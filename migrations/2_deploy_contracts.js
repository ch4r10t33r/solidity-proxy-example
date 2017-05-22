var ERC20Contract = artifacts.require("./ERC20Contract.sol");
var ProxyContract = artifacts.require("./ProxyContract.sol");

module.exports = function(deployer) {
  deployer.deploy(ERC20Contract).then (function() {
    deployer.deploy(ProxyContract,ERC20Contract.address,["0x79694ddc7755cb94b297e2be67755743ed68dc0b","0x475b99ca27909c3ac7e0231378bef4beb3a9f4ef","0x6fc8fe7cf69e8fc0577c00af0ea58e251144888f"]);
  });
};
