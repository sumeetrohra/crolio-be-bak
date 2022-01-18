import { CallableContext } from "firebase-functions/v1/https";

export const getUID = (context: CallableContext): string => {
  if (!context.auth || !context.auth.uid) {
    throw new Error("Unauthorized");
  }
  return context.auth.uid;
};
