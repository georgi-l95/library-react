import { useState } from "react";
import useTokenBalance from "../hooks/useTokenBalance";
import useWrapperContract from "../hooks/useWraperContract";
import { parseBalance } from "../util";
import Modal from "./Modal";

type TokenBalanceProps = {
  tokenAddress: string;
  wrapperAddress: string;
  symbol: string;
  account: string;
};

const TokenBalance = ({
  tokenAddress,
  wrapperAddress,
  symbol,
  account,
}: TokenBalanceProps) => {
  const wrapperContract = useWrapperContract(wrapperAddress);
  const { data } = useTokenBalance(account, tokenAddress);
  const [wrapQuantity, setWrapQuantity] = useState(0);
  const [error, setError] = useState<string | undefined>();
  const [txLoading, setTxLoading] = useState(false);
  const [txHash, setTxHash] = useState("0x00000000000");

  const wrapInput = (input) => {
    setWrapQuantity(input.target.value);
  };
  const submitWrap = async (event) => {
    event.preventDefault();
    const tx = await wrapperContract
      .wrap({ value: `${wrapQuantity * 10 ** 18}` })
      .catch((e) => {
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
      <p>
        {`${symbol} Balance`}: {parseBalance(data ?? 0)}
      </p>
      <p>
        <form onSubmit={submitWrap}>
          <label htmlFor="wrap">Give ETH to recieve LIB (1:1):</label>
          <input
            onChange={wrapInput}
            value={wrapQuantity}
            type="text"
            id="wrap"
            name="wrap"
          />
          <button type="submit">Wrap</button>
        </form>
      </p>
    </div>
  );
};

export default TokenBalance;
