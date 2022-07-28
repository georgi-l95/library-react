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
import NativeCurrencyBalance from "../components/NativeCurrencyBalance";
import { ethers } from "ethers";

const Budget = () => {
  const { account, library } = useWeb3React();
  const triedToEagerConnect = useEagerConnect();
  const libraryContract = useLibraryContract(LIBRARY_ADDRESS);
  const [error, setError] = useState<string | undefined>();
  const [txLoading, setTxLoading] = useState(false);
  const [txHash, setTxHash] = useState("0x00000000000");
  const isConnected = typeof account === "string" && !!library;

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
  const submitUnwrap = async (event) => {
    event.preventDefault();
    const unwrapTx = await libraryContract.unwrapProfit().catch((e) => {
      return e;
    });
    await handleResult(unwrapTx);
  };

  const submitWithdraw = async (event) => {
    event.preventDefault();
    const withdrawTx = await libraryContract.withdraw().catch((e) => {
      return e;
    });
    await handleResult(withdrawTx);
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
          <NativeCurrencyBalance account={LIBRARY_ADDRESS} />
          <TokenBalance
            tokenAddress={LIB_ADDRESS}
            wrapperAddress={LIBWRAPPER_ADDRESS}
            symbol="LIB"
            account={LIBRARY_ADDRESS}
          />

          <Account triedToEagerConnect={triedToEagerConnect} />
        </nav>
      </header>
      {isConnected && (
        <div className="bg">
          <LibraryComponent />
          <div className="content">
            <section>
              <form id="unwrap" onSubmit={submitUnwrap}>
                <button type="submit">Unwrap LIB Balance</button>
              </form>

              <form
                id="withdraw"
                onSubmit={submitWithdraw}
                style={{ margin: 10 }}
              >
                <button type="submit">Withdraw ETH Balance</button>
              </form>
            </section>
          </div>
        </div>
      )}
    </div>
  );
};

export default Budget;
