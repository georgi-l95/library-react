import { useWeb3React } from "@web3-react/core";
import Link from "next/link";
import Account from "../components/Account";
import LibraryComponent from "../components/LibraryComponent/LibraryComponent";
import useEagerConnect from "../hooks/useEagerConnect";

const Return = () => {
  const { account, library } = useWeb3React();

  const triedToEagerConnect = useEagerConnect();

  const isConnected = typeof account === "string" && !!library;
  return (
    <div>
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
            <section></section>
          </div>
        </div>
      )}
    </div>
  );
};
export default Return;
