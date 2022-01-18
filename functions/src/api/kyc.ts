import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { getUID } from "../utils/auth";
import {
  initiateVauldKYC,
  requestVauldKYCDocsUploadURL,
  verifyVauldUploadedKYCDoc,
} from "../vauldAPI/kyc";
import {
  IVerifyUploadedDocRequestData,
  UploadedKYCDocType,
} from "../types/kyc";
import { IVerifyVauldKYCUploadedDocRequestData } from "../sensitive_types/_kyc";

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
