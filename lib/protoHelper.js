const protobuf = require('protobufjs');
const root = protobuf.Root.fromJSON(require('./protoBundle.json'));

function serialize(msgName, obj) {
  const proto = root.lookup(`proto.${msgName}`);
  const error = proto.verify(obj);
  if (error) throw Error(error);

  const message = proto.create(obj);
  return proto.encode(message).finish();
}

function deserialize(msgName, hex) {
  const buffer = typeof hex === 'string' ? Buffer.from(hex, 'hex') : hex;
  const proto = root.lookup(`proto.${msgName}`);
  const tx = proto.decode(buffer);

  const error = proto.verify(tx);
  if (error) throw Error(error);
  return tx;
}

exports.SignedTransactionProto = {
  serialize: (obj) => serialize('SignedTransaction', obj),
  deserialize: (hex) => deserialize('SignedTransaction', hex),
  deserializeDeep: (hex) => {
    const signedTx = deserialize('SignedTransaction', hex);
    const body = this.TransactionBodyProto.deserialize(signedTx.bodyBytes);
    return { ...signedTx, body };
  },
};

exports.TransactionBodyProto = {
  serialize: (obj) => serialize('TransactionBody', obj),
  deserialize: (hex) => deserialize('TransactionBody', hex),
};

exports.TransactionProto = {
  serialize: (obj) => serialize('Transaction', obj),
  deserialize: (hex) => deserialize('Transaction', hex),
};

exports.QueryProto = {
  serialize: (obj) => serialize('Query', obj),
  deserialize: (hex) => deserialize('Query', hex),
};

exports.TransactionIDProto = {
  serialize: (obj) => serialize('TransactionID', obj),
  deserialize: (hex) => deserialize('TransactionID', hex),
};
