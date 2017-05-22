var ERC20Contract = artifacts.require("./ERC20Contract.sol");
var ProxyContract = artifacts.require("./ProxyContract.sol");

var contract_address = "0x81fa25cc774915f4a7eee02eb6145d3633a8390b";
var erc_address = "0x74690f2ad0493386ef8c07f2f38b039117d1921e";

contract('ERC20Contract', function(accounts) {
  it("should allow purchase", function () {
    var meta = ERC20Contract.at(erc_address);
    return meta.purchase({from:accounts[0],value:80000}).then(function(result) {
      console.log("purchase successful");
      //console.log(result);
      return meta.balanceOf(accounts[0]).then(function (balance) {
        console.log("Balance of " + accounts[0] + " in ERC20Contract: " + balance.valueOf());
      });
    });
  });

  it("should allow transfer to proxy",function() {
    var meta;
    var proxy = ProxyContract.at(contract_address);
    ERC20Contract.at(erc_address).then(function(instance) {
      meta = instance;
      return meta.transfer(contract_address,9,{from:accounts[0],gas: 100000});
    }).then(function(result) {
      return meta.balanceOf.call(accounts[0]);
    }).then(function(balance) {
      console.log("Balance of "+accounts[0]+" in ERC: " + balance.valueOf());
      return meta.balanceOf.call(contract_address);
    }).then(function(balance) {
      console.log("Balance of "+contract_address+" in ERC: " + balance.valueOf());
      //perform a withdrawal
      //return meta.withdrawFrom(contract_address,balance.valueOf(),{from: accounts[0],gas: 100000});
      return proxy.receiveTokens(balance.valueOf(),{from: accounts[0], gas: 5000000});
    }).then(function(result) {
      console.log(result);
      return meta.balanceOf.call(contract_address);
    }).then(function(balance) {
      console.log("Balance of "+contract_address+" after withdrawal: " + balance.valueOf());
      return proxy.balanceOf.call(accounts[1]);
    }).then(function(balance) {
      //assert.equal(balance.valueOf(), expected, "0 wasn't in the first account");
      console.log("Balance of "+accounts[1]+" in ProxyContract: " + balance.valueOf());
      return proxy.balanceOf.call(accounts[2]);
    }).then(function(balance) {
      //assert.equal(balance.valueOf(), expected, "0 wasn't in the first account");
      console.log("Balance of "+accounts[2]+" in ProxyContract: " + balance.valueOf());
      return proxy.balanceOf.call(accounts[3]);
    }).then(function(balance) {
      //assert.equal(balance.valueOf(), expected, "0 wasn't in the first account");
      console.log("Balance of "+accounts[3]+" in ProxyContract: " + balance.valueOf());
    }).catch(function(e) {
      console.log(e);
    });
  });
});

/*
contract('ProxyContract', function(accounts) {
  it("should have 0 token in all account", function() {
    // Get a reference to the deployed MetaCoin contract, as a JS object.
    var meta = ProxyContract.at(contract_address);

    return meta.balanceOf.call(accounts[1]).then(function(balance) {
      assert.equal(balance.valueOf(), 0, "0 wasn't in the first account");
      return meta.balanceOf.call(accounts[2]);
    }).then(function(balance) {
        assert.equal(balance.valueOf(),0,"0 wasn't in the second account");
        return meta.balanceOf.call(accounts[3]);
    }).then(function(balance){
      assert.equal(balance.valueOf(),0,"0 wasn't in the second account");
    });
  });

  it("should split the sent amount equally", function() {
    var meta;
    var expected = 3;
    ProxyContract.at(contract_address).then(function (instance) {
      meta = instance;
      //send 9 tokens and expect this to be split as 3 each
      return web3.eth.sendTransaction({from: accounts[0],to: contract_address, value: 9});
    }).then(function (result) {
      //console.log("transaction successful");
      //console.log(result);
      return meta.balanceOf.call(accounts[1]);
    }).then(function (balance) {
      assert.equal(balance.valueOf(), expected, "0 wasn't in the first account");
      //console.log("Balance of "+accounts[1]+" in ProxyContract: " + balance.valueOf());
      return meta.balanceOf.call(accounts[2]);
    }).then(function (balance) {
      assert.equal(balance.valueOf(), expected, "0 wasn't in the first account");
      //console.log("Balance of "+accounts[2] + " in ProxyContract: " + balance.valueOf());
      return meta.balanceOf.call(accounts[3]);
    }).then(function (balance) {
      assert.equal(balance.valueOf(), expected, "0 wasn't in the first account");
      //console.log("Balance of "+accounts[3] + " in ProxyContract: " + balance.valueOf());
    }).catch(function (e) {
      console.log(e);
    });
  });

  it("should update balances after withdrawal",function() {
    var meta;
    var expected = 2;
    ProxyContract.at(contract_address).then(function (instance) {
      meta = instance;
      //withdraw 1 from account 1
      return meta.withdraw(1,{from:accounts[1],gas: 100000});
    }).then(function (result) {
      //console.log(result);
      return meta.balanceOf.call(accounts[1]);
    }).then(function (balance) {
      assert.equal(balance.valueOf(),expected,"2 wasn't in the 1st account");
      //console.log("Balance of "+accounts[1]+" after withdrawal: " + balance.valueOf());
      //withdraw 2 from account 2
      expected = 1;
      return meta.withdraw(2,{from:accounts[2],gas: 100000});
    }).then(function (result) {
      //console.log(result);
      return meta.balanceOf.call(accounts[2]);
    }).then(function (balance) {
      assert.equal(balance.valueOf(),expected,"1 wasn't in the 2nd account");
      //console.log("Balance of "+accounts[2]+" after withdrawal: " + balance.valueOf());
      //withdraw 3 from account 3
      return meta.withdraw(3,{from:accounts[3],gas: 100000});
    }).then(function (result) {
      //console.log(result);
      expected = 0;
      return meta.balanceOf.call(accounts[3]);
    }).then(function (balance) {
      assert.equal(balance.valueOf(),expected,"0 wasn't in the 3rd account");
      //console.log("Balance of "+accounts[3]+" after withdrawal: " + balance.valueOf());
    }).catch(function(e) {
      console.log(e);
    });
  });
});
*/
