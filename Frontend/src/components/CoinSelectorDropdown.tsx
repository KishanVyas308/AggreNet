import { Coin } from "@/types/crypto";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";

interface CoinSelectorDropdownProps {
  selectedCoin: Coin;
  onCoinSelect: (coin: Coin) => void;
  coins: Coin[];
}

export const CoinSelectorDropdown = ({
  selectedCoin,
  onCoinSelect,
  coins,
}: CoinSelectorDropdownProps) => {
  return (
    <Select
      value={selectedCoin.id}
      onValueChange={(value) => {
        const coin = coins.find(c => c.id === value);
        if (coin) onCoinSelect(coin);
      }}
    >
      <SelectTrigger className="w-32 bg-transparent border-none text-white hover:bg-white/5 transition-colors">
        <div className="flex items-center gap-2">
          <img
            src={selectedCoin.icon}
            alt={selectedCoin.name}
            className="w-6 h-6 rounded-full"
          />
          <span className="font-medium">{selectedCoin.symbol}</span>
        </div>
      </SelectTrigger>
      <SelectContent className="bg-[#1a2c38] border-[#0ea5e9]/20">
        {coins.map((coin) => (
          <SelectItem
            key={coin.id}
            value={coin.id}
            className="text-white hover:bg-white/5"
          >
            <div className="flex items-center gap-2">
              <img
                src={coin.icon}
                alt={coin.name}
                className="w-4 h-4 rounded-full"
              />
              <span>{coin.symbol}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};