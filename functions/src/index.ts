import * as admin from "firebase-admin";
import { initiateKYC, verifyUploadedKYCDoc } from "./api/kyc";
import { createUserAccount } from "./api/user";

admin.initializeApp();

exports.createUserAccount = createUserAccount;

// KYC
exports.initiateKYC = initiateKYC;
exports.verifyUploadedKYCDoc = verifyUploadedKYCDoc;
