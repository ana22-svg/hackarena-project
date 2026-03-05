const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

/**
 * @class BlockchainService
 * @description Web3 bridge service for interacting with the EducationalVault smart contract
 * @author MicroSave Student Hackathon Team
 */
class BlockchainService {
    constructor() {
        this.provider = null;
        this.contract = null;
        this.contractData = null;
        this.signer = null;
        this.isInitialized = false;
    }

    /**
     * Initialize the blockchain service with provider and contract
     * @param {string} privateKey - Optional private key for signing transactions
     * @returns {Promise<boolean>} - Returns true if initialization successful
     */
    async initialize(privateKey = null) {
        try {
            console.log("🔗 Initializing BlockchainService...");
            
            // Load contract data from config file
            await this.loadContractData();
            
            // Initialize provider connected to local Hardhat network
            this.provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
            
            // Test provider connection
            await this.provider.getNetwork();
            console.log("✅ Connected to local Hardhat network");
            
            // Initialize signer if private key provided
            if (privateKey) {
                this.signer = new ethers.Wallet(privateKey, this.provider);
                console.log("🔐 Signer initialized with private key");
            } else {
                // Use the first account from Hardhat (for development)
                const accounts = await this.provider.listAccounts();
                if (accounts.length > 0) {
                    this.signer = this.provider.getSigner(0);
                    console.log("🔐 Using default Hardhat account");
                }
            }
            
            // Initialize contract instance
            this.contract = new ethers.Contract(
                this.contractData.address,
                this.contractData.abi,
                this.signer || this.provider
            );
            
            this.isInitialized = true;
            console.log("🎉 BlockchainService initialized successfully");
            console.log("📍 Contract Address:", this.contractData.address);
            
            return true;
            
        } catch (error) {
            console.error("❌ Failed to initialize BlockchainService:", error.message);
            throw new Error(`BlockchainService initialization failed: ${error.message}`);
        }
    }

    /**
     * Load contract data from the config file
     * @private
     */
    async loadContractData() {
        try {
            const configPath = path.join(__dirname, "../config/contractData.json");
            
            if (!fs.existsSync(configPath)) {
                throw new Error("Contract data file not found. Please deploy the contract first.");
            }
            
            const configData = fs.readFileSync(configPath, "utf8");
            this.contractData = JSON.parse(configData);
            
            console.log("📋 Contract data loaded successfully");
            
        } catch (error) {
            throw new Error(`Failed to load contract data: ${error.message}`);
        }
    }

    /**
     * Trigger a roundup deposit for a user
     * @param {string} userAddress - The user's Ethereum address
     * @param {string|number} amountInWei - The amount to deposit in Wei
     * @returns {Promise<object>} - Transaction receipt
     */
    async triggerRoundupDeposit(userAddress, amountInWei) {
        try {
            if (!this.isInitialized) {
                throw new Error("BlockchainService not initialized. Call initialize() first.");
            }

            if (!ethers.utils.isAddress(userAddress)) {
                throw new Error("Invalid user address provided");
            }

            // Convert amount to proper BigNumber format
            const amount = ethers.BigNumber.from(amountInWei.toString());
            
            if (amount.lte(0)) {
                throw new Error("Deposit amount must be greater than 0");
            }

            console.log(`💰 Depositing ${ethers.utils.formatEther(amount)} ETH for user ${userAddress}`);
            
            // Execute deposit transaction
            const tx = await this.contract.deposit({
                value: amount,
                from: userAddress
            });
            
            console.log("📤 Transaction sent:", tx.hash);
            console.log("⏳ Waiting for transaction confirmation...");
            
            // Wait for transaction to be mined
            const receipt = await tx.wait();
            
            console.log("✅ Deposit transaction confirmed!");
            console.log("🔗 Transaction Hash:", receipt.transactionHash);
            console.log("⛽ Gas Used:", receipt.gasUsed.toString());
            
            return {
                success: true,
                transactionHash: receipt.transactionHash,
                gasUsed: receipt.gasUsed.toString(),
                blockNumber: receipt.blockNumber,
                amount: amount.toString(),
                userAddress: userAddress
            };
            
        } catch (error) {
            console.error("❌ Deposit failed:", error.message);
            
            // Handle specific error cases
            if (error.code === "NETWORK_ERROR") {
                throw new Error("Local Hardhat node is not running. Please start the node first.");
            } else if (error.code === "INSUFFICIENT_FUNDS") {
                throw new Error("Insufficient funds for deposit transaction");
            } else if (error.message.includes("revert")) {
                throw new Error(`Contract reverted: ${error.message}`);
            }
            
            throw new Error(`Deposit transaction failed: ${error.message}`);
        }
    }

    /**
     * Get user's vault balance
     * @param {string} userAddress - The user's Ethereum address
     * @returns {Promise<string>} - Balance in Wei
     */
    async getUserBalance(userAddress) {
        try {
            if (!this.isInitialized) {
                throw new Error("BlockchainService not initialized. Call initialize() first.");
            }

            if (!ethers.utils.isAddress(userAddress)) {
                throw new Error("Invalid user address provided");
            }

            const balance = await this.contract.getBalance({ from: userAddress });
            return balance.toString();
            
        } catch (error) {
            console.error("❌ Failed to get user balance:", error.message);
            throw new Error(`Failed to retrieve balance: ${error.message}`);
        }
    }

    /**
     * Get total deposits in the contract
     * @returns {Promise<string>} - Total deposits in Wei
     */
    async getTotalDeposits() {
        try {
            if (!this.isInitialized) {
                throw new Error("BlockchainService not initialized. Call initialize() first.");
            }

            const totalDeposits = await this.contract.getTotalDeposits();
            return totalDeposits.toString();
            
        } catch (error) {
            console.error("❌ Failed to get total deposits:", error.message);
            throw new Error(`Failed to retrieve total deposits: ${error.message}`);
        }
    }

    /**
     * Check if the service is connected to the blockchain
     * @returns {Promise<boolean>} - Connection status
     */
    async isConnected() {
        try {
            if (!this.provider) return false;
            
            await this.provider.getNetwork();
            return true;
            
        } catch (error) {
            return false;
        }
    }

    /**
     * Get contract information
     * @returns {object} - Contract details
     */
    getContractInfo() {
        if (!this.contractData) {
            throw new Error("Contract data not loaded");
        }
        
        return {
            address: this.contractData.address,
            network: this.contractData.network,
            deployedAt: this.contractData.deployedAt,
            contractName: this.contractData.contractName
        };
    }
}

module.exports = BlockchainService;
