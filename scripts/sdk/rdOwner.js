
"use strict";
exports.mainOwner = exports.owner = void 0;

const { ethers } = require("hardhat");
const hre = require('hardhat');

require("dotenv").config();

const adminKey = {
    publicKey: process.env.PUBLIC_KEY,
    privateKey: process.env.PRIVATE_KEY,
};

const getMainOwner = () => {
    return new ethers.Wallet(adminKey.privateKey, ethers.provider);
}
const mainOwner = getMainOwner();
exports.mainOwner = mainOwner;

const getSigner = () => {
    const signer = hre.ethers.provider.getSigner(adminKey.publicKey);
    return signer
}
const owner = getSigner()
exports.owner = owner;


