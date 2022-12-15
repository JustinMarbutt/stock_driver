// Binding functions to dom

function buyStockAction() {
  if (!marketOpen) {
    return flashMessage('#flash-messages', 'Market Closed!', 'warning');
  }
  $('#is-loading').show();
  var ticker = $('#buy-action-ticker').val();
  var numberOfShares = $('#buy-action-num-shares').val();
  var stock = stocks[tickerHash[ticker]];
  var newCashValue = account.cash - (stock.price * numberOfShares);
  if ((newCashValue + account.margin) < 0) {
    $('#is-loading').hide();
    // if (rejectAlert.paused) {
    //   rejectAlert.play();
    // } else {
    //   rejectAlert.currentTime = 0;
    // }
    return flashMessage('#flash-messages', 'Order Rejected!', 'danger');
  }
  if (newCashValue < 0) {
    account.cash = 0;
    account.margin = account.margin + newCashValue;
  } else {
    account.cash = newCashValue;
  }

  if (portfolio[ticker]){
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

  flashMessage('#flash-messages', 'Order Accepted!', 'success');
  // if (successDing.paused) {
  //   successDing.play();
  // } else {
  //   successDing.currentTime = 0;
  // }
}

function sellStockAction() {
  if (!marketOpen) {
    return flashMessage('#flash-messages', 'Market Closed!', 'warning');
  }
  $('#is-loading').show();
  var id = $(this).data('id');
  var orderId = $(this).data('order-id')
  var shares = parseInt($(this).data('numOfShares'));
  var stock = stocks[tickerHash[id]];
  var newCashValue = account.cash + (stock.price * shares);
  account.cash = newCashValue;
  delete portfolio[orderId];
  $('#lot-row-' + id).remove();
  flashMessage('#flash-messages', 'Order Accepted!', 'success');
  // if (successDing.paused) {
  //   successDing.play();
  // } else {
  //   successDing.currentTime = 0;
  // }
}

function keySellStockAction(id) {
  return function() {
    console.log($(id));
    sellStockAction.call($(id));
  }
}

function onClickCloseMarket() {
  $('#is-loading').show();
  pauseMarket();
  while (gameTime < LENGTH_OF_TRADING_DAY_INTERVALS - 1) {
    stockTimer(false);
  }
  resumeMarket();
}

function toggleTradeView() {
  $('.toggle-trade-view-item').hide();
  $($(this).data('target')).show();
}

function selectStockToTrade() {
  $('.stock-display-row').removeClass('active');
  $(this).addClass('active');
  $('#buy-action-ticker').val($(this).data('stock'));
  $('.buy-action-display').text($(this).data('stock'))
  $('.toggle-trade-view-item').hide();
  $('#trading-view').show();
  selectedStockIndex = parseInt($(this).data('row-index'));
  swapChartData(dailyChart, stockDailyValues[selectedStockIndex]);
}

$('#open-market').on('click', openMarket);
$('#close-market').on('click', onClickCloseMarket);
$('#pause-market').on('click', pauseMarket);
$('.resume-market').on('click', resumeMarket);
$('#buy-stock-action').on('click', buyStockAction);
$('.toggle-trade-view').on('click', toggleTradeView);
