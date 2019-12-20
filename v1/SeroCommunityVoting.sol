pragma solidity ^0.4.25;

/**
 * @dev Contract module which provides a basic access control mechanism, where
 * there is an account (an owner) that can be granted exclusive access to
 * specific functions.
 *
 * This module is used through inheritance. It will make available the modifier
 * `onlyOwner`, which can be aplied to your functions to restrict their use to
 * the owner.
 */
contract Ownable {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Initializes the contract setting the deployer as the initial owner.
     */
    constructor () internal {
        _owner = msg.sender;
        emit OwnershipTransferred(address(0), _owner);
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(isOwner(), "Ownable: caller is not the owner");
        _;
    }

    /**
     * @dev Returns true if the caller is the current owner.
     */
    function isOwner() public view returns (bool) {
        return msg.sender == _owner;
    }

    /**
     * @dev Leaves the contract without owner. It will not be possible to call
     * `onlyOwner` functions anymore. Can only be called by the current owner.
     *
     * > Note: Renouncing ownership will leave the contract without an owner,
     * thereby removing any functionality that is only available to the owner.
     */
    function renounceOwnership() public onlyOwner {
        emit OwnershipTransferred(_owner, address(0));
        _owner = address(0);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public onlyOwner {
        _transferOwnership(newOwner);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     */
    function _transferOwnership(address newOwner) internal {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        emit OwnershipTransferred(_owner, newOwner);
        _owner = newOwner;
    }
}


contract Pausable is Ownable {
    /**
     * @dev Emitted when the pause is triggered by a pauser (`account`).
     */
    event Paused(address account);

    /**
     * @dev Emitted when the pause is lifted by a pauser (`account`).
     */
    event Unpaused(address account);

    bool private _paused;

    /**
     * @dev Initializes the contract in unpaused state. Assigns the Pauser role
     * to the deployer.
     */
    constructor () internal {
        _paused = false;
    }

    /**
     * @dev Returns true if the contract is paused, and false otherwise.
     */
    function paused() public view returns (bool) {
        return _paused;
    }

    /**
     * @dev Modifier to make a function callable only when the contract is not paused.
     */
    modifier whenNotPaused() {
        require(!_paused, "Pausable: paused");
        _;
    }

    /**
     * @dev Modifier to make a function callable only when the contract is paused.
     */
    modifier whenPaused() {
        require(_paused, "Pausable: not paused");
        _;
    }

    /**
     * @dev Called by a pauser to pause, triggers stopped state.
     */
    function pause() public onlyOwner whenNotPaused {
        _paused = true;
        emit Paused(msg.sender);
    }

    /**
     * @dev Called by a pauser to unpause, returns to normal state.
     */
    function unpause() public onlyOwner whenPaused {
        _paused = false;
        emit Unpaused(msg.sender);
    }
}


library Address {
    /**
     * @dev Returns true if `account` is a contract.
     *
     * This test is non-exhaustive, and there may be false-negatives: during the
     * execution of a contract's constructor, its address will be reported as
     * not containing a contract.
     *
     * > It is unsafe to assume that an address for which this function returns
     * false is an externally-owned account (EOA) and not a contract.
     */
    function isContract(address account) internal view returns (bool) {
        // This method relies in extcodesize, which returns 0 for contracts in
        // construction, since the code is only stored at the end of the
        // constructor execution.

        uint256 size;
        // solhint-disable-next-line no-inline-assembly
        assembly { size := extcodesize(account) }
        return size > 0;
    }
}

/**
 * @dev Wrappers over Solidity's arithmetic operations with added overflow
 * checks.
 *
 * Arithmetic operations in Solidity wrap on overflow. This can easily result
 * in bugs, because programmers usually assume that an overflow raises an
 * error, which is the standard behavior in high level programming languages.
 * `SafeMath` restores this intuition by reverting the transaction when an
 * operation overflows.
 *
 * Using this library instead of the unchecked operations eliminates an entire
 * class of bugs, so it's recommended to use it always.
 */
library SafeMath {
    /**
     * @dev Returns the addition of two unsigned integers, reverting on
     * overflow.
     *
     * Counterpart to Solidity's `+` operator.
     *
     * Requirements:
     * - Addition cannot overflow.
     */
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, "SafeMath: addition overflow");

        return c;
    }

    /**
     * @dev Returns the subtraction of two unsigned integers, reverting on
     * overflow (when the result is negative).
     *
     * Counterpart to Solidity's `-` operator.
     *
     * Requirements:
     * - Subtraction cannot overflow.
     */
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b <= a, "SafeMath: subtraction overflow");
        uint256 c = a - b;

        return c;
    }

    /**
     * @dev Returns the multiplication of two unsigned integers, reverting on
     * overflow.
     *
     * Counterpart to Solidity's `*` operator.
     *
     * Requirements:
     * - Multiplication cannot overflow.
     */
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
        // benefit is lost if 'b' is also tested.
        // See: https://github.com/OpenZeppelin/openzeppelin-solidity/pull/522
        if (a == 0) {
            return 0;
        }

        uint256 c = a * b;
        require(c / a == b, "SafeMath: multiplication overflow");

        return c;
    }

    /**
     * @dev Returns the integer division of two unsigned integers. Reverts on
     * division by zero. The result is rounded towards zero.
     *
     * Counterpart to Solidity's `/` operator. Note: this function uses a
     * `revert` opcode (which leaves remaining gas untouched) while Solidity
     * uses an invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     * - The divisor cannot be zero.
     */
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        // Solidity only automatically asserts when dividing by 0
        require(b > 0, "SafeMath: division by zero");
        uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold

        return c;
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
     * Reverts when dividing by zero.
     *
     * Counterpart to Solidity's `%` operator. This function uses a `revert`
     * opcode (which leaves remaining gas untouched) while Solidity uses an
     * invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     * - The divisor cannot be zero.
     */
    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b != 0, "SafeMath: modulo by zero");
        return a % b;
    }
}

library StringUtils {
    function compare(string _a, string _b) pure internal returns (int) {
        bytes memory a = bytes(_a);
        bytes memory b = bytes(_b);
        uint minLength = a.length;
        if (b.length < minLength) minLength = b.length;
        //@todo unroll the loop into increments of 32 and do full 32 byte comparisons
        for (uint i = 0; i < minLength; i ++)
            if (a[i] < b[i])
                return -1;
            else if (a[i] > b[i])
                return 1;
        if (a.length < b.length)
            return -1;
        else if (a.length > b.length)
            return 1;
        else
            return 0;
    }
    /// @dev Compares two strings and returns true iff they are equal.
    function equal(string _a, string _b) pure internal returns (bool) {
        return compare(_a, _b) == 0;
    }
    /// @dev Finds the index of the first occurrence of _needle in _haystack
    function indexOf(string _haystack, string _needle) pure internal returns (int)
    {
        bytes memory h = bytes(_haystack);
        bytes memory n = bytes(_needle);
        if(h.length < 1 || n.length < 1 || (n.length > h.length))
            return -1;
        else if(h.length > (2**128 -1)) // since we have to be able to return -1 (if the char isn't found or input error), this function must return an "int" type with a max length of (2^128 - 1)
            return -1;
        else
        {
            uint subindex = 0;
            for (uint i = 0; i < h.length; i ++)
            {
                if (h[i] == n[0]) // found the first char of b
                {
                    subindex = 1;
                    while(subindex < n.length && (i + subindex) < h.length && h[i + subindex] == n[subindex]) // search until the chars don't match or until we reach the end of a or b
                    {
                        subindex++;
                    }
                    if(subindex == n.length)
                        return int(i);
                }
            }
            return -1;
        }
    }
}



contract SeroInterface {

    /**
     * the follow topics is system topics,can not be changed at will
     */
    bytes32 private topic_sero_issueToken     =  0x3be6bf24d822bcd6f6348f6f5a5c2d3108f04991ee63e80cde49a8c4746a0ef3;
    bytes32 private topic_sero_balanceOf      =  0xcf19eb4256453a4e30b6a06d651f1970c223fb6bd1826a28ed861f0e602db9b8;
    bytes32 private topic_sero_send           =  0x868bd6629e7c2e3d2ccf7b9968fad79b448e7a2bfb3ee20ed1acbc695c3c8b23;
    bytes32 private topic_sero_currency       =  0x7c98e64bd943448b4e24ef8c2cdec7b8b1275970cfe10daf2a9bfa4b04dce905;
    bytes32 private topic_sero_setCallValues  =  0xa6cafc6282f61eff9032603a017e652f68410d3d3c69f0a3eeca8f181aec1d17;
    bytes32 private topic_sero_setTokenRate   =  0x6800e94e36131c049eaeb631e4530829b0d3d20d5b637c8015a8dc9cedd70aed;


    /**
    * @dev convert bytes 32 to string
    * @param  x the string btyes32
    */
    function bytes32ToString(bytes32 x) internal pure returns (string) {
        uint charCount = 0;
        bytes memory bytesString = new bytes(32);
        for (uint j = 0; j < 32; j++) {
            byte char = byte(bytes32(uint(x) * 2 ** (8 * j)));
            if (char != 0) {
                bytesString[charCount] = char;
                charCount++;
            } else if (charCount != 0){
                break;
            }
        }
        bytes memory bytesStringTrimmed = new bytes(charCount);
        for (j = 0; j < charCount; j++) {
            bytesStringTrimmed[j] = bytesString[j];

        }
        return string(bytesStringTrimmed);
    }

    /**
    * @dev set the call method params
    * @param _currency the crurrency of the token
    * @param _amount the value of the token
    * @param _category the category of the ticket
    * @param _ticket the tickeId of the ticket
    */
    function sero_setCallValues(string memory _currency, uint256 _amount, string memory _category, bytes32 _ticket) internal {
        bytes memory temp = new bytes(0x80);
        assembly {
            mstore(temp, _currency)
            mstore(add(temp, 0x20), _amount)
            mstore(add(temp, 0x40), _category)
            mstore(add(temp, 0x60), _ticket)
            log1(temp, 0x80, sload(topic_sero_setCallValues_slot))
        }
        return;
    }


    /**
    * @dev the get currency from the tx params
    */
    function sero_msg_currency() internal returns (string) {
        bytes memory tmp = new bytes(32);
        bytes32 b32;
        assembly {
            log1(tmp, 0x20, sload(topic_sero_currency_slot))
            b32 := mload(tmp)
        }
        return bytes32ToString(b32);
    }

    /**
    * @dev issue the token
    * @param _total the totalsupply of the token
    * @param _currency the currency ot the token
    */
    function sero_issueToken(uint256 _total,string memory _currency) internal returns (bool success){
        bytes memory temp = new bytes(64);
        assembly {
            mstore(temp, _currency)
            mstore(add(temp, 0x20), _total)
            log1(temp, 0x40, sload(topic_sero_issueToken_slot))
            success := mload(add(temp, 0x20))
        }
        return;
    }

    /**
     * @dev the balance of this contract
     * @param _currency the currency ot the token
     */
    function sero_balanceOf(string memory _currency) internal returns (uint256 amount){
        bytes memory temp = new bytes(32);
        assembly {
            mstore(temp, _currency)
            log1(temp, 0x20, sload(topic_sero_balanceOf_slot))
            amount := mload(temp)
        }
        return;
    }

    /**
     * @dev transfer the token to the receiver
     * @param _receiver the address of receiver
     * @param _currency the currency of token
     * @param _amount the amount of token
     */
    function sero_send_token(address _receiver, string memory _currency, uint256 _amount)internal returns (bool success){
        return sero_send(_receiver,_currency,_amount,"",0);
    }

    /**
     * @dev transfer the token or ticket to the receiver
     * @param _receiver the address of receiver
     * @param _currency the currency of token
     * @param _amount the amount of token
     * @param _category the category of the ticket
     * @param _ticket the Id of the ticket
     */
    function sero_send(address _receiver, string memory _currency, uint256 _amount, string memory _category, bytes32 _ticket)internal returns (bool success){
        bytes memory temp = new bytes(160);
        assembly {
            mstore(temp, _receiver)
            mstore(add(temp, 0x20), _currency)
            mstore(add(temp, 0x40), _amount)
            mstore(add(temp, 0x60), _category)
            mstore(add(temp, 0x80), _ticket)
            log1(temp, 0xa0, sload(topic_sero_send_slot))
            success := mload(add(temp, 0x80))
        }
        return;
    }


    /**
     * @dev Set the exchange rate of the SERO against the other token, the unit is the minimum unit of token
     * @param _currency the currency of other token
     * @param _tokenAmount the amount of  the other token,unit is minimum unit
     * @param _taAmount the amount of SERO ,unit is ta
     */
    function sero_setToketRate(string memory _currency, uint256 _tokenAmount, uint256 _taAmount) internal returns (bool success){
        bytes memory temp = new bytes(96);
        assembly {
            let start := temp
            mstore(start, _currency)
            mstore(add(start, 0x20), _tokenAmount)
            mstore(add(start, 0x40), _taAmount)
            log1(start, 0x60, sload(topic_sero_setTokenRate_slot))
            success := mload(add(start, 0x40))
        }
        return;
    }

}



contract ProposalBase is SeroInterface{

    using SafeMath for uint256;
    
    using Address for address;

    uint256 private _totalProfit;

    uint256 public _idCounter = 7;
    
    uint256 private _proposalFee = 100*10**18;
    
    
    uint256 private  _storageFee_per_bytes = 5000000*10**9;
    uint8 private _max_title_length = 192;
    uint8 private _free_desc_length = 192;
    uint16 private _max_desc_length = 1024;

    struct Proposal{
        uint256 id;
        address creator;
        string title;
        string desc;
        uint64 createTime;
        uint64 startTime;
        uint64 endTime;
        uint256 fee;
        uint256 minHoldAmount;
        uint16 minParticipants;
        uint256 baseSpend;
        uint256 storageSpend;
        uint256 support;
        uint256 oppose;
        bool deleted;
    }
   
    struct Voter {
        address addr;
        uint256 amount;
        bool  support;
    }

    uint256[] private _allIds;

    uint256 private _proposalsSize;
  
    mapping (uint256 => Proposal) private _allProposals;
    
    mapping (address => uint256[]) private _ownedProposals;
    
    mapping (uint256 => uint256) private _proposalBalances;
    
    mapping (address => uint256[]) private _ownedVotedProposals;
    
    mapping (uint256 => mapping(address =>Voter)) private _proposalVoters;
    
    mapping (uint256 => address[]) private _proposalVoterAddresses;

    function _createProposal(string memory _title,string memory _desc,uint64 _startTime,uint64 _endTime,uint256 _fee,
        uint256 _minHoldAmount,uint16 _minParticipants) internal 
    returns (uint256 _id){
        require(bytes(_title).length <= _max_title_length,"title to long");
        require (bytes(_desc).length <= _max_desc_length,"desc to long");
        require (_endTime >uint64(now),"endTime must after now");
        require (_startTime < _endTime,"startTime must before endTime");
        require( StringUtils.equal(sero_msg_currency(),"SERO"),"token name must be sero");
        require(!msg.sender.isContract(),"not support contract");
        uint256 _spend = _estimateProposalFee(_desc);
        
        require(msg.value >= _spend,"msg.value must be greate than spend");
        
        _totalProfit = _totalProfit.add(_spend);
        
        _id = _idCounter;
        
        uint256 _storageFee = _extFee(_desc);
        
        Proposal memory _proposal = Proposal({
            id:_id,
            creator:msg.sender,
            title:_title,
            desc:_desc,
            createTime:uint64(now),
            startTime:_startTime,
            endTime:_endTime,
            fee:_fee,
            minHoldAmount:_minHoldAmount,
            minParticipants:_minParticipants,
            baseSpend:_proposalFee,
            storageSpend:_storageFee,
            support:uint256(0),
            oppose:uint256(0),
            deleted:false
            });
        
        _allProposals[_id] = _proposal;
        
        _ownedProposals[msg.sender].push(_id);

        require(_id == uint256(uint32(_id)),"id to big");
       
        _allIds.push(_id);
        
          _idCounter += 1;
          _proposalsSize++;

        return _id;
    }
    
    
    function _requireId(uint256 _id) internal view {
        require(_id >6,"id must be greate than 6");
        require(_id < _idCounter,"id must be litter than _idCounter");
        require (_allProposals[_id].id>0,"id not exists");
    }
    
    function _estimateProposalFee (string memory _desc) internal view returns (uint256 _spendFee){
        uint256 _storageSpend = _extFee(_desc) ;
        _spendFee =   _proposalFee.add(_storageSpend);
        return;
    }
    
    function _extFee(string memory _desc) internal view returns (uint256 _storageFee){
        uint256  _des_length = bytes(_desc).length;
        if (_des_length > _free_desc_length){
            _storageFee = (_des_length-_free_desc_length).mul(_storageFee_per_bytes);
        }
        return;
    }
    
    function estimateProposalFee(string  _desc) external view returns (uint256){
       return _estimateProposalFee(_desc);
    }
    
    function propsalFeeDetails(string  _desc) external view returns (uint256 _baseFee,uint256 _storageFee){
        _baseFee = _proposalFee;
        _storageFee = _extFee(_desc);
        return;
    }

    
    function _deleteProposal(uint256 _id) internal {
        _requireId(_id);
         require(!_allProposals[_id].deleted,"propsal has be deleted");
        _allProposals[_id].deleted = true;
        _proposalsSize--;
    }

    function _isBegin(uint64 _startTime) internal view returns (bool ){
        if (uint64(now)>= _startTime ) {
            return true;
        }
        return false;
    }

    function isBegin(uint256 _id) public view returns (bool) {
       _requireId(_id);
        return _isBegin( _allProposals[_id].startTime);
    }

    function _isEnd(uint64 _endTime) internal  view returns ( bool ) {
        if (uint64(now) > _endTime) {
            return true;
        }
        return false;
    }

    function isEnd(uint256 _id) public view returns (bool) {
        _requireId(_id);
        return _isEnd(_allProposals[_id].endTime);
    }
    
    function proposalTimes(uint256 _id) external view returns (uint64 _createTime,uint64 _startTime,uint64 _endTime){
        _createTime =  _allProposals[_id].createTime;
        _startTime =  _allProposals[_id].startTime;
        _endTime =  _allProposals[_id].endTime;
        return;
    }
    
    function propsalSpend(uint256 _id) external view returns (uint256 _baseFee ,uint256 _storageFee){
        _baseFee =  _allProposals[_id].baseSpend;
        _storageFee =  _allProposals[_id].storageSpend;
        return;
    }
    
    function propsalStatus (uint256 _id) public view returns (uint8 _status){
      if (_allProposals[_id].id>0){
          if (_allProposals[_id].deleted){
              _status=uint8(5);
              return;
          }
         if (_isBegin( _allProposals[_id].startTime)){
            if (_isEnd( _allProposals[_id].endTime)){
                uint256 total = _allProposals[_id].support.add(_allProposals[_id].oppose);
                if (total < _allProposals[_id].minParticipants){
                    _status = uint8(3);
                }else{
                    _status = uint8(4);
                }
            }else{
                _status = uint8(2);
            }
        }else{
            _status = uint8(1);
        }
      }
        return;
        
    }
    
    function proposalBanlance (uint256 _id) external view returns (uint256) {
        return _proposalBalances[_id];
    }
    

    function proposalDetais (uint _id ) external view returns (string  _title,string _desc,
        uint64 _startTime,uint64 _endTime,uint256 _fee,uint256 _minHoldAmount,
        uint16 _minParticipants,uint8 _status,uint256 _support ,uint256 _oppose,address _creator){
        if (_allProposals[_id].id==0){
            return;
        }
        _title =  _allProposals[_id].title;
        _desc =  _allProposals[_id].desc;
        _startTime =  _allProposals[_id].startTime;
        _endTime = _allProposals[_id].endTime;
        _fee =  _allProposals[_id].fee;
        _minHoldAmount =  _allProposals[_id].minHoldAmount;
        _minParticipants =  _allProposals[_id].minParticipants;
        _support =   _allProposals[_id].support;
        _oppose =  _allProposals[_id].oppose;
        _creator = _allProposals[_id].creator;
        _status = propsalStatus(_id);
       
        return;
    }
    
    function _voteProposal(uint256 _id,bool _support ) internal returns (bool){
        
        _requireId(_id);
        
        require(!_allProposals[_id].deleted,"propsal has be deleted");

        require(_isBegin( _allProposals[_id].startTime),"propsal is not begin");
        
        require(!(_isEnd( _allProposals[_id].endTime)),"propsal is  over");
        
        require( StringUtils.equal(sero_msg_currency(),"SERO"),"token nanme must be sero");
        
        require(!msg.sender.isContract(),"not support contract");

        require(msg.value >= _allProposals[_id].minHoldAmount.add(_allProposals[_id].fee),"msg.value not enough");
        
        uint256 _pledgeAmount = msg.value.sub(_allProposals[_id].fee);
        
        _proposalBalances[_id] = _proposalBalances[_id].add(_pledgeAmount);
        
        _totalProfit = _totalProfit.add(_allProposals[_id].fee);
        
        require(_proposalVoters[_id][msg.sender].addr == address(0),"repeat vote");

        _proposalVoters[_id][msg.sender].addr = msg.sender;
        _proposalVoters[_id][msg.sender].support = _support;
        _proposalVoters[_id][msg.sender].amount = _pledgeAmount;
        
        _ownedVotedProposals[msg.sender].push(_id);
        _proposalVoterAddresses[_id].push(msg.sender);
        
        if (_support){
            _allProposals[_id].support = _allProposals[_id].support.add(1);
        }else{
            _allProposals[_id].oppose = _allProposals[_id].oppose.add(1);
        }
        return true;
       
    }

    function getProposalFee () public view returns (uint256){
        return _proposalFee;
    }

    function _setProposalFee(uint256 _fee) internal {
        _proposalFee= _fee;
    }
    
    
    
    function proposalsSize ()external view returns (uint256){
        return _proposalsSize;
    }
    
    function getAllIds(uint256 start,uint256 limit) external view returns (uint256[] ){
       if (start>=_proposalsSize){
           return;
       }
       uint256 len = limit;
       if ((_proposalsSize-start)<limit){
           len = _proposalsSize-start;
       }
       uint256[] memory result = new uint256[](len);
       uint256 index =0;
       uint256 from = start;
       while (true){
           if (index >=len){
               break;
           }
           if (_allProposals[_allIds[from]].deleted){
               from++;
               continue;
           }
           result[index] =_allIds[from];
           from++;
           index++;
       }
       return result;
       
    } 
    
    function withDrawWithProposal(uint256 _id) external returns (bool){
        _requireId(_id);
        require(!msg.sender.isContract(),"not support contract");
        if (!_allProposals[_id].deleted){
             require(_isEnd(_allProposals[_id].endTime),"propsal is not over");  
        }
        require(msg.sender ==  _proposalVoters[_id][msg.sender].addr,"not vote");
        uint256 withDrawAmount = _proposalVoters[_id][msg.sender].amount;
        require(withDrawAmount>0,"can not withDraw");
        require(_proposalBalances[_id]>=withDrawAmount,"propsal balance not enough");
        _proposalBalances[_id]=_proposalBalances[_id].sub(withDrawAmount);
        _proposalVoters[_id][msg.sender].amount=uint256(0);
        require(sero_send_token(msg.sender,"SERO",withDrawAmount),"withDraw failed");
        
    }
    
    function myVotedProposalStatus (uint256 _id) external view returns (uint8 _proposalStatus,uint256 _support,uint256 _oppose,
    uint8 _myStatus ,uint256 _amount,bool _isSupport,address _creator) {
        
        if (_allProposals[_id].id ==0){
            return;
        }
        _proposalStatus = propsalStatus(_id);
       
        _support = _allProposals[_id].support;
        _oppose = _allProposals[_id].oppose;
        _creator =  _allProposals[_id].creator;
        
        if (_proposalVoters[_id][msg.sender].addr == address(0)) {
            return;
        }
         _amount = _proposalVoters[_id][msg.sender].amount;
        _isSupport = _proposalVoters[_id][msg.sender].support;
        
        if (!_isEnd( _allProposals[_id].endTime) && !_allProposals[_id].deleted){
            _myStatus  =1;
        }else{
           if (_proposalVoters[_id][msg.sender].amount == 0){
                _myStatus = 3;
            }else{
                 _myStatus = 2;
            } 
        }
       
        return;
    }
    
    
    
    function ownedProposals() external  view returns (uint256[]  ){
        return _ownedProposals[msg.sender];
    }
    
    function ownedVotedProposals() external view returns (uint256[]  ){
        return _ownedVotedProposals[msg.sender];
    }
    
    function owedVotedProposalsSize() external view returns (uint256){
        return _ownedVotedProposals[msg.sender].length;
    }
    
    function ownedVotedProposalsWithLimit(uint256 start,uint256 limit) external view returns(uint256[]){
        uint256 size = _ownedVotedProposals[msg.sender].length;
        if (start>= size){
            return;
        }
        uint256 len = limit;
       if ((size-start)<limit){
           len = size-start;
       }
       uint256[] memory result = new uint256[](len);
       uint256 index =0;
       while (true){
           if (index >= len){
               break;
           }
           result[index] =_allIds[start+index];
           index++;
       }
       return result;
    }
    
    function _withDrawProfit(uint256 _amount) internal returns (bool){
        uint256 balance = sero_balanceOf("SERO");
        require(balance > _amount);
        require(_totalProfit >= _amount);
        _totalProfit = _totalProfit.sub(_amount);
        require(sero_send_token(msg.sender,"SERO",_amount));
    }
    
    function allProposals() external view returns(uint256[]){
        return _allIds;
    }
    
    function _allVotersInProposal(uint256 _id) internal view returns(address[] result){
       return _proposalVoterAddresses[_id];
    }
   
}


contract SeroCommunityVoting is Pausable,ProposalBase{


    function createProposal(string  _title,string _desc,uint64 _startTime,uint64 _endTime,uint256 _fee,
        uint256 _minHoldAmount,uint16 _minParticipants ) external payable  whenNotPaused returns (uint256){
         return _createProposal(_title,_desc, _startTime, _endTime, _fee,
         _minHoldAmount, _minParticipants) ;
    }
    
    function voteProposal(uint256 _id, bool _support) external payable returns (bool){
        return _voteProposal(_id,_support);
    }
    
    function deleteProposal(uint _id) external onlyOwner {
        _deleteProposal(_id);
    }

    function setProposalFee( uint256 _fee) external onlyOwner {
        _setProposalFee(_fee);
    }

    function allVotersInProposal(uint256 _id) external view returns (address[]){
       return  _allVotersInProposal(_id);
    }
    
    function withDrawProfit( uint256 _amount) external onlyOwner returns (bool){
        return _withDrawProfit(_amount);
    }
}
