# cryptoLOgic Staking and Reward Logic coding challenge

## Description

the purpose of this smartcontract is to allow stakers get a reward for their staking. the logic is as follows:

- a staker is only allowed to staker an ERC20 token of the rewardTokenAddress
- the staker recieves a reward based on how much they have staked and for how long they staked
- the smart contract awards the user 1 gwei for every 1 gwei they staked persecond. thus if a use were to staked 60 gwei for 60 seconds, they would recieve 60 gwei is bonus and be able to withdraw 120 gwei after the 60 seconds.
- the contract also has access control to avoid re-entrancy attacks

`solc` version 0.8.0

## Setup Project

Install dependencies by

    `npm install`

## Run tests

The project is built with `hardhat`. To run all test cases, Please run

    `npx hardhat test`

## Coverge report

`solidity-coverage` does the coverage report. to run it,

Reference: (https://github.com/net2devcrypto/nftstaking/blob/main/nftstakingV2.sol).
rewards calculation logic from the above mentioned source, But modified to for this challenge.

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
node scripts/sample-script.js
npx hardhat help
```
