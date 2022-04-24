import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

describe("Test NiFT721", function () {
  let niceFT721Contract: Contract;
  let owner: SignerWithAddress, user1: SignerWithAddress, user2: SignerWithAddress;

  this.beforeEach(async () => {
    const NiceFT721Contract = await ethers.getContractFactory("NiceErc721");
    niceFT721Contract = await NiceFT721Contract.deploy();
    [owner, user1, user2] = await ethers.getSigners();
  })

  it("Check balance correctness", async () => {
    expect(await niceFT721Contract.balanceOf(user1.address)).to.equal(0);

    await niceFT721Contract.mint(user1.address, "");
    expect(await niceFT721Contract.balanceOf(user1.address)).to.equal(1);

    await niceFT721Contract.mint(user1.address, "");
    expect(await niceFT721Contract.balanceOf(user1.address)).to.equal(2);
  });

  it("Check ownerOf correctness", async () => {
    const mintTransaction = await niceFT721Contract.mint(user1.address, "");
    const rc = await mintTransaction.wait();
    
    const transferEvent = rc.events!.find((e: { event: string; }) => e.event == 'Transfer');
    const [from, to, tokenId] = transferEvent!.args!;

    expect(await niceFT721Contract.ownerOf(tokenId)).to.equal(user1.address);
  });

  it("Check token url correctness", async () => {
    const dumbUrl = "ipfs://dumb";
    const mintTransaction = await niceFT721Contract.mint(user1.address, dumbUrl);
    const rc = await mintTransaction.wait();
    const transferEvent = rc.events!.find((e: { event: string; }) => e.event == 'Transfer');
    const [from, to, tokenId] = transferEvent!.args!;

    expect(await niceFT721Contract.tokenURI(tokenId)).to.equal(dumbUrl);
  });

  it("Check approving", async () => {
    const mintTransaction = await niceFT721Contract.mint(owner.address, "");
    const transferRc = await mintTransaction.wait();
    const transferEvent = transferRc.events!.find((e: { event: string; }) => e.event == 'Transfer');
    const [from, to, tokenId] = transferEvent!.args!;

    expect(await niceFT721Contract.getApproved(tokenId)).to.equal("0x0000000000000000000000000000000000000000"); 

    const approveTransaction = await niceFT721Contract.approve(user1.address, tokenId);
    const approveRc = await approveTransaction.wait();
    const approveEvent = approveRc.events!.find((e: { event: string; }) => e.event == 'Approval');
    
    expect(approveEvent).to.be.an('object');
    expect(await niceFT721Contract.getApproved(tokenId)).to.equal(user1.address); 

  })

  it("Check approving for all", async () => {
    await niceFT721Contract.mint(owner.address, "");

    expect(await niceFT721Contract.isApprovedForAll(owner.address, user1.address)).to.equal(false);

    const approveTransaction = await niceFT721Contract.setApprovalForAll(user1.address, true);
    const approveRc = await approveTransaction.wait();
    const approveEvent = approveRc.events!.find((e: { event: string; }) => e.event == 'ApprovalForAll');
    
    expect(approveEvent).to.be.an('object');
    expect(await niceFT721Contract.isApprovedForAll(owner.address, user1.address)).to.equal(true);

  })

  it("Check transfer from", async () => {
    const mintTransaction = await niceFT721Contract.mint(owner.address, "");
    const transferRc = await mintTransaction.wait();
    
    const transferEvent = transferRc.events!.find((e: { event: string; }) => e.event == 'Transfer');
    const [from, to, tokenId] = transferEvent!.args!;
    await niceFT721Contract.approve(user1.address, tokenId);
    expect(await niceFT721Contract.balanceOf(user2.address)).to.equal(0);
    await niceFT721Contract.connect(user1).transferFrom(owner.address, user2.address, tokenId);
    expect(await niceFT721Contract.balanceOf(user2.address)).to.equal(1);
  })

  it("Check that only owner can mint", async function () {
    await expect(niceFT721Contract.connect(user1).mint(user1.address, "")).to.be.revertedWith("You're not the owner");
  });
});


describe("Test NiFT1155", function () {
  let niceFT1155Contract: Contract;
  let owner: SignerWithAddress, user1: SignerWithAddress, user2: SignerWithAddress;

  const token1Id = 1;
  const amount1 = 100n;

  const token2Id = 2;
  const amount2 = 200n;

  this.beforeEach(async () => {
    const NiceFT1155Contract = await ethers.getContractFactory("NiceErc1155");
    niceFT1155Contract = await NiceFT1155Contract.deploy();
    [owner, user1, user2] = await ethers.getSigners();
  })

  it("Check balance", async () => {
    expect(await niceFT1155Contract.balanceOf(user1.address, token1Id)).to.equal(0);
    await niceFT1155Contract.mint(user1.address, token1Id, amount1, "");
    expect(await niceFT1155Contract.balanceOf(user1.address, token1Id)).to.equal(amount1);
  })


  it("Check balance of batch", async () => {
    await niceFT1155Contract.mint(user1.address, token1Id, amount1, "");
    await niceFT1155Contract.mint(user2.address, token2Id, amount2, "");

    const batchBalance = await niceFT1155Contract.balanceOfBatch([user1.address, user2.address], [token1Id, token2Id]);

    expect(batchBalance[0]).to.equal(amount1);
    expect(batchBalance[1]).to.equal(amount2);
  })

  it("Check approving for all", async () => {
    await niceFT1155Contract.mint(owner.address, token1Id, amount1, "");

    expect(await niceFT1155Contract.isApprovedForAll(owner.address, user1.address)).to.equal(false);

    const approveTransaction = await niceFT1155Contract.setApprovalForAll(user1.address, true);
    const approveRc = await approveTransaction.wait();
    const approveEvent = approveRc.events!.find((e: { event: string; }) => e.event == 'ApprovalForAll');
    
    expect(approveEvent).to.be.an('object');
    expect(await niceFT1155Contract.isApprovedForAll(owner.address, user1.address)).to.equal(true);
  })

  it("Check transfer from", async () => {
    await niceFT1155Contract.mint(owner.address, token1Id, amount1, "");
    await niceFT1155Contract.setApprovalForAll(user1.address, true);
    await niceFT1155Contract.connect(user1).safeTransferFrom(owner.address, user2.address, token1Id, amount1, 0x00);
    expect(await niceFT1155Contract.balanceOf(user2.address, token1Id)).to.equal(amount1);
  })

  it("Check batch transfer from", async () => {
    await niceFT1155Contract.mint(owner.address, token1Id, amount1, "");
    await niceFT1155Contract.mint(owner.address, token2Id, amount2, "");

    await niceFT1155Contract.setApprovalForAll(user1.address, true);
    await niceFT1155Contract.connect(user1).safeBatchTransferFrom(owner.address, user2.address, [token1Id, token2Id], [amount1, amount2], 0x00);

    expect(await niceFT1155Contract.balanceOf(user2.address, token1Id)).to.equal(amount1);
    expect(await niceFT1155Contract.balanceOf(user2.address, token2Id)).to.equal(amount2);
  });

  it("Check that only owner can mint", async function () {
    await expect(niceFT1155Contract.connect(user1).mint(owner.address, token1Id, amount1, "")).to.be.revertedWith("You're not the owner");
  });
});