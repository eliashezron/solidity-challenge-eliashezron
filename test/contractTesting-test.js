const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("RewardToken", function () {
  let owners, addr1, addr2, addr3
  beforeEach(async function () {
    getReward = await ethers.getContractFactory("RewardToken")
    getContract = await ethers.getContractFactory("DeFiContract")
    rewardToken = await getReward.deploy()
    await rewardToken.deployed()
    defiContract = await getContract.deploy(rewardToken.address)
    await defiContract.deployed()
    ;[owners, addr1, addr2, addr3, _] = await ethers.getSigners()
    await rewardToken
      .connect(owners)
      .transfer(addr1.address, ethers.utils.parseEther("50"))
    rewardToken
      .connect(owners)
      .approve(addr1.address, ethers.utils.parseEther("50"))
    await rewardToken
      .connect(owners)
      .transfer(defiContract.address, ethers.utils.parseEther("9949"))
    rewardToken
      .connect(owners)
      .approve(defiContract.address, ethers.utils.parseEther("9949"))
  })
  describe("Deployment", function () {
    it("only owner should set reward rate", async function () {
      await rewardToken.connect(owners).setRewardRatePS(10)
      const result = await rewardToken.REWARDRATE()
      expect(result).to.equal(10)
    })
    it("the senders' address contains all the tokens", async function () {
      //   const initial_supply = ethers.utils.parseEther("10000")
      const ownersbalance = ethers.utils.parseEther("1")
      const balance = await rewardToken.balanceOf(owners.address)
      expect(balance).to.equal(ownersbalance)
    })
    it("non owner can not call only owner function", async function () {
      await expect(
        rewardToken.connect(addr1).setRewardRatePS(8)
      ).to.be.revertedWith("Ownable: caller is not the owner")
    })
  })
  describe("staking into the defi contract", function () {
    it("Staker can not deposit ammount less than 0", async function () {
      await expect(
        defiContract
          .connect(addr1)
          .deposit(rewardToken.address, ethers.utils.parseEther("0"))
      ).to.be.revertedWith("Deposit an amount greater than 0")
    })
    it("staker can not deposit more than what they have in their wallet", async function () {
      await expect(
        defiContract
          .connect(addr1)
          .deposit(rewardToken.address, ethers.utils.parseEther("110"))
      ).to.be.revertedWith("insufficient tokens available")
    })
    it("deposited Amount is equal to stake balance", async function () {
      await rewardToken
        .connect(addr1)
        .approve(defiContract.address, ethers.utils.parseEther("10"))
      await defiContract
        .connect(addr1)
        .deposit(rewardToken.address, ethers.utils.parseEther("10"))
      const balance = ethers.utils.parseEther("40")
      const accBalance = await rewardToken.balanceOf(addr1.address)
      expect(accBalance).to.equal(balance)
    })
  })
  describe("claiming reward tokens", function () {
    it("only staker can claim reward tokens", async function () {
      await expect(
        defiContract.connect(addr2).claimRewards()
      ).to.be.revertedWith("Only stakers users can claim tokens")
    })
    it("stakers balance increases after claiming reward tokens", async function () {
      await rewardToken
        .connect(addr1)
        .approve(defiContract.address, ethers.utils.parseEther("10"))
      await defiContract
        .connect(addr1)
        .deposit(rewardToken.address, ethers.utils.parseEther("10"))
      setTimeout(async function () {
        await defiContract.connect(addr1).claimRewards()
      }, 60000)
      const balance = await defiContract.Balance()
      const accBalance = await defiContract.stakerBalance(addr1.address)
      expect(accBalance).to.equal(balance)
    })
  })
  describe("withdrawing tokens", function () {
    it("only staker can withdraw tokens", async function () {
      await expect(
        defiContract
          .connect(addr2)
          .withdraw(rewardToken.address, ethers.utils.parseEther("10"))
      ).to.be.revertedWith("Only stakers users can claim tokens")
    })
    it("staker can not withdraw more than they have", async function () {
      await rewardToken
        .connect(addr1)
        .approve(defiContract.address, ethers.utils.parseEther("10"))
      await defiContract
        .connect(addr1)
        .deposit(rewardToken.address, ethers.utils.parseEther("10"))
      setTimeout(async function () {
        await defiContract.connect(addr1).claimRewards()
      }, 60000)
      await expect(
        defiContract
          .connect(addr1)
          .withdraw(rewardToken.address, ethers.utils.parseEther("20"))
      ).to.be.revertedWith("token balance less than amount to withdraw")
    })
    it("staker can withdraw tokens", async function () {
      await rewardToken
        .connect(addr1)
        .approve(defiContract.address, ethers.utils.parseEther("10"))
      await defiContract
        .connect(addr1)
        .deposit(rewardToken.address, ethers.utils.parseEther("10"))
      setTimeout(async function () {
        await defiContract.connect(addr1).claimRewards()
      }, 60000)
      await defiContract
        .connect(addr1)
        .withdraw(rewardToken.address, ethers.utils.parseEther("8"))
      const balance = await defiContract.Balance()
      const accBalance = await defiContract.stakerBalance(addr1.address)
      expect(accBalance).to.equal(balance)
    })
  })
})
