import * as admin from "firebase-admin";
import { createUserAccount } from "./api/user";

admin.initializeApp();

exports.createUserAccount = createUserAccount;
