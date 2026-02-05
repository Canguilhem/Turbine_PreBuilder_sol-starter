import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createSignerFromKeypair,
  signerIdentity,
  generateSigner,
  percentAmount,
  publicKey,
  Commitment,
} from "@metaplex-foundation/umi";
import {
  createNft,
  mplTokenMetadata,
  transferV1,
} from "@metaplex-foundation/mpl-token-metadata";

import wallet from "./wallet/dev_wallet.json";
import base58 from "bs58";
import { getOrCreateAssociatedTokenAccount } from "@solana/spl-token";
import { Connection } from "@solana/web3.js";

const RPC_ENDPOINT = "https://api.devnet.solana.com";
const umi = createUmi(RPC_ENDPOINT);

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const myKeypairSigner = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(myKeypairSigner));
umi.use(mplTokenMetadata());

// using token address
const tokenAddr = publicKey("Cd6q9DJnbD71FCbAHrC6iXbSBwWGDWqcmf2GtcwwLzZC");

(async () => {
  let tx = transferV1(umi, {
    destinationOwner: publicKey("79sRbD72j88pPvsdTy6k3KXgpbX7wfFNSPEy9GkxstJv"),
    mint: tokenAddr,
    tokenStandard: 0, // NonFungible
  });
  let result = await tx.sendAndConfirm(umi);
  const signature = base58.encode(result.signature);

  console.log(
    `Succesfully Minted! Check out your TX here:\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`
  );
})();
