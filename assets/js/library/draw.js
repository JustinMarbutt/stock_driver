// Draw functions

function flashMessage(target, message, type) {
  var $alertNode = $('<div class="alert alert-' + type +' alert-dismissible fade show" role="alert">' +
    '<strong>' + message + '</strong>' +
    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
      '<span aria-hidden="true">&times;</span>' +
    '</button>' +
  '</div>');
  $(target).append($alertNode);
  $alertNode.alert();
  setTimeout(() => {
    $alertNode.alert('close');
    $alertNode.alert('dispose');
  }, 1100);
}

function drawPercentageChange(numerator, denominator) {
  var percentageChange = ((numerator/denominator * 100) - 100).toFixed(2)
  var cssClass = 'text-muted';
  if (percentageChange > 0) {
    cssClass = 'text-success percentage-up';
  } else if (percentageChange < 0) {
    cssClass = 'text-danger percentage-down';
  }
  var html = '<span class="percentage-diff-display ' + cssClass + '">&nbsp;' + percentageChange + '%</span>';
  return html;
}

function drawTicker(stock, index) {
  var html =
    '<tr class="stock-display-row" data-stock="' + stock.ticker + '" data-row-index="' + index + '" id="stock-row-' + stock.ticker + '">' +
      '<td class="stock-name">' + stock.name + '</td>' +
      '<td class="stock-ticker">' + stock.ticker + '</td>' +
      '<td class="text-right stock-price">' +
        stock.displayPrice() + ' ' +
      '</td>' +
      '<td class="text-right stock-percent-change">' +
        drawPercentageChange(stock.price, stock.open) +
      '</td>' +
      // '<td class="text-right">' + stock.displayOpen() + '</td>' +
      // '<td class="text-right">' + stock.displayClose() + '</td>' +
    '</tr>';
  return html;
}

function updateTicker(stock, $table) {
  var $row = $table.find('#stock-row-' + stock.ticker);
  $row.find('.stock-price').text(stock.displayPrice());
  $row.find('.stock-percent-change').html(drawPercentageChange(stock.price, stock.open));
}

function drawLot(order, id) {
  var stock = stocks[tickerHash[order.stockId]]
  var html =
    '<tr id="lot-row-'+ id +'">' +
      '<td>' + stock.ticker + '</td>' +
      '<td class="text-right lot-price-display">' +
        stock.displayPrice() + ' ' +
      '</td>' +
      '<td class="text-right lot-purchase-display">' +
        order.displayPurchasePrice() +
      '</td>' +
      '<td class="text-right lot-pnl-display">' +
        formatter.format((stock.price * order.numberOfShares) - (order.purchasePrice * order.numberOfShares)) + ' ' +
        drawPercentageChange(stock.price, order.purchasePrice) +
      '</td>' +
      '<td class="text-right lot-num-shares-display">' + order.numberOfShares + '</td>' +
      '<td class="text-right lot-market-value-display">' + formatter.format(order.numberOfShares * stock.price) + '</td>' +
      '<td class="text-right">' +
        '<button type="button" class="btn btn-primary sell-stock-action" ' +
          'id="lot-'+ id +'" ' +
          'data-id="' + order.stockId +'" data-num-of-shares="' + order.numberOfShares + '" data-order-id="' + id + '">' +
          'Sell Lot '+ id +
        '</button>' +
      '</td>' +
    '</tr>';
  return html;
}

function updateLot(order, id) {
  var stock = stocks[tickerHash[order.stockId]];
  var $lotRow = $('#lot-row-' + id);
  $lotRow.find('.lot-price-display').text(stock.displayPrice());
  $lotRow.find('.lot-pnl-display').html(
    formatter.format((stock.price * order.numberOfShares) - (order.purchasePrice * order.numberOfShares)) + ' ' +
    drawPercentageChange(stock.price, order.purchasePrice)
  );
  $lotRow.find('.lot-num-shares-display').text(order.numberOfShares);
  $lotRow.find('.lot-market-value-display').text(formatter.format(order.numberOfShares * stock.price));
  $lotRow.find('#lot-' + id).attr('data-num-of-shares', order.numberOfShares);
}

function drawMarketView(stocks, id) {
  var $tableBody = $(id);
  if ($tableBody.data('drawn')) {
    return stocks.forEach(function(stock){
      updateTicker(stock, $tableBody);
    });
  }
  $tableBody.html('');
  stocks.forEach(function(stock, i){
    $tableBody.append(drawTicker(stock, i));
  });
  $('.stock-display-row').on('click', selectStockToTrade);
  $tableBody.data('drawn', true);
}

function drawPortfolio() {
  var $tableBody = $('#portfolio-table');
  for (const [key, value] of Object.entries(portfolio)) {
    if ($('#lot-row-' + key).length > 0) {
      updateLot(value, key);
    } else {
      $tableBody.append(drawLot(value, key));
    }
  };
  $('#cash-value').text(formatter.format(account.cash));
  $('#margin-value').text(formatter.format(account.margin));
  $('#stock-value').text(formatter.format(account.portfolio));
  $('#total-value').text(formatter.format(account.cash + account.portfolio))
  $('.sell-stock-action').unbind('click').bind('click', sellStockAction);
}

function togglePausedMarketView() {
  $('#pause-market').hide();
  $('.resume-market').show();
}

function toggleTradeView(target) {
  $('.toggle-trade-view-item').hide();
  $(target).show();
}

function toggleClosedMarketView() {
  $('#pause-market').hide();
  $('#close-market').hide();
  $('.resume-market').hide();
  $('#open-market').show();
  $('#is-loading').hide();
}

function toggleOpenMarketView() {
  $('#open-market').hide();
  $('#pause-market').show();
  $('#close-market').show();
  $('.resume-market').show();
}

function toggleResumedMarketView () {
  $('#pause-market').show();
  $('#close-market').show();
}