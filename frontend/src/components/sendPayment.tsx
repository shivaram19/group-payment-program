import { useState } from 'react';
import { useAnchorWallet, useWallet } from '@solana/wallet-adapter-react';
import {  Connection, PublicKey, SystemProgram } from '@solana/web3.js';
import * as anchor from '@project-serum/anchor';
import { Idl, Program, AnchorProvider } from '@project-serum/anchor';
import idl from '../../../target/idl/group_payment.json'; 
import dotenv from "dotenv"

dotenv.config()
const SendPayment = () => {
  const wallet = useAnchorWallet();
  const { connected } = useWallet();
  const [amount, setAmount] = useState('');
  const [groupInfo, setGroupInfo] = useState('');
  const [status, setStatus] = useState('');
  const connection = new Connection("https://solana-devnet.g.alchemy.com/v2/2zKnK-ovBrxDHty5RlGixdU8InCAbNbI", 'confirmed');
  if (!connected) {
    return <div>Please connect your wallet.</div>;
  }

  const handleSendPayment = async () => {
    try {
      const provider = new AnchorProvider( connection ,wallet!, { commitment: 'confirmed' });
      const program = new Program(idl as unknown as Idl, process.env.REACT_APP_PROGRAM_ID!, provider);

      const tx = await program.methods.sendPayment(new anchor.BN(amount))
        .accounts({
          payer: wallet?.publicKey,
          groupInfo: new PublicKey(groupInfo),
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      setStatus(`Payment sent with transaction signature: ${tx}`);
    } catch (err) {
      console.error(err);
      setStatus('Error sending payment.');
    }
  };

  return (
    <div>
      <h2>Send Payment</h2>
      <input
        type="number"
        placeholder="Amount (in lamports)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <input
        type="text"
        placeholder="Group Info PublicKey"
        value={groupInfo}
        onChange={(e) => setGroupInfo(e.target.value)}
      />
      <button onClick={handleSendPayment}>Send Payment</button>
      <div>{status}</div>
    </div>
  );
};

export default SendPayment;
