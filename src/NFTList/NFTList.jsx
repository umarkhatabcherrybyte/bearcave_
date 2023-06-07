import { useState, useEffect } from 'react';
import Web3 from 'web3';
import { ListGroup, Spinner } from 'react-bootstrap';
import IPFS from 'ipfs-http-client';
const NFTList = () => {
  const [web3, setWeb3] = useState(null);  
  const [walletAddress, setWalletAddress] = useState(null);
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function connectToWeb3() {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
          await window.ethereum.enable();
          setWeb3(web3);
          const accounts = await web3.eth.getAccounts();
          setWalletAddress(accounts[0]);
          //const contractAddress = "0x..."; // Replace with your contract address
          //const contractABI = [...]; // Replace with your contract ABI
          const contract = new web3.eth.Contract(contractABI, contractAddress);
          const balance = await contract.methods.balanceOf(walletAddress).call();
          const nftList = [];
          for (let i = 0; i < balance; i++) {
            const tokenId = await contract.methods.tokenOfOwnerByIndex(walletAddress, i).call();
            const tokenURI = await contract.methods.tokenURI(tokenId).call();
            const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
            const metadata = await ipfs.get(tokenURI);
            nftList.push({ tokenId, metadata });
          }
          setNfts(nftList);
          setLoading(false);
        } catch (err) {
          console.error(err);
          setLoading(false);
        }
      }
    }
    connectToWeb3();
  }, []);
  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <List>
          {nfts.map((nft) => (
            <ListItem key={nft.tokenId}>
              <ListItemText primary={nft.metadata.name} secondary={nft.metadata.description} />
            </ListItem>
          ))}
        </List>
      </Grid>
    </Grid>
  );
}

export default NFTList