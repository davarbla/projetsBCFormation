const ethers = require("ethers");
const fs = require("fs-extra");
require("dotenv").config();

async function main() {
    // https://docs.ethers.org/v6/api/wallet/#Wallet
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);
    console.log(wallet)

    // https://docs.ethers.org/v6/api/wallet/#Wallet-encrypt
    const encryptedJsonKey = await wallet.encrypt(
        process.env.PRIVATE_KEY_PASSWORD
    );
    
    fs.writeFileSync("./.encryptedKey.json", encryptedJsonKey);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });