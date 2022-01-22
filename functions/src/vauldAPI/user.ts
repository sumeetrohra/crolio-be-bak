import {
  ICreateVauldUserRequestData,
  ICreateVauldUserAccountResponseData,
} from "../sensitive_types/_user";
import request from "./_axiosInstance";

export const createVauldAccount = (
  payload: ICreateVauldUserRequestData
): Promise<ICreateVauldUserAccountResponseData> => {
  return request<ICreateVauldUserAccountResponseData>("/users/create", payload);
};
