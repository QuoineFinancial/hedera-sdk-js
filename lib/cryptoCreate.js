const Long = require('long');
const forge = require('node-forge');
const Transaction = require('./transaction');
const duration = require('./duration');

class CryptoCreate extends Transaction {
  constructor(options) {
    super(options);

    this.tx = {
      body: {
        ...this.initBody(options),
        cryptoCreateAccount: {
          key: { ed25519: Buffer.from(forge.util.hexToBytes(options.newAccountPublicKey), 'binary') },
          initialBalance: Long.fromString(options.initialBalance),
          autoRenewPeriod: duration.seconds(30 * duration.DAY_IN_SECONDS),
          // sendRecordThreshold: 9223372036854775807,
          // receiveRecordThreshold: 9223372036854775807,
        },
      },
    };
  }
}

module.exports = CryptoCreate;
