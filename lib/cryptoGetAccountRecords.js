const Query = require('./query');
const AccountID = require('./accountId');

class CryptoGetAccountRecords extends Query {
  constructor(options) {
    super(options);

    this.query = {
      cryptoGetAccountRecords: {
        accountID: new AccountID(options.queryAccountId).toObject(),
        header: {
          responseType: options.responseType || this.ResponseType.ANSWER_ONLY,
        },
      },
    };
  }

  static handleResponse(response) {
    const res = super.handleResponse(response);
    return res.cryptoGetAccountRecords;
  }
}

module.exports = CryptoGetAccountRecords;
