import {
    time,
    loadFixture,
  } from "@nomicfoundation/hardhat-toolbox/network-helpers";
  import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
  import { expect } from "chai";
  import { ethers } from "hardhat";
  
  describe("Token Exchange", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployBefore() {
      // Set the price we are expecting to get from the DAPI
      // For ease I'm making ETH work 1000 USD, you can change this price but will reflect the amount of tokens you recieve
      const price = ethers.parseEther("1000");
      // We get the current time from Hardhat Network
      const timestamp = await time.latest();
  
      // Contracts are deployed using the first signer/account by default
      const [owner, otherAccount] = await ethers.getSigners();
  
      const TokenEx = await ethers.getContractFactory("SnowDay");
      const tokenEx = await TokenEx.deploy("string");
  
      await tokenEx.waitForDeployment();
  
  
      return { tokenEx, owner, otherAccount, timestamp };
    }
  
    describe("Deployment", function () {
      it("Should set the right owner", async function () {
        const { tokenEx, owner } = await loadFixture(deployBefore);
        expect(await tokenEx.owner()).to.equal(owner.address);
      });
    });
  
    describe("Claim Penguins", function () {
      it("Mint Pengu", async function () {
        const { tokenEx, owner, otherAccount, timestamp } = await loadFixture(deployBefore);
        await tokenEx.claimPenguin();
        await tokenEx.connect(otherAccount).claimPenguin();
        await expect(tokenEx.connect(otherAccount).claimPenguin()).to.be.revertedWith('Already has a penguin');

        expect(await tokenEx.balanceOf(owner.address, 1)).to.equal(1);
        expect(await tokenEx.balanceOf(otherAccount.address, 1)).to.equal(1);
      });

      it("Burn Pengu", async function () {
        const { tokenEx, owner, otherAccount, timestamp } = await loadFixture(deployBefore);
        await tokenEx.claimPenguin();
        await tokenEx.connect(otherAccount).claimPenguin();
        
        await tokenEx.connect(otherAccount).killPenguin(owner.address);
        expect(await tokenEx.balanceOf(owner.address, 1)).to.equal(0);
        await tokenEx.claimPenguin();
      });
      
    });
    
  });
  