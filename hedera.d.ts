import { stringify } from "querystring";

declare const _default: {
  Hedera: Hedera,
  Duration: Duration,
  Query: Query,
  CryptoGetAccountBalance: CryptoGetAccountBalance,
  CryptoGetAccountRecords: CryptoGetAccountRecords,
  CryptoTransfer: CryptoTransfer,
  CryptoGetInfo: CryptoGetInfo,
  Transaction: Transaction,
  TransactionID: TransactionID,
  TransactionGetRecord: TransactionGetRecord,
  TransactionGetFastRecord: TransactionGetFastRecord,
}
export default _default;

export declare namespace util {
  function fromPrivateKeyDer(privateKeyDer: string): string;
  function fromPublicKeyDer(publicKeyDer: string): string;
  function toHbar(tinyBar: Long | string): string;
  function toTinyBar(hBar: Long | string): string;
  function getOperatorId(transaction: {}): AccountID;
  function getTransactionId(transaction: {}): TransactionID;
  function getTransfers(transaction: {}): { accountId: string, amount: string }[];
  function getRecordTransfers(record: {}): { accountId: string, amount: string }[];
  function deserializeTx(hex: string): Promise<Transaction>
  function serializeAccountID(accountId: AccountID): string
}

export declare interface Duration {
  seconds: number,
  nanos?: string,
}

export declare namespace Duration {
  function now(): Duration;
  function seconds(s: number): Duration;
}

export declare class Hedera {
  nodeUrl: string;
  nodeAccountId: AccountID;
  operatorId: AccountID;
  cryptoService: any;

  constructor(nodeUrl: string, nodeAccountId: string, operatorId: string, operatorPrivateKey: string)

  static broadcast(requestName: string, nodeUrl: string, tx: {}): Promise<string | {}>
  createAccount(newAccountPublicKey: string, initialBalance: string): Promise<Query.Receipt>
  cryptoTransfer(destinations: { accountId: string, amount: string }[]): Promise<Query.Record>
  cryptoGetBalance(queryAccountId: string): Promise<{ header: Query.Header, accountID: AccountID, balance: string }>
  getAccountRecords(queryAccountId: string): Promise<{ header: Query.Header, accountID: AccountID, records: Query.Record[] }>
  getAccountInfo(queryAccountId: string): Promise<{}>
  getTransactionReceipts(transactionId: TransactionID): Promise<{ header: Query.Header, receipt: Query.Receipt }>
  getFastTransactionRecord(transactionId: TransactionID): Promise<{ header: Query.Header, transactionRecord: Query.Record }>
  getTxRecordByTxID(transactionId: TransactionID): Promise<{ header: Query.Header, transactionRecord: Query.Record }>
}

export declare interface AccountID {
  shardNum?: number;
  realmNum?: number;
  accountNum?: number;
}

export declare class AccountID {
  constructor(obj: AccountID | string | { shardNum: string | number, realmNum: string | number, accountNum: string | number });

  fromString(str: string): AccountID;
  toObject(): { accountNum: number };
  toString(): string;
  getShardID(): { shardNum: number };
  getRealmID(): { RealmNum: number };
}

export declare interface TransactionID {
  transactionValidStart: Duration
  accountID: AccountID,
}

export declare interface TransferTransaction {
  transactionID: TransactionID,
  nodeAccountID: AccountID,
  transactionFee: number,
  transactionValidDuration: Duration,
  memo: string,
  cryptoTransfer: { transferList: TransferList }
}

export declare interface TransferList {
  accountAmounts: { accountID: string, amount: string }[]
}

export declare interface Query {

}

export declare namespace Query {
  export enum RESPONSE_TYPE {
    ANSWER_ONLY = 0, // Response returns answer
    ANSWER_STATE_PROOF = 1, // Response returns both answer and state proof
    COST_ANSWER = 2, // Response returns the cost of answer
    COST_ANSWER_STATE_PROOF = 3,
  }

  export interface QueryResponse {
    header: {
      nodeTransactionPrecheckCode: string,
      cost: string,
    }
  }

  export interface Receipt {
    status: string,
    accountID?: string,
    fileID?: string,
    contractID?: string,
  }

  export interface Record {
    transactionHash: Buffer,
    consensusTimestamp: { seconds: number, nanos: string },
    transactionID: TransactionID,
    memo?: string,
    transactionFee: string,
    transferList?: TransferList,
  }

  export interface Header {
    nodeTransactionPrecheckCode: string,
    cost: string,
  }
}

export declare class Query {
  constructor(options: { nodeAccountId: AccountID | string, operatorId: AccountID | string });

  serialize(): Promise<string>;
  static deserialize(hex: string): Promise<{}>;
  signTransaction(privateKey: string): Promise<Query>;
  toObject(): {};
}

export declare class Transaction {
  constructor(options: { operatorId: AccountID | string, nodeAccountId: AccountID | string});

  addSignature(signature: string | Buffer): Transaction;
  serialize(): Promise<string>;
  static deserialize(hex: string): Promise<{}>;
  toObject(): {};
  getTransactionId(): TransactionID;
  signTransaction(privateKey: string): Promise<Transaction>;
}

export declare class CryptoGetAccountBalance extends Query {
  constructor(options: {
    nodeAccountId: AccountID | string,
    operatorId: AccountID | string,
    queryAccountId: string | AccountID,
    responseType?: Query.RESPONSE_TYPE,
  });
}

export declare class CryptoGetAccountRecords extends Query {
  constructor(options: {
    nodeAccountId: AccountID | string,
    operatorId: AccountID | string,
    queryAccountId: string | AccountID,
    responseType?: Query.RESPONSE_TYPE,
  });
}

export declare class CryptoGetInfo extends Query {
  constructor(options: {
    nodeAccountId: AccountID | string,
    operatorId: AccountID | string,
    queryAccountId: string | AccountID,
    responseType?: Query.RESPONSE_TYPE,
  });
}

export declare class TransactionGetReceipt extends Query {
  constructor(options: {
    nodeAccountId: AccountID | string,
    operatorId: AccountID | string,
    transactionId: TransactionID,
    responseType?: Query.RESPONSE_TYPE,
  });
}

export declare class TransactionGetRecord extends Query {
  constructor(options: {
    nodeAccountId: AccountID | string,
    operatorId: AccountID | string,
    transactionId: TransactionID,
    responseType?: Query.RESPONSE_TYPE,
  });
}

export declare class TransactionGetFastRecord extends Query {
  constructor(options: {
    nodeAccountId: AccountID | string,
    operatorId: AccountID | string,
    transactionId: TransactionID,
    responseType?: Query.RESPONSE_TYPE,
  });
}

export declare class CryptoTransfer extends Transaction {
  constructor(options: {
    nodeAccountId: AccountID | string,
    operatorId: AccountID | string,
    destinations: {
      accountId: AccountID | string,
      amount: string | Long,
    }[],
    transactionValidStart?: Duration,
    transactionFee?: string,
    transactionValidDuration?: Duration,
    memo?: string,
  });
}

export declare class TransactionID {
  constructor(obj: { accountID: AccountID | string, transactionValidStart: { seconds: string | number | Long } });

  toObject(): { accountID: string, transactionValidStart: Duration };
  static serialize(transactionId: TransactionID): Promise<string>;
  static deserialize(hex: string): Promise<TransactionID>;
}
