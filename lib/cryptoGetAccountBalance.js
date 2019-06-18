const Query = require('./query');
const AccountID = require('./accountId');

class CryptoGetAccountBalance extends Query {
  constructor(options) {
    super(options);

    this.query = {
      cryptogetAccountBalance: {
        accountID: new AccountID(options.queryAccountId).toObject(),
        header: {
          responseType: options.responseType || this.ResponseType.ANSWER_ONLY,
        },
      },
    };
  }

  static async handleResponse(response) {
    const res = await super.handleResponse(response);
    return res.cryptogetAccountBalance;
  }
}

module.exports = CryptoGetAccountBalance;
