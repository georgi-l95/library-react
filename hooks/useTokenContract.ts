import LIB_ABI from "../contracts/LIB.json";
import type { LIB } from "../contracts/types";
import useContract from "./useContract";

export default function useTokenContract(contractAddress?: string) {
  return useContract<LIB>(contractAddress, LIB_ABI);
}
