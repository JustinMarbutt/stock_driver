// Data generators for company names and stock prices

var firstWords = [
  'Averley',
  'Brown',
  'Cooks',
  'Denver',
  'Electronic',
  'Fabio',
  'Greyrock',
  'Hemmet',
  'Mark\'s',
  'New Haven',
  'Tip Top',
  'Good Vibes',
  'Reno',
  'Cybernine',
  'Blockchain',
  'Wolf'
];
var secondWords = [
  'Accounting',
  'Bank',
  'Computers',
  'Dynamics',
  'Engineering',
  'Financial',
  'Global',
  'Hotels',
  'International',
  'Sciences',
  'Capital Fund',
  'Airlines',
  'Retail Stores',
  'World Wide'
];

function getFirstLetters(str) {
  const firstLetters = str
    .split(' ')
    .map(word => word[0])
    .join('');

  return firstLetters;
}

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

function createFakeMarket() {
  var seed = getRandomArbitrary(0, 1000);
  var rng = defineSeededRandom(seed);

  drawSeedValue(seed);

  return {
    createStock: function(min, max) {
      var company = makeCompany(rng, min, max);
      return company;
    }
  };
}
