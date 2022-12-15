// Data generators

function makeName() {
  var fistIndex = Math.floor(Math.random()*firstWords.length);
  var secondIndex = Math.floor(Math.random()*secondWords.length);
  var firstWord = firstWords[fistIndex];
  var secondWord = secondWords[secondIndex];
  firstWords = firstWords.filter(function(item) {
      return item !== firstWord;
  });
  secondWords = secondWords.filter(function(item) {
      return item !== secondWord;
  });
  return firstWord + ' ' + secondWord;
}

function makeCompany(rng, min, max) {
  var price = rng(min, max);
  var name = makeName();
  var ticker = getFirstLetters(name);
  var open = price;
  return {
    name: name,
    ticker: ticker,
    price: price,
    open: open,
    close: null,
    displayPrice: function() {
      return formatter.format(this.price)
    },
    displayOpen: function() {
      return formatter.format(this.open)
    },
    displayClose: function() {
      if (this.close) {
        return formatter.format(this.close);
      }
      return '-';
    }
  }
}

function createStockDriver() {
  var seed = getRandomArbitrary(0, 1000);
  $('#seed-result').text(seed);
  var rng = defineSeededRandom(seed);

  return {
    createStock: function(min, max) {
      var company = makeCompany(rng, min, max);
      return company;
    }
  };
}
