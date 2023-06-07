import React from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
const Web3Component = () => {
  const { address, isConnected } = useAccount();
  return <></>;
};

export default Web3Component;
