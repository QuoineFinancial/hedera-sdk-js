const forge = require('node-forge');
const Long = require('long');
const Decimal = require('decimal.js');
const AccountID = require('./accountId');
const Transaction = require('./transaction');
const { HBAR_TO_TINYBAR, DECIMALS } = require('./constants');
const { parsePrivateKey, parsePublicKey } = require('../crypto/asn1parser');


function fromPrivateKeyDer(privateKeyDer) {
  const encoding = 'binary';
  const privKeyBytes = forge.util.hexToBytes(privateKeyDer);
  const privKeyBuffer = Buffer.from(privKeyBytes, encoding);

  // our retrieved ed25519 private key from ASN1 DER is 32 bytes length
  // In the context of node-forge, this parsed out private key is, in fact, the seed
  const seed = parsePrivateKey(privKeyBuffer);
  const keypairGen = forge.ed25519.generateKeyPair({ seed });
  // Now, we have node-forge compliant privateKey and publicKey
  const privKeyGenBuffer = keypairGen.privateKey;
  // const pubKeyGenBuffer = keypairGen.publicKey;
  // converting generated NativeBuffer into bytes
  const privateKeyBytes = forge.util.createBuffer(privKeyGenBuffer, 'raw');
  // const publicKeyBytes = forge.util.createBuffer(pubKeyGenBuffer, 'raw');
  // converting bytes into hex-string that is node-forge-compliant
  const privateKey = forge.util.bytesToHex(privateKeyBytes.getBytes());
  // const publicKey = forge.util.bytesToHex(publicKeyBytes.getBytes());
  return privateKey;
}

function fromPublicKeyDer(publicKeyDer) {
  const encoding = 'binary';
  const publicKeyBytes = forge.util.hexToBytes(publicKeyDer);
  const publicBuffer = Buffer.from(publicKeyBytes, encoding);
  return parsePublicKey(publicBuffer);
}

function toHbar(tinyBar) {
  return Long.isLong(tinyBar)
    ? new Decimal(tinyBar.toString()).div(HBAR_TO_TINYBAR).toFixed(DECIMALS)
    : new Decimal(tinyBar).div(HBAR_TO_TINYBAR).toFixed(DECIMALS);
}

function toTinyBar(hbar) {
  const amount = Long.isLong(hbar) ? new Decimal(hbar.toString()) : new Decimal(hbar);
  if (amount.decimalPlaces() > DECIMALS) throw Error('Invalid input, too many decimal points');

  // Make sure tinyBar value is integer
  return Long.isLong(hbar)
    ? new Decimal(hbar.toString()).mul(HBAR_TO_TINYBAR).toFixed(0)
    : new Decimal(hbar).mul(HBAR_TO_TINYBAR).toFixed(0);
}

function getOperatorId(transaction) {
  return new AccountID(transaction.body.transactionID.accountID);
}

function getTransfers(transaction) {
  if (!transaction || !transaction.body) throw Error('Invalid transaction');
  if (!transaction.body.cryptoTransfer) return [];

  const { transfers } = transaction.body.cryptoTransfer;
  if (!transfers || !transfers.accountAmounts) throw Error('Invalid transaction');

  return transfers.accountAmounts.reduce((acc, { accountID, amount }) => {
    if (new Decimal(amount.toString()).lt(0)) return acc;
    acc.push({
      accountId: new AccountID(accountID).toString(),
      amount: Long.isLong(amount) ? amount.toString() : amount,
    });
    return acc;
  }, []);
}

function getRecordTransfers(record) {
  if (!record || !record.transferList) throw Error('Invalid record');
  const { accountAmounts } = record.transferList;

  return accountAmounts.reduce((acc, { accountID, amount }) => {
    if (new Decimal(amount.toString()).lt(0)) return acc;
    acc.push({
      accountId: new AccountID(accountID).toString(),
      amount: Long.isLong(amount) ? amount.toString() : amount,
    });
    return acc;
  }, []);
}

function getTransactionId(transaction) {
  return transaction.body.transactionID;
}

async function deserializeTx(hex) {
  return Transaction.deserialize(hex);
}

function serializeAccountID(accountId) {
  return new AccountID(accountId).toString();
}

module.exports = {
  fromPrivateKeyDer,
  fromPublicKeyDer,
  toHbar,
  toTinyBar,
  getOperatorId,
  getTransactionId,
  getTransfers,
  getRecordTransfers,
  deserializeTx,
  serializeAccountID,
};
