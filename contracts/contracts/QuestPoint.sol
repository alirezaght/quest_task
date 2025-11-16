// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract QuestPoints {
    address public owner;
    mapping(address => uint256) public points;

    modifier onlyOwner() {
        require(msg.sender == owner, "not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function grantPoints(address user, uint256 amount) external onlyOwner {
        points[user] += amount;
    }

    function transferOwnership(address newOwner) external onlyOwner {
        owner = newOwner;
    }
}