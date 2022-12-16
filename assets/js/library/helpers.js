// Helper functions

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
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

function ringTheBell() {
  // closingBell.play();
  // setTimeout(() => closingBell2.play(), 250);
  // setTimeout(() => closingBell3.play(), 500);
}

function playSuccessSound() {
  if (successDing.paused) {
    successDing.play();
  } else {
    successDing.currentTime = 0;
  }
}

function playRejectSound() {
  if (rejectAlert.paused) {
    rejectAlert.play();
  } else {
    rejectAlert.currentTime = 0;
  }
}
