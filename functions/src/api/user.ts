import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { ICreateUserAccountRequestData } from "../types/kyc";
import { createVauldAccount } from "../vauldAPI/user";
import { getUID } from "../utils/auth";

export const createUserAccount = functions.https.onCall(
  async (data: ICreateUserAccountRequestData, context) => {
    const userId = getUID(context);

    // Create vauld user account
    const vauldUserDetails = await createVauldAccount({
      userIdentifier: userId,
      isCorporate: false,
    });

    const vauldData = vauldUserDetails.data;
    if (!vauldData.success && vauldData.error) {
      functions.logger.log(
        "User creation failed, here's the response from vauld: ",
        vauldData
      );
      throw new Error(vauldData.error?.message);
    }

    // Create vauld firestore account
    const db = admin.firestore();
    const userRef = await db.collection("users").doc(userId);

    const today = new Date();

    await userRef.create({
      userInfo: {
        firstName: data.firstName,
        lastName: data.lastName,
        createdAt: today,
        updatedAt: today,
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
        uid: userId,
      },
    };
  }
);
