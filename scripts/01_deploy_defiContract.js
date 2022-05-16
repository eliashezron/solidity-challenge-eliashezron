const hre = require("hardhat")
async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const RewardToken = await hre.ethers.getContractFactory("RewardToken")
  const getDefiContract = await hre.ethers.getContractFactory("DeFiContract")
  const rewardToken = await RewardToken.deploy()
  await rewardToken.deployed()
  const defiContract = await getDefiContract.deploy(rewardToken.address)

  console.log("reward deployed to:", rewardToken.address)
  console.log("defiContract deployed to:", defiContract.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
