import { Button } from "@/components/ui/button";

interface ModeSelectorProps {
  activeMode: 'degen' | 'advance';
  setActiveMode: (mode: 'degen' | 'advance') => void;
}

export const ModeSelector = ({ activeMode, setActiveMode }: ModeSelectorProps) => {
  return (
    <>
      <div className="flex gap-4 mb-6">
        <Button 
          variant="ghost" 
          className={`flex-1 backdrop-blur-lg border border-white/5 hover:bg-[#0ea5e9]/20 hover:border-[#0ea5e9]/20 transition-all duration-300 rounded-xl py-6 active:scale-95 transform ${
            activeMode === 'degen' ? 'bg-[#0ea5e9]/20 border-[#0ea5e9]/20 text-white animate-fade-in' : 'bg-white/5 text-gray-400'
          }`}
          onClick={() => setActiveMode('degen')}
        >
          Degen
        </Button>
        <Button 
          variant="ghost" 
          className={`flex-1 backdrop-blur-lg border border-white/5 hover:bg-[#0ea5e9]/20 hover:border-[#0ea5e9]/20 transition-all duration-300 rounded-xl py-6 active:scale-95 transform ${
            activeMode === 'advance' ? 'bg-[#0ea5e9]/20 border-[#0ea5e9]/20 text-white animate-fade-in' : 'bg-white/5 text-gray-400'
          }`}
          onClick={() => setActiveMode('advance')}
        >
          Advance
        </Button>
      </div>

      <div className="animate-fade-in text-center mb-6">
        <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium backdrop-blur-md ${
          activeMode === 'degen' 
            ? 'bg-[#0ea5e9]/20 text-[#0ea5e9] border border-[#0ea5e9]/20' 
            : 'bg-[#22c55e]/20 text-[#22c55e] border border-[#22c55e]/20'
        }`}>
          {activeMode === 'degen' ? '🚀 Degen Mode Active' : '⚙️ Advance Mode Active'}
        </span>
      </div>
    </>
  );
};