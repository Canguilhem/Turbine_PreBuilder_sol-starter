import { Commitment, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, sendAndConfirmTransaction, Transaction } from "@solana/web3.js"
import wallet from "./wallet/dev_wallet.json"
import { createTransferInstruction, getOrCreateAssociatedTokenAccount, TOKEN_PROGRAM_ID, transfer } from "@solana/spl-token";

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

// Mint address
const mint = new PublicKey("Hh3TjYntA636VAcfn8oU38aq7Urqf3e4XL4a2LHXGgM6");


// Recipient address


(async () => {
    try {
        const recipients=["Ggph5TqSLMMKWg5QA88ojUW7nLbfZ26DakmHcCd6fVb4","9yq8BgSG7XahLBKivhTiHKbrhXfHTA8Yk4xixgyg8yyd","4ncsvGw6AuXFjgA328JaZHkjzNHTWLHw9yZ8A9JTqZ5n"]
        // Get the token account of the fromWallet address, and if it does not exist, create it
        const fromAta = await getOrCreateAssociatedTokenAccount(connection, keypair, mint, keypair.publicKey);
        const fromBalance = await connection.getTokenAccountBalance(fromAta.address);
        console.log(`From balance: ${fromBalance.value.amount}`);

        

        // Get the token account of the toWallet address, and if it does not exist, create it
        const toAta = await getOrCreateAssociatedTokenAccount(connection, keypair, mint, new PublicKey(recipients[0]));
        const toBalance = await connection.getTokenAccountBalance(toAta.address);
        console.log(`To balance: ${toBalance.value.amount}`);
        
        let transaction = new Transaction();
        
        for (const recipient of recipients) {
            const to = new PublicKey(recipient);
            const toAta = await getOrCreateAssociatedTokenAccount(connection, keypair, mint, to);
             transaction.add(
                createTransferInstruction(fromAta.address, toAta.address, keypair.publicKey,  1_000_000, [], TOKEN_PROGRAM_ID),
            );
        
        }
        console.log(`Transaction: ${transaction}`);
        const signature = await sendAndConfirmTransaction(connection, transaction, [keypair]);
        console.log(`Signature: ${signature}`);
        
        console.log(`Transaction: ${JSON.stringify(transaction)}`);
        
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();