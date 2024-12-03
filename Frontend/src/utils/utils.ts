import axios from "axios"
import {  OrbiterClient, ENDPOINT, RouterType } from "@orbiter-finance/bridge-sdk";
import { backendApi } from "@/types/globle";
import { ethers } from "ethers";

//npm install @orbiter-finance/bridge-sdk


export async function getBridgeDetailList() {
    // layerswap mainnet
}

export async function getLayerSwapTestnet(source_network: string, source_token: string, destination_network: string, destination_token: string, amount: number) {
    // layerswap testnet
    const LayerSwapTestnetAPI = "NDBxG+aon6WlbgIA2LfwmcbLU52qUL9qTnztTuTRPNSohf/VnxXpRaJlA5uLSQVqP8YGIiy/0mz+mMeZhLY4/Q"
try {
   

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
        params : {
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

    })

    // const {} = res.data;
    // const structure = {
    //     name: "LayerSwap",
    //     time: "1min",
    //     fee: res2.data.quote.total_fee,
    //     minReceived: res1.data.min_amount,
    //     maxReceived: res1.data.max_amount,
    //     recive_amount: res2.data.data.quote.receive_amount,  
    //     icon: "/placeholder.svg"
    // }

    // console.log(structure);
    // return structure;
} catch (error) {
    console.log("Error is : ",error);
}
   
}


export async function addSwapToLayerSwapTestNet(data) {

    const swapId = await axios.post(backendApi + "create-swap", data);
    console.log(swapId.data);


    return swapId.data;
  

}



export async function addSwapToLayerSwapMainNet(data) {
 
    
    const swapId = await axios.post(backendApi + "create-swap", data);
    console.log(swapId.data);


    return swapId.data;
}












