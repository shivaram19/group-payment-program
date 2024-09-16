import WalletProvider from './wallet/walletProvider';
import CreateGroup from './components/createGroup';
import SendPayment from './components/sendPayment';

const App = () => {
  return (
    <WalletProvider>
      <div>
        <h1>Group Payment dApp</h1>
        <CreateGroup />
        <SendPayment />
      </div>
    </WalletProvider>
  );
};

export default App;
