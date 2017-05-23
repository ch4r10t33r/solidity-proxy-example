var ERC20Contract = artifacts.require("./ERC20Contract.sol");
var ProxyContract = artifacts.require("./ProxyContract.sol");

var contract_address = "0x2037f1b7cfba8bc83cdc3fce3b32f152539c7216";
var erc_address = "0xd678f464da0f6a50664056dce9b670a7577811dd";

contract('ERC20Contract', function(accounts) {
  it("should allow purchase", function () {
    var expected = 800;
    var meta = ERC20Contract.at(erc_address);
    return meta.purchase({from:accounts[0],value:80000}).then(function(result) {
      console.log("purchase successful");
      //console.log(result);
      return meta.balanceOf(accounts[0]).then(function (balance) {
        //console.log("Balance of " + accounts[0] + " in ERC20Contract: " + balance.valueOf());
        assert.equal(balance.valueOf(),expected,"should have purchased "+ expected + "tokens");
      });
    });
  });

  it("disallow transferFrom from unauthorized address",function() {
    var meta;
    ERC20Contract.at(erc_address).then(function (instance) {
      meta = instance;
      return meta.transferFrom(accounts[0],accounts[1],10,{from:accounts[1],gas: 1000000});
    }).then(function (result) {
      //code wont come here due to failure.
      console.log(result);
    }).catch(function(e) {
      //console.log(e);
      assert.equal(e,e,"Disallowed transferFrom");
    });
  });

  it("should allow transfer to proxy",function() {
    var meta;
    var expected = 10;
    var proxy = ProxyContract.at(contract_address);
    ERC20Contract.at(erc_address).then(function(instance) {
      meta = instance;
      //approve transfer to other accounts
      return meta.approve(accounts[1],expected,{from: accounts[0]});
    }).then(function(result) {
      //console.log("Approval was " + result);
      return meta.allowance.call(accounts[0],accounts[1]);
    }).then(function(balance) {
      //console.log(balance.valueOf());
      assert.equal(balance.valueOf(),expected,"Expected allowance from "+accounts[0]+" is "+expected);
      return meta.approve(accounts[2],10,{from: accounts[0]});
    }).then(function(result) {
      //console.log("Approval was " + result);
      return meta.allowance.call(accounts[0],accounts[2]);
    }).then(function(balance) {
      //console.log(balance.valueOf());
      assert.equal(balance.valueOf(),expected,"Expected allowance from "+accounts[1]+" is "+expected);
      return meta.approve(accounts[3],10,{from: accounts[0]});
    }).then(function(result) {
      return meta.allowance.call(accounts[0],accounts[3]);
    }).then(function(balance) {
      assert.equal(balance.valueOf(),expected,"Expected allowance from "+accounts[2]+" is "+expected);
      //send tokens to proxy account
      return proxy.sendTokens(accounts[0],9,{from: accounts[0], gas: 1000000});
    }).then(function(result) {
      //console.log(result);
      expected = 800 - 9;
      return meta.balanceOf.call(accounts[0]);
    }).then(function(balance) {
      //console.log("Balance of "+accounts[0]+" is : " + balance.valueOf());
      assert.equal(balance.valueOf(),expected,"Expected balance in "+accounts[0]+" is "+expected);
      //the transaction should have equally distributed 3 tokens to each address
      expected = 3;
      return meta.balanceOf.call(accounts[1]);
    }).then(function(balance) {
      assert.equal(balance.valueOf(),expected,"Expected balance in "+accounts[1]+" is "+expected);
      //console.log("Balance of "+accounts[1]+" is : " + balance.valueOf());
      return meta.balanceOf.call(accounts[2]);
    }).then(function(balance) {
      assert.equal(balance.valueOf(),expected,"Expected balance in "+accounts[2]+" is "+expected);
      //console.log("Balance of "+accounts[2]+" is : " + balance.valueOf());
      return meta.balanceOf.call(accounts[3]);
    }).then(function(balance) {
      assert.equal(balance.valueOf(),expected,"Expected balance in "+accounts[3]+" is "+expected);
      //assert.equal(balance.valueOf(), expected, "0 wasn't in the first account");
      //console.log("Balance of "+accounts[3]+" is : " + balance.valueOf());
    }).catch(function(e) {
      console.log(e);
    });
  });
});
