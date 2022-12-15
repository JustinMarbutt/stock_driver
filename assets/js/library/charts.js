// Chart.js manipulation wrappers

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
