import express from 'express';
import axios from 'axios';
import cors from 'cors';
import { OrbiterClient, ENDPOINT, RouterType } from "@orbiter-finance/bridge-sdk";
import { Account, Provider } from "starknet";
import { JsonRpcProvider, MaxInt256, Wallet } from "ethers";


const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get('/layerswap-testnet', async (req, res) => {
  const { source_network, source_token, destination_network, destination_token, amount } = req.query;

  try {
    const LayerSwapTestnetAPI = "Dz1jVir9WUD0gBWoGbOmS1oe5K4985SGptaZXjF4z9VVrvO5nC9q55h8TE/3CIESRxWdYVpPnz/H2BogL2eG+A";

    const res1 = await axios.get(
      `https://api.layerswap.io/api/v2/limits?source_network=${source_network}&source_token=${source_token}&destination_network=${destination_network}&destination_token=${destination_token}`,
      {
        headers: {
          "x-ls-apikey": LayerSwapTestnetAPI,
          "Content-Type": "application/json",
        },
      }
    );

    const res2 = await axios.get("https://api.layerswap.io/api/v2/quote", {
      params: {
        source_network,
        source_token,
        destination_network,
        destination_token,
        amount
      },
      headers: {
        "access-control-allow-origin": "*",
        "origin": "https://layerswap.io",
        "referer": "https://layerswap.io/",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "x-ls-apikey": LayerSwapTestnetAPI,
        "Content-Type": "application/json"
      },
    });

    const structure = {
      name: "LayerSwap",
      time: "1min",
      fee: res2.data.quote.total_fee,
      minReceived: res1.data.min_amount,
      maxReceived: res1.data.max_amount,
      recive_amount: res2.data.data.quote.receive_amount,
      icon: "/placeholder.svg"
    };

    console.log(structure);
    res.json(structure);
  } catch (error) {
    console.log("Error is : ", error);
    res.status(500).send("Internal Server Error");
  }
});


app.get('/orbitor-finance,astronaut', async (req, res) => {

  const { source_chain_id, dstChainId, srcToeknSymbol, dstTokenSymbol, amount } = req.query;

  try {
    const orbiter = await OrbiterClient.create({
      apiEndpoint: ENDPOINT.MAINNET,
    });

    const tradePair = {
      srcChainId: source_chain_id,
      dstChainId: destination_chain_id,
      srcTokenSymbol: source_token_symbol,
      dstTokenSymbol: destination_token_symbol,
      routerType: RouterType.CONTRACT,
    }

    const router = orbiter.createRouter(tradePair);

    const structure = {
      name: "Oribitor Finan",
      time: router.routerConfig.spentTime,
      fee: (router.routerConfig.tradeFee * amount) + router.routerConfig.withholdingFee,
      minReceived: router.routerConfig.minAmt,
      maxReceived: router.routerConfig.maxAmt,
      recive_amount: amount - (router.routerConfig.tradeFee * amount) - router.routerConfig.withholdingFee,
      icon: "/placeholder.svg"
    }

    console.log(structure);
    res.json(structure);
  } catch (error) {
    console.log("Error is : ", error);
    res.status(500).send("Internal Server Error");
  }

});


app.get('/owito-mainnet', async (req, res) => {
  const { from_address, from_chain_name, to_address, amount , token_name} = req.query;

  const body = {
    "channel": 910325,
    "from_address": from_address,
    "from_chain_name": from_chain_name,
    "to_address": to_address,
    "to_chain_name": "Stark net",
    "token_name": token_name,
    "ui_value": "1.2",
    "value_include_gas_fee": false
  };

  try {
    const res2 = await axios.post("https://api.owito.com/v1/get_build_tx", body, {
      headers: {
        "Content-Type": "application/json"
      }
    });

    const structure = {
      name: "Owito Mainnet",
      time: "1min",
      fee: res2.data.data.gas_fee.decimals + res2.data.data.bridge_fee.decimals,
      minReceived: res2.data.data.min_value.decimals,
      maxReceived: res2.data.data.max_value.decimals,
      recive_amount: res2.data.data.receive_value.decimals,
      icon: "/placeholder.svg"
    };

    console.log(structure);
    res.json(structure);
    
  } catch (error) {
    console.log("Error is : ", error);
    res.status(500).send("Internal Server Error");
  }

});


app.get('/retrobridge-testnet', async (req, res) => {
  const { source_network, asset_from, destination_network, asset_to, amount , wallet_sender} = req.query;

  try {

    const res1 = await axios.get(
      `https://backend.retrobridge.io/api/bridge/quote?source_chain=${source_network}&destination_chain=${destination_network}&asset_from=${asset_from}&asset_to=${asset_to}&amount=${amount}&wallet_sender=${wallet_sender}`,
      {
        headers: {
          // "x-ls-apikey": LayerSwapTestnetAPI,
          "Content-Type": "application/json",
        },
      }
    );

    const res2 = await axios.get("https://backend.retrobridge.io/api/bridge/limits", {
      params: {
        source_network,
        destination_network,
        asset_from,
        asset_to,
      },
      headers: {
        "access-control-allow-origin": "*",
      //   "origin": "https://layerswap.io",
      //   "referer": "https://layerswap.io/",
      //   "sec-fetch-mode": "cors",
      //   "sec-fetch-site": "same-site",
      //   "x-ls-apikey": LayerSwapTestnetAPI,
        "Content-Type": "application/json"
      },
    });

    const structure = {
      name: "Retro Bridge",
      time: "1min",
      fee: res1.data.data.platform_fee + res1.data.data.blockchain_fee + res1.data.data.swap_fee + res1.data.data.full_fee,
      minReceived: res2.data.data.min_send,
      maxReceived: res2.data.data.max_send,
      recive_amount: res2.data.data.amount_out,
      icon: "/placeholder.svg"
    };

    console.log(structure);
    res.json(structure);
  } catch (error) {
    console.log("Error is : ", error);
    res.status(500).send("Internal Server Error");
  }
});



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});