// Variables
// TODO: extract from index.js to default state creation
var stocks = [];
var portfolio = {};
var account = {
  cash: 24500.00,
  margin: 0.00,
  portfolio: 0.00,
}
var trends = {};

// Global action/draw vars
var selectedStockIndex = 0;
var tickerHash = {};
