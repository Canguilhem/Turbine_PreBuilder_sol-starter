import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createSignerFromKeypair,
  signerIdentity,
  generateSigner,
  publicKey,
} from "@metaplex-foundation/umi";
import {
  mplTokenMetadata,
  updateAsUpdateAuthorityV2,
} from "@metaplex-foundation/mpl-token-metadata";

import wallet from "./wallet/dev_wallet.json";
import base58 from "bs58";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";

const RPC_ENDPOINT = "https://api.devnet.solana.com";
const umi = createUmi(RPC_ENDPOINT);

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const myKeypairSigner = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(myKeypairSigner));
umi.use(mplTokenMetadata());

umi.use(irysUploader({ address: "https://devnet.irys.xyz" }));

(async () => {
  const newURI = await umi.uploader.uploadJson({
    name: "Newest Vintage Rug",
    uri: "https://gateway.irys.xyz/33Tg4hTxPGEzUTxZbAXxFY35dWbJFNLJCDDTTTEVW5qY",
    description: "A fresh vintage rug",
    image:
      "https://gateway.irys.xyz/6SEjzD9dFXbq8EmpF8HkuyuMhLCGHgeWxU9uYtzaj9kJ",
    attributes: [
      { trait_type: "Type", value: "Rug" },
      { trait_type: "Colors", value: "4" },
      { trait_type: "Size", value: "1000x1000" },
    ],
  });

  // using update auth
  const updatedNftTx = updateAsUpdateAuthorityV2(umi, {
    // provide public key of the metadata account
    mint: publicKey("7rXNf3V8VNUPh48LXpXWSv1sCRJkQvNm3RVYhKgp3Rnn"), // token address
    //  we need to provide the whole object
    data: {
      name: "Newest Vintage Rug",
      symbol: "VR",
      uri: newURI,
      sellerFeeBasisPoints: 300, // update total royalties to 3%
      creators: [
        {
          address: keypair.publicKey,
          share: 100,
          verified: true,
        },
      ],
    },
  });

  let result = await updatedNftTx.sendAndConfirm(umi);
  const signature = base58.encode(result.signature);

  console.log(
    `Succesfully Minted! Check out your TX here:\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`
  );
})();
