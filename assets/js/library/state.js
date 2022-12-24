// State machine
const LENGTH_OF_TRADING_DAY_INTERVALS = 389;
const STATE_INTERVAL_IN_MS = 1000;
const CHANCE_OF_BULL_MARKET = 0.08;
const CHANCE_OF_BEAR_MARKET = 0.04;

var drawOnTick = function(a, b, c, d) {return a || b || c || d};
var drawOffMarketTick = function(a, b, c, d) {return a || b || c|| d};
var saveMarketTick = function(a, b) {return a || b};
var drawClosedMarket = function(a, b, c) {return a || b || c};

var stocks = [];
var portfolio = {};
var account = {
  cash: 24500.00,
  margin: 0.00,
  portfolio: 0.00,
}
var trends = {};
var stockDailyValues = [[],[],[],[],[],[],[],[],[]];

var bullMarketToday = false;
var bearMarketToday = false;

var time = moment();
var gameTime = 0;
var gameDays = 0;
var addedTime = 0;
var marketOpen = false;
var marketPaused = false;
var gameState;

var fakeMarket = createFakeMarket();

// Default funciton for creating a new game
function initNewGame() {
  var stockIndex = 0;
  // create 3 unique teir 0 stocks with high prices and low vol
  for (var i = 0; i < 3; i++) {
    var newStock = fakeMarket.createStock(50, 420);
    newStock['tier'] = 0;
    stocks.push(newStock);
    tickerHash[newStock.ticker] = stockIndex;
    stockIndex++;
  }

  // create 3 unique tier 1 stocks with medium prices and vol
  for (var i = 0; i < 3; i++) {
    var newStock = fakeMarket.createStock(12, 75);
    newStock['tier'] = 1;
    stocks.push(newStock);
    tickerHash[newStock.ticker] = stockIndex;
    stockIndex++;
  }

  // create 3 unique tier 2 stocks with low price and high vol
  for (var i = 0; i < 3; i++) {
    var newStock = fakeMarket.createStock(0, 10);
    newStock['tier'] = 2;
    stocks.push(newStock);
    tickerHash[newStock.ticker] = stockIndex;
    stockIndex++;
  }

  // set beggining game time display and default buy order to 10 shares
  time.set('hour', 9);
  time.set('minute', 30);
  time.set('month', 3);
  time.set('day', 9);
  time.set('year', 1987);
  drawCurrentTime(time);

  // set the trends for the first week
  trends = setTrendsForWeek();

  // draw the market and portfolio
  drawMarketView(stocks, '#stock-market-table');
  drawPortfolio(stocks, portfolio, account);

  // select the first stock to trade by default
  $('#stock-market-table').find('tr').first().trigger('click');
  $('#buy-action-num-shares').val(10);
}

function marketTick(drawOnTick = true) {
  gameTime++;
  time.add(1, 'minutes');
  if (gameTime > LENGTH_OF_TRADING_DAY_INTERVALS) {
    closeMarket();
    return drawClosedMarketView(stocks, portfolio, account);
  }

  stocks.forEach(function(stock, i) {
    if (bullMarketToday) {
      stockDailyValues[i].push(stocks[i].price);
      stocks[i].price = upTrendSimple(stock.price);
      return;
    }
    if (bearMarketToday) {
      stockDailyValues[i].push(stocks[i].price);
      stocks[i].price = downTrendSimple(stock.price);
      return;
    }
    if (trends[i]) {
      stocks[i].price = trends[i].priceFunc(stock.price, gameTime);
    } else {
      stocks[i].price = noTrend(stock.price);
    }
    stockDailyValues[i].push(stocks[i].price);
  });

  var stockTotalValue = 0.00;
  for (const [key, value] of Object.entries(portfolio)) {
    stockTotalValue += stocks[tickerHash[key]].price * value.numberOfShares;
  };
  account.portfolio = stockTotalValue;

  if (drawOnTick) {
    drawOnMarketTick(stocks, portfolio, account, time);
  } else {
    saveMarketTick(stocks, portfolio, account, time);
  }
}

function broadcastState() {
  drawOffMarketTick(stocks, portfolio, account, stockDailyValues);
}

function openMarket() {
  if (marketOpen) {
    return;
  }
  marketOpen = true;
  marketPaused = false;
  bearMarketToday = false;
  bullMarketToday = false;
  if (gameState) {
    clearInterval(gameState);
  }
  stockDailyValues = [[],[],[],[],[],[],[],[],[]];
  stocks.forEach(function(stock, i) {
    stocks[i].open = stock.price;
    stocks[i].close = null;
  });

  time.set('hour', 9);
  time.set('minute', 30);
  if (time.format('dddd') === 'Friday') {
    time.add(2, 'days');
    trends = setTrendsForWeek();
  }
  time.add(1, 'days');
  var rand = Math.random();
  var rand2 = Math.random();
  if (rand < CHANCE_OF_BULL_MARKET) {
    bullMarketToday = true;
  } else if (rand2 < CHANCE_OF_BEAR_MARKET) {
    bearMarketToday = true;
  }
  addedTime = 0;
  gameState = setInterval(marketTick, STATE_INTERVAL_IN_MS); //setting the loop with time interval
}

function closeMarket() {
  marketOpen = false;
  marketPaused = false;
  gameTime = 0;
  gameDays++;
  stocks.forEach(function(stock, i) {
    stocks[i].close = stock.price;
    if (trends[i] && trends[i].daysLeft) {
      if (trends[i].daysLeft < 2) {
        delete trends[i];
      } else {
        trends[i].daysLeft -= 1;
      }
    }
  });

  // Enable margin
  // if ((account.cash + account.portfolio > 24999)) {
  //   account.margin = 25000;
  // }

  clearInterval(gameState);
}

function pauseMarket() {
  marketPaused = true;
  clearInterval(gameState);
}

function skipToMarketClose() {
  pauseMarket();
  while (gameTime < LENGTH_OF_TRADING_DAY_INTERVALS - 1) {
    marketTick(false);
  }
  resumeMarket(-800);
}

function resumeMarket(addedTime) {
  clearInterval(gameState);
  //setting the loop with time interval
  gameState = setInterval(marketTick, STATE_INTERVAL_IN_MS + addedTime);
  marketPaused = false;
}

function sellStock(stockId, orderId, numOfShares) {
  if (!marketOpen || marketPaused) {
    // order rejected (markets not open)
    return false
  }
  var stock = stocks[tickerHash[stockId]];
  var newCashValue = account.cash + (stock.price * numOfShares);
  account.cash = newCashValue;
  delete portfolio[orderId];
  return true;
}

function buyStock(ticker, numberOfShares) {
  if (!marketOpen || marketPaused) {
    // order rejected (markets not open)
    return false
  }
  var stock = stocks[tickerHash[ticker]];
  var newCashValue = account.cash - (stock.price * numberOfShares);
  if ((newCashValue + account.margin) < 0) {
    // order rejected (not enough cash)
    return false;
  }
  if (newCashValue < 0) {
    account.cash = 0;
    account.margin = account.margin + newCashValue;
  } else {
    account.cash = newCashValue;
  }

  // if the position already exists in portfolio add to it
  if (portfolio[ticker]) {
    var position = portfolio[ticker];
    position.purchasePrice = (
      (parseFloat(position.purchasePrice) * parseFloat(position.numberOfShares)) +
      (parseFloat(stock.price) * parseFloat(numberOfShares))
    ) / (parseFloat(numberOfShares) + parseFloat(position.numberOfShares))  
    position.numberOfShares = parseFloat(position.numberOfShares) + parseFloat(numberOfShares);
  } else {
    portfolio[ticker] = {
      stockId: ticker,
      purchasePrice: stock.price,
      numberOfShares: numberOfShares,
      displayPurchasePrice: function() {
        return formatter.format(this.purchasePrice);
      },
    };
  }

  // order accepted
  return true;
}
