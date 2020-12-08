const TRANSACTION_RESPONSE_CODE = {
  0: 'OK', // The transaction passed the precheck validations.
  1: 'INVALID_TRANSACTION', // For any error not handled by specific error codes listed below.
  2: 'PAYER_ACCOUNT_NOT_FOUND', // Payer account does not exist.
  3: 'INVALID_NODE_ACCOUNT', // Node Account provided does not match the node account of the node the transaction was submitted to.
  4: 'TRANSACTION_EXPIRED', // Pre-Check error when TransactionValidStart + transactionValidDuration is less than current consensus time.
  5: 'INVALID_TRANSACTION_START', // Transaction start time is greater than current consensus time
  6: 'INVALID_TRANSACTION_DURATION', // valid transaction durati`on is a positive non zero number that does not exceed 120 seconds
  7: 'INVALID_SIGNATURE', // The transaction signature is not valid
  8: 'MEMO_TOO_LONG', // Transaction memo size exceeded 100 bytes
  9: 'INSUFFICIENT_TX_FEE', // The fee provided in the transaction is insufficient for this type of transaction
  10: 'INSUFFICIENT_PAYER_BALANCE', // The payer account has insufficient cryptocurrency to pay the transaction fee
  11: 'DUPLICATE_TRANSACTION', // This transaction ID is a duplicate of one that was submitted to this node or reached consensus in the last 180 seconds (receipt period)
  12: 'BUSY', // If API is throttled out
  13: 'NOT_SUPPORTED', // The API is not currently supported


  14: 'INVALID_FILE_ID', // The file id is invalid or does not exist
  15: 'INVALID_ACCOUNT_ID', // The account id is invalid or does not exist
  16: 'INVALID_CONTRACT_ID', // The contract id is invalid or does not exist
  17: 'INVALID_TRANSACTION_ID', // Transaction id is not valid
  18: 'RECEIPT_NOT_FOUND', // Receipt for given transaction id does not exist
  19: 'RECORD_NOT_FOUND', // Record for given transaction id does not exist
  20: 'INVALID_SOLIDITY_ID', // The solidity id is invalid or entity with this solidity id does not exist


  21: 'UNKNOWN', // Transaction hasn't yet reached consensus, or has already expired
  22: 'SUCCESS', // The transaction succeeded
  23: 'FAIL_INVALID', // There was a system error and the transaction failed because of invalid request parameters.
  24: 'FAIL_FEE', // There was a system error while performing fee calculation, reserved for future.
  25: 'FAIL_BALANCE', // There was a system error while performing balance checks, reserved for future.


  26: 'KEY_REQUIRED', // Key not provided in the transaction body
  27: 'BAD_ENCODING', // Unsupported algorithm/encoding used for keys in the transaction
  28: 'INSUFFICIENT_ACCOUNT_BALANCE', // When the account balance is not sufficient for the transfer
  29: 'INVALID_SOLIDITY_ADDRESS', // During an update transaction when the system is not able to find the Users Solidity address


  30: 'INSUFFICIENT_GAS', // Not enough gas was supplied to execute transaction
  31: 'CONTRACT_SIZE_LIMIT_EXCEEDED', // contract byte code size is over the limit
  32: 'LOCAL_CALL_MODIFICATION_EXCEPTION', // local execution (query) is requested for a function which changes state
  33: 'CONTRACT_REVERT_EXECUTED', // Contract REVERT OPCODE executed
  34: 'CONTRACT_EXECUTION_EXCEPTION', // For any contract execution related error not handled by specific error codes listed above.
  35: 'INVALID_RECEIVING_NODE_ACCOUNT', // In Query validation, account with +ve(amount) value should be Receiving node account, the receiver account should be only one account in the list
  36: 'MISSING_QUERY_HEADER', // Header is missing in Query request


  37: 'ACCOUNT_UPDATE_FAILED', // The update of the account failed
  38: 'INVALID_KEY_ENCODING', // Provided key encoding was not supported by the system
  39: 'NULL_SOLIDITY_ADDRESS', // null solidity address

  40: 'CONTRACT_UPDATE_FAILED', // update of the contract failed
  41: 'INVALID_QUERY_HEADER', // the query header is invalid

  42: 'INVALID_FEE_SUBMITTED', // Invalid fee submitted
  43: 'INVALID_PAYER_SIGNATURE', // Payer signature is invalid


  44: 'KEY_NOT_PROVIDED', // The keys were not provided in the request.
  45: 'INVALID_EXPIRATION_TIME', // Expiration time provided in the transaction was invalid.
  46: 'NO_WACL_KEY', // WriteAccess Control Keys are not provided for the file
  47: 'FILE_CONTENT_EMPTY', // The contents of file are provided as empty.
  48: 'INVALID_ACCOUNT_AMOUNTS', // The crypto transfer credit and debit do not sum equal to 0
  49: 'EMPTY_TRANSACTION_BODY', // Transaction body provided is empty
  50: 'INVALID_TRANSACTION_BODY', // Invalid transaction body provided


  51: 'INVALID_SIGNATURE_TYPE_MISMATCHING_KEY', // the type of key (base ed25519 key, KeyList, or ThresholdKey) does not match the type of signature (base ed25519 signature, SignatureList, or ThresholdKeySignature)
  52: 'INVALID_SIGNATURE_COUNT_MISMATCHING_KEY', // the number of key (KeyList, or ThresholdKey) does not match that of signature (SignatureList, or ThresholdKeySignature). e.g. if a keyList has 3 base keys, then the corresponding signatureList should also have 3 base signatures.

  53: 'EMPTY_CLAIM_BODY', // the claim body is empty
  54: 'EMPTY_CLAIM_HASH', // the hash for the claim is empty
  55: 'EMPTY_CLAIM_KEYS', // the key list is empty
  56: 'INVALID_CLAIM_HASH_SIZE', // the size of the claim hash is not 48 bytes

  57: 'EMPTY_QUERY_BODY', // the query body is empty
  58: 'EMPTY_CLAIM_QUERY', // the crypto claim query is empty
  59: 'CLAIM_NOT_FOUND', // the crypto claim doesn't exists in the file system. It expired or was never persisted.
  60: 'ACCOUNT_ID_DOES_NOT_EXIST', // the account id passed has not yet been created.
  61: 'CLAIM_ALREADY_EXISTS', // the claim hash already exists


  62: 'INVALID_FILE_WACL', // File WACL keys are invalid
  63: 'SERIALIZATION_FAILED', // Serialization failure
  64: 'TRANSACTION_OVERSIZE', // The size of the Transaction is greater than transactionMaxBytes
  65: 'TRANSACTION_TOO_MANY_LAYERS', // The Transaction has more than 50 levels
  66: 'CONTRACT_DELETED', // Contract is marked as deleted

  67: 'PLATFORM_NOT_ACTIVE', // the platform node is either disconnected or lagging behind.
  68: 'KEY_PREFIX_MISMATCH', // one public key matches more than one prefixes on the signature map
  69: 'PLATFORM_TRANSACTION_NOT_CREATED', // transaction not created by platform due to either large backlog or message size exceeded transactionMaxBytes
  70: 'INVALID_RENEWAL_PERIOD', // auto renewal period is not a positive number of seconds
  71: 'INVALID_PAYER_ACCOUNT_ID', // the response code when a smart contract id is passed for a crypto API request
  72: 'ACCOUNT_DELETED', // the account has been marked as deleted
  73: 'FILE_DELETED', // the file has been marked as deleted
  74: 'ACCOUNT_REPEATED_IN_ACCOUNT_AMOUNTS', // same accounts repeated in the transfer account list
  75: 'SETTING_NEGATIVE_ACCOUNT_BALANCE', // attempting to set negative balance value for crypto account
  76: 'OBTAINER_REQUIRED', // when deleting smart contract that has crypto balance either transfer account or transfer smart contract is required
  77: 'OBTAINER_SAME_CONTRACT_ID', // when deleting smart contract that has crypto balance you can not use the same contract id as transferContractId as the one being deleted
  78: 'OBTAINER_DOES_NOT_EXIST', // transferAccountId or transferContractId specified for contract delete does not exist
  79: 'MODIFYING_IMMUTABLE_CONTRACT', // attempting to modify (update or delete a immutable smart contract, i.e. one created without a admin key)
  80: 'FILE_SYSTEM_EXCEPTION', // Unexpected exception thrown by file system functions
  81: 'AUTORENEW_DURATION_NOT_IN_RANGE', // the duration is not a subset of [MINIMUM_AUTORENEW_DURATION,MAXIMUM_AUTORENEW_DURATION]
  82: 'ERROR_DECODING_BYTESTRING', // Decoding the smart contract binary to a byte array failed. Check that the input is a valid hex string.
  83: 'CONTRACT_FILE_EMPTY', // File to create a smart contract was of length zero
  84: 'CONTRACT_BYTECODE_EMPTY', // Bytecode for smart contract is of length zero
  85: 'INVALID_INITIAL_BALANCE', // Attempt to set negative initial balance
  86: 'INVALID_RECEIVE_RECORD_THRESHOLD', // attempt to set negative receive record threshold
  87: 'INVALID_SEND_RECORD_THRESHOLD', // attempt to set negative send record threshold
  88: 'ACCOUNT_IS_NOT_GENESIS_ACCOUNT', // Special Account Operations should be performed by only Genesis account, return this code if it is not Genesis Account
  89: 'PAYER_ACCOUNT_UNAUTHORIZED', // The fee payer account doesn't have permission to submit such Transaction
  90: 'INVALID_FREEZE_TRANSACTION_BODY', // FreezeTransactionBody is invalid
  91: 'FREEZE_TRANSACTION_BODY_NOT_FOUND', // FreezeTransactionBody does not exist
  92: 'TRANSFER_LIST_SIZE_LIMIT_EXCEEDED', // Exceeded the number of accounts (both from and to) allowed for crypto transfer list
  93: 'RESULT_SIZE_LIMIT_EXCEEDED', // Smart contract result size greater than specified maxResultSize
  94: 'NOT_SPECIAL_ACCOUNT', // The payer account is not a special account(account 0.0.55)
  95: 'CONTRACT_NEGATIVE_GAS', // Negative gas was offered in smart contract call
  96: 'CONTRACT_NEGATIVE_VALUE', // Negative value / initial balance was specified in a smart contract call / create
  97: 'INVALID_FEE_FILE', // Failed to update fee file
  98: 'INVALID_EXCHANGE_RATE_FILE', // Failed to update exchange rate file
  99: 'INSUFFICIENT_LOCAL_CALL_GAS', // Payment tendered for contract local call cannot cover both the fee and the gas
  100: 'ENTITY_NOT_ALLOWED_TO_DELETE', // Entities with Entity ID below 1000 are not allowed to be deleted
  101: 'AUTHORIZATION_FAILED', // Violating one of these rules: 1) treasury account can update all entities below 0.0.1000, 2) account 0.0.50 can update all entities from 0.0.51 - 0.0.80, 3) Network Function Master Account A/c 0.0.50 - Update all Network Function accounts & perform all the Network Functions listed below, 4) Network Function Accounts: i) A/c 0.0.55 - Update Address Book files (0.0.101/102), ii) A/c 0.0.56 - Update Fee schedule (0.0.111), iii) A/c 0.0.57 - Update Exchange Rate (0.0.112).
  102: 'FILE_UPLOADED_PROTO_INVALID', // Fee Schedule Proto uploaded but not valid (append or update is required)
  103: 'FILE_UPLOADED_PROTO_NOT_SAVED_TO_DISK', // Fee Schedule Proto uploaded but not valid (append or update is required)
  104: 'FEE_SCHEDULE_FILE_PART_UPLOADED', // Fee Schedule Proto File Part uploaded
  105: 'EXCHANGE_RATE_CHANGE_LIMIT_EXCEEDED', // The change on Exchange Rate exceeds Exchange_Rate_Allowed_Percentage
};

module.exports = {
  TRANSACTION_RESPONSE_CODE,
  DEFAULT_QUERY_FEE: '100000',
  DEFAULT_TX_FEE: '1000000',
  DEFAULT_CREATE_ACCOUNT_FEE: '80000000',
  HBAR_TO_TINYBAR: '100000000',
  DECIMALS: 8,
  DEFAULT_RENEW_SECONDS: 7890000,
};
