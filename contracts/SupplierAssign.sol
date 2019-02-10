pragma solidity ^0.5.0;

contract SupplierAssign {

    address public owner;
    address[] public supplier;
    
    mapping (address => bool ) public supplierStatus;
    mapping (address => bool) public whitelisted;

    event StatusAssigned(address indexed _supplier, bool _newStatus);
    event OwnershipTransferred(address indexed newOwner);
    event WhitelistedAdded(address indexed account);
    event WhitelistedRemoved(address indexed account);

    constructor() public {
		owner = msg.sender;
    }

    modifier onlyOwner() {
	    require(msg.sender == owner);
		_;
	}
           
    function assign(address _supplier, bool _status) public  onlyOwner {  
        supplierStatus[_supplier] = _status;
        emit StatusAssigned(_supplier, _status);
    }

    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0));
        address previousOwner = owner;
		owner = newOwner;
        emit OwnershipTransferred(newOwner);
    }

    function isWhitelisted(address account) public view returns (bool) {
        require(account != 0x0000000000000000000000000000000000000000);
        if (whitelisted[account] == true){ 
            return true;
            
        }
    }
   
    function addWhitelisted(address account) public {
        whitelisted[account] = true;
        emit WhitelistedAdded(account);
    }

    function removeWhitelisted(address account)  public returns(bool) {
        whitelisted[account] = false;
        emit WhitelistedRemoved(account);
        return true;
    }

}