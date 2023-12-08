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
    const tokenEx = await TokenEx.deploy(
      ["Tank", "Balanced", "Swift"],
      [
        "https://i.imgur.com/lgPFnUw.jpeg",
        "https://i.imgur.com/DYy7js6.jpeg",
        "https://i.imgur.com/yRMhDS0.jpeg",
      ],
      [300, 200, 100], //HP
      [25, 20, 25], //Attack
      [20, 15, 10], //Defense
      [0, 10, 20] //Evade
    );

    await tokenEx.waitForDeployment();

    return { tokenEx, owner, otherAccount, timestamp };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { tokenEx, owner } = await loadFixture(deployBefore);
      expect(await tokenEx.owner()).to.equal(owner.address);
    });
  });

  describe("Claim NFT", function () {
    it("Mint NFT", async function () {
      const { tokenEx, owner, otherAccount, timestamp } = await loadFixture(
        deployBefore
      );
      await tokenEx.claimNFT(0);
      await tokenEx.connect(otherAccount).claimNFT(1);
      await expect(
        tokenEx.connect(otherAccount).claimNFT(1)
      ).to.be.revertedWithCustomError(tokenEx, "AlreadyHasNFT");

      expect(await tokenEx.balanceOf(owner.address)).to.equal(1);
      expect(await tokenEx.balanceOf(otherAccount.address)).to.equal(1);
    });

    it("Test Pause", async function () {
      const { tokenEx, owner, otherAccount, timestamp } = await loadFixture(
        deployBefore
      );
      await tokenEx.stopGame();
      await expect(
        tokenEx.connect(otherAccount).claimNFT(1)
      ).to.be.revertedWithCustomError(tokenEx, "Paused");
    });

    it("Throw Snowball", async function () {
      const { tokenEx, owner, otherAccount, timestamp } = await loadFixture(
        deployBefore
      );
      //Claim Tank
      await tokenEx.claimNFT(0);

      //Claim Balanced
      await tokenEx.connect(otherAccount).claimNFT(1);

      for (let i = 0; i < 20; i++) {
        if ((await tokenEx.checkIfTargetHasNFT(otherAccount.address)) == false) {
          break;
        }
        const tx = await tokenEx.throwSnowball(otherAccount.address);

        // let hp = await tokenEx.getCharacterHp(1);
        // console.log(hp);
      }
    });

    it("Names", async function () {
      const { tokenEx, owner, otherAccount, timestamp } = await loadFixture(
        deployBefore
      );
      await tokenEx.claimNFT(0);
      await tokenEx.connect(otherAccount).claimNFT(1);

      await tokenEx.updateCharacterName(2, "Billy");
      await tokenEx.updateCharacterImageURI(2, "new string");
      await tokenEx.updateCharacterHp(2, 1000);

      await tokenEx.addCharacter("new name", "new string", 2000, 100, 100, 100);

      let names = await tokenEx.getAllDefaultCharacters();
      // console.log(names);
    });
  });
});
