const { ethers } = require("hardhat");
const { expect } = require("chai");
const { expectTuple } = require("../utils/utils");
const { BigNumber } = require("ethers");
const { parse } = require("csv-parse/sync");
const fs = require("fs");

require("dotenv").config();

async function main() {
  const DAY = 60 * 60 * 24;
  const YEAR = DAY * 365;

  const TOKEN_ADDRESS = process.env.TOKEN_ADDRESS ?? "";
  const VESTING_ADDRESS = process.env.VESTING_ADDRESS ?? "";

  const tokens = ethers.parseEther;

  const input = fs.readFileSync("./scripts/allocations.csv");
  const allocArray = parse(input, { skip_records_with_error: true, columns: true, trim: true });

  console.log("allocArray", allocArray);

  const [owner] = await ethers.getSigners();

  const JuicySips = await ethers.getContractFactory("JuicySips");
  const token = await JuicySips.attach(TOKEN_ADDRESS);
  console.log("Token attached to:", await token.getAddress());

  const Vesting = await ethers.getContractFactory("Vesting");
  const vesting = await Vesting.attach(VESTING_ADDRESS);
  console.log("Vesting attached to:", await vesting.getAddress());

  console.log(
    "Owner tokens balance:",
    await token.balanceOf(owner.address),
    await token.decimals(),
    await token.symbol()
  );

  let totalVestAmount = 0n;
  for (let i = 0; i < allocArray.length; i++) totalVestAmount += BigInt(allocArray[i].vestAmount);

  const tx0 = await token.approve(await vesting.getAddress(), totalVestAmount);
  await tx0.wait();

  const lastVestingId = await vesting.lastVestingId();
  console.log("Last vesting id:", lastVestingId);

  const tx = await vesting.allocate(allocArray, { gasLimit: 5000000 });
  await tx.wait();

  console.log("Allocated");

  for (let i = 0; i < allocArray.length; i++) {
    const vestId = BigInt(i) + BigInt(1) + lastVestingId;
    const vestObj = await vesting.vestings(vestId);
    const alloc = allocArray[i];

    await expectTuple(vestObj, alloc.vestAmount, alloc.lockupPeriod, alloc.vestingPeriod, 0);
    expect(await vesting.vestingIdsOf(alloc.investor)).to.deep.include(vestId);

    console.log("Vesting with id =", vestId, "is correct");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
