import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Chain {
  id: string;
  name: string;
  icon: string;
}

interface Coin {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  chains: Chain[];
}

interface CoinSelectorProps {
  selectedCoin: Coin;
  selectedChain?: Chain;
  onSelect: (coin: Coin, chain?: Chain) => void;
  coins: Coin[];
  label: string;
}

export const CoinSelector = ({
  selectedCoin,
  selectedChain,
  onSelect,
  coins,
  label,
}: CoinSelectorProps) => {
  return (
    <Select
      value={selectedCoin.id}
      onValueChange={(value) => {
        const coin = coins.find((c) => c.id === value);
        if (coin) {
          // If coin has only one chain, select it automatically
          const defaultChain = coin.chains.length === 1 ? coin.chains[0] : undefined;
          onSelect(coin, defaultChain);
        }
      }}
    >
      <SelectTrigger className="w-full bg-transparent border-none text-white hover:bg-white/5 transition-colors">
        <div className="flex items-center gap-2">
          <div className="relative">
            <img
              src={selectedCoin.icon}
              alt={selectedCoin.name}
              className="w-6 h-6 rounded-full"
            />
            {selectedChain && (
              <img
                src={selectedChain.icon}
                alt={selectedChain.name}
                className="w-4 h-4 rounded-full absolute -bottom-1 -right-1"
              />
            )}
          </div>
          <span className="font-medium">{selectedCoin.symbol}</span>
          {selectedChain && (
            <span className="text-sm text-gray-400">on {selectedChain.name}</span>
          )}
        </div>
      </SelectTrigger>
      <SelectContent className="bg-[#1a2c38] border-[#0ea5e9]/20">
        {coins.map((coin) => (
          <div key={coin.id} className="py-1">
            <div className="px-2 py-1.5 text-sm text-gray-400">
              <div className="flex items-center gap-2 mb-2">
                <img
                  src={coin.icon}
                  alt={coin.name}
                  className="w-6 h-6 rounded-full"
                />
                <span>{coin.symbol}</span>
              </div>
              <div className="pl-8 space-y-1">
                {coin.chains.map((chain) => (
                  <SelectItem
                    key={`${coin.id}-${chain.id}`}
                    value={`${coin.id}-${chain.id}`}
                    className="text-white hover:bg-white/5"
                    onClick={() => onSelect(coin, chain)}
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={chain.icon}
                        alt={chain.name}
                        className="w-4 h-4 rounded-full"
                      />
                      <span>{chain.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </div>
            </div>
          </div>
        ))}
      </SelectContent>
    </Select>
  );
};