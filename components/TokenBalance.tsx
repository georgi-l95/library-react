import { useWeb3React } from "@web3-react/core";
import { utils } from "ethers";
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
  const { library } = useWeb3React();
  const wrapperContract = useWrapperContract(wrapperAddress);
  const { data } = useTokenBalance(account, tokenAddress);
  const [wrapQuantity, setWrapQuantity] = useState(0);
  const [hashMsg, setHashMsg] = useState<string | undefined>();
  const [signMsg, setSignMsg] = useState<string | undefined>();
  const [receiver, setReceiver] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [txLoading, setTxLoading] = useState(false);
  const [txHash, setTxHash] = useState("0x00000000000");

  const wrapInput = (input) => {
    setWrapQuantity(input.target.value);
  };
  const hashMsgInput = (input) => {
    setHashMsg(input.target.value);
  };
  const signMsgInput = (input) => {
    setSignMsg(input.target.value);
  };

  const receiverInput = (input) => {
    setReceiver(input.target.value);
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

  const submitWrap = async (event) => {
    event.preventDefault();
    const tx = await wrapperContract
      .wrap({ value: `${wrapQuantity * 10 ** 18}` })
      .catch((e) => {
        return e;
      });
    await handleResult(tx);
  };

  const submitWrapWithSignedMsg = async (event) => {
    event.preventDefault();
    const sig = utils.splitSignature(signMsg);
    const wrapTx = await wrapperContract
      .wrapWithSignature(hashMsg, sig.v, sig.r, sig.s, receiver, {
        value: `${wrapQuantity * 10 ** 18}`,
      })
      .catch((e) => {
        return e;
      });
    await handleResult(wrapTx);
  };
  //0x48f29f3e23ae28591a2212613c310573715b5e97dd3775e1c8890063320d1e4e msgHash
  //0xdea7401f64bd7b5fddf89e4bac99baa2c1b755d3b6c588bbdd329d56aaf790d6580d6addc48eb5ceee78d3775bd8fe128bea459d8dae5b99051d35f9847279501b signMsg
  const getWrapSignedMsg = async (event) => {
    event.preventDefault();
    const signer = library.getSigner();
    const messageToSign = "I signed the message";
    const messageHash = utils.solidityKeccak256(["string"], [messageToSign]);
    const arrayfiedHash = utils.arrayify(messageHash);
    setTxLoading(true);
    const signedMsg = await signer.signMessage(arrayfiedHash);
    setTxLoading(false);
    setError(`Your message: ${messageHash}
    Your signature: ${signedMsg}`);
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
      <form onSubmit={getWrapSignedMsg}>
        <button type="submit">Give me only signed msg for wrap</button>
      </form>
      <form
        onSubmit={submitWrapWithSignedMsg}
        style={{
          display: "flex",
          flexWrap: "wrap",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <label>
          Give ETH to recieve LIB (1:1) for someone else with signed msg:
        </label>
        <label htmlFor="hashMsg">Msg Hash</label>
        <input
          onChange={hashMsgInput}
          value={hashMsg}
          type="text"
          id="hashMsg"
          name="hashMsg"
        />
        <label htmlFor="signMsg">Signed Msg</label>
        <input
          onChange={signMsgInput}
          value={signMsg}
          type="text"
          id="signMsg"
          name="signMsg"
        />
        <label htmlFor="receiver">Receiver Address</label>
        <input
          onChange={receiverInput}
          value={receiver}
          type="text"
          id="receiver"
          name="receiver"
        />
        <button type="submit">Wrap</button>
      </form>
    </div>
  );
};

export default TokenBalance;
