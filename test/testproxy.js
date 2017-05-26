var ERC20Contract = artifacts.require("ERC20Contract");
var ProxyContract = artifacts.require("ProxyContract");
var expect = require("chai").expect;
var expectedTokenPurchase = 800;
var expectedInitialWithdrawal = 5;
var expectedFirstTransfer = 9;
var expectedSecondTransfer = 9;
var meta;
var proxy;

contract('ERC20Contract', function(accounts) {
  it("should allow ERC token purchase", async function () {
    var expected = expectedTokenPurchase;
    meta = await ERC20Contract.deployed();
    var status = await meta.purchase({from:accounts[0],value:80000});
    var balance = await meta.balanceOf.call(accounts[0]);
    expect(parseInt(balance.valueOf())).to.equal(expected);
  });

  it("should setup ERC token in proxy contract", async function() {
    proxy = await ProxyContract.deployed();
    var expected = meta.address;
    await proxy.setTokenAddress(meta.address);
    const tokenAddress = await proxy.getTokenAddress.call();
    expect(tokenAddress.valueOf()).to.equal(expected);
  });

  it("should add two members to proxy contract", async function() {
    var expected = 2;
    await proxy.addMember(accounts[1]);
    await proxy.addMember(accounts[2]);
    const count = await proxy.totalMembers.call();
    expect(parseInt(count.valueOf())).to.equal(expected);
  });

  it("should allow transfer authorizations", async function() {
    var expected = 10;
    await meta.approve(accounts[1],10,{from: accounts[0]});
    const allowance1 = await meta.allowance.call(accounts[0],accounts[1]);
    expect(parseInt(allowance1.valueOf())).to.equal(expected);
    await meta.approve(accounts[2],10,{from: accounts[0]});
    const allowance2 = await meta.allowance.call(accounts[0],accounts[2]);
    expect(parseInt(allowance2.valueOf())).to.equal(expected);
    await meta.approve(accounts[3],10,{from: accounts[0]});
    const allowance3 = await meta.allowance.call(accounts[0],accounts[3]);
    expect(parseInt(allowance3.valueOf())).to.equal(expected);
  });

  it("should distribute tokens equally among two wallet members",async function() {
    var expected = 792; // as only 8 would be transferred
    await proxy.sendTokens(accounts[0],expectedFirstTransfer,{from:accounts[0],gas:1000000});
    const balance0 = await meta.balanceOf.call(accounts[0]);
    expect(parseInt(balance0.valueOf())).to.equal(expected);
    const balance1 = await meta.balanceOf.call(accounts[1]);
    expect(parseInt(balance1.valueOf())).to.equal(4);
    const balance2 = await meta.balanceOf.call(accounts[2]);
    expect(parseInt(balance2.valueOf())).to.equal(4);
  });

  it("should allow adding additional member to proxy", async function() {
    await proxy.addMember(accounts[3]);
    const count = await proxy.totalMembers.call();
    expect(parseInt(count)).to.equal(3);
  });

  it("should distribute tokens equally among three wallet members",async function() {
    var proxy = await ProxyContract.deployed();
    var meta = await ERC20Contract.deployed();
    var expected = 783;

    await proxy.sendTokens(accounts[0],expectedSecondTransfer,{from:accounts[0],gas:1000000});

    balance0 = await meta.balanceOf(accounts[0]);
    expect(parseInt(balance0.valueOf())).to.equal(expected);
    const balance1 = await meta.balanceOf(accounts[1]);
    expect(parseInt(balance1.valueOf())).to.equal(7);
    const balance2 = await meta.balanceOf(accounts[2]);
    expect(parseInt(balance2.valueOf())).to.equal(7);
    const balance3 = await meta.balanceOf(accounts[3]);
    expect(parseInt(balance3.valueOf())).to.equal(3);
  });

  it("disallow transferFrom from unauthorized address", async function() {
    try {
      var status = await meta.transferFrom(accounts[0],accounts[1],10,{from:accounts[1],gas: 1000000});
    } catch(e) {
      assert.equal(e,e,"Disallowed transferFrom");
    }
  });

});
