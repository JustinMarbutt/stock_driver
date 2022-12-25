// Draw and toggle functions
import formatter from '../library/formatter';
import {
  getStockIndex,
  broadcastState
} from '../library/state';
import {
  onClickSellStock,
  onClickStockToTrade
} from './actions';

var selectedStockIndex = 0;
// Init Charts
var accountChartData = {
  labels: ['9:30 AM'],
  datasets: [{
    label: 'Account Value',
    data: [24500.00],
    borderColor: 'rgba(75, 192, 192, 0.5)',
    borderWidth: 2,
    spanGaps: true,
    fill: true,
    interaction: {
      intersect: false
    },
    radius: 0,
  }]
}

var dailyChartData = {
  labels: ['9:30 AM'],
  datasets: [{
    label: 'Stock Price',
    data: [],
    borderColor: 'rgba(75, 192, 192, 0.5)',
    borderWidth: 2,
    spanGaps: true,
    fill: false,
    interaction: {
      intersect: false
    },
    radius: 0,
  }]
}

var accountChartCtx = document.getElementById('account-chart').getContext('2d');
var accountChart = new Chart(accountChartCtx, {
  type: 'line',
  data: accountChartData,
  options: {
    responsive: true,
    animation: false,
    maintainAspectRatio: false,
    scales: {
      yAxis: {
        display: true,
        position: 'right',
        ticks: {
         beginAtZero: false
        }
      }
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Total Account Value'
      }
    }
  },
});

var dailyChartCtx = document.getElementById('daily-chart').getContext('2d');
var dailyChart = new Chart(dailyChartCtx, {
  type: 'line',
  data: dailyChartData,
  options: {
    responsive: true,
    animation: false,
    maintainAspectRatio: false,
    scales: {
      yAxis: {
        display: true,
        position: 'right',
        ticks: {
         beginAtZero: false
        }
      }
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Daily Chart'
      }
    }
  },
});

// Chart.js manipulation wrappers

function addChartData(chart, label, data, draw) {
  chart.data.labels.push(label);
  chart.data.datasets.forEach((dataset) => {
    dataset.data.push(data);
  });
  if (draw) {
    chart.update();
  }
}

function swapChartData(chart, data) {
  chart.data.datasets[0].data = data;
  chart.update();
}

function clearChartData(chart, draw) {
  chart.data.labels = [];
  chart.data.datasets[0].data = [];
  if (draw) {
    chart.update();
  }
}

function flashMessage(target, message, type) {
  var $alertNode = $('<div class="alert alert-' + type +' alert-dismissible fade show" role="alert">' +
    '<strong>' + message + '</strong>' +
    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
      '<span aria-hidden="true">&times;</span>' +
    '</button>' +
  '</div>');
  $(target).append($alertNode);
  $alertNode.alert();
  setTimeout(function() {
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

function drawLot(order, id, stock) {
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
          'Sell '+ id +
        '</button>' +
      '</td>' +
    '</tr>';
  return html;
}

function updateLot(order, id, stock) {
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
  $('.stock-display-row').on('click', onClickStockToTrade);
  $tableBody.data('drawn', true);
}

function drawPositionTradeView(stocks, position) {
  var stock = stocks[getStockIndex(position.stockId)];
  var $selectedStockPosition = $('#selected-stock-position');
  var $sellButton = $selectedStockPosition.find('.sell-stock-action');
  // re-draw position info
  $selectedStockPosition.find('.current-position-info-display').html(
    '<strong>Current Position</strong><br>' +
    'Shares: ' + position.numberOfShares + '<br>' +
    'Market Value: ' + formatter.format(parseInt(position.numberOfShares) * stock.price) + '<br>' +
    'Profit/Loss: ' + formatter.format((stock.price * position.numberOfShares) - (position.purchasePrice * position.numberOfShares)) + ' ' +
        drawPercentageChange(stock.price, position.purchasePrice) + '<br>'
  );
  // update sell button (not re-draw) so its always clickable
  $sellButton.attr('id', 'trade-sell-lot-'+ stock.ticker);
  $sellButton.data('id', stock.ticker);
  $sellButton.data('num-of-shares', position.numberOfShares);
  $sellButton.data('order-id', stock.ticker);
  $sellButton.text('Sell ' + stock.ticker);
  $('.sell-stock-action').unbind('click');
  $('.sell-stock-action').on('click', onClickSellStock);
}

function drawPortfolio(stocks, portfolio, account) {
  var selectedStock = stocks[selectedStockIndex];
  var $tableBody = $('#portfolio-table');
  var $selectedStockPosition = $('#selected-stock-position');
  $selectedStockPosition.hide();
  for (const [key, value] of Object.entries(portfolio)) {
    if (selectedStock.ticker === key) {
      $selectedStockPosition.show();
      drawPositionTradeView(stocks, value);
    }
    if ($('#lot-row-' + key).length > 0) {
      updateLot(value, key, stocks[getStockIndex(value.stockId)]);
    } else {
      $tableBody.append(drawLot(value, key, stocks[getStockIndex(value.stockId)]));
    }
  };
  $('#cash-value').text(formatter.format(account.cash));
  $('#margin-value').text(formatter.format(account.margin));
  $('#stock-value').text(formatter.format(account.portfolio));
  $('#total-value').text(formatter.format(account.cash + account.portfolio))
  $('.sell-stock-action').unbind('click').bind('click', onClickSellStock);
}

function drawSelectedStock(stockTicker, selectedStockRow) {
  broadcastState();
  $('.stock-display-row').removeClass('active');
  $(selectedStockRow).addClass('active');
  $('#buy-action-ticker').val(stockTicker);
  $('.buy-action-display').text(stockTicker)
  $('.toggle-trade-view-item').hide();
  $('#trading-view').show();
}

function drawClosedMarketView(stocks, portfolio, account) {
  drawMarketView(stocks, '#stock-market-table');
  drawPortfolio(stocks, portfolio, account);
  // ringTheBell();

  toggleClosedMarketView();
  flashMessage('#flash-messages', 'Markets Closed', 'danger');
}

function drawOnMarketTick(stocks, portfolio, account, time) {
  drawMarketView(stocks, '#stock-market-table');
  drawPortfolio(stocks, portfolio, account);
  drawCurrentTime(time);
  addChartData(accountChart, time.format('h:mm a'), account.cash + account.portfolio, true);
  addChartData(dailyChart, time.format('h:mm a'), stocks[selectedStockIndex].price, true);
  $('#is-loading').hide();
}

function drawOffMarketTick(stocks, portfolio, account, stockDailyValues) {
  drawPortfolio(stocks, portfolio, account);
  swapChartData(dailyChart, stockDailyValues[selectedStockIndex]);
}

function saveMarketTick(stocks, portfolio, account, time) {
  addChartData(accountChart, time.format('h:mm a'), account.cash + account.portfolio, false);
  addChartData(dailyChart, time.format('h:mm a'), stocks[selectedStockIndex].price, false);
}

function drawCurrentTime(time) {
  $('#time-display').text(time.format('dddd MMMM Do, h:mm a'));
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
  clearChartData(dailyChart);
  $('#open-market').hide();
  $('#pause-market').show();
  $('#close-market').show();
  $('.resume-market').show();
  // ringTheBell();
}

function toggleResumedMarketView() {
  $('#pause-market').show();
  $('#close-market').show();
}

function removeStockFromPortfolioView(id) {
  $('#lot-row-' + id).remove();
}

function drawFirstGameState(stocks, portfolio, account, time) {
  drawOnMarketTick(stocks, portfolio, account, time);
  $('#stock-market-table').find('tr').first().trigger('click');
  $('#buy-action-num-shares').val(10);
}

function setSelectedStockIndex(i) {
  selectedStockIndex = i;
}

export {
  removeStockFromPortfolioView,
  drawSelectedStock,
  drawOnMarketTick,
  drawOffMarketTick,
  saveMarketTick,
  drawClosedMarketView,
  drawFirstGameState,
  togglePausedMarketView,
  toggleOpenMarketView,
  toggleResumedMarketView,
  toggleTradeView,
  setSelectedStockIndex,
  flashMessage
}
