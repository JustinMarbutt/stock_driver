// Trend Functions

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

function setTendsForWeek() {
  trends = {};
  for(var i = 0; i < 7; i++) {
    trends[i] = {
      priceFunc: trendFuncs[Math.round(getRandomArbitrary(0,13))],
      daysLeft: Math.round(getRandomArbitrary(0,4)),
    }
  }
}

function setBearTrendsForWeek() {
  trends = {};
  for(var i = 0; i < 7; i++) {
    trends[i] = {
      priceFunc: trendFuncs[Math.round(getRandomArbitrary(0,14))],
      daysLeft: Math.round(getRandomArbitrary(0,5)),
    }
  }
}

function setBullTendsForWeek() {
  trends = {};
  for(var i = 0; i < 7; i++) {
    trends[i] = {
      priceFunc: trendFuncs[Math.round(getRandomArbitrary(0,14))],
      daysLeft: Math.round(getRandomArbitrary(0,5)),
    }
  }
}