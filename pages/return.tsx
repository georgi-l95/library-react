import { useWeb3React } from "@web3-react/core";
import Link from "next/link";
import { useState } from "react";
import Account from "../components/Account";
import LibraryComponent from "../components/LibraryComponent/LibraryComponent";
import useEagerConnect from "../hooks/useEagerConnect";
import useLibraryContract from "../hooks/useLibraryContract";
import { LIBRARY_ADDRESS, LIBWRAPPER_ADDRESS, LIB_ADDRESS } from "../constants";
import Modal from "../components/Modal";
import TokenBalance from "../components/TokenBalance";

const Return = () => {
  const { account, library } = useWeb3React();
  const [bookId, setBookId] = useState<number | undefined>();
  const triedToEagerConnect = useEagerConnect();
  const libraryContract = useLibraryContract(LIBRARY_ADDRESS);
  const [error, setError] = useState<string | undefined>();
  const [txLoading, setTxLoading] = useState(false);
  const [txHash, setTxHash] = useState("0x00000000000");
  const isConnected = typeof account === "string" && !!library;

  const bookIdInput = (input) => {
    setBookId(input.target.value);
  };

  const submitRent = async (event) => {
    event.preventDefault();
    const tx = await libraryContract.returnBook(bookId).catch((e) => {
      return e;
    });
    if ("hash" in tx) {
      setTxLoading(true);
      setTxHash(tx.hash);
      await tx.wait();
      setTxLoading(false);
    } else {
      if ("error" in tx) {
        setError(tx.error.message.toString());
      } else if ("message" in tx) {
        setError(tx.message);
      } else {
        setError(tx.toString());
      }
    }
  };
  return (
    <div>
      {" "}
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
          />
          <Account triedToEagerConnect={triedToEagerConnect} />
        </nav>
      </header>
      {isConnected && (
        <div className="bg">
          <LibraryComponent />
          <div className="content">
            <section>
              <form onSubmit={submitRent}>
                <label htmlFor="id">Book ID:</label>
                <input
                  onChange={bookIdInput}
                  value={bookId}
                  type="text"
                  id="id"
                  name="id"
                />
                <button type="submit">Return</button>
              </form>
            </section>
          </div>
        </div>
      )}
    </div>
  );
};

export default Return;
