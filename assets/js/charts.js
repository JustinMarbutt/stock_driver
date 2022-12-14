// Init Charts
var data = {
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

var dailyData = {
  labels: ['9:30 AM'],
  datasets: [{
    label: 'Stock Price',
    data: [stocks[0].price],
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

var ctx = document.getElementById('account-chart').getContext('2d');
var accountChart = new Chart(ctx, {
  type: 'line',
  data: data,
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

var ctx = document.getElementById('daily-chart').getContext('2d');
var dailyChart = new Chart(ctx, {
  type: 'line',
  data: dailyData,
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

function addData(chart, label, data, draw) {
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