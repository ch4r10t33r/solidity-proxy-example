pragma solidity ^0.4.8;

import './ERC20Contract.sol';

contract ProxyContract is Ownable {
  using SafeMath for uint;
  ERC20Contract cont;
  address tokenAddress;
  address[] walletAddresses;

  event ReceivedToken(address _from,uint _tokens);
  event Distributed(address _owner,uint _token);

  function ProxyContract(address _tokenAddress, address[] _walletAddresses) {
    if(_tokenAddress == address(0)) throw;

    tokenAddress = _tokenAddress;
    cont = ERC20Contract(tokenAddress);

    for(uint i=0;i<_walletAddresses.length;i++) {

      if(_walletAddresses[i] == address(0)) throw;

      walletAddresses.push(_walletAddresses[i]);
    }
  }

  function () external payable {
    throw;
  }

  function sendTokens(address _from,uint tokens) external payable returns (bool){
    uint split;
    if(tokens == 0) throw;

    if(cont.balanceOf(_from) < tokens) throw;

    split = tokens.div(walletAddresses.length);
    for(uint i=0;i<walletAddresses.length;i++) {
      if(cont.transferFrom(_from,walletAddresses[i],split)) {
        Distributed(walletAddresses[i],split);
      }
    }
  }
}
