import useNativeCurrencyBalance from "../hooks/useNativeCurrencyBalance";
import { parseBalance } from "../util";

type NativeCurrencyProps = {
  account: string;
};
const NativeCurrencyBalance = ({ account }: NativeCurrencyProps) => {
  const { data } = useNativeCurrencyBalance(account);

  return <p>Balance: Ξ{parseBalance(data ?? 0)}</p>;
};

export default NativeCurrencyBalance;
