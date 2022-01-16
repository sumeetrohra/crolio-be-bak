import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { ICreateVauldUserRequestData } from "../sensitive_types/_kyc";
import { ICreateUserAccountRequestData } from "../types/kyc";
import { createVauldPayload } from "../utils/vauld";
import { createVauldAccount } from "../vauldAPI/kyc";

export const createUserAccount = functions.https.onCall(
  async (data: ICreateUserAccountRequestData, context) => {
    if (!context.auth || !context.auth.uid) {
      throw new Error("Unauthorized");
    }

    // Create vauld user account
    const userId = context.auth.uid;
    const vauldUserDetails = await createVauldAccount(
      createVauldPayload({
        userIdentifier: userId,
        isCorporate: false,
      }) as ICreateVauldUserRequestData
    );
    const vauldData = vauldUserDetails.data;
    if (!vauldData.success && vauldData.error) {
      throw new Error(vauldData.error?.message);
    }

    // Create vauld firestore account
    const db = admin.firestore();
    const userRef = await db.collection("users").doc(userId);

    await userRef.create({
      userInfo: {
        firstName: data.firstName,
        lastName: data.lastName,
      },
      _private: {
        vauldUserData: {
          userID: vauldData.data?.userID,
          kycStatus: {
            status: "open",
          },
        },
      },
    });

    return {
      success: true,
      data: {
        message: "user created",
        uid: context.auth.uid,
      },
    };
  }
);
