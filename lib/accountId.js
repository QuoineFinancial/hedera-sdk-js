class AccountID {
  // string or AccountID object
  constructor(obj) {
    if (obj instanceof AccountID) {
      this.shardNum = obj.shardNum;
      this.realmNum = obj.realmNum;
      this.accountNum = obj.accountNum;
      return;
    }

    if (typeof obj === 'string') this.fromString(obj);

    if (obj && obj.accountNum) {
      this.shardNum = Number(obj.shardNum) || 0;
      this.realmNum = Number(obj.realmNum) || 0;
      this.accountNum = Number(obj.accountNum);
    }
  }

  fromString(str) {
    if (!/\d+\.\d+\.\d+/.test(str)) throw Error('Invalid accountID');

    this.shardNum = Number(str.split('.')[0]);
    this.realmNum = Number(str.split('.')[1]);
    this.accountNum = Number(str.split('.')[2]);
    return this;
  }

  toObject() {
    return {
      // shardNum: this.shardNum,
      // realmNum: this.realmNum,
      accountNum: this.accountNum,
    };
  }

  toString() {
    return `${this.shardNum || 0}.${this.realmNum || 0}.${this.accountNum}`;
  }

  getShardID() {
    return {
      shardNum: this.shardNum,
    };
  }

  getRealmID() {
    return {
      realmNum: this.realmNum,
    };
  }
}

module.exports = AccountID;
