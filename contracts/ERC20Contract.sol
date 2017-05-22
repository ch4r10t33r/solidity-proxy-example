pragma solidity ^0.4.8;

import './Ownable.sol';
import './SafeMath.sol';

contract ERC20Contract is Ownable {
  using SafeMath for uint;
  string public constant name = "SAMPLE ERC20 TOKEN";
  string public constant symbol = "SLM";
  uint public constant decimals = 18;
  uint  public constant totalNumberOfTokens = 10000000;

  uint public constant tokenPrice  = 100;
  uint public constant minTokensForSale = 2000000;
  uint totalUsedTokens;

  mapping (address => uint256) balances;
  //Owner of account approves the transfer of an amount to another account
  mapping(address => mapping (address => uint256)) allowed;


  function ERC20Contract() {
    //initializing the contract with few dummy values
    totalUsedTokens = 0;
  }

  function purchase() payable external returns (uint tokens) {
    uint amount = msg.value;
    if(totalUsedTokens >= totalNumberOfTokens) throw;

    if (msg.value == 0) throw;
    //total tokens purchased is received gas/cost of 1 token
    uint numTokens = amount.div(tokenPrice);
    totalUsedTokens = totalUsedTokens.add(numTokens);
    if (totalUsedTokens > totalNumberOfTokens) throw;
    // Assign new tokens to sender
    balances[msg.sender] = balances[msg.sender].add(numTokens);
    // log token creation event
    Transfer(0, msg.sender, numTokens);
    tokens = numTokens;
  }

  function totalSupply() constant returns (uint totalSupply) {
    totalSupply = totalNumberOfTokens;
  }
  function balanceOf(address _owner) constant returns (uint balance) {
    balance = balances[_owner];
  }
  function transfer(address _to, uint _value) external returns (bool success) {
    uint senderBalance = balances[msg.sender];
    if (senderBalance >= _value && _value > 0) {
        senderBalance = senderBalance.sub(_value);
        balances[msg.sender] = senderBalance;
        balances[_to] = balances[_to].add(_value);
        Transfer(msg.sender, _to, _value);
        return true;
    }
    return false;
  }
  function transferFrom(address _from, address _to, uint _amount) external returns (bool success) {
    if(balances[_from] >= _amount
      && allowed[_from][msg.sender] >= _amount
      && _amount > 0
      && balances[_to].add(_amount) > balances[_to]) {
        balances[_from] = balances[_from].sub(_amount);
        allowed[_from][msg.sender] = allowed[_from][msg.sender].sub(_amount);
        balances[_to] = balances[_to].add(_amount);
        Transfer(_from, _to, _amount);
        return true;
      } else {
        return false;
      }
  }
  function approve(address _spender, uint _amount) returns (bool success) {
    allowed[msg.sender][_spender] = _amount;
    Approval(msg.sender, _spender, _amount);
    return true;
  }
  function allowance(address _owner, address _spender) constant returns (uint remaining) {
    return allowed[_owner][_spender];
  }

  event Transfer(address indexed _from, address indexed _to, uint _value);
  event Approval(address indexed _owner, address indexed _spender, uint _value);
}
