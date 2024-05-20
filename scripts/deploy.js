const { ethers } = require("hardhat");
const { deployJuicySips, deployVesting } = require("../utils/utils");
require("dotenv").config();

async function main() {
  const [owner] = await ethers.getSigners();

  // ** ENV *** ENV **
  const OWNER = process.env.OWNER;
  // ** ENV *** ENV **

  const token = await deployJuicySips(ethers, "JuicySips", "JSP");
  let tokenAddress = await token.getAddress();
  console.log("Token deployed to:", tokenAddress);

  console.log(
    "Minted. Owner balance:",
    await token.balanceOf(owner.address),
    await token.decimals(),
    await token.symbol()
  );

  const vesting = await deployVesting(ethers, tokenAddress, OWNER);
  console.log("Vesting deployed to:", await vesting.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
