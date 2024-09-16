import { useState } from 'react';
import { useAnchorWallet, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { Program, AnchorProvider, Idl } from '@project-serum/anchor';
import idl from '../../../target/idl/group_payment.json'; // Path to your IDL file
import { Connection } from '@solana/web3.js';

const CreateGroup = () => {
  const wallet = useAnchorWallet();
  const { connected } = useWallet();
  const [title, setTitle] = useState('');
  const [recipient, setRecipient] = useState('');
  const [members, setMembers] = useState([]);
  const [status, setStatus] = useState('');
  const connection = new Connection("https://api.devnet.solana.com", 'confirmed');

  if (!connected) {
    return <div>Please connect your wallet.</div>;
  }

  const handleCreateGroup = async () => {
    try {
      // Check if wallet is connected and valid
      if (!wallet?.publicKey) {
        setStatus('Wallet not connected');
        return;
      }

      console.log('Initializing provider and program...');
      const provider = new AnchorProvider(connection, wallet, { commitment: 'confirmed' });
      const program = new Program(idl as unknown as Idl, "BhoPUdL4TWzUVgB3Mrrt16zdDmQNN8h1QACYxp8VVMaE", provider);
      console.log('Program initialized');

      // Ensure recipient is a valid public key
      const recipientPubKey = new PublicKey(recipient);
      const memberPubKeys = members.map((m) => new PublicKey(m));
      console.log("hakuna")
      // Validate title length or other business logic if necessary

      // Find the program address for the group
      const [groupInfo] = await PublicKey.findProgramAddress(
        [Buffer.from(title), recipientPubKey.toBuffer()],
        program.programId
      );
      console.log('Group Info PDA:', groupInfo.toString());

      // Make the transaction to create the group
      console.log("mat")
      // const tx = await 
      console.log(program.methods) 
      let tx
      try {
         tx = await program.methods
        .createGroup(title, recipientPubKey, memberPubKeys)
        .accounts({
          groupInfo: groupInfo,
          admin: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
      } catch (error) {
        console.log(error)
      }
        console.log("aata")
      console.log('Transaction successful:', tx);
      setStatus(`Group created with transaction signature: ${tx}`);
    } catch (err:any) {
      console.error('Error creating group:', err);
      setStatus(`Error creating group: ${err.message}`);
    }
  };

  return (
    <div>
      <h2>Create Group</h2>
      <input
        type="text"
        placeholder="Group Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Recipient PublicKey"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      />
      <input
        type="text"
        placeholder="Members (comma separated)"
        value={members.join(',')}
        onChange={(e:any) => setMembers(e.target.value.split(','))}
      />
      <button onClick={handleCreateGroup}>Create Group</button>
      <div>{status}</div>
    </div>
  );
};

export default CreateGroup;
