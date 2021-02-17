import { Client, Provider, ProviderRegistry, Result } from "@blockstack/clarity";
import { assert } from "chai";


const party1 = "STP6TH31V8VQ8R2XT00VQYTRCWB7CD6QZKNREP4B";
const party2 = "ST1VYZX9900MPJE92VG3RNXEXXM4SWWAAT3M1X63J";
const newParty1 = "ST2MAZ88AG92DX4SNP4115RH5VRJZBVHXG2Z5JE0D";
const newParty2 = "ST1VKS3Z6CW858VVD6FFS5NF7PNQZZ7WQN03MXFKJ";


describe("agreement contract test suite", () => {
  let agreementClient: Client;
  let provider: Provider;
  before(async () => {
    provider = await ProviderRegistry.createProvider();
    agreementClient = new Client("SP3GWX3NE58KXHESRYE4DYQ1S31PQJTCRXB3PE9SB.agreement", "agreement", provider);
  });
  it("should have a valid syntax", async () => {
    await agreementClient.checkContract();
  });

  const getPartyDecision = async(party: number) => {
    const query = agreementClient.createQuery({
      method: { name: `get-current-party-${party}-decision`, args: [] },
    });
    const receipt = await agreementClient.submitQuery(query);
    let result = Result.unwrap(receipt);
    return result.includes('true');
  }

  const updatePartyDecision = async(principal: string, party: number, decision: string) => {
      const tx = agreementClient.createTransaction({
        method: {
          name: `update-party-${party}-decision`,
          args: [decision],
        },
      });
      await tx.sign(principal);
      const receipt = await agreementClient.submitTransaction(tx);
    return receipt
  }

  const getParty = async(party: number) => {
    const query = agreementClient.createQuery({
      method: { name: `get-current-party-${party}`, args: [] },
    });
    const receipt = await agreementClient.submitQuery(query);
    const result = Result.unwrap(receipt).match(/^\(ok\s(\w+)\)$/)[1];
    return result;
  }

  const updateParty = async(principal: string, party: number, updatedPrincipal: string) => {
      const tx = agreementClient.createTransaction({
        method: {
          name: `update-party-${party}-principal`,
          args: ["'" + updatedPrincipal],
        },
      });
      await tx.sign(principal);
      const receipt = await agreementClient.submitTransaction(tx);
    return receipt
  }

  const getIsAgreement = async() => {
    const query = agreementClient.createQuery({
      method: { name: `is-agreement`, args: [] },
    });
    const receipt = await agreementClient.submitQuery(query);
    let result = Result.unwrap(receipt);
    return result.includes('true');
  }

  describe("deploying an instance of the contract", () => {
    before(async () => {
      await agreementClient.deployContract();
    });
    it("party 1 decision should start at false", async () => {
      const party1Decision = await getPartyDecision(1);
      assert.equal(party1Decision, false);
    })
    it("party 1 principal should start at STP6TH31V8VQ8R2XT00VQYTRCWB7CD6QZKNREP4B", async () => {
      const party1Principal = await getParty(1);
      assert.equal(party1Principal, party1);
    })
    it("party 2 decision should start at false", async () => {
      const party2Decision = await getPartyDecision(2);
      assert.equal(party2Decision, false);
    })
    it("party 2 principal should start at ST1VYZX9900MPJE92VG3RNXEXXM4SWWAAT3M1X63J", async () => {
      const party2Principal = await getParty(2);
      assert.equal(party2Principal, party2);
    })
    it("updating party 1 decision to true with valid address should update decision", async () => {
      await updatePartyDecision(party1, 1, "true");
      const party1Decision = await getPartyDecision(1);
      assert.equal(party1Decision, true);
    })
    it("updating party 1 principal with invalid address should have no effect", async () => {
      await updateParty(party2, 1, newParty1);
      const party1Principal = await getParty(1);
      assert.equal(party1Principal, party1);
    })
    it("updating party 1 principal with valid address should update principal", async () => {
      await updateParty(party1, 1, newParty1);
      const party1Principal = await getParty(1);
      assert.equal(party1Principal, newParty1);
    })
    it("updating party 1 decision with invalid address should have no effect", async () => {
      await updatePartyDecision(party1, 1, "false");
      const party1Decision = await getPartyDecision(1);
      assert.equal(party1Decision, true);
    })
    it("updating party 2 decision to true with valid address should update decision", async () => {
      await updatePartyDecision(party2, 2, "true");
      const party2Decision = await getPartyDecision(2);
      assert.equal(party2Decision, true);
    })
    it("updating party 2 principal with invalid address should have no effect", async () => {
      await updateParty(party1, 2, newParty2);
      const party2Principal = await getParty(2);
      assert.equal(party2Principal, party2);
    })
    it("updating party 2 principal with valid address should update principal", async () => {
      await updateParty(party2, 2, newParty2);
      const party2Principal = await getParty(2);
      assert.equal(party2Principal, newParty2);
    })
    it("updating party 2 decision with invalid address should have no effect", async () => {
      await updatePartyDecision(party2, 2, "false");
      const party2Decision = await getPartyDecision(2);
      assert.equal(party2Decision, true);
    })
    it("false-false should have false agreement", async () => {
      await updatePartyDecision(newParty1, 1, "false");
      await updatePartyDecision(newParty2, 2, "false");
      const isAgreement = await getIsAgreement();
      assert.equal(isAgreement, false)
    })
    it("false-true should have false agreement", async () => {
      await updatePartyDecision(newParty1, 1, "false");
      await updatePartyDecision(newParty2, 2, "true");
      const isAgreement = await getIsAgreement();
      assert.equal(isAgreement, false)
    })
    it("true-false should have false agreement", async () => {
      await updatePartyDecision(newParty1, 1, "true");
      await updatePartyDecision(newParty2, 2, "false");
      const isAgreement = await getIsAgreement();
      assert.equal(isAgreement, false)
    })
    it("true-true should have true agreement", async () => {
      await updatePartyDecision(newParty1, 1, "true");
      await updatePartyDecision(newParty2, 2, "true");
      const isAgreement = await getIsAgreement();
      assert.equal(isAgreement, true)
    })
  });
  after(async () => {
    await provider.close();
  });
});
