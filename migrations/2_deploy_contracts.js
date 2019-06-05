var fixedSupplyToken = artifacts.require("FixedSupplyToken");
var exchange = artifacts.require("Exchange");

module.exports = function(deployer) {
  deployer.deploy(fixedSupplyToken);
  deployer.deploy(exchange);
};
