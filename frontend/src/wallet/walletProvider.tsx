import { FC } from 'react';
import { WalletProvider as SolanaWalletProvider, ConnectionProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
interface childrenProps {
  children?: React.ReactNode;
}
const WalletProvider: FC<childrenProps> = ({ children }) => {
  const endpoint = "ttps://solana-devnet.g.alchemy.com/v2/2zKnK-ovBrxDHty5RlGixdU8InCAbNbI" // Or 'mainnet-beta' for mainnet

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
};

export default WalletProvider;
