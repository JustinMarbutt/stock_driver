// Binding functions to dom
import {
  isMarketOpen,
  isMarketPaused,
  sellStock,
  buyStock,
  skipToMarketClose,
  openMarket,
  pauseMarket,
  resumeMarket,
  setAddedTime
} from "../library/state";
import {
  removeStockFromPortfolioView,
  drawSelectedStock,
  togglePausedMarketView,
  toggleOpenMarketView,
  toggleResumedMarketView,
  toggleTradeView,
  setSelectedStockIndex,
  flashMessage
} from "./draw";

function onClickBuyStock() {
  if (!isMarketOpen()) {
    return flashMessage('#flash-messages', 'Market Closed!', 'warning');
  } else if (isMarketPaused()) {
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
    // playSuccessSound();
    flashMessage('#flash-messages', 'Order Accepted!', 'success');
  } else {
    $('#is-loading').hide();
    // playRejectSound();
    return flashMessage('#flash-messages', 'Order Rejected!', 'danger');
  }
}

function onClickSellStock() {
  if (!isMarketOpen()) {
    return flashMessage('#flash-messages', 'Market Closed!', 'warning');
  } else if (isMarketPaused()) {
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
    // playSuccessSound();
    flashMessage('#flash-messages', 'Order Accepted!', 'success');
  } else {
    // playRejectSound();
    flashMessage('#flash-messages', 'Order Rejected!', 'danger');
  }
}

function onClickStockToTrade() {
  var stockTicker = $(this).data('stock');
  var selectedStockRow = this;
  var selectedIndex = parseInt($(this).data('row-index'));
  // set global var for state machine refrence
  setSelectedStockIndex(selectedIndex);
  drawSelectedStock(stockTicker, selectedStockRow);
}

function onClickCloseMarket() {
  $('#is-loading').show();
  skipToMarketClose();
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
  var t = $(this).data('ms');
  setAddedTime(t);
  resumeMarket(t);
  toggleResumedMarketView();
}

function registerActions() {
  $('#buy-stock-action').on('click', onClickBuyStock);
  $('#open-market').on('click', onClickOpenMarket);
  $('#close-market').on('click', onClickCloseMarket);
  $('#pause-market').on('click', onClickPauseMarket);
  $('.resume-market').on('click', onClickResumeMarket);
  $('.toggle-trade-view').on('click', onClickToggleTradeView);
}

export { registerActions, onClickSellStock, onClickStockToTrade }
