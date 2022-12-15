// Helper functions

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function getFirstLetters(str) {
  const firstLetters = str
    .split(' ')
    .map(word => word[0])
    .join('');

  return firstLetters;
}

function defineSeededRandom(a) {
	
  // the initial seed
  Math.seed = a;
  
  // in order to work 'Math.seed' must NOT be undefined,
  // so in any case, you HAVE to provide a Math.seed
  return function(max, min) {
      max = max || 1;
      min = min || 0;
  
      Math.seed = (Math.seed * 9301 + 49297) % 233280;
      var rnd = Math.seed / 233280;
  
      return min + rnd * (max - min);
  }
}

var formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

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

function ringTheBell() {
  // closingBell.play();
  // setTimeout(() => closingBell2.play(), 250);
  // setTimeout(() => closingBell3.play(), 500);
}
