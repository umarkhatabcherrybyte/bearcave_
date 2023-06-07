import { Alchemy, Network } from "alchemy-sdk";

const config = {
  apiKey: "HE6Yp2w5FbXAHXsOcIxgshTXmeAKMhsV",
  network: Network.ETH_MAINNET,
};
export const ProviderUrl =
  "wss://eth-mainnet.g.alchemy.com/v2/Ye6S888IuNTfAGGPQf2C_ZRvXJD9YQdQ";
// export const ProviderUrl =   "https://polygon-mumbai.infura.io/v3/685daa6fa7f94b4b89cdc6d7c5a8639e";

const alchemy = new Alchemy(config);

// Fetch all the NFTs owned by elanhalpern.eth
export const getNFTs = async (owner, contractAddress) => {
  console.log("getting nfts for ", { owner, contractAddress });
  try {

    const nfts = await alchemy.nft.getNftsForOwner(owner, {
      contractAddresses: [contractAddress],
    });
    let arr = nfts.ownedNfts;
    console.log(arr);

    // console.log({ nfts: arr });
    // if (setter) setter(arr);

    return arr;
  } catch (e) {
    console.log(e);
  }
};
