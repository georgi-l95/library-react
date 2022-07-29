import { useWeb3React } from "@web3-react/core";
import { utils } from "ethers";
import { useEffect, useState } from "react";
import { LIBRARY_ADDRESS, LIBWRAPPER_ADDRESS, LIB_ADDRESS } from "../constants";
import useLibraryContract from "../hooks/useLibraryContract";
import useTokenContract from "../hooks/useTokenContract";
import { parseBalance } from "../util";

const Log = (props) => {
  const [logs, setLogs] = useState([]);
  const { account, library } = useWeb3React();
  const isConnected = typeof account === "string" && !!library;
  const libraryContract = useLibraryContract(LIBRARY_ADDRESS);
  const tokenContract = useTokenContract(LIB_ADDRESS);
  useEffect(() => {
    if (libraryContract !== null && isConnected) {
      const fitlerTransfer = tokenContract.filters.Transfer(
        null,
        LIBRARY_ADDRESS,
        null
      );
      const fitlerAddBook = libraryContract.filters.BookAdded(null, null, null);
      const fitlerBorrowBook = libraryContract.filters.BookBorrowed(null, null);
      const filterReturnBook = libraryContract.filters.BookReturn(null);
      libraryContract.on(fitlerAddBook, (id, name, quantity) => {
        const addBookLog = `Added book with ID: ${id} , name ${name} and quantity ${quantity}`;
        setLogs((prevState) => [...prevState, addBookLog]);
      });
      libraryContract.on(fitlerBorrowBook, (id, address) => {
        const borrowBookLog = `Borrowed book with ID: ${id} from ${address}`;
        setLogs((prevState) => [...prevState, borrowBookLog]);
      });

      libraryContract.on(filterReturnBook, (id) => {
        const returnBookLog = `Returned book with ID: ${id}`;
        setLogs((prevState) => [...prevState, returnBookLog]);
      });

      tokenContract.on(fitlerTransfer, (from, to, value) => {
        const transferTokenLog = `LIB transferred from ${from} to ${to} - ${parseBalance(
          value.toString(),
          18,
          3
        )} LIB`;
        setLogs((prevState) => [...prevState, transferTokenLog]);
      });
    }
    if (libraryContract !== null && !isConnected) {
      libraryContract.removeAllListeners();
      tokenContract.removeAllListeners();
    }
  }, [isConnected]);
  return (
    <table>
      <tbody>
        <tr>
          <td>
            <h3>Event Log</h3>
          </td>
        </tr>
        <tr>
          <td>
            {logs.map((log, index) => (
              <p key={index}>{log}</p>
            ))}
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default Log;
