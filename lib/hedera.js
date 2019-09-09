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
  constructor(nodeUrl, nodeAccountId, operatorId, operatorPrivateKey) {
    if (!nodeUrl) throw Error('Missing nodeUrl');
    if (!nodeAccountId) throw Error('Missing nodeAccountId');
    if (!operatorId) throw Error('Missing operatorId');
    if (!operatorPrivateKey) throw Error('Missing operatorPrivateKey');

    this.nodeUrl = nodeUrl;
    this.cryptoService = caller(this.nodeUrl, PROTO_PATH, 'CryptoService');
    this.nodeAccountId = new AccountID().fromString(nodeAccountId);
    this.operatorId = new AccountID().fromString(operatorId);
    this.operatorPrivateKey = util.fromPrivateKeyDer(operatorPrivateKey);
  }

  static async broadcast(requestName, nodeUrl, tx) {
    if (!nodeUrl) throw Error('Missing nodeUrl');
    const cryptoService = caller(nodeUrl, PROTO_PATH, 'CryptoService');
    const result = await cryptoService[requestName](tx);
    return this.constructor.handleResponse(requestName, result);
  }

  static handleResponse(requestName, response) {
    let queryResponse;
    switch (requestName) {
      case 'getAccountRecords':
        queryResponse = CryptoGetAccountRecords.handleResponse(response);
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

  async createAccount(newAccountPublicKey, initialBalance) {
    const publicKey = util.fromPublicKeyDer(newAccountPublicKey);
    const tx = new CryptoCreate({
      newAccountPublicKey: publicKey,
      initialBalance: `${initialBalance}`,
      nodeAccountId: this.nodeAccountId,
      operatorId: this.operatorId,
      transactionFee: DEFAULT_CREATE_ACCOUNT_FEE, // Create Account fee is big
    });
    await tx.signTransaction(this.operatorPrivateKey);
    const result = await this.cryptoService.createAccount(tx.toObject());
    return this.constructor.handleResponse('', result);
  }

  // updateAccount (Transaction)

  // destinations = [{ accountID, amount }] - array of destination accountIDs and amount
  async cryptoTransfer(destinations, memo) {
    const tx = new CryptoTransfer({
      destinations,
      memo,
      nodeAccountId: this.nodeAccountId,
      operatorId: this.operatorId,
    });
    await tx.signTransaction(this.operatorPrivateKey);
    const result = await this.cryptoService.cryptoTransfer(tx.toObject());
    return this.constructor.handleResponse('', result);
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
    await query.signTransaction(this.operatorPrivateKey);
    const response = await this.cryptoService.cryptoGetBalance(query.toObject());
    return this.constructor.handleResponse('cryptoGetBalance', response);
  }

  async getAccountRecords(queryAccountId) {
    const query = new CryptoGetAccountRecords({
      queryAccountId: new AccountID().fromString(queryAccountId),
      nodeAccountId: this.nodeAccountId,
      operatorId: this.operatorId,
    });
    await query.signTransaction(this.operatorPrivateKey);
    const response = await this.cryptoService.getAccountRecords(query.toObject());
    return this.constructor.handleResponse('getAccountRecords', response);
  }

  async getAccountInfo(queryAccountId) {
    const query = new CryptoGetInfo({
      queryAccountId: new AccountID().fromString(queryAccountId),
      nodeAccountId: this.nodeAccountId,
      operatorId: this.operatorId,
    });
    await query.signTransaction(this.operatorPrivateKey);
    const response = await this.cryptoService.getAccountInfo(query.toObject());
    return this.constructor.handleResponse('getAccountInfo', response);
  }

  async getTransactionReceipts(transactionId) {
    const query = new TransactionGetReceipt({
      nodeAccountId: this.nodeAccountId,
      operatorId: this.operatorId,
      transactionId,
    });

    await query.signTransaction(this.operatorPrivateKey);
    const response = await this.cryptoService.getTransactionReceipts(query.toObject());
    return this.constructor.handleResponse('getTransactionReceipts', response);
  }

  async getFastTransactionRecord(transactionId) {
    const query = new TransactionGetFastRecord({
      nodeAccountId: this.nodeAccountId,
      operatorId: this.operatorId,
      transactionId,
    });

    await query.signTransaction(this.operatorPrivateKey);
    const response = await this.cryptoService.getFastTransactionRecord(query.toObject());
    return this.constructor.handleResponse('getFastTransactionRecord', response);
  }

  async getTxRecordByTxID(transactionId) {
    const query = new TransactionGetRecord({
      nodeAccountId: this.nodeAccountId,
      operatorId: this.operatorId,
      transactionId,
    });

    await query.signTransaction(this.operatorPrivateKey);
    const result = await this.cryptoService.getTxRecordByTxID(query.toObject());
    return this.constructor.handleResponse('getTxRecordByTxID', result);
  }

  // getStakersByAccountID (Query)
}

module.exports = Hedera;
