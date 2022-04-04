import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

export const injected = new InjectedConnector({
  supportedChainIds: [56, 1],
});

export const API_URL = process.env.REACT_APP_API_URL;
export const BSC_RPC ="https://bsc-dataseed1.binance.org/";
export const ETH_RPC ="https://mainnet.infura.io/v3/e83a8c54240f48c3bb04c457d4c04946";
export const walletConnect = new WalletConnectConnector({
  rpc: { 1: ETH_RPC, 56: BSC_RPC },
  bridge: "https://bridge.walletconnect.org",
  qrcode: true,
  pollingInterval: 12000,
});
