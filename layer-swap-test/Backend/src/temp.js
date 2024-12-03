import express, { response } from 'express';
import axios from 'axios';
import cors from 'cors';
import { OrbiterClient, ENDPOINT, RouterType } from "@orbiter-finance/bridge-sdk";





const app = express();
const port = 4003;

app.use(cors());
app.use(express.json());

app.get('/layerswap-testnet', async (req, res) => {
  const { source_network, source_token, destination_network, destination_token, amount } = req.query;

  try {
    const LayerSwapTestnetAPI = "NDBxG+aon6WlbgIA2LfwmcbLU52qUL9qTnztTuTRPNSohf/VnxXpRaJlA5uLSQVqP8YGIiy/0mz+mMeZhLY4/Q";

    const res1 = await axios.get(`https://api.layerswap.io/api/v2/limits?source_network=${source_network}&source_token=${source_token}&destination_network=${destination_network}&destination_token=${destination_token}`, {
      headers: {
      "X-LS-APIKEY": LayerSwapTestnetAPI,
      },
    });
    

    const res2 = await axios.get(`https://api.layerswap.io/api/v2/quote?source_network=${source_network}&source_token=${source_token}&destination_network=${destination_network}&destination_token=${destination_token}&amount=${amount}`, {
      headers: {
        'Content-Type': 'application/json',
        "X-LS-APIKEY": LayerSwapTestnetAPI 
      }
    });

    const resp1 = res1.data
    const resp2 = res2.data
    console.log(resp1)
    console.log(resp2) 
    

    const structure = {
      name: "LayerSwap",
      time: "1min",
      fee: resp2.data.quote.total_fee,
      minReceived: resp1.data.min_amount,
      maxReceived: resp1.data.max_amount,
      recive_amount: resp2.data.quote.receive_amount,
      icon: "https://docs.layerswap.io/~gitbook/image?url=https%3A%2F%2F2091339926-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252Fk6gvOhIkKgdK236Bl8ds%252Ficon%252FJdGYJEM74LitXbZOfbpq%252Ftransparent_main.png%3Falt%3Dmedia%26token%3D890c4d30-d2c0-4bfc-8d30-725ef5f32d0c&width=32&dpr=2&quality=100&sign=2d4387d2&sv=1"
    };

    console.log(structure);
    res.json(structure);
  } catch (error) {
    console.log("Error is : ", error);
    res.status(500).send("Internal Server Error");
  }
});













app.get('/orbitor-finance', async (req, res) => {

  const { source_chain_id, dstChainId, srcToeknSymbol, dstTokenSymbol, amount } = req.query;

  try {
    const orbiter = await OrbiterClient.create({
      apiEndpoint: ENDPOINT.MAINNET,
    });

    const tradePair = {
      srcChainId: source_chain_id,
      dstChainId: dstChainId,
      srcTokenSymbol: srcToeknSymbol,
      dstTokenSymbol: dstTokenSymbol,
      routerType: RouterType.CONTRACT,
    }

    const router = orbiter.createRouter(tradePair);

    const structure = {
      name: "Oribiter Finance",
      time: router.routerConfig.spentTime,
      fee: (router.routerConfig.tradeFee * amount) + router.routerConfig.withholdingFee,
      minReceived: router.routerConfig.minAmt,
      maxReceived: router.routerConfig.maxAmt,
      recive_amount: amount - (router.routerConfig.tradeFee * amount) - router.routerConfig.withholdingFee,
      icon: "https://2241067817-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F3q5fMp74wGQ0tOLcPW42%2Ficon%2FT4hquhrIf2v1zUPWh5X1%2FOrbiter_Icon_Black.png?alt=media&token=6c792098-a144-4172-8801-1770f34f9c52"
    }

    console.log(structure);
    res.json(structure);
  } catch (error) {
    console.log("Error is : ", error);
    res.status(500).send("Internal Server Error");
  }

});


app.get('/owito-mainnet', async (req, res) => {

  const { from_address, from_chain_name, to_address, amount, token_name, to_chain_name } = req.query;

  if (!from_address || !from_chain_name || !to_address || !token_name) {
    return res.status(400).json({ error: "Missing required query parameters." });
  }


  // const body = {
  //   channel: 910325,
  //   from_address,
  //   from_chain_name,
  //   to_address,
  //   to_chain_name: "Stark net",
  //   token_name,
  //   ui_value: amount, // Assuming amount should be passed here
  //   value_include_gas_fee: false
  // };

  const baseApi = "https://owlto.finance/api/bridge_api/v1";
  const endpoint = "/get_build_tx";

  console.log("body is ",{
    from_address: from_address,
    from_chain_name: from_chain_name,
    to_address: to_address,
    to_chain_name: to_chain_name,
    UiValue: amount,
    token_name: token_name,
  },)

  
    const response = await fetch(`${baseApi}${endpoint}`, {
      method: "POST",
      headers: {
      "Content-Type": "application/json",
      },
      body: JSON.stringify({
      from_address: from_address,
      from_chain_name: from_chain_name,
      to_address: to_address,
      ui_value: amount,
      to_chain_name: to_chain_name,
      token_name: token_name,
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const res2 = await response.json();

  // try {
  //   const res2 = await axios.post("https://api.owito.com/v1/get_build_tx", body, {
  //     headers: {
  //       "Content-Type": "application/json"
  //     }
  //   });

  const data = res2.data;
  console.log("Owlto data is ", data)
    const structure = {
      name: "Owlto Mainnet",
      time: "1min",
      fee: (data.gas_fee?.ui_value || 0) + (data.bridge_fee?.ui_value || 0),
      minReceived: data.min_value?.ui_value || 0,
      maxReceived: data.max_value?.ui_value || 0,
      recive_amount: data.receive_value?.ui_value - (data.gas_fee?.ui_value || 0) - (data.bridge_fee?.ui_value || 0) || 0,
      icon: "https://3491479700-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FnT8HZBhWt1X1dPYEQK1F%2Ficon%2FIlbV5NaUSVcxJcZrEKBR%2Fowlto_logo.png?alt=media&token=7beee5cd-586e-4820-b525-bc7f941feb19"
    };

     console.log(structure);
     res.json(structure);

  // } catch (error) {
  //   console.error("Error occurred:", error.response?.data || error.message);
  //   res.status(500).send("Internal Server Error");
  // }
}
)



app.get('/retrobridge-testnet', async (req, res) => {
  const { source_chain, asset_from, destination_chain, asset_to, amount , wallet_sender} = req.query;

  console.log(source_chain, asset_from, destination_chain, asset_to, amount, wallet_sender)
  try {

    const res1 = await axios.get(`https://backend.retrobridge.io/api/bridge/quote?source_chain=${source_chain}&destination_chain=${destination_chain}&asset_from=${asset_from}&asset_to=${asset_to}&amount=${amount}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Res 1: ", res1.data);

    

    const res2 = await axios.get("https://backend.retrobridge.io/api/bridge/limits", {
      params: {
        source_chain,
        destination_chain,
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
      recive_amount: res1.data.data.amount_out,
      icon: "https://692763704-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FmbVvmwMdSj7r2k9kgEId%2Ficon%2FZmsQpsMgtpLGPMGc2auD%2Fprofile%20image%201.png?alt=media&token=093dc63f-b452-446c-af9d-edbbfa9821e2`"
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