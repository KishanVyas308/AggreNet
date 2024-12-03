import { ExchangeCard } from "@/components/ExchangeCard";
import { BridgeRoutesPanel } from "@/components/BridgeRoutesPanel";
import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { WalletConnectionDialog } from "@/components/WalletConnectionDialog";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { Chain, Coin } from "@/types/crypto";
import { chains, toChain } from "@/types/globle";
import { useRecoilValue } from "recoil";
import { allBridgesDetailAtom } from "../hooks/allBrigesDetailAtom"




const Exchange = () => {
  const bridge = useRecoilValue(allBridgesDetailAtom)
  const [selectedFromChain, setSelectedFromChain] = useState<any>(() => {
    const saved = localStorage.getItem('selectedFromChain');
    return saved ? JSON.parse(saved) : chains[0];
  });
  const [selectedFromCoin, setSelectedFromCoin] = useState<any>(() => {
    const saved = localStorage.getItem('selectedFromCoin');
    return saved ? JSON.parse(saved) : chains[0].coins[0];
  });
  const [selectedToCoin, setSelectedToCoin] = useState<any>(() => {
    const saved = localStorage.getItem('selectedToCoin');
    return saved ? JSON.parse(saved) : toChain.coins[0];
  });
  const [amount, setAmount] = useState<string>(() => {
    return localStorage.getItem('amount') || '';
  });
  const [showRoutes, setShowRoutes] = useState(false);
  const [isSliding, setIsSliding] = useState(false);
  const [selectedBridge, setSelectedBridge] = useState<string | null>(null);
  const [selectedBridgeDetails, setSelectedBridgeDetails] = useState(null);
  const [activeMode, setActiveMode] = useState<'degen' | 'advance'>('degen');
  const [degenBridgeDetails, setDegenBridgeDetails] = useState(null);
  const [isWalletDialogOpen, setIsWalletDialogOpen] = useState(false);
  const [isLoadingBridges, setIsLoadingBridges] = useState(false);
  const { fromWalletAddress, toWalletAddress } = useWalletConnection();




  useEffect(() => {
    localStorage.setItem('selectedFromChain', JSON.stringify(selectedFromChain));
  }, [selectedFromChain]);
  useEffect(() => {
    localStorage.setItem('selectedFromCoin', JSON.stringify(selectedFromCoin));
  }, [selectedFromCoin]);
  useEffect(() => {
    localStorage.setItem('selectedToCoin', JSON.stringify(selectedToCoin));
  }, [selectedToCoin]);
  useEffect(() => {
    if (amount) {
      localStorage.setItem('amount', amount);
    }
  }, [amount]);
  useEffect(() => {
    if (fromWalletAddress) {
      localStorage.setItem('fromWalletAddress', fromWalletAddress);
    }
  }, [fromWalletAddress]);
  useEffect(() => {
    if (toWalletAddress) {
      localStorage.setItem('toWalletAddress', toWalletAddress);
    }
  }, [toWalletAddress]);




  const handleFromChainSelect = (chain: Chain) => {
    setSelectedFromChain(chain);
    setSelectedFromCoin(chain.coins[0]);
  };

  const handleFromCoinSelect = (coin: Coin) => {
    setSelectedFromCoin(coin);
  };

  const handleToCoinSelect = (coin: Coin) => {
    setSelectedToCoin(coin);
  };

  const handleReviewSwap = () => {
    if (activeMode === 'advance') {
      setIsSliding(true);
      setShowRoutes(true);
      setIsLoadingBridges(true);

      // Simulate loading time of 3.5 seconds
      setTimeout(() => {
        setIsLoadingBridges(false);
      }, 3000);
    } else {
      const cheapestBridge = bridge.reduce((prev, current) => {
        const prevFee = parseFloat(prev.fee.replace('$', ''));
        const currentFee = parseFloat(current.fee.replace('$', ''));
        return prevFee < currentFee ? prev : current;
      });
      setDegenBridgeDetails(cheapestBridge);
    }
  };

  const handleBridgeSelect = (bridge: any) => {
    setSelectedBridge(bridge.name);
    setSelectedBridgeDetails(bridge);
    setShowRoutes(false);
    setIsSliding(false);
  };

  const handleCloseRoutes = () => {
    setShowRoutes(false);
    setIsSliding(false);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a2c38] via-[#0f1922] to-[#162736] text-white">
      <Navigation />
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-6xl px-4 sm:px-8 py-8">
          <div className="relative">
            <ExchangeCard
              isSliding={isSliding}
              selectedFromChain={selectedFromChain}
              selectedFromCoin={selectedFromCoin}
              selectedToCoin={selectedToCoin}
              onFromChainSelect={handleFromChainSelect}
              onFromCoinSelect={handleFromCoinSelect}
              onToCoinSelect={handleToCoinSelect}
              chains={chains}
              toChain={toChain}
              selectedBridgeDetails={activeMode === 'advance' ? selectedBridgeDetails : degenBridgeDetails}
              handleReviewSwap={handleReviewSwap}
              activeMode={activeMode}
              setActiveMode={setActiveMode}
              amount={amount}
              onAmountChange={setAmount}
            />
            {activeMode === 'advance' && (
              <BridgeRoutesPanel
                showRoutes={showRoutes}
                bridges={bridge}
                selectedBridge={selectedBridge}
                onBridgeSelect={handleBridgeSelect}
                isLoading={isLoadingBridges}
                onClose={handleCloseRoutes}
              />
            )}
          </div>
        </div>
      </div>

      <WalletConnectionDialog
        isOpen={isWalletDialogOpen}
        onClose={() => setIsWalletDialogOpen(false)}
      />
    </div>
  );
};
export default Exchange;