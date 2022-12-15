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
    return closeMarket();
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
    addData(accountChart, time.format('h:mm a'), account.cash + account.portfolio, drawOnTick);
  }
  addData(dailyChart, time.format('h:mm a'), stocks[selectedStockIndex].price, drawOnTick);

  if (drawOnTick) {
    drawMarketView(stocks, '#stock-market-table');
    drawPortfolio();
    $('#is-loading').hide();
  }
}

function ringTheBell() {
  // closingBell.play();
  // setTimeout(() => closingBell2.play(), 250);
  // setTimeout(() => closingBell3.play(), 500);
}

function openMarket() {
  if (marketOpen) return onClickCloseMarket();
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
  clearChartData(dailyChart);
  ringTheBell();
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

  toggleOpenMarketView();
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
  drawMarketView(stocks, '#stock-market-table');
  drawPortfolio();
  ringTheBell();

  toggleClosedMarketView();
  flashMessage('#flash-messages', 'Markets Have Closed!', 'danger');
}

function pauseMarket() {
  clearInterval(gameState);
  togglePausedMarketView();
}

function resumeMarket() {
  clearInterval(gameState);
  addedTime = parseInt($(this).data('ms'));
  //setting the loop with time interval
  gameState = setInterval(stockTimer, STATE_INTERVAL_IN_MS + addedTime);

  toggleResumedMarketView();
}
