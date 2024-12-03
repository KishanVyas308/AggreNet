import { Button } from "@/components/ui/button";
import { ArrowLeftRightIcon, Wallet2Icon, CheckCircle2Icon } from "lucide-react";
import { Link } from "react-router-dom";
import { WalletConnectionDialog } from "@/components/WalletConnectionDialog";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { useState } from "react";

export const Navigation = () => {
  const [isWalletDialogOpen, setIsWalletDialogOpen] = useState(false);
  const { fromWalletAddress, toWalletAddress } = useWalletConnection();

  const isFullyConnected = fromWalletAddress && toWalletAddress;

  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <nav className="px-6 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 animate-fade-in">
          <ArrowLeftRightIcon className="w-6 h-6 text-[#0ea5e9]" />
          <h1 className="text-xl font-bold text-white">AggreNet</h1>
        </Link>

        <div className="flex items-center gap-4">
          {isFullyConnected ? (
            <Button 
              variant="outline" 
              className="glass-card font-medium text-[#0ea5e9] hover:backdrop-blur-lg hover:font-bold border-0 transition-all animate-fade-in"
              disabled
            >
              <CheckCircle2Icon className="w-4 h-4 mr-2" />
              {formatAddress(fromWalletAddress)} → {formatAddress(toWalletAddress)}
            </Button>
          ) : (
            <Button 
              variant="outline" 
              className="glass-card font-medium text-white hover:backdrop-blur-lg hover:font-bold border-0 transition-all animate-fade-in"
              onClick={() => setIsWalletDialogOpen(true)}
            >
              <Wallet2Icon className="w-4 h-4 mr-2" />
              Connect Wallet
            </Button>
          )}
        </div>

        <WalletConnectionDialog 
          isOpen={isWalletDialogOpen}
          onClose={() => setIsWalletDialogOpen(false)}
        />
      </div>
    </nav>
  );
};