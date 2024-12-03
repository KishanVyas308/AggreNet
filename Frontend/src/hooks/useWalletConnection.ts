import { useState } from "react";
import { connect, disconnect } from "get-starknet";
import { useToast } from "@/hooks/use-toast";
import { ethers } from "ethers";

// Static variables to store wallet addresses and signers
let fromWalletAddress: string | null = null;
let toWalletAddress: string | null = null;
let fromWalletSigner: ethers.Signer | null = null;

export const useWalletConnection = () => {
  const { toast } = useToast();
  const [isConnectingFrom, setIsConnectingFrom] = useState(false);
  const [isConnectingTo, setIsConnectingTo] = useState(false);

  const connectFromWallet = async (walletId: string) => {
    setIsConnectingFrom(true);
    try {
      // Check if MetaMask is installed
      if (!window.ethereum) {
        toast({
          title: "Wallet not found",
          description: "Please install MetaMask or another Ethereum wallet",
          variant: "destructive",
        });
        return null;
      }

      // Request account access
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      
      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts found");
      }

      fromWalletAddress = accounts[0];
      fromWalletSigner = provider.getSigner();
      
      toast({
        title: "Success",
        description: `Connected to ${walletId}!`,
      });
      
      return fromWalletAddress;
    } catch (error) {
      console.error("Failed to connect source wallet:", error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to wallet. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsConnectingFrom(false);
    }
  };

  const connectToWallet = async (walletId: string) => {
    setIsConnectingTo(true);
    try {
      // Connect to Starknet wallet using default modal
      const starknet = await connect();

      if (!starknet?.isConnected) {
        throw new Error("Starknet wallet connection failed");
      }

      toWalletAddress = starknet.selectedAddress;
      // toWalletAddress = "0x7cfbf495bf66c26C73867B221c4301ef6463578b";

      
      toast({
        title: "Success",
        description: `Connected to Starknet wallet!`,
      });
      
      return toWalletAddress;
    } catch (error) {
      console.error("Failed to connect Starknet wallet:", error);
      toast({
        title: "Connection Failed",
        description: "Please make sure your Starknet wallet is installed and unlocked.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsConnectingTo(false);
    }
  };

  return {
    connectFromWallet,
    connectToWallet,
    isConnectingFrom,
    isConnectingTo,
    fromWalletAddress,
    toWalletAddress,
    fromWalletSigner,
  };
};