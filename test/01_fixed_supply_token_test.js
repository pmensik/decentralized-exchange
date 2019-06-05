const fixedSupplyToken = artifacts.require("FixedSupplyToken");

contract("MyToken", function(accounts) {
  it("first account should own all the tokens", function() {
    var tokenSupply;
    var myTokenInstance;

    return fixedSupplyToken
      .deployed()
      .then(function(instance) {
        myTokenInstance = instance;
        return myTokenInstance.totalSupply.call();
      })
      .then(function(totalSupply) {
        _totalSupply = totalSupply;
        return myTokenInstance.balanceOf(accounts[0]);
      })
      .then(function(balanceAccountOwner) {
        assert.equal(
          parseFloat(balanceAccountOwner),
          parseFloat(_totalSupply),
          "Total Amount of tokens is owned by owner"
        );
      });
  });

  it("second account should own no tokens", function() {
    var myTokenInstance;
    return fixedSupplyToken
      .deployed()
      .then(function(instance) {
        myTokenInstance = instance;
        return myTokenInstance.balanceOf(accounts[1]);
      })
      .then(function(balanceAccountOwner) {
        assert.equal(
          parseFloat(balanceAccountOwner),
          0,
          "Total Amount of tokens is owned by some other address"
        );
      });
  });

  it("should send tokens correctly", function() {
    var token;

    var account_one = accounts[0];
    var account_two = accounts[1];

    var account_one_starting_balance;
    var account_two_starting_balance;
    var account_one_ending_balance;
    var account_two_ending_alance;

    var amount = 10;

    return fixedSupplyToken
      .deployed()
      .then(function(instance) {
        token = instance;
        return token.balanceOf.call(account_one);
      })
      .then(function(balance) {
        account_one_starting_balance = parseFloat(balance);
        return token.balanceOf.call(account_two);
      })
      .then(function(balance) {
        account_two_starting_balance = parseFloat(balance);
        return token.transfer(account_two, amount, { from: account_one });
      })
      .then(function() {
        return token.balanceOf.call(account_one);
      })
      .then(function(balance) {
        account_one_ending_balance = parseFloat(balance);
        return token.balanceOf.call(account_two);
      })
      .then(function(balance) {
        account_two_ending_alance = parseFloat(balance);

        assert.equal(
          account_one_ending_balance,
          account_one_starting_balance - amount,
          "Amount wasn't correctly taken from sender"
        );
        assert.equal(
          account_two_ending_alance,
          account_two_starting_balance + amount,
          "Amount wasn't correctly sent to the receiver"
        );
      });
  });
});
