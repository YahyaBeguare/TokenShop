const hre= require("hardhat");
const fs = require("fs").promises;
const path = require("path");
const addressFile= require("../address.json");
let ContractAddress;


async function deploy(){
    try{
        console.log("Deploying Token shop contract...");
    const deployer= (await hre.ethers.getSigners())[0];
    
    //  Deploying AdvContract
    const TokenShopContract= await hre.ethers.deployContract("TokenShop");
    await TokenShopContract.waitForDeployment();
    ContractAddress= TokenShopContract.target;
    console.log("TokenShop Contract deployed at: ", TokenShopContract.target);
    }catch(err){
    console.error("Error deploying AdvContract: ", err.message || err);
    }
    // Update the address.json file
    try{
        addressFile["TokenShop"]= {"ContractAddress": ContractAddress};
        await fs.writeFile("./address.json", JSON.stringify(addressFile, null, 2));
    }catch(err){
        console.error("Error: ", err);
    }

}

deploy().catch((error) => {
    console.error("Deployment script error:", error.message || error);
    process.exit(1);
  }); 
