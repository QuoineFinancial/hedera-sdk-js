"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var asn1_1 = require("@fidm/asn1");
var privateKeyValidator = {
    name: 'PrivateKeyInfo',
    // tslint:disable-next-line:object-literal-sort-keys
    class: asn1_1.Class.UNIVERSAL,
    tag: asn1_1.Tag.SEQUENCE,
    capture: 'privateKeyInfo',
    value: [
        {
            name: 'PrivateKeyInfo.Version',
            // tslint:disable-next-line:object-literal-sort-keys
            class: asn1_1.Class.UNIVERSAL,
            tag: asn1_1.Tag.INTEGER,
            capture: 'privateKeyVersion'
        },
        {
            name: 'PrivateKeyInfo.AlgorithmIdentifier',
            // tslint:disable-next-line:object-literal-sort-keys
            class: asn1_1.Class.UNIVERSAL,
            tag: asn1_1.Tag.SEQUENCE,
            value: [
                {
                    name: 'PrivateKeyAlgorithmIdentifier.algorithm',
                    // tslint:disable-next-line:object-literal-sort-keys
                    class: asn1_1.Class.UNIVERSAL,
                    tag: asn1_1.Tag.OID,
                    capture: 'privateKeyOID'
                }
            ]
        },
        {
            name: 'PrivateKeyInfo.PrivateKey',
            // tslint:disable-next-line:object-literal-sort-keys
            class: asn1_1.Class.UNIVERSAL,
            tag: asn1_1.Tag.OCTETSTRING,
            capture: 'privateKey'
        }
    ]
};
exports.default = privateKeyValidator;
