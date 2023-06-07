import {
  EthereumClient,
  modalConnectors,
  walletConnectProvider,
} from "@web3modal/ethereum";

import { Web3Modal } from "@web3modal/react";

import { configureChains, createClient, WagmiConfig } from "wagmi";

import { arbitrum, mainnet, polygon } from "wagmi/chains";
import { walletId } from "../WalletID/WalletId";

const chains = [arbitrum, mainnet, polygon];

//import { useAccount, useConnect, useDisconnect } from 'wagmi'
// Wagmi client
const { provider } = configureChains(chains, [
  walletConnectProvider({ projectId: walletId }),
]);
//const { address, isConnected } = useAccount()
export const wagmiClient = createClient({
  autoConnect: true,
  connectors: modalConnectors({
    projectId: walletId,
    version: "1", // or "2"
    appName: "web3Modal",
    chains,
  }),
  provider,
});

// Web3Modal Ethereum Client
export const ethereumClient = new EthereumClient(wagmiClient, chains);
