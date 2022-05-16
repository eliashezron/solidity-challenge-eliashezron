// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RewardToken is ERC20, Ownable {
    // the staker recieves 1 gwei for every token staked per second
    uint256 public REWARDRATE;
    uint256 public withdrawFees;
    bool public withdrawFeeEnable;

    constructor() ERC20("RewardToken", "RT") {
        _mint(msg.sender, 10000000000000000000000);
        REWARDRATE = 1;
        withdrawFees = 0;
        withdrawFeeEnable = false;
    }

    function setRewardRatePS(uint256 _rate) public onlyOwner {
        require(_rate > 1, "1 gwei is the smallest unit of Measurement");
        REWARDRATE = _rate;
    }

    //  the smart contract awards the user 1 gwei for every 1 gwei they staked persecond.
    // thus if a use were to staked 60 gwei for 60 seconds,
    // they would recieve 60 gwei is bonus and be able to withdraw 120 gwei after the 60 seconds.

    function rewardTokensPS(uint256 _amount, uint256 _timeTaken)
        public
        view
        returns (uint256)
    {
        return _amount * _timeTaken * REWARDRATE;
    }

    function setWithdrawFees(uint256 _withdrawfees) public onlyOwner {
        require(
            _withdrawfees > 1,
            "set withdraw fees at a value greater than 1"
        );
        withdrawFees = _withdrawfees;
    }

    function withdrawChargeEnable() public onlyOwner {
        withdrawFeeEnable = !withdrawFeeEnable;
    }

    function readwithdrawChargeEnable() public view returns (bool) {
        return withdrawFeeEnable;
    }
}
