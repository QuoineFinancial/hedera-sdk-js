const Long = require('long');
const Decimal = require('decimal.js');
const AccountID = require('./accountId');
const Transaction = require('./transaction');

class CryptoTransfer extends Transaction {
  constructor(options) {
    super(options);

    const accountAmounts = options.destinations.reduce((acc, { accountId, amount }) => {
      acc.push({
        accountID: this.operatorId.toObject(),
        amount: Long.fromString(new Decimal(amount).times(-1).toFixed()),
      });
      acc.push({
        accountID: new AccountID(accountId).toObject(),
        amount: Long.fromString(new Decimal(amount).toFixed()),
      });
      return acc;
    }, []);

    this.tx = {
      body: {
        ...this.initBody(options),
        cryptoTransfer: {
          transfers: { accountAmounts },
        },
      },
    };

    return this;
  }
}

module.exports = CryptoTransfer;
