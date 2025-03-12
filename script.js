const errorTolerance = 0.1;

const isLetter = (b) => {
  return b.match("^[a-zA-Z]+$");
};

const calculateFrequency = (sentence) => {
  let letterCount = 0;

  let frequency = {};
  for (let i = 0; i < sentence.length; i++) {
    let letter = sentence[i].toUpperCase();
    if (isLetter(letter)) {
      if (frequency[letter] === undefined) {
        frequency[letter] = 1;
      } else {
        frequency[letter]++;
      }
      letterCount++;
    }
  }

  for (let letter of Object.keys(frequency)) {
    frequency[letter] = (frequency[letter] / letterCount) * 100;
  }

  return frequency;
};

const mustBeHundredPercent = (frequency) => {
  console.log("frequency", frequency);
  let sum = 0;
  for (let letter of Object.keys(frequency)) {
    sum += frequency[letter];
  }
  return sum <= 100 + errorTolerance && sum >= 100 - errorTolerance;
};

// Test cases

console.log(mustBeHundredPercent(calculateFrequency("Dies ist ein Satz")));
// Expected: true

console.log(mustBeHundredPercent(calculateFrequency("!,._-[](')")));
// Expected: true

console.log(
  mustBeHundredPercent(calculateFrequency("Köln ist eine schöne Stadt"))
);
// Expected: true

console.log(mustBeHundredPercent(calculateFrequency(["a", "b"])));
// Expected: true

console.log(
  mustBeHundredPercent(calculateFrequency("Ungueltige Eingabedaten"))
);
// Expected: true

console.log(mustBeHundredPercent(""));
// Expected: false
