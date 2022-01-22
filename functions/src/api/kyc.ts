import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { getUID } from "../utils/auth";
import {
  approveVauldInstantKYC,
  initiateVauldKYC,
  initiateVauldManualKYCVerification,
  requestVauldKYCDocsUploadURL,
  verifyVauldUploadedKYCDoc,
  verifyVauldUploadedSelfie,
} from "../vauldAPI/kyc";
import {
  IVerifyUploadedDocRequestData,
  UploadedKYCDocType,
} from "../types/kyc";
import {
  IApproveVauldInstantKYCRequestData,
  IVerifyVauldKYCUploadedDocRequestData,
  IVerifyVauldKYCUploadedSelfieRequestData,
} from "../sensitive_types/_kyc";

// TODO: Add return types here to make it easier to find types
export const initiateKYC = functions.https.onCall(async (data, context) => {
  const userId = getUID(context);

  // TODO: Abstract out crud methods
  // Get user data
  const db = admin.firestore();
  const userRef = await db.collection("users").doc(userId).get();
  const userData = userRef.data();

  // initiate kyc
  const result = await initiateVauldKYC({
    docType: UploadedKYCDocType.AADHAR,
    userID: userData?._private.vauldUserData.userID,
  });

  if (!result.success) {
    throw new Error("Couldn't initiate kyc with vauld");
  }

  const docsUploadURLs = await requestVauldKYCDocsUploadURL({
    userID: userData?._private.vauldUserData.userID,
  });

  return docsUploadURLs;
});

export const verifyUploadedKYCDoc = functions.https.onCall(
  async (data: IVerifyUploadedDocRequestData, context) => {
    const userId = getUID(context);

    // TODO: Abstract out crud methods
    // Get user data
    const db = admin.firestore();
    const userRef = await db.collection("users").doc(userId).get();
    const userData = userRef.data();

    let payload: IVerifyVauldKYCUploadedDocRequestData = {
      documentType: data.documentType,
      userID: userData?._private.vauldUserData.userID,
    };
    if (data.documentType === UploadedKYCDocType.AADHAR) {
      payload = { ...payload, frontOrBack: data.frontOrBack };
    }
    const result = await verifyVauldUploadedKYCDoc(payload);

    return result;
  }
);

export const verifyUploadedKYCSelfie = functions.https.onCall(
  async (data, context) => {
    const userId = getUID(context);

    // TODO: Abstract out crud methods
    // Get user data
    const db = admin.firestore();
    const userRef = await db.collection("users").doc(userId).get();
    const userData = userRef.data();

    const payload: IVerifyVauldKYCUploadedSelfieRequestData = {
      userID: userData?._private.vauldUserData.userID,
    };

    const result = await verifyVauldUploadedSelfie(payload);

    return result;
  }
);

export const requestKYCApproval = functions.https.onCall(
  async (data, context) => {
    const userId = getUID(context);

    // TODO: Abstract out crud methods
    // Get user data
    const db = admin.firestore();
    const userRef = await db.collection("users").doc(userId).get();
    const userData = userRef.data();

    const payload: IApproveVauldInstantKYCRequestData = {
      userID: userData?._private.vauldUserData.userID,
    };

    const result = await approveVauldInstantKYC(payload);

    if (result.success) {
      return result;
    }

    const manualKYCResult = await initiateVauldManualKYCVerification(payload);

    return manualKYCResult;
  }
);
