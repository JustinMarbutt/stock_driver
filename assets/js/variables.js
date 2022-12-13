// Constants
const LENGTH_OF_TRADING_DAY_INTERVALS = 389;
const STATE_INTERVAL_IN_MS = 1000;
const MIN_CHANCE_OF_GAIN = .025;
const MAX_CHANCE_OF_GAIN = 1;
const MIN_TICK_CHANGE = .00005;
const MAX_TICK_CHANGE = .00027;
const CHANCE_OF_NO_CHANGE = .125;

// Variables
var chanceOfBullMarket = 0.08;
var chanceOfBearMarket = 0.04;
var bullMarketToday = false;
var bearMarketToday = false;
var closingBell = new Audio('closing_bell.wav');
var closingBell2 = new Audio('closing_bell.wav');
var closingBell3 = new Audio('closing_bell.wav');
var successDing = new Audio('success.wav');
var rejectAlert = new Audio('rejected.wav');
var addedTime = 0;
var firstWords = [
  'Averley',
  'Brown',
  'Cooks',
  'Denver',
  'Electronic',
  'Fabio',
  'Greyrock',
  'Hemmet',
  'Mark\'s',
  'New Haven',
  'Tip Top',
  'Good Vibes',
  'Reno',
  'Cybernine',
  'Blockchain',
  'Wolf'
];
var secondWords = [
  'Accounting',
  'Bank',
  'Computers',
  'Dynamics',
  'Engineering',
  'Financial',
  'Global',
  'Hotels',
  'International',
  'Sciences',
  'Capital Fund',
  'Airlines',
  'Retail Stores',
  'World Wide'
];

var tickerHash = {};
var portfolio = {}//Array(9);
var account = {
  cash: 24500.00,
  margin: 0.00,
  portfolio: 0.00,
}
var time = moment();
var trends = {};
