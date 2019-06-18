const Query = require('./query');

class TransactionGetRecord extends Query {
  constructor(options) {
    super(options);

    this.query = {
      transactionGetRecord: {
        transactionID: options.transactionId,
        header: {
          responseType: options.responseType || this.ResponseType.ANSWER_ONLY,
        },
      },
    };
  }

  static handleResponse(response) {
    const res = super.handleResponse(response);
    return res.transactionGetRecord;
  }
}

module.exports = TransactionGetRecord;
