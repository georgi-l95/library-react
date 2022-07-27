export interface Networks {
  [key: number]: string;
}
export const walletConnectSupportedNetworks: Networks = {
  // Add your network rpc URL here
  1: "https://ethereumnode.defiterm.io",
  3: "https://ethereumnode.defiterm-dev.net",
};

// Network chain ids
export const supportedMetamaskNetworks = [1, 3, 4, 5, 42];

export const ALBT_TOKEN_ADDRESS = "0xc6869a93ef55e1d8ec8fdcda89c9d93616cf0a72";
export const US_ELECTION_ADDRESS = "0xA09fF4F39FD8553051ABf0188100b7C5A6dc5452";
export const LIBRARY_ADDRESS = "0x15c69195AA2E3A90aaa8B8383E44630FeA8f07Bf";
export const LIB_ADDRESS = "0x3E58D4C7Aa1e724a852eaeF17C0F0C989AE9115B";
export const LIBWRAPPER_ADDRESS = "0x316B5f4F460b4203Bb7f68cA01b3ff267b8bBB45";
