import React, { Component } from 'react';
import { nftArray } from "../NFTs_data/NFTs_data";
import { embedGateway } from '../../APIRequests/IPFS';
const LoreNFT = () => {
  return (
    <div>
    {nftArray? nftArray.map((item) => {
        <img src = {embedGateway( nftArray[0].img)} />
    }): 'No data to show!'}
    </div>
  )
}

export default LoreNFT