const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    console.log("🚀 Starting EducationalVault contract deployment...");
    
    try {
        // Get the contract factory
        const EducationalVault = await ethers.getContractFactory("EducationalVault");
        
        // Deploy the contract
        console.log("📦 Deploying EducationalVault contract...");
        const educationalVault = await EducationalVault.deploy();
        
        // Wait for deployment to complete
        await educationalVault.deployed();
        
        const contractAddress = educationalVault.address;
        console.log("✅ EducationalVault deployed successfully!");
        console.log("📍 Contract Address:", contractAddress);
        
        // Get the contract ABI
        const contractABI = educationalVault.interface.format(ethers.utils.FormatTypes.json);
        
        // Prepare contract data object
        const contractData = {
            address: contractAddress,
            abi: JSON.parse(contractABI),
            network: "localhost",
            deployedAt: new Date().toISOString(),
            contractName: "EducationalVault"
        };
        
        // Create backend config directory if it doesn't exist
        const backendConfigDir = path.join(__dirname, "../../backend/src/config");
        if (!fs.existsSync(backendConfigDir)) {
            fs.mkdirSync(backendConfigDir, { recursive: true });
            console.log("📁 Created backend config directory");
        }
        
        // Save contract data to backend config file
        const configFilePath = path.join(backendConfigDir, "contractData.json");
        fs.writeFileSync(configFilePath, JSON.stringify(contractData, null, 2), "utf8");
        
        console.log("💾 Contract ABI and address saved to:", configFilePath);
        console.log("🎉 Deployment completed successfully!");
        
        // Log deployment summary
        console.log("\n📊 Deployment Summary:");
        console.log("   Network: localhost (Hardhat)");
        console.log("   Contract: EducationalVault");
        console.log("   Address:", contractAddress);
        console.log("   Config File:", configFilePath);
        
        return contractAddress;
        
    } catch (error) {
        console.error("❌ Deployment failed:", error.message);
        process.exit(1);
    }
}

// Execute deployment
main()
    .then(() => {
        console.log("🔚 Deployment script finished");
        process.exit(0);
    })
    .catch((error) => {
        console.error("💥 Unexpected error:", error);
        process.exit(1);
    });
