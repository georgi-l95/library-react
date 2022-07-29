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
export const LIBRARY_ADDRESS = "0x633AB0042348CffC304BE903E758977B4C05a188";
export const LIB_ADDRESS = "0x6e09095e5198993C593A35632FBb77ae771AfB9E";
export const LIBWRAPPER_ADDRESS = "0xD47ac3C78F46f5cBd967E77128CA0c9d7Ad2e9B2";
