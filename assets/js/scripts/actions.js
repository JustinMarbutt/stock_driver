// Binding functions to dom

function onClickBuyStock() {
  if (!marketOpen) {
    return flashMessage('#flash-messages', 'Market Closed!', 'warning');
  } else if (marketPaused) {
    return flashMessage('#flash-messages', 'Market Paused!', 'warning');
  }

  var ticker = $('#buy-action-ticker').val();
  var numberOfShares = $('#buy-action-num-shares').val();

  $('#is-loading').show();
  var orderRes = buyStock(ticker, numberOfShares);
  // Let drawOnMarketTick clear loading for now
  // to prevent more than one order per tick
  // $('#is-loading').hide();
  if (orderRes) {
    playSuccessSound();
    flashMessage('#flash-messages', 'Order Accepted!', 'success');
  } else {
    $('#is-loading').hide();
    playRejectSound();
    return flashMessage('#flash-messages', 'Order Rejected!', 'danger');
  }
}

function onClickSellStock() {
  if (!marketOpen) {
    return flashMessage('#flash-messages', 'Market Closed!', 'warning');
  } else if (marketPaused) {
    return flashMessage('#flash-messages', 'Market Paused!', 'warning');
  }

  var id = $(this).data('id');
  var orderId = $(this).data('order-id')
  var shares = parseInt($(this).data('numOfShares'));

  $('#is-loading').show();
  var orderRes = sellStock(id, orderId, shares);
  // Let drawOnMarketTick clear loading for now
  // to prevent more than one order per tick
  // $('#is-loading').hide();
  if (orderRes) {
    removeStockFromPortfolioView(id);
    playSuccessSound();
    flashMessage('#flash-messages', 'Order Accepted!', 'success');
  } else {
    playRejectSound();
    flashMessage('#flash-messages', 'Order Rejected!', 'danger');
  }
}

function onClickStockToTrade() {
  var stockTicker = $(this).data('stock');
  var selectedStockRow = this;
  var selectedIndex = parseInt($(this).data('row-index'));
  // set global var for state machine refrence
  selectedStockIndex = selectedIndex;
  drawSelectedStock(stockTicker, selectedStockRow, selectedIndex);
}

function onClickCloseMarket() {
  $('#is-loading').show();
  pauseMarket();
  while (gameTime < LENGTH_OF_TRADING_DAY_INTERVALS - 1) {
    marketTick(false);
  }
  resumeMarket(-800);
}

function onClickPauseMarket() {
  pauseMarket();
  togglePausedMarketView();
}

function onClickToggleTradeView() {
  var target = $(this).data('target');
  toggleTradeView(target);
}

function onClickOpenMarket() {
  openMarket();
  toggleOpenMarketView();
}

function onClickResumeMarket() {
  addedTime = $(this).data('ms');
  resumeMarket(addedTime);
  toggleResumedMarketView();
}

$('#buy-stock-action').on('click', onClickBuyStock);
$('#open-market').on('click', onClickOpenMarket);
$('#close-market').on('click', onClickCloseMarket);
$('#pause-market').on('click', onClickPauseMarket);
$('.resume-market').on('click', onClickResumeMarket);
$('.toggle-trade-view').on('click', onClickToggleTradeView);
