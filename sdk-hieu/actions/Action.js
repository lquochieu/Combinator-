
const AbiCoder = require('web3-eth-abi');
const { keccak256, padLeft, toHex } = require('web3-utils');
const ActionAbi = require('./Action.json');

class Action {
  constructor(name, contractAddress, paramTypes, args) {
    if (paramTypes.length !== args.length) throw new Error('Parameters/arguments length mismatch');

    this.contractAddress = contractAddress;
    this.paramTypes = paramTypes;
    this.name = name;
    this.args = args;
    this.mappableArgs = args;
  }

  getId() {
    return keccak256(this.name).substr(0, 10);
  }

  _getArgumentMappingWithSlots(subSlots) {
    return this.mappableArgs.map(arg => {
      if (new RegExp(/\$\d+/).test(arg)) {
        if (Array.isArray(arg)) throw TypeError('Input can\'t be mapped to arrays (tuples/structs). Specify `mappableArgs` array in constructor.');
        return parseInt(arg.substr(1));
      }

      if (new RegExp(/&\w+/).test(arg)) {
        if (arg === '&proxy') return 254;
        if (arg === '&eoa') return 255;
        return parseInt(subSlots[arg].index);
      }

      return 0;
    });
  }

  _getArgumentMapping() {
    return this.mappableArgs.map(arg => {
      if (new RegExp(/\$\d+/).test(arg)) {
        if (Array.isArray(arg)) throw TypeError('Input can\'t be mapped to arrays (tuples/structs). Specify `mappableArgs` array in constructor.');
        return parseInt(arg.substr(1));
      }
      return 0;
    });
  }

  #_getPlaceholderForType(type) {
    if (type.startsWith('bytes')) return `0x${'0'.repeat(parseInt(type.substr(5)) * 2)}`;
    if (type === 'address') return `0x${'0'.repeat(40)}`;
    if (type === 'string') return '';
    return '0';
  }

  _parseParamType(paramType, arg) {
    if (typeof (paramType) === 'string') {
      if (paramType.startsWith('(')) {
        let _paramType = paramType.replace('(', '');
        _paramType = _paramType.replace(')', '');
        return _paramType.split(',');
      }
      if (paramType.endsWith('[]')) {
        return Array.from(Array(arg.length).fill(paramType.replace('[]', '')));
      }
    }
    return paramType;
  }

  _replaceWithPlaceholders(arg, paramType) {
    const paramTypeParsed = this._parseParamType(paramType, arg);
    if (Array.isArray(arg)) return arg.map((_arg, i) => this._replaceWithPlaceholders(_arg, paramTypeParsed[i]));
    if (typeof (paramType) === 'string') {
      if (new RegExp(/\$\d+/).test(arg)) return this.#_getPlaceholderForType(paramType);
      if (new RegExp(/&\w+/).test(arg)) return this.#_getPlaceholderForType(paramType);
    }
    return arg;
  }

  _formatType(paramType) {
    if (Array.isArray(paramType)) return `(${paramType.map((_paramType) => this._formatType(_paramType))})`;
    return paramType;
  }

  _encodeForCall() {
    const _arg = this._replaceWithPlaceholders(this.args, this.paramTypes);
    const _paramType = this._formatType(this.paramTypes);
    return [AbiCoder.encodeParameter(_paramType, _arg)];
  }

  encodeForL2DsProxyCall() {
    const executeActionDirectAbi = ActionAbi.find(({ name }) => name === 'executeActionDirect');
    return AbiCoder.encodeFunctionCall(executeActionDirectAbi, this._encodeForCall());
  }

  encodeForL2Recipe() {
    return this._encodeForCall()[0];
  }

  encodeForDsProxyCall() {
    return [this.contractAddress, this.encodeForL2DsProxyCall()];
  }

  encodeForRecipe() {
    return [
      this._encodeForCall()[0],
      '0x0000000000000000000000000000000000000000000000000000000000000000',
      this.getId(),
      this._getArgumentMapping(),
    ];
  }

  encodeForStrategy(subSlots) {
    return [
      this.getId(),
      this._getArgumentMappingWithSlots(subSlots),
    ];
  }

  async getAssetsToApprove() {
    return [];
  }

  async getEthValue() {
    return '0';
  }
}

module.exports = { Action };
