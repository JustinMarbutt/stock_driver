var stockDriver = createStockDriver();

// Default funciton for creating a new game
function initNewGame() {
  // create 3 unique teir 0 stocks with high prices and low vol
  for (var i = 0; i < 3; i++) {
    var newStock = stockDriver.createStock(50, 420);
    newStock['tier'] = 0;
    stocks.push(newStock);
    tickerHash[newStock.ticker] = stockIndex;
    stockIndex++;
  }

  // create 3 unique tier 1 stocks with medium prices and vol
  for (var i = 0; i < 3; i++) {
    var newStock = stockDriver.createStock(12, 75);
    newStock['tier'] = 1;
    stocks.push(newStock);
    tickerHash[newStock.ticker] = stockIndex;
    stockIndex++;
  }

  // create 3 unique tier 2 stocks with low price and high vol
  for (var i = 0; i < 3; i++) {
    var newStock = stockDriver.createStock(0, 10);
    newStock['tier'] = 2;
    stocks.push(newStock);
    tickerHash[newStock.ticker] = stockIndex;
    stockIndex++;
  }

  // set beggining game time display and default buy order to 10 shares
  time.set('hour', 9);
  time.set('minute', 30);
  time.set('month', 3);
  time.set('day', 8);
  time.set('year', 2021);
  $('#time-display').text(time.format('dddd MMMM Do, h:mm a'));
  $('#buy-action-num-shares').val(10);

  // set the trends for the first week
  setTendsForWeek();

  // draw the market and portfolio
  drawMarketView(stocks, '#stock-market-table');
  drawPortfolio();

  // select the first stock to trade by default
  $('#stock-market-table').find('tr').first().trigger('click');
}

$(document).ready(initNewGame);
