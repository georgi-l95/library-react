import LIBWRAPPER_ABI from "../contracts/LIBWrapper.json";
import type { LIBWrapper } from "../contracts/types";
import useContract from "./useContract";

export default function useWrapperContract(contractAddress?: string) {
  return useContract<LIBWrapper>(contractAddress, LIBWRAPPER_ABI);
}
