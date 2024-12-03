import { Chain } from "@/types/crypto";

interface ChainDisplayProps {
  chain: Chain;
}

export const ChainDisplay = ({ chain }: ChainDisplayProps) => {
  return (
    <div className="flex-1 flex items-center gap-2">
      <img
        src={chain.icon}
        alt={chain.name}
        className="w-6 h-6 rounded-full"
      />
      <span className="font-medium text-white">{chain.name}</span>
    </div>
  );
};