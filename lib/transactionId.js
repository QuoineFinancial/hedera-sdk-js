const path = require('path');
const Long = require('long');
const protobuf = require('protobufjs');
const AccountID = require('./accountId');

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

  static async serialize(transactionId) {
    const root = await protobuf.load(path.join(__dirname, '../hedera-proto/BasicTypes.proto'));
    const TransactionIDProto = root.lookup('proto.TransactionID');
    const serializeObj = {
      transactionValidStart: {
        seconds: Long.fromValue(transactionId.transactionValidStart.seconds),
      },
      accountID: new AccountID(transactionId.accountID).toObject(),
    };
    const error = TransactionIDProto.verify(serializeObj);
    if (error) throw Error(error);

    const message = TransactionIDProto.create(serializeObj);
    const buffer = TransactionIDProto.encode(message).finish();
    return buffer.toString('hex');
  }

  static async deserialize(hex) {
    const buffer = Buffer.from(hex, 'hex');
    const root = await protobuf.load(path.join(__dirname, '../hedera-proto/BasicTypes.proto'));
    const TransactionIDProto = root.lookup('proto.TransactionID');
    const transactionId = TransactionIDProto.decode(buffer);
    const error = TransactionIDProto.verify(transactionId);
    if (error) throw error;
    return transactionId;
  }
}

module.exports = TransactionID;
