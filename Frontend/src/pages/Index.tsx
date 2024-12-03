import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRightIcon, Wallet2Icon, ArrowLeftRightIcon, ShieldCheckIcon, SparklesIcon, ZapIcon, BarChart3Icon, WalletIcon, CheckCircle2Icon } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { WalletConnectionDialog } from "@/components/WalletConnectionDialog";

const Index = () => {
  const [isWalletDialogOpen, setIsWalletDialogOpen] = useState(false);
  const { fromWalletAddress, toWalletAddress } = useWalletConnection();
  const isFullyConnected = fromWalletAddress && toWalletAddress;

  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a2c38] via-[#0f1922] to-[#162736] flex flex-col">
      <nav className="px-6 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 animate-fade-in">
            <ArrowLeftRightIcon className="w-6 h-6 text-[#0ea5e9]" />
            <h1 className="text-xl font-bold text-white">AggreNet</h1>
          </div>
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
      </nav>

      <div className="flex-1 flex flex-col items-center max-w-6xl mx-auto px-4 py-8 space-y-12">
        <div className="text-center space-y-4 mt-10">
          <h1 className="text-6xl font-bold text-white tracking-tight animate-[fade-in_0.8s_ease-out]">
            The Ultimate
            <span className="text-[#0ea5e9] block mt-2 animate-[fade-in_1s_ease-out_0.2s]">AggreNet for Starknet</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed animate-[fade-in_1.2s_ease-out_0.4s]">
            Find the best rates across multiple bridging protocols like StarkGate, Layerswap,
            Orbiter Finance, and Rhino.fi - all in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
          {[
            { icon: BarChart3Icon, stat: "5+", label: "Bridging Protocols" },
            { icon: ArrowLeftRightIcon, stat: "100%", label: "Automated Comparison" },
            { icon: WalletIcon, stat: "Real-time", label: "Price Updates" }
          ].map((item, index) => (
            <Card key={index} className="glass-card p-6 text-center hover:scale-105 transition-transform duration-300 animate-[fade-in_0.6s_ease-out] hover:bg-white/5">
              <item.icon className="w-8 h-8 text-[#0ea5e9] mx-auto mb-2" />
              <span className="text-3xl font-bold text-white block mb-1">{item.stat}</span>
              <span className="text-sm text-gray-300">{item.label}</span>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {[
            { icon: SparklesIcon, title: "Best Rates", description: "Instantly compare rates across StarkGate, Layerswap, Orbiter Finance, and more." },
            { icon: ShieldCheckIcon, title: "Security First", description: "All integrated protocols are thoroughly vetted and regularly audited." },
            { icon: ZapIcon, title: "One-Click Bridge", description: "Bridge your assets with the best rates in a single transaction." }
          ].map((feature, index) => (
            <Card key={index} className="glass-card p-6 hover:scale-105 transition-transform duration-300 animate-[fade-in_0.8s_ease-out] hover:bg-white/5">
              <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <feature.icon className="w-6 h-6 text-[#0ea5e9]" />
                {feature.title}
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>

        <Link to="/exchange">
          <Button
            className="glass-card text-white px-10 py-5 text-lg font-bold hover:bg-[#1e293b] transition-all transform hover:scale-105 animate-[fade-in_1s_ease-out] border border-[#0ea5e9]/20"
          >
            Start Bridging
            <ArrowRightIcon className="w-5 h-5 ml-2" />
          </Button>
        </Link>
      </div>

      <WalletConnectionDialog
        isOpen={isWalletDialogOpen}
        onClose={() => setIsWalletDialogOpen(false)}
      />
    </div>
  );
};

export default Index;