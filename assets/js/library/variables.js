// Constants
const LENGTH_OF_TRADING_DAY_INTERVALS = 389;
const STATE_INTERVAL_IN_MS = 1000;
const MIN_CHANCE_OF_GAIN = .025;
const MAX_CHANCE_OF_GAIN = 1;
const MIN_TICK_CHANGE = .00005;
const MAX_TICK_CHANGE = .00027;
const CHANCE_OF_NO_CHANGE = .125;

// Variables
var closingBell = new Audio('assets/audio/closing_bell.wav');
var closingBell2 = new Audio('assets/audio/closing_bell.wav');
var closingBell3 = new Audio('assets/audio/closing_bell.wav');
var successDing = new Audio('assets/audio/success.wav');
var rejectAlert = new Audio('assets/audio/rejected.wav');

var tickerHash = {};
var portfolio = {}//Array(9);
var account = {
  cash: 24500.00,
  margin: 0.00,
  portfolio: 0.00,
}

var trends = {};
var stockDailyValues = [[],[],[],[],[],[],[],[],[]];
var selectedStockIndex = 0;
var stocks = [];

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
