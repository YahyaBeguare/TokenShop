const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Token Contract", function () {
  let Token;
  let token;
  let owner, addr1, addr2;
  let MINTER_ROLE;

  beforeEach(async function () {
    // Get the signers
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    // Deploy the Token contract
    Token = await ethers.getContractFactory("Token");
    token = await Token.deploy();
    await token.waitForDeployment();
    MINTER_ROLE = await token.MINTER_ROLE();
  });

  describe("Deployment", function () {
    it("Should have the correct name and symbol", async function () {
      expect(await token.name()).to.equal("Golden Token");
      expect(await token.symbol()).to.equal("GTK");
    });

    it("Should assign DEFAULT_ADMIN_ROLE and MINTER_ROLE to the deployer", async function () {
      const DEFAULT_ADMIN_ROLE = await token.DEFAULT_ADMIN_ROLE();
      expect(await token.hasRole(DEFAULT_ADMIN_ROLE, owner.address)).to.be.true;
      expect(await token.hasRole(MINTER_ROLE, owner.address)).to.be.true;
    });
  });

  describe("Minting", function () {
    it("Should allow the owner (minter) to mint tokens", async function () {
      const mintAmount = 1000;
      await token.mint(addr1.address, mintAmount);
      expect(await token.balanceOf(addr1.address)).to.equal(mintAmount);
    });

    it("Should revert if a non-minter attempts to mint tokens", async function () {
      const mintAmount = 500;
      await expect(
        token.connect(addr1).mint(addr2.address, mintAmount)
      ).to.be.revertedWithCustomError(token,"AccessControlUnauthorizedAccount")
      .withArgs(addr1.address, MINTER_ROLE);
      
    });
  });

  describe("Decimals", function () {
    it("Should return 2 decimals", async function () {
      expect(await token.decimals()).to.equal(2);
    });
  });
});
