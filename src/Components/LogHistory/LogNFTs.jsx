import React from 'react'
import { CardMedia, Container, Grid, Typography } from "@mui/material";
import { nftArray } from '../NFTs_data/NFTs_data'
const LogNFTs = () => {
  return (
    <Container xs = 'large'>
        {nftArray.length > 0? <Grid container spacing={2} sx = {{pt:'7rem'}}>
        {nftArray.map((item) => (
          <Grid item md={3} sm = {1}  key={item.id} pt = '5rem'>
            <img src={item.img} className="LoreNftsImg" alt={item.name} 
            onClick = {e => handleNFTClick(item.tokenId, item.contractAddress)}/>  
          </Grid>
        ))}
      </Grid>: <Typography sx = {{display: 'flex', justifyContent: 'center',py: '25%', alignItem: 'center', color: 'white', fontFamily: 'rubik', fontWeight: 750, fontSize: 26}}>
            Sorry! you need NFTs to access lores.
        </Typography>}
      
    </Container>
  )
}

export default LogNFTs