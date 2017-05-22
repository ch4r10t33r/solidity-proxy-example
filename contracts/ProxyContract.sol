pragma solidity ^0.4.8;

import './ERC20Contract.sol';

contract ProxyContract is Ownable {
  ERC20Contract cont;
  address tokenAddress;
  address[] walletAddresses;
  uint res;
  mapping (address => uint256) balances;

  event ReceivedToken(address _from,uint _tokens);
  event SplitOccured(address _owner,uint _token);

  function ProxyContract(address _tokenAddress, address[] _walletAddresses) {
    if(_tokenAddress == address(0)) throw;

    tokenAddress = _tokenAddress;
    cont = ERC20Contract(tokenAddress);

    for(uint i=0;i<_walletAddresses.length;i++) {

      if(_walletAddresses[i] == address(0)) throw;

      walletAddresses.push(_walletAddresses[i]);
      balances[_walletAddresses[i]] = 0;
    }
    res = 0;
  }

  function () external payable {
    if(msg.value == 0) throw;

    ReceivedToken(msg.sender,msg.value);

    res += msg.value;
  }

  function receiveTokens(uint tokens) external payable returns (bool) {
    if(cont.withdraw(tokens)) {
      res += tokens;
      return true;
    }
    return false;
  }

  function withdraw(uint _value) external payable returns (bool){
    if(res > (2*walletAddresses.length)) {
      updateBalances();
    }
    uint senderBalance = balances[msg.sender];
    if (senderBalance >= _value && _value > 0) {
      balances[msg.sender] -= _value;
      return true;
    }
    return false;
  }

  function balanceOf(address _address) external returns (uint value) {
    if(res > (2*walletAddresses.length)) {
      updateBalances();
    }
    value = balances[_address];
  }

  function updateBalances() internal {
    uint split = (res / walletAddresses.length);
    res = (res % walletAddresses.length);

    for(uint i=0;i<walletAddresses.length;i++) {
      balances[walletAddresses[i]] += split;
      SplitOccured(walletAddresses[i],split);
    }
  }
}
