pragma solidity ^0.4.11;

import './ERC20Contract.sol';

contract ProxyContract is Ownable {
  using SafeMath for uint;
  ERC20Contract cont;
  address tokenAddress;
  address[] walletAddresses;

  event ReceivedToken(address _from,uint _tokens);
  event Distributed(address _owner,uint _token);
  event AddedMember(address _member);
  event SetERCToken(address token);

  function ProxyContract() {
    tokenAddress = address(0);
  }

  function setTokenAddress(address _tokenAddress) onlyOwner external returns (bool){
    assert(_tokenAddress != address(0));
    tokenAddress = _tokenAddress;
    cont = ERC20Contract(_tokenAddress);
    SetERCToken(_tokenAddress);
    return true;
  }

  function setWalletMembers(address[] members) onlyOwner external returns (bool){
    for(uint i=0;i<members.length;i++) {
      assert(members[i] != address(0));
      walletAddresses.push(members[i]);
      AddedMember(members[i]);
    }
    return true;
  }

  /*
  Having the constructor accept these params makes the testing of the contract cumbersome.
  function ProxyContract(address _tokenAddress, address[] _walletAddresses) {
    //if(_tokenAddress == address(0)) throw;
    //assert is supported only in solidity version 0.4.11
    assert(_tokenAddress != address(0));

    tokenAddress = _tokenAddress;
    cont = ERC20Contract(tokenAddress);

    for(uint i=0;i<_walletAddresses.length;i++) {

      if(_walletAddresses[i] == address(0)) throw;

      walletAddresses.push(_walletAddresses[i]);
    }
  }
  */

  function () external payable {
    throw;
  }

  function sendTokens(address _from,uint tokens) external payable returns (bool){
    uint split;
    assert(walletAddresses.length > 0);
    assert(tokenAddress != address(0));
    //if(tokens < walletAddresses.length) throw;
    assert(tokens >= walletAddresses.length);

    if(cont.balanceOf(_from) < tokens) throw;

    split = tokens.div(walletAddresses.length);
    for(uint i=0;i<walletAddresses.length;i++) {
      if(cont.transferFrom(_from,walletAddresses[i],split)) {
        Distributed(walletAddresses[i],split);
      }
    }
  }

  function balanceOf(address _account) external returns (uint) {
    return cont.balanceOf(_account);
  }

  function addMember(address _account) external onlyOwner returns (bool) {
    assert(_account != address(0));
    walletAddresses.push(_account);
    AddedMember(_account);
    return true;
  }

  function totalMembers() external returns (uint) {
    return walletAddresses.length;
  }

  function getTokenAddress() external returns (address) {
    return tokenAddress;
  }
}
