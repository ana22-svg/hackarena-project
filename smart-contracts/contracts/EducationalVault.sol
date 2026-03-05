// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title EducationalVault
 * @dev A decentralized savings pool for securelygit push -u origin main holding users' rounded-up spare change
 * @notice This contract allows users to deposit, track, and withdraw their micro-savings
 * @author MicroSave Student Hackathon Team
 */
contract EducationalVault {
    // State variables
    mapping(address => uint256) private userBalances; // Maps user addresses to their vault balances
    uint256 public totalDeposits; // Total funds locked in the contract
    
    // Events for off-chain monitoring
    event Deposit(address indexed user, uint256 amount);
    event Withdrawal(address indexed user, uint256 amount);
    
    // Custom errors for gas efficiency
    error InsufficientBalance(uint256 requested, uint256 available);
    error ZeroAmount();
    error TransferFailed();
    
    /**
     * @dev Allows users to deposit ETH/Wei into their vault
     * @notice The function is payable and accepts ETH along with the transaction
     * @dev Updates the sender's mapped balance and total deposits
     */
    function deposit() external payable {
        if (msg.value == 0) {
            revert ZeroAmount();
        }
        
        // Update user's balance
        userBalances[msg.sender] += msg.value;
        
        // Update total deposits
        totalDeposits += msg.value;
        
        // Emit event for backend monitoring
        emit Deposit(msg.sender, msg.value);
    }
    
    /**
     * @dev Returns the caller's current vault balance
     * @notice Read-only function that doesn't consume gas when called off-chain
     * @return The balance of the caller in Wei
     */
    function getBalance() external view returns (uint256) {
        return userBalances[msg.sender];
    }
    
    /**
     * @dev Allows users to withdraw their funds from the vault
     * @notice Includes reentrancy protection and balance validation
     * @param amount The amount of Wei to withdraw
     */
    function withdraw(uint256 amount) external {
        if (amount == 0) {
            revert ZeroAmount();
        }
        
        uint256 userBalance = userBalances[msg.sender];
        if (amount > userBalance) {
            revert InsufficientBalance(amount, userBalance);
        }
        
        // Reentrancy protection: update balance before external call
        userBalances[msg.sender] = userBalance - amount;
        totalDeposits -= amount;
        
        // Emit event before external call (Events-First pattern)
        emit Withdrawal(msg.sender, amount);
        
        // External call to transfer ETH
        (bool success, ) = msg.sender.call{value: amount}("");
        if (!success) {
            revert TransferFailed();
        }
    }
    
    /**
     * @dev Returns the total amount of funds locked in the contract
     * @notice Useful for monitoring and analytics
     * @return Total deposits in Wei
     */
    function getTotalDeposits() external view returns (uint256) {
        return totalDeposits;
    }
    
    /**
     * @dev Returns the balance of a specific user (for admin/verification purposes)
     * @notice Can be used by backend systems to verify user balances
     * @param user The address to check
     * @return The balance of the specified user in Wei
     */
    function getUserBalance(address user) external view returns (uint256) {
        return userBalances[user];
    }
    
    /**
     * @dev Emergency function to check contract's ETH balance
     * @notice Should match totalDeposits if all operations are correct
     * @return Contract's actual ETH balance in Wei
     */
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}