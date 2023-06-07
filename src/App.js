import * as React from "react";
import { createContext } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import ProTip from "./ProTip";
import "./App.css";
//import './Components/App.css'
//import Paper from 'material-ui/Paper';
import Appbar from "./Components/Appbar/Appbar";
import image from "../src/Components/background.png";
import Dashboard from "./Components/Dashboard/Dashboard";
import Homepage from "./Components/Dashboard/Homepage";
import Feeds from "./Components/Feeds/Feeds";
import MobileMenu from "./Components/MobileMenu/MobileMenu";
import ShowNFT from "./Components/ShowNFT/ShowNFT";
import {
  BrowserRouter as Router,
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import ShopCard from "./Components/ShopCard/ShopCard";
import Shop from "./Components/Shop/Shop";
import Collection from "./Components/Collection/Collection";
import Lore from "./Components/Lore/Lore";
import BearLog from "./Components/BearLog/BearLog";
import ClaimToken from "./Components/ClaimToken/ClaimToken";
import Menubar from "./Components/MenuBar/Menubar";
import Downloads from "./Components/Downloads/Downloads";
import { createClient, configureChains, mainnet, goerli } from "wagmi";
import { polygonMumbai } from "wagmi/chains";
//import { WagmiConfig } from "wagmi";
export const UserContext = React.createContext(null);
import { WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import {
  ethereumClient,
  wagmiClient,
} from "./Components/Wallet/Web3ModalConnection";
import { Web3Modal } from "@web3modal/react";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { walletId } from "./Components/WalletID/WalletId";
import LoreNFTs from "./Components/Lore/LoreNFTs";
import LoreNFT from "./Components/Lore/LoreNFT";
import AddTickets from "./Components/AddTickets/AddTickets";
import CreateTickets from "./Components/AdminPanel/CreateTickets";
import { getNFTs } from "./APIRequests/Alchemi";
import { useEffect } from "react";
import FeedDetail from "./Components/FeedDetail/FeedDetail";
import PrivateRoute from "./PrivateRoute";
import AddGraphics from "./Components/AddGraphics.js/AddGraphics";
const { chains, provider, webSocketProvider } = configureChains(
  [mainnet],
  [publicProvider()]
);

const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
});

export default function App() {
  const [globalMenuBarState, setGlobalMenuBarState] = React.useState(1);

  return (
    <>
      {/* <WagmiConfig client={wagmiClient}> */}

      <WagmiConfig client={client}>
        <div className="main">
          {/* <UserContext.Provider value={{ globalMenuBarState: globalMenuBarState, setGlobalMenuBarState: setGlobalMenuBarState }}> */}
          <Appbar className="font" />
          {/* <Menubar /> */}
          {/* <WagmiConfig client={client}> */}
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route
              path="/feeds"
              element={
                <PrivateRoute>
                  {" "}
                  <Feeds />
                </PrivateRoute>
              }
            />
            <Route
              path="/feed-detail/:id/:contractaddress"
              element={
                <PrivateRoute>
                  {" "}
                  <FeedDetail />
                </PrivateRoute>
              }
            />
            <Route
              path="/rewards"
              element={
                <PrivateRoute>
                  {" "}
                  <Shop />
                </PrivateRoute>
              }
            />
            <Route
              path="/collection"
              element={
                <PrivateRoute>
                  {" "}
                  <Collection />
                </PrivateRoute>
              }
            />
            <Route
              path="/nfts/:from"
              element={
                <PrivateRoute>
                  {" "}
                  <LoreNFTs />
                </PrivateRoute>
              }
            />
            <Route
              path="/lore/:id/:contractaddress"
              element={
                <PrivateRoute>
                  {" "}
                  <Lore />
                </PrivateRoute>
              }
            />
            <Route
              path="/bearLog/:id/:contractaddress"
              element={
                <PrivateRoute>
                  {" "}
                  <BearLog />
                </PrivateRoute>
              }
            />
            <Route path="/downloads" element={<Downloads />} />
            <Route path="/addGraphics" element={<AddGraphics />} />

            <Route
              path="/Bearberry"
              element={
                <PrivateRoute>
                  {" "}
                  <ClaimToken />
                </PrivateRoute>
              }
            />
            <Route
              path="/safeswap"
              element={
                <PrivateRoute>
                  {" "}
                  <AddTickets />
                </PrivateRoute>
              }
            />
            <Route
              path="/addReward"
              element={
                <PrivateRoute>
                  {" "}
                  <CreateTickets />
                </PrivateRoute>
              }
            />
            <Route
              path="/showNFT/:id/:contractaddress"
              element={
                <PrivateRoute>
                  {" "}
                  <ShowNFT />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </WagmiConfig>

      <Web3Modal projectId={walletId} ethereumClient={ethereumClient} />
    </>
  );
}
