# patternProject
Final project for course: DESIGN PATTERNS FOR BLOCKCHAIN CRN-52719-201802

Intro: 
This project contains one contract; SupplierAssgin. It is a part of suppluy chain management system based on de-centralized
hyperledger concept. This contract basically assign the status of “ accepted” or “true” and “rejected” or “false” to a supplier. 
Any supplier has a unique account. All mapped to statuses mentioned above.
There is onlyOwner modifier to limit transferring ownership. This is a base to do test based on "Owner Pattern'.
Also, accounts are mapped to another boolean value, to authorized account for a further role(to be determined). This will be used to test
"Whitelisted" pattern.
Tests 
Patterns of “Ownership” and “Whitelisted” are uesd to test this code: 
 Ownership tests
      ✓ Should have owner address be same address who deployed contract
      ✓ Should fail if a non-owner calls a function with the onlyOwner modifier (53ms)
      ✓ Should allow owner to change status (57ms)
      ✓ Should emit an event once status assigned (38ms)
      ✓ should allow transferring ownership to another address (55ms)
      ✓ Should fail if transferring ownership to address zero
      ✓ Should emit an event once ownership transfered
    whitelisted tests
      ✓ should return true when checking if an account is whitelisted  (42ms)
      ✓ should revert if an account is ZERO_ADDRESS 
      ✓ should return false if an account is NOT whitelisted (41ms)
      ✓ should allow whitelisting an account (92ms)
      ✓ should emit an event when an account successfully whitelisted
      ✓ should allow removing an account from whitelist (46ms)
      ✓ should emit an event when an account removed from whitelist (64ms)
      ✓ Should fail if passing wrong value type


  15 passing (1s)
  
Before running tests you need to have the ethereum node running. Due to some problems' I could not use a docker container, so I
use Ganache-cli. Coverage is also disabled.

Now we’re ready to run the tests: 
```bash truffle test 
Contract and tests author: Matt Saeeda #10122580
