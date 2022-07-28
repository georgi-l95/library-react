import { ethers } from "ethers";
import LIBRARY_ABI from "../contracts/Library.json";
import type { Library } from "../contracts/types";
import useContract from "./useContract";

export default function useLibraryContract(contractAddress?: string) {
  if (!ethers.utils.isAddress(contractAddress)) {
    throw new Error("Library contract address is incorrect!");
  }
  return useContract<Library>(contractAddress, LIBRARY_ABI);
}
