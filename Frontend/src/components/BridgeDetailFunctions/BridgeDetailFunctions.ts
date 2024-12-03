import { BACKEND_API_BRIDGE_DATA } from "@/types/globle";
import axios from "axios";



const fetchLayerSwap = async (amount) => {
    const { source_network, source_token, destination_network, destination_token } = inputData.layerswap;
    const response = await axios.get(`${BACKEND_API_BRIDGE_DATA}/layerswap-testnet`, {
      params: { source_network, source_token, destination_network, destination_token, amount },
    });
    return response.data;
  };
  
  const fetchOrbiter = async (amount) => {
    const { source_chain_id, dstChainId, srcToeknSymbol, dstTokenSymbol } = inputData.orbiter;
    const response = await axios.get(`${BACKEND_API_BRIDGE_DATA}/orbitor-finance`, {
      params: { source_chain_id, dstChainId, srcToeknSymbol, dstTokenSymbol, amount },
    });
    return response.data;
  };
  
  const fetchOwito = async (amount) => {
    const { from_address, from_chain_name, to_address, ui_value, token_name,  to_chain_name} = inputData.owito;
    const response = await axios.get(`${BACKEND_API_BRIDGE_DATA}/owito-mainnet`, {
      params: { from_address, from_chain_name, to_address, amount, token_name ,to_chain_name},
    });
    return response.data;
  };
  
  const fetchRetroBridge = async (amount) => {
    const { source_chain, asset_from, destination_chain, asset_to, wallet_sender } = inputData.retrobridge;
    const response = await axios.get(`${BACKEND_API_BRIDGE_DATA}/retrobridge-testnet`, {
      params: { source_chain, asset_from, destination_chain, asset_to, amount, wallet_sender },
    });
    return response.data;
  };


  const inputData = {
    layerswap: {
      source_network: 'ETHEREUM_MAINNET',
      source_token: 'ETH',
      destination_network: 'STARKNET_MAINNET',
      destination_token: 'ETH',
      amount: 1,    
    },
    orbiter: {
      source_chain_id: 1,
      dstChainId: 137,
      srcToeknSymbol: 'ETH',
      dstTokenSymbol: 'ETH',
      amount: 0.1,
    },
    owito: {
      from_address: "0x81D6afA127fA4cbE97579E41f7D8d34525d14268",
      from_chain_name: "EthereumMainnet",
      to_address: "0x043c91915f9d295240e7319a4fd05594a3ed8a62f6c29b9a664e7ec034753beb",
      to_chain_name: "StarknetMainnet",
      token_name: "ETH",
      ui_value: "0.5",
    },
    retrobridge: {
      source_chain: 'ETHEREUM',
      asset_from: 'ETH',
      destination_chain: 'STARKNET',
      asset_to: 'ETH',
      amount: 0.1,
      wallet_sender: '0xDca60Cb8F4E7409e2FC4b028973bbFA56caD2578...',
    },
  };




  
 export const getAllBridgesDetail = async (amount) => {
    try {
      const layerswapData = await fetchLayerSwap(amount);
      console.log('LayerSwap Data:', layerswapData);
  
      const orbiterData = await fetchOrbiter(amount);
      console.log('Orbiter Data:', orbiterData);
  
      const owitoData = await fetchOwito(amount);
      console.log('Owito Data:', owitoData);
  
      const retroBridgeData = await fetchRetroBridge(amount);
      console.log('Retro Bridge Data:', retroBridgeData);
      const allData : any= [
        { name: 'LayerSwap', data: layerswapData },
        { name: 'Orbiter', data: orbiterData },
        { name: 'Owito', data: owitoData },
        { name: 'RetroBridge', data: retroBridgeData },
      ];
  
      allData.sort((a, b) : any => a.data.fee - b.data.fee);
  
      console.log('Sorted Data by Fee:', allData);
      
      return allData
    
  } catch (error) {
      console.error('Error fetching data:', error.response ? error.response.data : error.message);
    }
  };