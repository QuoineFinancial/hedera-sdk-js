const path = require('path');
const caller = require('grpc-caller');
const Promise = require('bluebird');

// lib
const util = require('./util');
const AccountID = require('./accountId');
const Transaction = require('./transaction');
const CryptoGetAccountBalance = require('./cryptoGetAccountBalance');
const CryptoGetAccountRecords = require('./cryptoGetAccountRecords');
const CryptoGetInfo = require('./cryptoGetInfo');
const CryptoTransfer = require('./cryptoTransfer');
const TransactionGetFastRecord = require('./transactionGetFastRecord');
const TransactionGetRecord = require('./transactionGetRecord');

const PROTO_PATH = path.resolve(__dirname, '../hedera-proto/CryptoService.proto');

class Hedera {
  constructor(nodeUrl, nodeAccountId, operatorId, operatorPrivateKey) {
    this.nodeUrl = nodeUrl;
    this.nodeAccountId = new AccountID().fromString(nodeAccountId);
    this.operatorId = new AccountID().fromString(operatorId);
    this.operatorPrivateKey = util.fromPrivateKeyDer(operatorPrivateKey);
    this.cryptoService = caller(this.nodeUrl, PROTO_PATH, 'CryptoService');
  }

  async broadcast(requestName, tx) {
    const result = await this.cryptoService[requestName](tx);
    return this.constructor.handleResponse(requestName, result);
  }

  static handleResponse(requestName, response) {
    const transactionRequests = [
      'createAccount', 'updateAccount', 'cryptoTransfer',
      'cryptoDelete', 'addClaim', 'deleteClaim',
    ];
    if (transactionRequests.includes(requestName)) return Transaction.handleResponse(response);

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

      default:
    }

    return queryResponse || response;
  }

  // async createAccount(newAccountPublicKey, initialBalance) {
  //   const unsignedTx = this.transaction.buildCryptoCreate(newAccountPublicKey, initialBalance);
  //   const tx = await this.transaction.sign(unsignedTx, this.operatorPrivateKey);
  //   return this.cryptoService.createAccount(tx);
  // }

  // updateAccount (Transaction)

  // destinations = [{ accountID, amount }] - array of destination accountIDs and amount
  async cryptoTransfer(destinations) {
    const tx = new CryptoTransfer({
      destinations,
      nodeAccountId: this.nodeAccountId,
      operatorId: this.operatorId,
    });
    await tx.signTransaction(this.operatorPrivateKey);
    await this.cryptoService.cryptoTransfer(tx.toObject());
    await Promise.delay(200);
    const transactionId = util.getTransactionId(tx.toObject());
    return this.getTxRecordByTxID(transactionId);
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

  // async getTransactionReceipts(transactionId) {
  //   const unsignedQuery = this.query.buildTransactionGetReceipt(transactionId);
  //   const query = await this.query.sign(unsignedQuery, this.operatorPrivateKey);
  //   return this.cryptoService.getTransactionReceipts(query);
  // }

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
    const response = await this.cryptoService.getTxRecordByTxID(query.toObject());
    return this.constructor.handleResponse('getTxRecordByTxID', response);
  }

  // getStakersByAccountID (Query)
}

module.exports = Hedera;
