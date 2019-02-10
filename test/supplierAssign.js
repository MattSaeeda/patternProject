const SupplierAssign = artifacts.require("SupplierAssign");
const {ZERO_ADDRESS, expectEvent, shouldFail } = require('openzeppelin-test-helpers');
const { assert } = require('chai');

const mode = process.env.MODE;

let supplierAssignInstance;


contract("SupplierAssign", accounts => {
  
  beforeEach(async function() {
    supplierAssignInstance = await SupplierAssign.new();
    
  });  

  after("write coverage/profiler output", async () => {
    if (mode === "profile") {
      await global.profilerSubprovider.writeProfilerOutputAsync();
    } 
    else
      if (mode === "coverage") {
      await global.coverageSubprovider.writeCoverageAsync();
    }

  });
  

  describe('ownership tests' , function(){
  

    it("Should have owner address be same address who deployed contract", async () => {
      const owner = accounts[0];

     assert.equal(
       (await supplierAssignInstance.owner()),
        owner
      );
    });
 
    it("Should fail if a non-owner calls a function with the onlyOwner modifier", async function() {
      const currentOwner = accounts[0];
      const anotherAccount = accounts[1];
      const booleanValue = true;

      assert.equal(
        (await supplierAssignInstance.owner()),
        currentOwner,
        "Initial owner is not address expected."
      );

      await shouldFail.reverting(supplierAssignInstance.assign(anotherAccount, booleanValue, { from: anotherAccount }));
    });

    it("Should allow owner to change status", async function() {
       const currentOwner = accounts[0];
       const anotherAccount = accounts[1];
       const booleanValue = true;

       assert.equal(
        (await supplierAssignInstance.owner()),
       currentOwner,
        "Initial owner is not address expected."
      );

      await supplierAssignInstance.assign(anotherAccount, true);

      assert.equal(
      (await supplierAssignInstance.supplierStatus.call(anotherAccount)),
      booleanValue,
      "Updated supplier's status is not `true'"
      );

    });

    it("Should emit an event once status assigned", async function() {
      const aSupplier = accounts[1];
      const booleanValue = true;
      const { logs } = await supplierAssignInstance.assign(aSupplier, booleanValue);
      await expectEvent.inLogs(logs, 'StatusAssigned', {_supplier: aSupplier,  _newStatus: booleanValue});

    });

    it("should allow transferring ownership to another address", async function() {
      const currentOwner = accounts[0];
      const futureOwner = accounts[1];
      assert.equal(
        (await supplierAssignInstance.owner()),
        currentOwner,
        "Initial owner is not address expected."
      );
      await supplierAssignInstance.transferOwnership(futureOwner);
      assert.equal(
        (await supplierAssignInstance.owner()),
        futureOwner
      );
    });

    it("Should fail if transferring ownership to address zero", async function() {
      const currentOwner = accounts[0];
             
      // console.log(`current owner  ${currentOwner}`);
      // console.log(`from contractOwner owner  ${(await supplierAssignInstance.owner())}`);


      assert.equal(
         (await supplierAssignInstance.owner()),
         currentOwner,
         "Initial owner is not address expected."
      );
  
        await shouldFail(supplierAssignInstance.transferOwnership(ZERO_ADDRESS, { from: currentOwner }));
      });

    
    

    it("Should emit an event once ownership transfered", async function() {
     
      const owner = accounts[0];
      const newOwner1 = accounts[2];
      // assert.equal(
      //   (await supplierAssignInstance.owner()),
      //    owner
      //  );
      
      const { logs } = await supplierAssignInstance.transferOwnership(newOwner1, {from: owner});
      await expectEvent.inLogs(logs, 'OwnershipTransferred', {newOwner : newOwner1});
      
    });
  
  
  });


  describe('whitelisted tests', function(){

    it('should return true when checking if an account is whitelisted ' , async function(){
      
      const anAccount = accounts[2];
      const booleanValue = true;
           
      await supplierAssignInstance.addWhitelisted(anAccount);

      assert.equal(
        (await supplierAssignInstance.isWhitelisted(anAccount)),
        booleanValue,
        "Updated whitelisted status is not `true'");

    })

    it('should revert if an account is ZERO_ADDRESS ' , async function(){
      
      const anAccount = accounts[2];
      await supplierAssignInstance.addWhitelisted(anAccount);
            
      await shouldFail(supplierAssignInstance.isWhitelisted(ZERO_ADDRESS));

    })

    it('should return false if an account is NOT whitelisted' , async function(){
      const anAccount1 = accounts[1];
      //const anAccount = await supplierAssignInstance.whitelisted.call(anAccount1);
      await supplierAssignInstance.removeWhitelisted(anAccount1);
      assert.equal(
        (await supplierAssignInstance.isWhitelisted(anAccount1)),
        false,
        "Updated whitelisted status is not `false'");

    });
    

    it('should allow whitelisting an account' , async function(){
      const party = accounts[1];
      const booleanValue = true;

      await supplierAssignInstance.addWhitelisted(party);

      assert.equal(
        (await supplierAssignInstance.whitelisted.call(party)),
        booleanValue,
        "Updated whitelisted status is not `false'");


    });

    it('should emit an event when an account successfully whitelisted', async function(){
      const aSupplier = accounts[1];
      const booleanValue = true;
      const { logs } = await supplierAssignInstance.addWhitelisted(aSupplier);
      await expectEvent.inLogs(logs, 'WhitelistedAdded', {account: aSupplier});


    });

    
    it('should allow removing an account from whitelist' , async function(){
      const anAccount = accounts[1];
      const booleanValue = false;

      await supplierAssignInstance.removeWhitelisted(anAccount);

      assert.equal(
        (await supplierAssignInstance.whitelisted.call(anAccount)),
        booleanValue,
        "Updated whitelisted status is not `false'");


    });

    it('should emit an event when an account removed from whitelist' , async function(){
      const aSupplier = accounts[1];
      await supplierAssignInstance.addWhitelisted(aSupplier);
      const { logs } = await supplierAssignInstance.removeWhitelisted(aSupplier);
      await expectEvent.inLogs(logs, 'WhitelistedRemoved', {account: aSupplier});


    });

    it("Should fail if passing wrong value type", async function() {
      const currentOwner = accounts[0];
      const participant = "supplier";
                
      assert.equal(
        (await supplierAssignInstance.owner()),
        currentOwner,
        "Initial owner is not address expected."
      );

      await should.not.equal(supplierAssignInstance.addWhitelisted(participant, { from: currentOwner }));
    });

    it('should throw if an unemitted event requested' , async function(){
      const aSupplier = accounts[1];
      await supplierAssignInstance.addWhitelisted(aSupplier);
      const { logs } = await supplierAssignInstance.removeWhitelisted(aSupplier);
      shouldFail (() => expectEvent.inLogs(logs, 'WhiteligstedAdded'));
    });

    it('should return true when  an account was removed from white list' , async function(){
      const supplier = accounts[1];
      const booleanValue = true;
      await supplierAssignInstance.addWhitelisted(supplier);
      const isRemoved = await supplierAssignInstance.removeWhitelisted(supplier);

      should.equal(
        (await isRemoved, booleanValue,
        "Updated whitelisted status is not `true'")
      );

    });

    
    

  });

});
