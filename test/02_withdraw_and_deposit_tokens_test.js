const fixedSupplyToken = artifacts.require("FixedSupplyToken");
const exchangeToken = artifacts.require("Exchange");

contract("Exchange Basic Tests", function(accounts) {
  var supplyTokenInstance;
  var exchangeTokenInstance;
  var etherAmount = 0.5;
  var toWithdraw = 0.2;

  it("first account can deposit ether to the exchange", function() {
    return exchangeToken
      .deployed()
      .then(function(instance) {
        instance.depositEther({
          from: accounts[0],
          value: web3.utils.toWei("0.5", "ether")
        });
        return instance.getEthBalanceInWei();
      })
      .then(function(exchangeBalance) {
        assert.equal(etherAmount, web3.utils.fromWei(exchangeBalance));
      });
  });
  it("first account can withdraw ether from the exchange", function() {
    var toWithdraw = 0.2;

    return exchangeToken
      .deployed()
      .then(function(instance) {
        instance.withdrawEther(
          web3.utils.toWei(toWithdraw.toString(), "ether")
        );
        return instance.getEthBalanceInWei();
      })
      .then(function(exchangeBalance) {
        assert.equal(
          etherAmount - toWithdraw,
          web3.utils.fromWei(exchangeBalance)
        );
      });
  });

  it("should deposit FixedSupplyToken token to the Exchange", function() {
    return fixedSupplyToken
      .new()
      .then(function(instance) {
        supplyTokenInstance = instance;
        return instance;
      })
      .then(function(instance) {
        supplyTokenInstance = instance;
        return exchangeToken.deployed();
      })
      .then(function(instance) {
        exchangeTokenInstance = instance;
        return exchangeTokenInstance.addToken(
          "FIXED",
          supplyTokenInstance.address
        );
      })
      .then(function(txResult) {
        return supplyTokenInstance.approve(exchangeTokenInstance.address, 1000);
      })
      .then(function(txResult) {
        return exchangeTokenInstance.depositToken("FIXED", 500);
      })
      .then(function(txResult) {
        return exchangeTokenInstance.getBalance("FIXED");
      })
      .then(function(balance) {
        assert.equal(balance, 500);
        // assert.equal(supplyTokenInstance.balanceOf(accounts[0]), 500);
      });
  });
  it("should withdraw FixedSupplyToken from the exchange", function() {
    exchangeToken
      .new()
      .then(function(instance) {
        instance.withdrawToken("FIXED", 200);
        return instance;
      })
      .then(function(instance) {
        return exchangeTokenInstance.getBalance("FIXED");
      })
      .then(function(balance) {
        assert.equal(balance, 300);
      });
  });
});
