const protobuf = require('protobufjs');
const path = require('path');
const Long = require('long');
const CryptoTransfer = require('./cryptoTransfer');
const AccountID = require('./accountId');
const TransactionID = require('./transactionId');
const { DEFAULT_QUERY_FEE, TRANSACTION_RESPONSE_CODE } = require('./constants');

class Query {
  constructor({ nodeAccountId, operatorId }) {
    this.ResponseType = {
      ANSWER_ONLY: 0, // Response returns answer
      ANSWER_STATE_PROOF: 1, // Response returns both answer and state proof
      COST_ANSWER: 2, // Response returns the cost of answer
      COST_ANSWER_STATE_PROOF: 3,
    };
    this.payment = new CryptoTransfer({
      nodeAccountId,
      operatorId,
      destinations: [{
        accountId: nodeAccountId,
        amount: DEFAULT_QUERY_FEE,
      }],
    });
  }

  async serialize() {
    const root = await protobuf.load(path.join(__dirname, '../hedera-proto/Query.proto'));
    const QueryProto = root.lookup('proto.Query');
    const queryObj = this.toObject();
    const error = QueryProto.verify(queryObj);
    if (error) throw Error(error);

    const message = QueryProto.create(queryObj);
    const buffer = QueryProto.encode(message).finish();
    return buffer.toString('hex');
  }

  static async deserialize(hex) {
    const buffer = Buffer.from(hex, 'hex');
    const root = await protobuf.load(path.join(__dirname, '../hedera-proto/Query.proto'));
    const QueryProto = root.lookup('proto.Query');
    const query = QueryProto.decode(buffer);

    const error = QueryProto.verify(query);
    if (error) return undefined;
    return query;
  }

  static handleResponse(response) {
    const res = this.convertToObject(response);
    if (res.header.nodeTransactionPrecheckCode !== TRANSACTION_RESPONSE_CODE[0]) {
      throw Error(res.header.nodeTransactionPrecheckCode);
    }

    return res;
  }

  static convertToObject(response) {
    const res = response;
    Object.keys(response).forEach((key) => {
      if (response[key] instanceof Long) {
        res[key] = response[key].toString();
        return;
      }

      if (key === 'accountID' || key === 'nodeAccountID') {
        res[key] = new AccountID(response[key]).toString();
      }

      if (key === 'transactionID') {
        res[key] = new TransactionID(response[key]).toObject();
      }

      if (key === 'header') {
        const code = res[key].nodeTransactionPrecheckCode;
        res[key].nodeTransactionPrecheckCode = TRANSACTION_RESPONSE_CODE[code || 0];
        res[key].cost = res[key].cost && res[key].cost.toString();
        return;
      }

      if (key === 'status') {
        res[key] = TRANSACTION_RESPONSE_CODE[response[key]];
        return;
      }

      if (key === 'transactionHash') {
        res[key] = response[key].toString('hex');
        return;
      }

      if (Array.isArray(response[key])) {
        res[key] = response[key].map(el => this.convertToObject(el));
        return;
      }

      if (typeof response[key] === 'object') {
        res[key] = this.convertToObject(response[key]);
      }
    });

    return res;
  }

  async signTransaction(privateKey) {
    await this.payment.signTransaction(privateKey);
    return this;
  }

  toObject() {
    const obj = this.query;
    obj[Object.keys(obj)[0]].header.payment = this.payment.toObject();
    return obj;
  }
}

module.exports = Query;
