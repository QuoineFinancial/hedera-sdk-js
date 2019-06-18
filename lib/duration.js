const nano = require('nano-seconds');

const DAY_IN_SECONDS = 24 * 60 * 60;

function now() {
  const ns = nano.now();
  const secondsInDeci = parseInt(nano.toString(ns), 10) / 1000000000;
  const splitSeconds = secondsInDeci.toString().split('.');
  const s = parseInt(splitSeconds[0], 10);
  return {
    seconds: s,
  };
}


function seconds(s) {
  return {
    seconds: s,
  };
}

module.exports = {
  now,
  seconds,
  DAY_IN_SECONDS,
};
