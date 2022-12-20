// Constants
const LENGTH_OF_TRADING_DAY_INTERVALS = 389;
const STATE_INTERVAL_IN_MS = 1000;

// Variables
var tickerHash = {};
var portfolio = {}//Array(9);
var account = {
  cash: 24500.00,
  margin: 0.00,
  portfolio: 0.00,
}

var trends = {};
var stockDailyValues = [[],[],[],[],[],[],[],[],[]];
var selectedStockIndex = 0;
var stocks = [];
