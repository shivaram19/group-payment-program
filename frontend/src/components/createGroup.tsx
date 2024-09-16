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
      const provider = new AnchorProvider(connection, wallet!, { commitment: 'confirmed' });
      const program = new Program(idl as unknown as Idl, "BhoPUdL4TWzUVgB3Mrrt16zdDmQNN8h1QACYxp8VVMaE", provider);

      const [groupInfo] = await PublicKey.findProgramAddress(
        [Buffer.from(title), new PublicKey(recipient).toBuffer()],
        program.programId
      );

      const tx = await program.methods.createGroup(title, new PublicKey(recipient), members.map(m => new PublicKey(m)))
        .accounts({
          groupInfo: groupInfo,
          admin: wallet?.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      setStatus(`Group created with transaction signature: ${tx}`);
    } catch (err) {
      console.error(err);
      setStatus('Error creating group.');
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
