const Decimal = require('decimal.js');
const AccountID = require('./accountId');
const Transaction = require('./transaction');

class CryptoTransfer extends Transaction {
  constructor(options) {
    super(options);

    const accountAmounts = options.destinations.reduce((acc, { accountId, amount }) => {
      acc.push({
        accountID: this.operatorId.toObject(),
        amount: new Decimal(amount).times(-1).toNumber(),
      });
      acc.push({
        accountID: new AccountID(accountId).toObject(),
        amount: new Decimal(amount).toNumber(),
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
