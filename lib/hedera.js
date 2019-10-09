const path = require('path');
const caller = require('grpc-caller');

// lib
const util = require('./util');
const { DEFAULT_CREATE_ACCOUNT_FEE } = require('./constants');
const AccountID = require('./accountId');
const Transaction = require('./transaction');
const CryptoGetAccountBalance = require('./cryptoGetAccountBalance');
const CryptoGetAccountRecords = require('./cryptoGetAccountRecords');
const CryptoCreate = require('./cryptoCreate');
const CryptoGetInfo = require('./cryptoGetInfo');
const CryptoTransfer = require('./cryptoTransfer');
const TransactionGetRecord = require('./transactionGetRecord');
const TransactionGetReceipt = require('./transactionGetReceipt');
const TransactionGetFastRecord = require('./transactionGetFastRecord');

const PROTO_PATH = path.resolve(__dirname, '../hedera-proto/CryptoService.proto');

class Hedera {
  constructor(options, nodeAccountId, operatorId, operatorPublicKey, operatorPrivateKey) {
    let nodeUrl;
    const { derPublicKey, derPrivateKey } = options;
    if (typeof options === 'object') {
      this.nodeUrl = options.nodeUrl;
    } else {
      nodeUrl = options;
    }

    if (!nodeUrl && options.nodeUrl) throw Error('Missing nodeUrl');
    if (!nodeAccountId && options.nodeAccountId) throw Error('Missing nodeAccountId');
    if (!operatorId && options.operatorId) throw Error('Missing operatorId');
    if (!operatorPublicKey && !options.operatorPublicKey && !derPublicKey) {
      throw Error('Missing operatorPublicKey or derPublicKey');
    }
    if (!operatorPublicKey && !options.operatorPrivateKey && !derPrivateKey) {
      throw Error('Missing operatorPrivateKey or derPrivateKey');
    }

    this.nodeUrl = nodeUrl || options.nodeUrl;
    this.nodeAccountId = new AccountID().fromString(nodeAccountId || options.nodeAccountId);
    this.operatorId = new AccountID().fromString(operatorId || options.operatorId);
    this.operatorPublicKey = operatorPublicKey
      || options.operatorPublicKey
      || util.fromPublicKeyDer(derPublicKey);
    this.operatorPrivateKey = operatorPrivateKey
      || options.operatorPrivateKey
      || util.fromPrivateKeyDer(derPrivateKey);
    this.cryptoService = caller(this.nodeUrl, PROTO_PATH, 'CryptoService');
  }

  static async broadcast(requestName, nodeUrl, tx) {
    if (!nodeUrl) throw Error('Missing nodeUrl');
    const cryptoService = caller(nodeUrl, PROTO_PATH, 'CryptoService');
    const result = await cryptoService[requestName](tx);
    return Hedera.handleResponse(requestName, result);
  }

  static handleResponse(requestName, response) {
    let queryResponse;
    switch (requestName) {
      case 'getAccountRecords':
        queryResponse = CryptoGetAccountRecords.handleResponse(response);
        break;

      case 'getAccountInfo':
        queryResponse = CryptoGetInfo.handleResponse(response);
        break;

      case 'cryptoGetBalance':
        queryResponse = CryptoGetAccountBalance.handleResponse(response);
        break;

      case 'getFastTransactionRecord':
        queryResponse = TransactionGetFastRecord.handleResponse(response);
        break;

      case 'getTxRecordByTxID':
        queryResponse = TransactionGetRecord.handleResponse(response);
        break;

      case 'getTransactionReceipts':
        queryResponse = TransactionGetReceipt.handleResponse(response);
        break;

      default:
        return Transaction.handleResponse(response);
    }

    return queryResponse || response;
  }

  // `newAccountPublicKey` must be convert to non-der using util.fromPublicKeyDer before use
  async createAccount(newAccountPublicKey, initialBalance) {
    let publicKey = newAccountPublicKey.toLowerCase().toString('hex');
    if (newAccountPublicKey.length !== 64) {
      publicKey = util.fromPublicKeyDer(newAccountPublicKey);
    }

    const tx = new CryptoCreate({
      newAccountPublicKey: publicKey,
      initialBalance: `${initialBalance}`,
      nodeAccountId: this.nodeAccountId,
      operatorId: this.operatorId,
      transactionFee: DEFAULT_CREATE_ACCOUNT_FEE, // Create Account fee is big
    });
    const serializedTxId = util.serializeTxID(tx.getTransactionId());
    await tx.signTransaction(this.operatorPrivateKey, this.operatorPublicKey);
    const result = await this.cryptoService.createAccount(tx.toObject());
    await this.constructor.handleResponse('', result);
    return serializedTxId;
  }

  // updateAccount (Transaction)

  // destinations = [{ accountId, amount }] - array of destination accountIDs and amount
  async cryptoTransfer(destinations, memo) {
    const tx = new CryptoTransfer({
      destinations,
      memo,
      nodeAccountId: this.nodeAccountId,
      operatorId: this.operatorId,
    });
    const serializedTxId = util.serializeTxID(tx.getTransactionId());
    await tx.signTransaction(this.operatorPrivateKey, this.operatorPublicKey);
    const result = await this.cryptoService.cryptoTransfer(tx.toObject());
    await this.constructor.handleResponse('', result);
    return serializedTxId;
  }

  // cryptoDelete (Transaction)

  // addClaim (Transaction)

  // deleteClaim (Transaction)

  // getClaim (Query)

  async cryptoGetBalance(queryAccountId) {
    const query = new CryptoGetAccountBalance({
      queryAccountId: new AccountID().fromString(queryAccountId),
      nodeAccountId: this.nodeAccountId,
      operatorId: this.operatorId,
    });
    await query.signTransaction(this.operatorPrivateKey, this.operatorPublicKey);
    const response = await this.cryptoService.cryptoGetBalance(query.toObject());
    return this.constructor.handleResponse('cryptoGetBalance', response);
  }

  async getAccountRecords(queryAccountId) {
    const query = new CryptoGetAccountRecords({
      queryAccountId: new AccountID().fromString(queryAccountId),
      nodeAccountId: this.nodeAccountId,
      operatorId: this.operatorId,
    });
    await query.signTransaction(this.operatorPrivateKey, this.operatorPublicKey);
    const response = await this.cryptoService.getAccountRecords(query.toObject());
    return this.constructor.handleResponse('getAccountRecords', response);
  }

  async getAccountInfo(queryAccountId) {
    const query = new CryptoGetInfo({
      queryAccountId: new AccountID().fromString(queryAccountId),
      nodeAccountId: this.nodeAccountId,
      operatorId: this.operatorId,
    });
    await query.signTransaction(this.operatorPrivateKey, this.operatorPublicKey);
    const response = await this.cryptoService.getAccountInfo(query.toObject());
    return this.constructor.handleResponse('getAccountInfo', response);
  }

  async getTransactionReceipts(transactionId) {
    const query = new TransactionGetReceipt({
      nodeAccountId: this.nodeAccountId,
      operatorId: this.operatorId,
      transactionId,
    });

    await query.signTransaction(this.operatorPrivateKey, this.operatorPublicKey);
    const response = await this.cryptoService.getTransactionReceipts(query.toObject());
    return this.constructor.handleResponse('getTransactionReceipts', response);
  }

  async getFastTransactionRecord(transactionId) {
    const query = new TransactionGetFastRecord({
      nodeAccountId: this.nodeAccountId,
      operatorId: this.operatorId,
      transactionId,
    });

    await query.signTransaction(this.operatorPrivateKey, this.operatorPublicKey);
    const response = await this.cryptoService.getFastTransactionRecord(query.toObject());
    return this.constructor.handleResponse('getFastTransactionRecord', response);
  }

  async getTxRecordByTxID(transactionId) {
    const query = new TransactionGetRecord({
      nodeAccountId: this.nodeAccountId,
      operatorId: this.operatorId,
      transactionId,
    });

    await query.signTransaction(this.operatorPrivateKey, this.operatorPublicKey);
    const result = await this.cryptoService.getTxRecordByTxID(query.toObject());
    return this.constructor.handleResponse('getTxRecordByTxID', result);
  }

  // getStakersByAccountID (Query)
}

module.exports = Hedera;
