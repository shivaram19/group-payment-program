# Project description

This project is a payment splitting dApp built on the Solana blockchain using Rust with the Anchor framework to develop Solana programs (smart contracts). The frontend is built using React to interact with the deployed Solana program. The goal of the application is to allow users to split payments between multiple participants seamlessly on the Solana network, ensuring efficient and transparent financial transactions.

# how to start application
# prerequsites
2) Rust and Cargo (for building Solana programs)
3) Solana CLI (for interacting with the Solana blockchain)
```bash
sh -c "$(curl -sSfL https://release.solana.com/v1.10.32/install)"
```
4) Anchor CLI (for working with the Anchor framework)
```bash
cargo install --git https://github.com/project-serum/anchor --tag v0.24.2 anchor-cli --locked
```

5) Solana Devnet Account: Make sure you have an account on the Solana Devnet with some SOL for testing.

```bash
solana-keygen new --outfile ~/.config/solana/devnet.json
solana config set --keypair ~/.config/solana/devnet.json
solana config set --url https://api.devnet.solana.com
solana airdrop 2
```


# steps to run application
1) clone repo
```bash
git clone https://github.com/shivaram19/group-payment-program.git
cd payment-split-app
```
2) To deploy the smart contract (Solana program) on Devnet, run the following commands. Make sure you have SOL airdropped to your account and all necessary dependencies installed:
```bash
anchor build
anchor deploy --provider.cluster devnet
```

3) Open the frontend configuration file (usually .env or a configuration file where the Program ID is set), and replace the placeholder with the Program ID you obtained from the deployment step.
4) Now, install all the required frontend dependencies and start the development server:
```bash
npm install
npm run dev
```
