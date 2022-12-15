var stockDriver = createStockDriver();

function initNewGame() {
  for (var i = 0; i < 3; i++) {
    var newStock = stockDriver.createStock(50, 420);
    newStock['tier'] = 0;
    stocks.push(newStock);
    tickerHash[newStock.ticker] = stockIndex;
    stockIndex++;
  }

  for (var i = 0; i < 3; i++) {
    var newStock = stockDriver.createStock(12, 75);
    newStock['tier'] = 1;
    stocks.push(newStock);
    tickerHash[newStock.ticker] = stockIndex;
    stockIndex++;
  }

  for (var i = 0; i < 3; i++) {
    var newStock = stockDriver.createStock(0, 10);
    newStock['tier'] = 2;
    stocks.push(newStock);
    tickerHash[newStock.ticker] = stockIndex;
    stockIndex++;
  }

  $('#time-display').text(time.format('dddd MMMM Do, h:mm a'));
  $('#buy-action-num-shares').val(10);

  time.set('hour', 9);
  time.set('minute', 30);
  time.set('month', 3);
  time.set('day', 8);
  time.set('year', 2021);
  setTendsForWeek();

  drawMarketView(stocks, '#stock-market-table');
  drawPortfolio();
  $('#stock-market-table').find('tr').first().trigger('click');
}

$(document).ready(initNewGame);
