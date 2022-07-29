import { useWeb3React } from "@web3-react/core";
import Link from "next/link";
import { useState } from "react";
import Account from "../components/Account";
import LibraryComponent from "../components/LibraryComponent/LibraryComponent";
import useEagerConnect from "../hooks/useEagerConnect";
import useLibraryContract from "../hooks/useLibraryContract";
import useTokenContract from "../hooks/useTokenContract";
import { LIBRARY_ADDRESS, LIBWRAPPER_ADDRESS, LIB_ADDRESS } from "../constants";
import Modal from "../components/Modal";
import TokenBalance from "../components/TokenBalance";
import { parseBalance } from "../util";
import { utils } from "ethers";

const Borrow = () => {
  const { account, library } = useWeb3React();
  const [bookId, setBookId] = useState<number | undefined>();
  const triedToEagerConnect = useEagerConnect();
  const libraryContract = useLibraryContract(LIBRARY_ADDRESS);
  const tokenContract = useTokenContract(LIB_ADDRESS);
  const [error, setError] = useState<string | undefined>();
  const [txLoading, setTxLoading] = useState(false);
  const [txHash, setTxHash] = useState("0x00000000000");
  const isConnected = typeof account === "string" && !!library;

  const getPreparedSignature = async (wrapValue) => {
    const nonce = await tokenContract.nonces(account);
    const deadline = +new Date() + 60 * 60;

    const EIP712Domain = [
      { name: "name", type: "string" },
      { name: "version", type: "string" },
      { name: "verifyingContract", type: "address" },
    ];

    const domain = {
      name: await tokenContract.name(),
      version: "1",
      verifyingContract: tokenContract.address,
    };

    const Permit = [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
      { name: "value", type: "uint256" },
      { name: "nonce", type: "uint256" },
      { name: "deadline", type: "uint256" },
    ];

    const message = {
      owner: account,
      spender: LIBRARY_ADDRESS,
      value: wrapValue.toString(),
      nonce: nonce.toHexString(),
      deadline,
    };

    const data = JSON.stringify({
      types: {
        EIP712Domain,
        Permit,
      },
      domain,
      primaryType: "Permit",
      message,
    });

    const signatureLike = await library.send("eth_signTypedData_v4", [
      account,
      data,
    ]);
    const signature = await utils.splitSignature(signatureLike);

    const preparedSignature = {
      v: signature.v,
      r: signature.r,
      s: signature.s,
      deadline,
    };

    return preparedSignature;
  };
  const getBorrowPrice = async () => {
    const borrowPrice = await libraryContract.rentPrice();
    return parseBalance(borrowPrice, 0, 0);
  };

  const bookIdInput = (input) => {
    setBookId(input.target.value);
  };

  const handleResult = async (result) => {
    if ("hash" in result) {
      setTxLoading(true);
      setTxHash(result.hash);
      await result.wait();
      setTxLoading(false);
    } else {
      if ("error" in result) {
        setError(result.error.message.toString());
      } else if ("message" in result) {
        setError(result.message);
      } else {
        setError(result.toString());
      }
    }
  };
  const submitBorrow = async (event) => {
    event.preventDefault();
    const borrowPirce = await getBorrowPrice();
    const preparedSignature = await getPreparedSignature(borrowPirce);

    const tx = await libraryContract
      .borrowBookWithPermit(
        bookId,
        borrowPirce,
        preparedSignature.deadline,
        preparedSignature.v,
        preparedSignature.r,
        preparedSignature.s
      )
      .catch((e) => {
        return e;
      });

    await handleResult(tx);
  };
  return (
    <div>
      {txLoading && (
        <Modal loading={txLoading}>
          <h5>
            TX Hash:
            <a
              href={`https://ropsten.etherscan.io/tx/${txHash}`}
              target="_blank"
            >
              {txHash}
            </a>
          </h5>
        </Modal>
      )}
      {error !== undefined && (
        <Modal title="Error">
          {error}
          <button
            className="button-wrapper"
            onClick={() => setError(undefined)}
          >
            Close
          </button>
        </Modal>
      )}
      <header>
        <nav>
          <Link href="/">
            <a>LimeAcademy-boilerplate</a>
          </Link>
          <TokenBalance
            tokenAddress={LIB_ADDRESS}
            wrapperAddress={LIBWRAPPER_ADDRESS}
            symbol="LIB"
            account={account}
          />
          <Account triedToEagerConnect={triedToEagerConnect} />
        </nav>
      </header>
      {isConnected && (
        <div className="bg">
          <LibraryComponent />
          <div className="content">
            <section>
              <form onSubmit={submitBorrow}>
                <label htmlFor="id">Book ID:</label>
                <input
                  onChange={bookIdInput}
                  value={bookId}
                  type="text"
                  id="id"
                  name="id"
                />
                <button type="submit">Borrow</button>
              </form>
            </section>
          </div>
        </div>
      )}
    </div>
  );
};

export default Borrow;
