const Query = require('./query');
const TransactionID = require('./transactionId');

class TransactionGetFastRecord extends Query {
  constructor(options) {
    super(options);

    let transactionID = options.transactionId;
    if (typeof options.transactionId === 'string') {
      transactionID = TransactionID.parseString(options.transactionId);
    }

    this.query = {
      transactionGetFastRecord: {
        transactionID,
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
