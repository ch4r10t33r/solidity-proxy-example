pragma solidity ^0.4.8;

import './ERC20Contract.sol';

contract ProxyContract is Ownable {
  ERC20Contract cont;
  address tokenAddress;
  address[] walletAddresses;
  uint res;

  event ReceivedToken(address _from,uint _tokens);
  event SplitOccured(address _owner,uint _token);

  function ProxyContract(address _tokenAddress, address[] _walletAddresses) {
    if(_tokenAddress == address(0)) throw;

    tokenAddress = _tokenAddress;
    cont = ERC20Contract(tokenAddress);

    for(uint i=0;i<_walletAddresses.length;i++) {

      if(_walletAddresses[i] == address(0)) throw;

      walletAddresses.push(_walletAddresses[i]);
    }
    res = 0;
  }

  function () external payable {
    throw;
  }

  function sendTokens(uint tokens) external {
    res += tokens;
    if(res > (2*walletAddresses.length)) {
      updateBalances();
    }
  }

  function updateBalances() internal {
    uint split = (res / walletAddresses.length);
    res = (res % walletAddresses.length);

    for(uint i=0;i<walletAddresses.length;i++) {
      //transfer the tokens in contract_address
      cont.transferFrom(address(this),walletAddresses[i],split);
      SplitOccured(walletAddresses[i],split);
    }
  }
}
