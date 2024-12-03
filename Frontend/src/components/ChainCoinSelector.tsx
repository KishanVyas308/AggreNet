import { Chain, Coin } from "@/types/crypto";
import { ChainDisplay } from "./ChainDisplay";
import { ChainSelector } from "./ChainSelector";
import { CoinSelectorDropdown } from "./CoinSelectorDropdown";

interface ChainCoinSelectorProps {
  selectedChain: Chain;
  selectedCoin: Coin;
  onChainSelect: (chain: Chain) => void;
  onCoinSelect: (coin: Coin) => void;
  chains: Chain[];
  label: string;
  isToSection?: boolean;
}

export const ChainCoinSelector = ({
  selectedChain,
  selectedCoin,
  onChainSelect,
  onCoinSelect,
  chains,
  label,
  isToSection
}: ChainCoinSelectorProps) => {
  return (
    <div className="flex gap-2">
      {isToSection ? (
        <ChainDisplay chain={selectedChain} />
      ) : (
        <ChainSelector
          selectedChain={selectedChain}
          onChainSelect={onChainSelect}
          chains={chains}
        />
      )}

      <CoinSelectorDropdown
        selectedCoin={selectedCoin}
        onCoinSelect={onCoinSelect}
        coins={selectedChain.coins}
      />
    </div>
  );
};