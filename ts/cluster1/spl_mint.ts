import { Keypair, PublicKey, Connection, Commitment } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token';
import wallet from "./wallet/dev_wallet.json"

// Import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

const token_decimals = 7_777_777n;

// Mint address
const mint = new PublicKey("Hh3TjYntA636VAcfn8oU38aq7Urqf3e4XL4a2LHXGgM6");

(async () => {
    try {
        // Create an ATA
        const ata = await getOrCreateAssociatedTokenAccount(connection, keypair, mint, keypair.publicKey);
        console.log(`Your ata is: ${ata.address.toBase58()}`);
        // console.log(`Your ata is: ${ata.address.toBase58()}`);

        // Mint to ATA
        const mintTx = await mintTo(connection, keypair,mint,  ata.address, keypair.publicKey, token_decimals);
        console.log(`Your mint txid: ${mintTx}`);
        const balance = await connection.getTokenAccountBalance(ata.address);
        console.log(`Balance: ${balance.value.amount}`);
        // console.log(`Your mint txid: ${mintTx}`);
    } catch(error) {
        console.log(`Oops, something went wrong: ${error}`)
    }
})()
