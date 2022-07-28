import { ethers } from "ethers";
import LIB_ABI from "../contracts/LIB.json";
import type { LIB } from "../contracts/types";
import useContract from "./useContract";

export default function useTokenContract(contractAddress?: string) {
  if (!ethers.utils.isAddress(contractAddress)) {
    throw new Error("Token contract address is incorrect!");
  }
  return useContract<LIB>(contractAddress, LIB_ABI);
}
