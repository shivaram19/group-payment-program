import { FC, useMemo } from 'react';
import { WalletProvider as SolanaWalletProvider, ConnectionProvider } from '@solana/wallet-adapter-react';
import { WalletDisconnectButton, WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter} from '@solana/wallet-adapter-wallets';
interface childrenProps {
  children?: React.ReactNode;
}

export const endpoint = "https://solana-devnet.g.alchemy.com/v2/HWJHZamlTOsopXL8PpF2cD4MQCDYzmnQ"
const WalletProvider: FC<childrenProps> = ({ children }) => {
   // Or 'mainnet-beta' for mainnet
  //  const network = WalletAdapterNetwork.Devnet
  //   // You can also provide a custom RPC endpoint
  //   const endpoint = useMemo(() => clusterApiUrl(network), [network]);
   const wallets = useMemo(
    () => [
        new PhantomWalletAdapter()
        // Add other wallets here
    ],
    []
  );
  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <WalletMultiButton />
          <WalletDisconnectButton />
          {children}
        </WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
};

export default WalletProvider;
