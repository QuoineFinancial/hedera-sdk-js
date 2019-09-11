const protobuf = require('protobufjs');
const forge = require('node-forge');
const path = require('path');
const Long = require('long');
const duration = require('./duration');
const AccountID = require('./accountId');
const { DEFAULT_TX_FEE, TRANSACTION_RESPONSE_CODE } = require('./constants');

const { ed25519 } = forge;

class Transaction {
  constructor({ operatorId, nodeAccountId }) {
    this.operatorId = new AccountID(operatorId);
    this.nodeAccountId = new AccountID(nodeAccountId);
  }

  initBody(options) {
    const transactionID = {
      accountID: this.operatorId.toObject(),
      transactionValidStart: options.transactionValidStart || duration.now(),
    };

    return {
      transactionID,
      nodeAccountID: this.nodeAccountId.toObject(),
      transactionFee: Long.fromString(options.transactionFee || DEFAULT_TX_FEE),
      transactionValidDuration: options.transactionValidDuration || duration.seconds(120),
      memo: options.memo || undefined,
    };
  }

  addSignature(signature) {
    if (!this.tx) {
      throw Error('Missing transaction body. Must create transaction before adding signature');
    }
    const sig = { ed25519: signature };
    if (!Buffer.isBuffer(signature)) sig.ed25519 = Buffer.from(signature, 'binary');

    this.tx.sigs = { sigs: [sig, sig] };
    return this;
  }

  async serialize() {
    const root = await protobuf.load(path.join(__dirname, '../hedera-proto/Transaction.proto'));
    const TransactionProto = root.lookup('proto.Transaction');
    const error = TransactionProto.verify(this.tx);
    if (error) throw Error(error);

    const message = TransactionProto.create(this.tx);
    const buffer = TransactionProto.encode(message).finish();
    return buffer.toString('hex');
  }

  static async deserialize(hex) {
    const buffer = Buffer.from(hex, 'hex');
    const root = await protobuf.load(path.join(__dirname, '../hedera-proto/Transaction.proto'));
    const TransactionProto = root.lookup('proto.Transaction');
    const tx = TransactionProto.decode(buffer);

    const error = TransactionProto.verify(tx);
    if (error) return undefined;
    return tx;
  }

  toObject() {
    return this.tx;
  }

  getTransactionId() {
    return this.tx.body.transactionID;
  }

  static async handleResponse(response) {
    if (response.nodeTransactionPrecheckCode === 0 || !response.nodeTransactionPrecheckCode) {
      return TRANSACTION_RESPONSE_CODE[0];
    }

    throw Error(TRANSACTION_RESPONSE_CODE[response.nodeTransactionPrecheckCode]);
  }

  // sign and return tx with signature
  async signTransaction(privateKey) {
    if (!this.tx) {
      throw Error('Missing transaction body. Must create transaction before adding signature');
    }

    const signature = await this.constructor.sign(this.tx.body, privateKey);
    this.addSignature(signature);
    return this;
  }

  static async serializeBody(body) {
    const root = await protobuf.load(path.join(__dirname, '../hedera-proto/TransactionBody.proto'));
    const TransactionBody = root.lookup('proto.TransactionBody');
    const error = TransactionBody.verify(body);
    if (error) throw Error(error);

    const message = TransactionBody.create(body);
    const buffer = TransactionBody.encode(message).finish();
    return buffer;
  }

  static async sign(body, privateKeyHex) {
    const message = await this.serializeBody(body);
    const encoding = 'binary';
    const privateKey = Buffer.from(forge.util.binary.hex.decode(privateKeyHex), encoding);
    const signature = ed25519.sign({ encoding, message, privateKey });
    return signature;
  }
}

module.exports = Transaction;
