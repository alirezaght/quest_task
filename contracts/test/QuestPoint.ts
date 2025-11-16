import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { network } from "hardhat";

describe("QuestPoints", async function () {
  const { viem } = await network.connect();
  const [owner, user1, user2] = await viem.getWalletClients();

  it("Should set the right owner", async function () {
    const questPoints = await viem.deployContract("QuestPoints");

    assert.equal((await questPoints.read.owner()).toLowerCase(), owner.account.address.toLowerCase());
  });

  it("Should initialize with zero points for all users", async function () {
    const questPoints = await viem.deployContract("QuestPoints");

    assert.equal(await questPoints.read.points([user1.account.address]), 0n);
  });

  it("Should allow owner to grant points to a user", async function () {
    const questPoints = await viem.deployContract("QuestPoints");

    await questPoints.write.grantPoints([user1.account.address, 100n]);

    assert.equal(await questPoints.read.points([user1.account.address]), 100n);
  });

  it("Should accumulate points when granted multiple times", async function () {
    const questPoints = await viem.deployContract("QuestPoints");

    await questPoints.write.grantPoints([user1.account.address, 50n]);
    await questPoints.write.grantPoints([user1.account.address, 75n]);

    assert.equal(await questPoints.read.points([user1.account.address]), 125n);
  });

  it("Should grant points to multiple users independently", async function () {
    const questPoints = await viem.deployContract("QuestPoints");

    await questPoints.write.grantPoints([user1.account.address, 100n]);
    await questPoints.write.grantPoints([user2.account.address, 200n]);

    assert.equal(await questPoints.read.points([user1.account.address]), 100n);
    assert.equal(await questPoints.read.points([user2.account.address]), 200n);
  });

  it("Should revert when non-owner tries to grant points", async function () {
    const questPoints = await viem.deployContract("QuestPoints");

    await assert.rejects(
      async () => {
        await questPoints.write.grantPoints([user2.account.address, 100n], {
          account: user1.account,
        });
      },
      /not owner/
    );
  });

  it("Should allow granting zero points", async function () {
    const questPoints = await viem.deployContract("QuestPoints");

    await questPoints.write.grantPoints([user1.account.address, 0n]);

    assert.equal(await questPoints.read.points([user1.account.address]), 0n);
  });

  it("Should allow granting large amounts of points", async function () {
    const questPoints = await viem.deployContract("QuestPoints");

    const largeAmount = 1000000000000000000n; // 1e18
    await questPoints.write.grantPoints([user1.account.address, largeAmount]);

    assert.equal(await questPoints.read.points([user1.account.address]), largeAmount);
  });

  it("Should allow owner to transfer ownership", async function () {
    const questPoints = await viem.deployContract("QuestPoints");

    await questPoints.write.transferOwnership([user1.account.address]);

    assert.equal((await questPoints.read.owner()).toLowerCase(), user1.account.address.toLowerCase());
  });

  it("Should allow new owner to grant points after ownership transfer", async function () {
    const questPoints = await viem.deployContract("QuestPoints");

    await questPoints.write.transferOwnership([user1.account.address]);

    await questPoints.write.grantPoints([user2.account.address, 150n], {
      account: user1.account,
    });

    assert.equal(await questPoints.read.points([user2.account.address]), 150n);
  });

  it("Should prevent old owner from granting points after ownership transfer", async function () {
    const questPoints = await viem.deployContract("QuestPoints");

    await questPoints.write.transferOwnership([user1.account.address]);

    await assert.rejects(
      async () => {
        await questPoints.write.grantPoints([user2.account.address, 100n], {
          account: owner.account,
        });
      },
      /not owner/
    );
  });

  it("Should revert when non-owner tries to transfer ownership", async function () {
    const questPoints = await viem.deployContract("QuestPoints");

    await assert.rejects(
      async () => {
        await questPoints.write.transferOwnership([user2.account.address], {
          account: user1.account,
        });
      },
      /not owner/
    );
  });

  it("Should allow transferring ownership to the current owner", async function () {
    const questPoints = await viem.deployContract("QuestPoints");

    await questPoints.write.transferOwnership([owner.account.address]);

    assert.equal((await questPoints.read.owner()).toLowerCase(), owner.account.address.toLowerCase());
  });
});
