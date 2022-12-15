// State machine

var gameTime = 0;
var gameDays = 0;
var marketOpen = false;
var gameState;

function stockTimer(drawOnTick = true) {
  gameTime++;
  time.add(1, 'minutes');
  $('#time-display').text(time.format('dddd MMMM Do, h:mm a'));
  if (gameTime > LENGTH_OF_TRADING_DAY_INTERVALS) {
    closeMarket();
    return drawClosedMarketView();
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

  var total = 0.00;
  for (const [key, value] of Object.entries(portfolio)) {
    total += stocks[tickerHash[key]].price * value.numberOfShares;
  };
  account.portfolio = total;

  if(gameTime % 30 == 0 || gameTime === LENGTH_OF_TRADING_DAY_INTERVALS) {
    addChartData(accountChart, time.format('h:mm a'), account.cash + account.portfolio, drawOnTick);
  }
  addChartData(dailyChart, time.format('h:mm a'), stocks[selectedStockIndex].price, drawOnTick);

  if (drawOnTick) {
    drawOnMarketTicket(stocks);
  }
}

function openMarket() {
  if (marketOpen) {
    return;
  }
  marketOpen = true;
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
    setTendsForWeek();
  }
  time.add(1, 'days');
  var rand = Math.random();
  var rand2 = Math.random();
  if (rand < chanceOfBullMarket) {
    bullMarketToday = true;
    chanceOfBullMarket += 0.01
  } else if (rand2 < chanceOfBearMarket) {
    bearMarketToday = true;
    chanceOfBearMarket += 0.01
  }
  addedTime = 0;
  gameState = setInterval(stockTimer, STATE_INTERVAL_IN_MS); //setting the loop with time interval
}

function closeMarket() {
  marketOpen = false;
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
  clearInterval(gameState);
}

function resumeMarket(addedTime) {
  clearInterval(gameState);
  //setting the loop with time interval
  gameState = setInterval(stockTimer, STATE_INTERVAL_IN_MS + addedTime);
}

function sellStock(stockId, orderId, numOfShares) {
  var stock = stocks[tickerHash[stockId]];
  var newCashValue = account.cash + (stock.price * numOfShares);
  account.cash = newCashValue;
  delete portfolio[orderId];
  return true;
}

function buyStock(ticker, numberOfShares) {
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
