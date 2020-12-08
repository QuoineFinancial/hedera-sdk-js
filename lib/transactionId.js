const Long = require('long');
const AccountID = require('./accountId');
const { TransactionIDProto } = require('./protoHelper');

class TransactionID {
  constructor(obj) {
    if (!obj || !obj.accountID || !obj.transactionValidStart) {
      throw Error('Invalid transactionID');
    }

    if (!obj.transactionValidStart.seconds) {
      throw Error('Invalid transactionID');
    }

    const { seconds } = obj.transactionValidStart;
    this.accountID = new AccountID(obj.accountID);
    this.transactionValidStart = {
      seconds: Long.isLong(seconds) ? Number(seconds.toString()) : Number(seconds),
    };
  }

  toObject() {
    return {
      transactionValidStart: this.transactionValidStart,
      accountID: this.accountID.toString(),
    };
  }

  static parseString(str) {
    const [accountId, seconds, nanos] = str.split('-');
    if (!accountId || !seconds || !nanos) throw Error('Invalid transactionID string');

    const transactionValidStart = {
      seconds: Long.fromString(seconds),
    };

    if (Number(nanos) !== 0) {
      transactionValidStart.nanos = Long.fromString(nanos);
    }

    return {
      transactionValidStart,
      accountID: new AccountID(accountId).toObject(),
    };
  }

  static serialize(transactionId) {
    const serializeObj = {
      transactionValidStart: {
        seconds: Long.fromValue(transactionId.transactionValidStart.seconds),
      },
      accountID: new AccountID(transactionId.accountID).toObject(),
    };

    return TransactionIDProto.serialize(serializeObj).toString('hex');
  }

  static deserialize(hex) {
    return TransactionIDProto.deserialize(hex);
  }
}

module.exports = TransactionID;
