const fixedSupplyToken = artifacts.require("FixedSupplyToken");
const exchangeToken = artifacts.require("Exchange");

contract("Simple Order Tests", function(accounts) {
  before(function() {
    var instanceExchange;
    var instanceToken;

    return exchangeToken
      .deployed()
      .then(function(instance) {
        instanceExchange = instance;
        return instanceExchange.depositEther({
          from: accounts[0],
          value: web3.utils.toWei("3", "ether")
        });
      })
      .then(function(txResult) {
        return fixedSupplyToken.deployed();
      })
      .then(function(instance) {
        instanceToken = instance;
        return instanceExchange.addToken("FIXED", instanceToken.address);
      })
      .then(function(txResult) {
        return tokenInstance.approve(instanceExchange.address, 2000);
      })
      .then(function(txResult) {
        return instanceExchange.depositToken("FIXED", 2000);
      });
  });

  it("should be possible to add a limit buy order", function() {
    var myExchangeInstance;
    return exchange
      .deployed()
      .then(function(instance) {
        myExchangeInstance = instance;
        return myExchangeInstance.getBuyOrderBook.call("FIXED");
      })
      .then(function(orderBook) {
        assert.equal(
          orderBook.length,
          2,
          "BuyOrderBook should have two elements"
        );
        assert.equal(
          orderBook[0].length,
          0,
          "OrderBook should have 0 buy offers"
        );
        return myExchangeInstance.buyToken(
          "FIXED",
          web3.utils.toWei(1, "finney"),
          5
        );
      })
      .then(function(txResult) {
        assert.equal(
          txResult.logs.length,
          1,
          "There should be one log message emited"
        );
        assert.equal(
          txResult.logs[0].event,
          "LimitBuyOrderCreated",
          "Event should be LimitBuyOrderCreated"
        );
        return myExchangeInstance.getBuyOrderBook.call("FIXED");
      })
      .then(function(orderBook) {
        assert.equal(
          orderBook[0].length,
          1,
          "OrderBook should have 0 buy offers"
        );
        assert.equal(
          orderBook[1].length,
          1,
          "OrderBook should have 0 buy volume"
        );
      });
  });

  it("should be possible to add three limit buy orders", function() {
    var myExchangeInstance;
    var orderBookLengthBeforeBuy = 0;
    return exchange
      .deployed()
      .then(function(instance) {
        myExchangeInstance = instance;
        return myExchangeInstance.getBuyOrderBook.call("FIXED");
      })
      .then(function(orderBook) {
        orderBookLengthBeforeBuy = orderBook[0].length;
        return myExchangeInstance.buyToken(
          "FIXED",
          web3.utils.toWei(2, "finney"),
          5
        );
      })
      .then(function(txResult) {
        assert.equal(
          txResult.logs.length,
          1,
          "There should be one log message emited"
        );
        assert.equal(
          txResult.logs[0].event,
          "LimitBuyOrderCreated",
          "Event should be LimitBuyOrderCreated"
        );
        return myExchangeInstance.buyToken(
          "FIXED",
          web3.utils.toWei(1.4, "finney"),
          5
        );
      })
      .then(function(txResult) {
        assert.equal(
          txResult.logs.length,
          1,
          "There should be one log message emited"
        );
        assert.equal(
          txResult.logs[0].event,
          "LimitBuyOrderCreated",
          "Event should be LimitBuyOrderCreated"
        );
        return myExchangeInstance.getBuyOrderBook.call("FIXED");
      })
      .then(function(orderBook) {
        assert.equal(
          orderBook[0].length,
          orderBookLengthBeforeBuy + 2,
          "OrderBook should have 0 buy offers"
        );
        assert.equal(
          orderBook[1].length,
          orderBookLengthBeforeBuy + 2,
          "OrderBook should have 0 buy volume"
        );
      });
  });
});
