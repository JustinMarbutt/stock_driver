// Constants
const LENGTH_OF_TRADING_DAY_INTERVALS = 389;
const STATE_INTERVAL_IN_MS = 1000;
const MIN_CHANCE_OF_GAIN = .025;
const MAX_CHANCE_OF_GAIN = 1;
const MIN_TICK_CHANGE = .00005;
const MAX_TICK_CHANGE = .00027;
const CHANCE_OF_NO_CHANGE = .125;

// Variables
var closingBell = new Audio('assets/audio/closing_bell.wav');
var closingBell2 = new Audio('assets/audio/closing_bell.wav');
var closingBell3 = new Audio('assets/audio/closing_bell.wav');
var successDing = new Audio('assets/audio/success.wav');
var rejectAlert = new Audio('assets/audio/rejected.wav');

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
