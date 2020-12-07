const protobuf = require('protobufjs');
const forge = require('node-forge');
const path = require('path');
const Long = require('long');
const duration = require('./duration');
const AccountID = require('./accountId');
const { SignedTransactionProto, TransactionBodyProto } = require('./protoHelper');
const { DEFAULT_TX_FEE, TRANSACTION_RESPONSE_CODE } = require('./constants');

const { ed25519 } = forge;
const txRoot = protobuf.loadSync(path.join(__dirname, '../hedera-proto/Transaction.proto'));

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

  buildBody() {
    this.tx = {
      signedTransactionBytes: SignedTransactionProto.serialize({
        bodyBytes: TransactionBodyProto.serialize(this.txBody),
        sigMap: { sigPair: [] },
      }),
    };
  }

  serialize() {
    const TransactionProto = txRoot.lookup('proto.Transaction');
    const error = TransactionProto.verify(this.tx);
    if (error) throw Error(error);

    const message = TransactionProto.create(this.tx);
    const buffer = TransactionProto.encode(message).finish();
    return buffer.toString('hex');
  }

  static deserialize(hex) {
    let signed;
    let body;
    const buffer = Buffer.from(hex, 'hex');
    const TransactionProto = txRoot.lookup('proto.Transaction');
    const tx = TransactionProto.decode(buffer);

    const error = TransactionProto.verify(tx);
    if (error) return undefined;

    if (tx.signedTransactionBytes) {
      signed = SignedTransactionProto.deserialize(tx.signedTransactionBytes);
    }

    if (signed.bodyBytes) {
      body = TransactionBodyProto.deserialize(signed.bodyBytes);
    }

    return body;
  }

  toObject() {
    return this.tx;
  }

  getTransactionId() {
    return this.txBody.transactionID;
  }

  static async handleResponse(response) {
    if (response.nodeTransactionPrecheckCode === 0 || !response.nodeTransactionPrecheckCode) {
      return TRANSACTION_RESPONSE_CODE[0];
    }

    throw Error(TRANSACTION_RESPONSE_CODE[response.nodeTransactionPrecheckCode]);
  }

  addSignature(signature, publicKey) {
    if (!this.txBody) {
      throw Error('Missing transaction body. Must create transaction before adding signature');
    }

    const encoding = 'binary';
    const sig = {
      pubKeyPrefix: Buffer.from(forge.util.binary.hex.decode(publicKey), encoding),
      ed25519: signature,
    };
    if (!Buffer.isBuffer(signature)) sig.ed25519 = Buffer.from(signature, 'binary');

    const signedTransactionBytes = SignedTransactionProto.serialize({
      bodyBytes: TransactionBodyProto.serialize(this.txBody),
      sigMap: { sigPair: [sig] },
    });
    this.tx = { signedTransactionBytes };
    return this;
  }

  // sign and return tx with signature
  async signTransaction(privateKey, publicKey) {
    if (!this.txBody) {
      throw Error('Missing transaction body. Must create transaction before adding signature');
    }

    const signature = await this.constructor.sign(this.txBody, privateKey);
    this.addSignature(signature, publicKey);
    return this;
  }

  static sign(body, privateKeyHex) {
    const message = TransactionBodyProto.serialize(body);
    const encoding = 'binary';
    const privateKey = Buffer.from(forge.util.binary.hex.decode(privateKeyHex), encoding);
    const signature = ed25519.sign({ encoding, message, privateKey });
    return signature;
  }
}

module.exports = Transaction;
