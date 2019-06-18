const Query = require('./query');

class TransactionGetFastRecord extends Query {
  constructor(options) {
    super(options);

    this.query = {
      transactionGetFastRecord: {
        transactionID: options.transactionId,
        header: {
          responseType: options.responseType || this.ResponseType.ANSWER_ONLY,
        },
      },
    };
  }

  static handleResponse(response) {
    const res = super.handleResponse(response);
    return res.transactionGetFastRecord;
  }
}

module.exports = TransactionGetFastRecord;
