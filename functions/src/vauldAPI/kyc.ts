import axios from "axios";
import * as functions from "firebase-functions";
import {
  ICreateVauldUserAccountResponseData,
  ICreateVauldUserRequestData,
} from "../sensitive_types/_kyc";
import { signRequest } from "../utils/vauld";

export const createVauldAccount = (
  payload: ICreateVauldUserRequestData
): Promise<ICreateVauldUserAccountResponseData> => {
  return axios.post(
    `${functions.config().vauld.endpoint}/users/create`,
    payload,
    { headers: { hmac: signRequest(payload) } }
  );
};
