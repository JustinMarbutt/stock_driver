// Trend Functions

const MIN_CHANCE_OF_GAIN = .025;
const MAX_CHANCE_OF_GAIN = 1;
const MIN_TICK_CHANGE = .00005;
const MAX_TICK_CHANGE = .00027;
const CHANCE_OF_NO_CHANGE = .125;

function basicTick(price, chanceOfNoChange, minGainChance, maxGainChance, minTickChange, maxTickChange) {
  var rand = Math.random();
  if (rand < chanceOfNoChange) {
    return price;
  }
  rand = Math.random();
  var newPrice;
  var percentageLoss = getRandomArbitrary(minGainChance, maxGainChance);
  var percentChange = getRandomArbitrary(minTickChange, maxTickChange);
  if (rand > percentageLoss) {
    newPrice = price - (price * percentChange);
  } else {
    newPrice = price + (price * percentChange);
  }
  return newPrice;
}

function noTrend(price) {
  return basicTick(
    price,
    CHANCE_OF_NO_CHANGE,
    MIN_CHANCE_OF_GAIN,
    MAX_CHANCE_OF_GAIN,
    MIN_TICK_CHANGE,
    MAX_TICK_CHANGE,
  );
}

function upTrendSimple(price) {
  return basicTick(
    price,
    CHANCE_OF_NO_CHANGE,
    0.53,
    0.89,
    .00006,
    .00029,
  );
}

function buyingFrenzy(price) {
  return basicTick(
    price,
    CHANCE_OF_NO_CHANGE,
    0.53,
    0.89,
    .00016,
    .00039,
  );
}

function downTrendSimple(price) {
  return basicTick(
    price,
    CHANCE_OF_NO_CHANGE,
    0.015,
    0.47,
    .00005,
    .00035,
  );
}

function sellOff(price) {
  return basicTick(
    price,
    CHANCE_OF_NO_CHANGE,
    0.015,
    0.40,
    .00015,
    .00045,
  );
}

function popAndDrop(price, gt) {
  if (gt < 15) {
    return basicTick(
      price,
      CHANCE_OF_NO_CHANGE,
      0.83,
      1,
      .00126,
      .01339,
    );
  }
  return downTrendSimple(price);
}

function popAndRun(price, gt) {
  if (gt < 15) {
    return basicTick(
      price,
      CHANCE_OF_NO_CHANGE,
      0.83,
      1,
      .00126,
      .01339,
    );
  }
  return upTrendSimple(price);
}

function dropAndRecover(price, gt) {
  if (gt < 15) {
    return basicTick(
      price,
      CHANCE_OF_NO_CHANGE,
      0.015,
      0.40,
      .00126,
      .01339,
    );
  }
  return upTrendSimple(price);
}

function dropAndSell(price, gt) {
  if (gt < 15) {
    return basicTick(
      price,
      CHANCE_OF_NO_CHANGE,
      0.015,
      0.40,
      .00126,
      .01339,
    );
  }
  return sellOff(price);
}

function sellIntoClose(price, gt) {
  if (gt < 200) {
    return noTrend(price);
  }
  return sellOff(price);
}

function buyIntoClose(price, gt) {
  if (gt < 200) {
    return noTrend(price);
  }
  return buyingFrenzy(price);
}

var trendFuncs = [
  upTrendSimple,
  buyingFrenzy,
  downTrendSimple,
  sellOff,
  popAndDrop,
  dropAndRecover,
  sellIntoClose,
  buyIntoClose,
  upTrendSimple,
  downTrendSimple,
  popAndRun,
  dropAndSell,
  sellIntoClose,
  buyIntoClose,
]

function setTrendsForWeek() {
  var randTrends = {};
  for(var i = 0; i < 7; i++) {
    randTrends[i] = {
      priceFunc: trendFuncs[Math.round(getRandomArbitrary(0,13))],
      daysLeft: Math.round(getRandomArbitrary(0,4)),
    }
  }
  return randTrends;
}
