import { useWeb3React } from "@web3-react/core";
import Link from "next/link";
import { useEffect, useState } from "react";
import Account from "../components/Account";
import LibraryComponent from "../components/LibraryComponent/LibraryComponent";
import useEagerConnect from "../hooks/useEagerConnect";
import useLibraryContract from "../hooks/useLibraryContract";
import { LIBRARY_ADDRESS, LIBWRAPPER_ADDRESS, LIB_ADDRESS } from "../constants";
import TokenBalance from "../components/TokenBalance";

function Home() {
  const { account, library } = useWeb3React();
  const libraryContract = useLibraryContract(LIBRARY_ADDRESS);
  const triedToEagerConnect = useEagerConnect();
  const [allBooks, setAllBooks] = useState([]);
  const isConnected = typeof account === "string" && !!library;

  useEffect(() => {
    getAllBooks().then((result) => {
      setAllBooks(result);
    });
  }, [libraryContract]);

  const getAllBooks = async () => {
    if (libraryContract !== null) {
      const allBooks = await libraryContract.getAllBooks();
      return allBooks.map((book, index) => {
        return { id: index, name: book.name, quantity: book.quantity };
      });
    }
    return [];
  };
  return (
    <div>
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
              <table className="table">
                <tr>
                  <th>ID</th>
                  <th>Book Title</th>
                  <th>Quantity</th>
                </tr>
                {allBooks.length === 0
                  ? "No Books in our library"
                  : allBooks.map((book) => (
                      <tr key={book.id}>
                        <th>{book.id}</th>
                        <th>{book.name}</th>
                        <th>{book.quantity}</th>
                      </tr>
                    ))}
              </table>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
