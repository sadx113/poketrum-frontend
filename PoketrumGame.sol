// SPDX-License-Identifier: MIT

interface ERC20 {
    function totalSupply() external view returns (uint);

    function balanceOf(address account) external view returns (uint);

    function transfer(address recipient, uint amount) external returns (bool);

    function allowance(address owner, address spender) external view returns (uint);

    function approve(address spender, uint amount) external returns (bool);

    function transferFrom(
        address sender,
        address recipient,
        uint amount
    ) external returns (bool);

    event Transfer(address indexed from, address indexed to, uint value);
    event Approval(address indexed owner, address indexed spender, uint value);
}

pragma solidity ^0.8.18;

contract PoketrumGame {
    struct Tower {
        uint256 coins;
        uint256 money;
        uint256 money2;
        uint256 yield;
        uint256 timestamp;
        uint256 hrs;
        uint8[8] chefs;
    }
    mapping(address => Tower) public towers;
    uint256 public totalChefs;
    uint256 public totalTowers;
    uint256 public totalInvested;
    address public manager = msg.sender;
    address busd = 0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56;


    function addCoins(uint256 amount) public {
        ERC20(busd).transferFrom(address(msg.sender), address(this), amount);
        uint256 coins = amount / 2e16;
        require(coins > 0, "Zero coins");
        address user = msg.sender;
        totalInvested += amount;
        if (towers[user].timestamp == 0) {
            totalTowers++;
            towers[user].timestamp = block.timestamp;
        }
        towers[user].coins += coins;
    }

    function withdrawMoney() public {
        address user = msg.sender;
        uint256 money = towers[user].money;
        require (money > 0);
        towers[user].money = 0;
        uint256 amount = money * 2e14;
        ERC20(busd).transfer(user,amount);
    }

    function collectMoney() public {
        address user = msg.sender;
        syncTower(user);
        towers[user].hrs = 0;
        towers[user].money += towers[user].money2;
        towers[user].money2 = 0;
    }

    function upgradeTower(uint256 floorId) public {
        require(floorId < 8, "Max 8 floors");
        address user = msg.sender;
        syncTower(user);
        towers[user].chefs[floorId]++;
        totalChefs++;
        uint256 chefs = towers[user].chefs[floorId];
        towers[user].coins -= getUpgradePrice(floorId, chefs);
        towers[user].yield += getYield(floorId, chefs);
    }

    function getChefs(address addr) public view returns (uint8[8] memory) {
        return towers[addr].chefs;
    }

    function syncTower(address user) internal {
        require(towers[user].timestamp > 0, "User is not registered");
        if (towers[user].yield > 0) {
            uint256 hrs = block.timestamp / 3600 - towers[user].timestamp / 3600;
            if (hrs + towers[user].hrs > 24) {
                hrs = 24 - towers[user].hrs;
            }
            towers[user].money2 += hrs * towers[user].yield;
            towers[user].hrs += hrs;
        }
        towers[user].timestamp = block.timestamp;
    }

    function getUpgradePrice(uint256 floorId, uint256 chefId) internal pure returns (uint256) {
        if (chefId == 1) return [500, 1500, 4500, 13500, 40500, 120000, 365000, 1000000][floorId];
        if (chefId == 2) return [625, 1800, 5600, 16800, 50600, 150000, 456000, 1200000][floorId];
        if (chefId == 3) return [780, 2300, 7000, 21000, 63000, 187000, 570000, 1560000][floorId];
        if (chefId == 4) return [970, 3000, 8700, 26000, 79000, 235000, 713000, 2000000][floorId];
        if (chefId == 5) return [1200, 3600, 11000, 33000, 98000, 293000, 890000, 2500000][floorId];
        revert("Incorrect chefId");
    }

    function getYield(uint256 floorId, uint256 chefId) internal pure returns (uint256) {
        if (chefId == 1) return [41, 130, 399, 1220, 3750, 11400, 36200, 104000][floorId];
        if (chefId == 2) return [52, 157, 498, 1530, 4700, 14300, 45500, 126500][floorId];
        if (chefId == 3) return [65, 201, 625, 1920, 5900, 17900, 57200, 167000][floorId];
        if (chefId == 4) return [82, 264, 780, 2380, 7400, 22700, 72500, 216500][floorId];
        if (chefId == 5) return [103, 318, 995, 3050, 9300, 28700, 91500, 275000][floorId];
        revert("Incorrect chefId");
    }
}