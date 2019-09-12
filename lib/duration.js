const nano = require('nano-seconds');

const DAY_IN_SECONDS = 24 * 60 * 60;

function now() {
  const [s, ns] = nano.now();
  return {
    seconds: s,
    nanos: ns,
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
