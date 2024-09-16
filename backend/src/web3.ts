import anchor, { BN, Wallet, web3 } from "@project-serum/anchor";
import { AnchorProvider, Program, Idl } from '@project-serum/anchor';
import { Connection, PublicKey } from "@solana/web3.js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

// Load the IDL from file
const idl = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'idl', 'group_payment.json'), 'utf8'));

const connection = new Connection(process.env.SOLANA_RPC_URL!, "confirmed");

// Load the Anchor program
const provider = new AnchorProvider(
  connection,
  new Wallet(anchor.web3.Keypair.generate()), // Use real wallet in production
  {commitment:"confirmed"}
);



const programId = new PublicKey(process.env.PROGRAM_ID!); // Ensure this matches your Anchor program ID

const program = new Program(idl, programId, provider);

// Function to create user info
export async function createUserInfo(username:any, walletAddress:any) {
  const userInfo = web3.Keypair.generate();
  const tx = await program.methods
    .createUserInfo(username)
    .accounts({
      userInfo: userInfo.publicKey,
      owner: new PublicKey(walletAddress),
      systemProgram: web3.SystemProgram.programId,
    })
    .signers([userInfo])
    .rpc();
  return tx;
}

// Function to create a group
export async function createGroup(title:any, recipient:any, members:any, admin:any) {
  const groupInfo = web3.Keypair.generate();
  const tx = await program.methods
    .createGroup(title, new PublicKey(recipient), members.map((m:any) => new PublicKey(m)))
    .accounts({
      groupInfo: groupInfo.publicKey,
      admin: new PublicKey(admin),
      systemProgram: web3.SystemProgram.programId,
    })
    .signers([groupInfo])
    .rpc();
  return tx;
}

// Function to send payment
export async function sendPayment(amount:any, payer:any, groupInfo:any) {
  const tx = await program.methods
    .sendPayment(new BN(amount))
    .accounts({
      payer: new PublicKey(payer),
      groupInfo: new PublicKey(groupInfo),
      systemProgram: web3.SystemProgram.programId,
    })
    .rpc();
  return tx;
}

