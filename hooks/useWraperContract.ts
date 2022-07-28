import { ethers } from "ethers";
import LIBWRAPPER_ABI from "../contracts/LIBWrapper.json";
import type { LIBWrapper } from "../contracts/types";
import useContract from "./useContract";

export default function useWrapperContract(contractAddress?: string) {
  if (!ethers.utils.isAddress(contractAddress)) {
    throw new Error("Token wrapper contract address is incorrect!");
  }
  return useContract<LIBWrapper>(contractAddress, LIBWRAPPER_ABI);
}
