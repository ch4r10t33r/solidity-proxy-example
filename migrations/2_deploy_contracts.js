var ERC20Contract = artifacts.require("ERC20Contract");
var ProxyContract = artifacts.require("ProxyContract");

module.exports = function(deployer) {
  /*
  deployer.deploy(ERC20Contract).then (function() {
    // deploy contract with accounts[1], accounts[2] and accounts[3] as initial members of wallet
    deployer.deploy(ProxyContract,ERC20Contract.address,["0xdf5f2ec3f8a02dd0e139f1a5a02f9428a97b10b4","0x4d4bf347b06d9fba96fa622704bffed2119142db","0xc8ff1b647e79721c73afe02f9589dbbce03746a8"]);
  //deployer.deploy(ProxyContract,"0x0","0x0");
  });
  */
  deployer.deploy(ERC20Contract);
  deployer.deploy(ProxyContract);
};
