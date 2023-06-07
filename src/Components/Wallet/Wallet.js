//import React, { useState } from 'react'
export default async function walletConnection() {
  // const [walletAddress, setWalletAddress] = useState('')

  if (window.ethereum) {
    console.log("Detecting");
    try {
      const account = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log(account);
      //setWalletAddress(account[0])
      return account[0];
    } catch (error) {
      console.log(error);
    }
  }
}
