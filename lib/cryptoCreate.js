const Long = require('long');
const forge = require('node-forge');
const Transaction = require('./transaction');
const duration = require('./duration');
const { DEFAULT_RENEW_SECONDS } = require('./constants');

class CryptoCreate extends Transaction {
  constructor(options) {
    super(options);

    this.txBody = {
      ...this.initBody(options),
      cryptoCreateAccount: {
        key: { ed25519: Buffer.from(forge.util.hexToBytes(options.newAccountPublicKey), 'binary') },
        initialBalance: Long.fromString(options.initialBalance),
        autoRenewPeriod: duration.seconds(DEFAULT_RENEW_SECONDS),
        sendRecordThreshold: Number.MAX_SAFE_INTEGER,
        receiveRecordThreshold: Number.MAX_SAFE_INTEGER,
      },
    };

    this.buildBody();
  }
}

module.exports = CryptoCreate;
