import * as admin from "firebase-admin";
import {
  initiateKYC,
  requestKYCApproval,
  verifyUploadedKYCDoc,
  verifyUploadedKYCSelfie,
} from "./api/kyc";
import { createUserAccount } from "./api/user";

admin.initializeApp();

exports.createUserAccount = createUserAccount;

// KYC
exports.initiateKYC = initiateKYC;
exports.verifyUploadedKYCDoc = verifyUploadedKYCDoc;
exports.verifyUploadedKYCSelfie = verifyUploadedKYCSelfie;
exports.requestKYCApproval = requestKYCApproval;
