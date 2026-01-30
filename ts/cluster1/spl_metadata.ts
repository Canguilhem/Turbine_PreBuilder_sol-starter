import wallet from "./wallet/dev_wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { 
    createMetadataAccountV3, 
    CreateMetadataAccountV3InstructionAccounts, 
    CreateMetadataAccountV3InstructionArgs,
    DataV2Args,
    findMetadataPda
} from "@metaplex-foundation/mpl-token-metadata";
import { createSignerFromKeypair, signerIdentity, publicKey } from "@metaplex-foundation/umi";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";

// Define our Mint address
const mint = publicKey("Hh3TjYntA636VAcfn8oU38aq7Urqf3e4XL4a2LHXGgM6")

// Create a UMI connection
const umi = createUmi('https://api.devnet.solana.com');
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(createSignerFromKeypair(umi, keypair)));

(async () => {
    try {
        // Start here

        let metadataPda = findMetadataPda(umi, {mint});
        console.log(`Metadata PDA: ${metadataPda}`);
        let accounts: CreateMetadataAccountV3InstructionAccounts = {
            metadata: metadataPda,
            mint: mint,
            mintAuthority: signer,
            payer: signer,
            updateAuthority: keypair.publicKey,
            
        }

        let data: DataV2Args = {
            name: "Red Berries",
            symbol: "RB",
            uri: "ipfs://bafkreigysa45fojqulvqkay77y5jqgt7x5rs6crqki6h6dr2mrji62kcea", //ipfs URI ./programs/token_metadata.json
            sellerFeeBasisPoints: 100,
            creators: [
                {
                    address: keypair.publicKey,
                    share: 100,
                    verified:true
                }
            ],
            collection: null,
            uses: null,
        }

        let args: CreateMetadataAccountV3InstructionArgs = {
         data:data,
         isMutable:true,
         collectionDetails:null,
        }

        let tx = createMetadataAccountV3(
            umi,
            {
                ...accounts,
                ...args
            }
        )

        let result = await tx.sendAndConfirm(umi);
        console.log(bs58.encode(result.signature));
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();
