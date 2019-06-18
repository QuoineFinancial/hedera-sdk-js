"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var asn1_1 = require("@fidm/asn1");
var asn1privatekeyvalidator_1 = __importDefault(require("./asn1privatekeyvalidator"));
var asn1publickeyvalidator_1 = __importDefault(require("./asn1publickeyvalidator"));
var asn1parser = function (privNativeBuffer, pubNativeBuffer) {
    var captures = asn1_1.ASN1.parseDERWithTemplate(privNativeBuffer, asn1privatekeyvalidator_1.default);
    var capturesLen = captures.privateKey.value.length;
    if (capturesLen !== 34) {
        throw new Error("We expect the captured ed25519 private key to have an additional 2           bytes 0x04 prepended, so length is 32 + 2 (34), but our length is " + capturesLen);
    }
    var privKeyBuffer = captures.privateKey.value;
    privKeyBuffer = privKeyBuffer.slice(2);
    if (privKeyBuffer.byteLength !== 32) {
        throw new Error("We expect our actual ed25519 private key buffer to be 32 bytes       but your private key buffer byte length is " + privKeyBuffer.byteLength);
    }
    if (!pubNativeBuffer) {
        return {
            privKeyBuffer: privKeyBuffer,
        }
    }
    // public key
    var pubCaptures = asn1_1.ASN1.parseDERWithTemplate(pubNativeBuffer, asn1publickeyvalidator_1.default);
    var pubKeyBitString = pubCaptures.publicKey.value;
    var pubKeyBuffer = pubKeyBitString.buf;
    if (pubKeyBuffer.length !== 32) {
        throw new Error("We expect our ed25519 public key buffer to be 32 bytes       but your public key buffer byte length is " + pubKeyBuffer.length);
    }

    console.log(privKeyBuffer.toString('hex'), pubKeyBuffer.toString('hex'));
    return {
        privKeyBuffer: privKeyBuffer,
        pubKeyBuffer: pubKeyBuffer
    };
};

function parsePrivateKey(privNativeBuffer) {
    const captures = asn1_1.ASN1.parseDERWithTemplate(privNativeBuffer, asn1privatekeyvalidator_1.default);
    const capturesLen = captures.privateKey.value.length;
    if (capturesLen !== 34) {
        throw new Error("We expect the captured ed25519 private key to have an additional 2 bytes 0x04 prepended, so length is 32 + 2 (34), but our length is " + capturesLen);
    }
    let privKeyBuffer = captures.privateKey.value;
    privKeyBuffer = privKeyBuffer.slice(2);
    return privKeyBuffer;
}

function parsePublicKey(pubNativeBuffer) {
    const pubCaptures = asn1_1.ASN1.parseDERWithTemplate(pubNativeBuffer, asn1publickeyvalidator_1.default);
    const pubKeyBitString = pubCaptures.publicKey.value;
    const pubKeyBuffer = pubKeyBitString.buf;
    if (pubKeyBuffer.length !== 32) {
        throw new Error("We expect our ed25519 public key buffer to be 32 bytes       but your public key buffer byte length is " + pubKeyBuffer.length);
    }

    return pubKeyBuffer.toString('hex');
}

module.exports = {
    parsePrivateKey,
    parsePublicKey,
};
