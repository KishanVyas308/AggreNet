import { useState } from "react";
import { ArrowDownIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { WalletConnectionDialog } from "@/components/WalletConnectionDialog";
import { ChainCoinSelector } from "@/components/ChainCoinSelector";
import { ModeSelector } from "@/components/exchange/ModeSelector";
import { Chain, Coin } from "@/types/crypto";
import { BridgeDetails } from "@/components/exchange/BridgeDetails";
import { addSwapToLayerSwapTestNet, getBridgeDetailList, getLayerSwapTestnet } from "@/utils/utils";
import { useRecoilState, useSetRecoilState } from "recoil";
import { allBridgesDetailAtom } from "@/hooks/allBrigesDetailAtom";
import axios from "axios";
import { backendApi } from "@/types/globle";
import { ethers } from "ethers";
import * as owlto from "owlto-sdk";
import { getAllBridgesDetail } from "./BridgeDetailFunctions/BridgeDetailFunctions";

import { validateAndParseAddress } from "starknet";


interface ExchangeCardProps {
  isSliding: boolean;
  selectedFromChain: Chain;
  selectedFromCoin: Coin;
  selectedToCoin: Coin;
  onFromChainSelect: (chain: Chain) => void;
  onFromCoinSelect: (coin: Coin) => void;
  onToCoinSelect: (coin: Coin) => void;
  chains: Chain[];
  toChain: Chain;
  selectedBridgeDetails: any;
  handleReviewSwap: () => void;
  activeMode: 'degen' | 'advance';
  setActiveMode: (mode: 'degen' | 'advance') => void;
  amount: string;
  onAmountChange: (amount: string) => void;
}

export const ExchangeCard = ({
  isSliding,
  selectedFromChain,
  selectedFromCoin,
  selectedToCoin,
  onFromChainSelect,
  onFromCoinSelect,
  onToCoinSelect,
  chains,
  toChain,
  selectedBridgeDetails,
  handleReviewSwap,
  activeMode,
  setActiveMode,
  amount,
  onAmountChange,
}: ExchangeCardProps) => {
  const [isWalletDialogOpen, setIsWalletDialogOpen] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  const { fromWalletAddress, toWalletAddress } = useWalletConnection();
  const [status, setStatus] = useState("");

  const [bridges, setBridges] = useRecoilState(allBridgesDetailAtom);



  const handleSwapNowClick = async () => {

    if (!fromWalletAddress || !toWalletAddress) {
      setIsWalletDialogOpen(true);

      return;
    }

    // In advance mode, if no bridge is selected, trigger bridge selection
    if (activeMode === 'advance' && !selectedBridgeDetails) {
      handleReviewSwap(); // This opens the bridge routes panel
      return;
    }
    setIsTransferring(true);


    const amount = localStorage.getItem("amount");
    const source_network = JSON.parse(localStorage.getItem("selectedFromChain"));
    const destination_network = localStorage.getItem("selectedToChain");

    const source_token = JSON.parse(localStorage.getItem("selectedFromCoin"));
    const destination_token = JSON.parse(localStorage.getItem("selectedToCoin"))

    const source_address = localStorage.getItem("fromWalletAddress")
    const destination_address = localStorage.getItem("toWalletAddress")
    console.log("source_network", source_network)
    console.log("destination_network", destination_network);


    // getLayerSwapTestnet("ETHEREUM_MAINNET", "ETH", "STARKNET_MAINNET", "ETH", 1).then(console.log)


    const res = await getAllBridgesDetail(localStorage.getItem("amount"));
    setBridges(res);

    let layerSwap = false;
    let orlto = false;

    bridges.map(async (bridge) => {
      console.log(bridge);
      if (bridge.name === "LayerSwap") {
        layerSwap = true;
        // terminate the loop
        return;
      }
      if (bridge.name === "Owlto") {
        orlto = true;
        // terminate the loop
        return;
      }
    } )

    //!! for layerswap main net
    // for layer swap 
    if (layerSwap) {
      console.log("LayerSwap");
      
      try {


        const formData = {
          amount: amount,
          source_network: source_network.chainid,
          source_token: source_token.symbol,
          destination_network: "STARKNET_MAINNET",
          destination_token: destination_token.symbol,
          destination_address: destination_address,
          source_address: source_address,
          refuel: false,
          fee: 0,
          reference_id: null,
          use_deposit_address: false,
          use_new_deposit_address: null,
          slippage: null
        }

        console.log(formData)

        const swapid = await addSwapToLayerSwapTestNet(formData)

        console.log("swap id is : ", swapid)
        await conformTransactionfun(swapid)

        setIsTransferring(false)

      } catch (error) {
        console.error('Bridge Error:', error);
        setStatus(error.message);
        setIsTransferring(false);
      }

    }

    //!for orlto mainnet
    if (orlto) {
      console.log("Owlto");
      
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();

        const options = {};
        const bridge = new owlto.Bridge(options);

        console.log((fromWalletAddress).toString())
        console.log(toWalletAddress);

        validateAndParseAddress(toWalletAddress);

        const result = await bridge.getBuildTx(
          
          "ETH", // token name
          "EthereumMainnet", // from chain name
          "StarknetMainnet", // to chain name
          amount, // value
          fromWalletAddress,
          toWalletAddress
        );

        if (result.txs.approveBody) {
          const approveTx = await signer.sendTransaction(result.txs.approveBody);
          await approveTx.wait();
        }

        const transferTx = await signer.sendTransaction(result.txs.transferBody);
        await transferTx.wait();

        setStatus(`Transaction Successful! Hash: ${transferTx.hash}`);

        const receipt = await bridge.waitReceipt(transferTx.hash);
        console.log('Bridge Receipt:', receipt);
      } catch (error) {
        console.error('Bridge Error:', error);
        setStatus(error.message);
        setIsTransferring(false);
      }
    }

    // Only start animation if we have a bridge selected (advance mode) or in degen mode
    setIsTransferring(true);
    setTimeout(() => {
      setIsTransferring(false);
      if (activeMode === 'degen') {
        handleReviewSwap();
      }
    }, 3000);
  };

  //? this is the function to confirm the transaction
  async function conformTransactionfun(swapId: any) {
    const API_KEY =
      "NDBxG+aon6WlbgIA2LfwmcbLU52qUL9qTnztTuTRPNSohf/VnxXpRaJlA5uLSQVqP8YGIiy/0mz+mMeZhLY4/Q";

    try {
      const res: any = await axios.get(
        `https://api.layerswap.io/api/v2/swaps/${swapId}/deposit_actions`,
        {
          headers: {
            "x-ls-apikey": API_KEY,
          },
        }
      );

      console.log("Deposit Actions:", res.data);

      const depositAction: any = res.data;
      console.log("Deposit Action:", depositAction.data[0]);


      const { to_address, amount_in_base_units, network } = depositAction.data[0];

      try {
        if (!window.ethereum) {
          throw new Error("MetaMask is not installed");
        }
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        // Ensure the user is on the correct network
        const networkDetails = {
          chainId: ethers.utils.hexValue(parseInt(network.chain_id, 10)),
          chainName: network.display_name,
          rpcUrls: [network.node_url],
          nativeCurrency: {
            name: network.token.symbol,
            symbol: network.token.symbol,
            decimals: network.token.decimals,
          },
          blockExplorerUrls: [
            network.transaction_explorer_template.replace("{0}", ""),
          ],
        };

        try {
          await provider.send("wallet_addEthereumChain", [networkDetails]);
        } catch (switchError) {
          if (switchError.code === 4902) {
            await provider.send("wallet_switchEthereumChain", [
              { chainId: networkDetails.chainId },
            ]);
          } else {
            throw switchError;
          }
        }
        // Check balance
        const balance = await provider.getBalance(signer.getAddress());
        const gasPrice = await provider.getGasPrice();
        const gasLimit = ethers.BigNumber.from("21000"); // Estimate gas limit
        const totalCost = gasPrice.mul(gasLimit).add(ethers.BigNumber.from(amount_in_base_units));

    
        // Create transaction
        const tx = {
          from: "0x7cfbf495bf66c26C73867B221c4301ef6463578b",
          to: to_address,
          value: ethers.BigNumber.from(amount_in_base_units), // Amount in wei
          data: res.data.data[0].call_data,
          gasLimit: gasLimit,
          gasPrice: gasPrice,
        };

        // Send transaction
        const transactionResponse = await signer.sendTransaction(tx);

        // Wait for the transaction to be mined (optional)
        const receipt = await transactionResponse.wait();
        console.log("Transaction Receipt:", receipt);
      } catch (err) {
        console.error(err);
        // setError(err.message);
      }
    } catch (error) {
      console.error(
        "Error confirming transaction:",
        error.response?.data || error.message
      );
    }
  }



  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onAmountChange(e.target.value);
  };
  return (
    <Card
      className={`3relative overflow-hidden p-6 max-w-[420px] mx-auto 
        transition-all duration-500 ease-in-out transform 
        ${isSliding ? 'opacity-80 scale-95' : 'opacity-100 scale-100'}
        bg-gradient-to-br from-[#1a2c38] via-[#0f1922] to-[#162736]
        before:absolute before:inset-0 
        before:bg-[url('https://images.unsplash.com/photo-1640340434855-6084b1f4901c')] 
        before:opacity-5 before:bg-cover before:bg-center before:mix-blend-overlay
        ${activeMode === 'degen' ? 'shadow-[0_0_50px_-5px_#0ea5e9]' : ''}
      `}
    >
      <div className="relative z-10">
        <ModeSelector activeMode={activeMode} setActiveMode={setActiveMode} />

        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-[#1a2c38]/50 backdrop-blur-md border border-[#0ea5e9]/10 hover:bg-[#1a2c38]/70 hover:border-[#0ea5e9]/20 transition-all duration-300">
            <div className="mb-2">
              <span className="text-sm text-gray-400">From</span>
            </div>
            <ChainCoinSelector
              selectedChain={selectedFromChain}
              selectedCoin={selectedFromCoin}
              onChainSelect={onFromChainSelect}
              onCoinSelect={onFromCoinSelect}
              chains={chains}
              label="From"
            />
            <div className="mt-3">
              <Input
                type="text"
                value={amount}
                onChange={handleAmountChange}
                className="w-full bg-transparent text-2xl border-none text-white placeholder:text-gray-600 p-1 h-10"
                placeholder="Add amount"
              />
            </div>
          </div>

          <div className="flex justify-center -my-2 relative z-10">
            <div className="p-4">
              <ArrowDownIcon className="w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#1a2c38]/50 backdrop-blur-md border border-[#0ea5e9]/10 hover:bg-[#1a2c38]/70 hover:border-[#0ea5e9]/20 transition-all duration-300">
            <div className="mb-2">
              <span className="text-sm text-gray-400">To</span>
            </div>
            <ChainCoinSelector
              selectedChain={toChain}
              selectedCoin={selectedToCoin}
              onChainSelect={() => { }}
              onCoinSelect={onToCoinSelect}
              chains={[toChain]}
              label="To"
              isToSection
            />
          </div>

          {activeMode === 'advance' && selectedBridgeDetails && (
            <BridgeDetails
              bridge={selectedBridgeDetails}
              onReselect={handleReviewSwap}
            />
          )}
          {isTransferring && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-8 h-8 rounded-full bg-cyan animate-coin-transfer">
                <img
                  src={selectedFromCoin.icon}
                  alt="transferring coin"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          )}

          <Button
            className="w-full bg-gradient-to-r from-[#0ea5e9] to-[#22c55e] hover:from-[#0ea5e9]/90 hover:to-[#22c55e]/90 text-white py-6 font-medium text-lg rounded-xl shadow-lg transition-all duration-300 mt-2 backdrop-blur-md border border-[#0ea5e9]/20"
            onClick={handleSwapNowClick}
            disabled={isTransferring}
          >
            {isTransferring ? (
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin" />
                Processing...
              </div>
            ) : (
              'Swap Now'
            )}
          </Button>

          {status && (
            <div className="mt-4 text-center text-gray-400">
              {status}
            </div>
          )}
        </div>
      </div>

      <WalletConnectionDialog
        isOpen={isWalletDialogOpen}
        onClose={() => setIsWalletDialogOpen(false)}
      />
    </Card>
  );
};