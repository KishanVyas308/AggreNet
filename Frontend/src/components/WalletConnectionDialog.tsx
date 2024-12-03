import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { useWalletConnection } from "@/hooks/useWalletConnection";

const fromWallets = [
  { id: 'metamask', name: 'MetaMask', icon: 'https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg' },
  { id: 'coinbase', name: 'Coinbase Wallet', icon: 'https://seeklogo.com/images/C/coinbase-coin-logo-C86F46D7B8-seeklogo.com.png' },
  { id: 'trustwallet', name: 'Trust Wallet', icon: 'https://trustwallet.com/assets/images/media/assets/trust_platform.svg' },
];

interface WalletConnectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WalletConnectionDialog = ({
  isOpen,
  onClose,
}: WalletConnectionDialogProps) => {
  const {
    connectFromWallet,
    connectToWallet,
    isConnectingFrom,
  } = useWalletConnection();

  const handleFromWalletSelect = async (walletId: string) => {
    const address = await connectFromWallet(walletId);
    if (address) {
      onClose(); // Close dialog after source wallet connects
      // Trigger Starknet connection after dialog is closed
      connectToWallet(walletId);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1A1F2C] border-none text-white">
        <DialogTitle className="text-xl font-bold mb-4 text-white">
          Select Source Wallet
        </DialogTitle>
        <div className="p-6">
          <div className="space-y-2">
            {fromWallets.map((wallet) => (
              <button
                key={wallet.id}
                onClick={() => handleFromWalletSelect(wallet.id)}
                disabled={isConnectingFrom}
                className="w-full flex items-center gap-2 p-3 rounded-lg hover:bg-[#2A2F3A] transition-colors disabled:opacity-50"
                aria-label={`Connect to ${wallet.name}`}
              >
                {isConnectingFrom ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <img src={wallet.icon} alt={wallet.name} className="w-6 h-6" />
                )}
                <span className="text-white">
                  {isConnectingFrom ? 'Connecting...' : wallet.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};