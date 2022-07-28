import { useWeb3React } from "@web3-react/core";
import Link from "next/link";
import { useState } from "react";
import Account from "../components/Account";
import LibraryComponent from "../components/LibraryComponent/LibraryComponent";
import LIBRARY_ABI from "../contracts/Library.json";
import useEagerConnect from "../hooks/useEagerConnect";
import useLibraryContract from "../hooks/useLibraryContract";
import { LIBRARY_ADDRESS } from "../constants";
import Modal from "../components/Modal";
import { ethers } from "ethers";

function Create() {
  const { account, library } = useWeb3React();
  const libraryContract = useLibraryContract(LIBRARY_ADDRESS);
  const [bookName, setBookName] = useState("");
  const [bookQuantity, setBookQuantity] = useState(0);
  const triedToEagerConnect = useEagerConnect();
  const [error, setError] = useState<string | undefined>();
  const [txLoading, setTxLoading] = useState(false);
  const [txHash, setTxHash] = useState("0x00000000000");
  const isConnected = typeof account === "string" && !!library;

  const bookNameInput = (input) => {
    setBookName(input.target.value);
  };

  const bookQuantityInput = (input) => {
    setBookQuantity(input.target.value);
  };
  const submitBook = async (event) => {
    event.preventDefault();
    const iLibrary = new ethers.utils.Interface(LIBRARY_ABI);
    const encodedData = iLibrary.encodeFunctionData("addBook", [
      bookName,
      bookQuantity,
    ]);
    const signer = library.getSigner();
    const packedTx = {
      to: LIBRARY_ADDRESS,
      data: encodedData,
    };
    const tx = await signer.sendTransaction(packedTx);

    // const tx = await libraryContract
    //   .addBook(bookName, bookQuantity)
    //   .catch((e) => {
    //     return e;
    //   });
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
    resetForm();
  };

  const resetForm = () => {
    setBookName("");
    setBookQuantity(0);
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

          <Account triedToEagerConnect={triedToEagerConnect} />
        </nav>
      </header>
      {isConnected && (
        <div className="bg">
          <LibraryComponent />
          <div className="content">
            <section>
              <form onSubmit={submitBook}>
                <label htmlFor="name">Book name:</label>
                <input
                  onChange={bookNameInput}
                  value={bookName}
                  type="text"
                  id="name"
                  name="name"
                />
                <label htmlFor="quantity">Quantity:</label>
                <input
                  onChange={bookQuantityInput}
                  value={bookQuantity}
                  type="text"
                  id="quantity"
                  name="quantity"
                />
                <button type="submit">Add</button>
              </form>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}

export default Create;
