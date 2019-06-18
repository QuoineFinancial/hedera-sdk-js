"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var asn1_1 = require("@fidm/asn1");
var publicKeyValidator = {
    name: 'SubjectPublicKeyInfo',
    // tslint:disable-next-line:object-literal-sort-keys
    class: asn1_1.Class.UNIVERSAL,
    tag: asn1_1.Tag.SEQUENCE,
    // tslint:disable-next-line:object-literal-sort-keys
    capture: 'subjectPublicKeyInfo',
    value: [
        {
            name: 'SubjectPublicKeyInfo.AlgorithmIdentifier',
            // tslint:disable-next-line:object-literal-sort-keys
            class: asn1_1.Class.UNIVERSAL,
            tag: asn1_1.Tag.SEQUENCE,
            value: [
                {
                    name: 'AlgorithmIdentifier.algorithm',
                    // tslint:disable-next-line:object-literal-sort-keys
                    class: asn1_1.Class.UNIVERSAL,
                    tag: asn1_1.Tag.OID,
                    // tslint:disable-next-line:object-literal-sort-keys
                    capture: 'publicKeyOID'
                }
            ]
        },
        {
            // subjectPublicKey
            name: 'SubjectPublicKeyInfo.subjectPublicKey',
            // tslint:disable-next-line:object-literal-sort-keys
            class: asn1_1.Class.UNIVERSAL,
            tag: asn1_1.Tag.BITSTRING,
            capture: 'publicKey'
        }
    ]
};
exports.default = publicKeyValidator;
