const Query = require('./query');

class TransactionGetReceipt extends Query {
  constructor(options) {
    super(options);

    this.query = {
      transactionGetReceipt: {
        transactionID: options.transactionId,
        header: {
          responseType: options.responseType || this.ResponseType.ANSWER_ONLY,
        },
      },
    };
  }

  static handleResponse(response) {
    const res = super.handleResponse(response);
    return res.transactionGetReceipt;
  }
}

module.exports = TransactionGetReceipt;
