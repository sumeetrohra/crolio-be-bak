import { _vauldBaseRequestData, _vauldBaseResponseData } from "./_baseTypes";

export interface ICreateVauldUserRequestData extends _vauldBaseRequestData {
  userIdentifier: string;
  isCorporate: boolean;
}

interface _VauldCrateUserResponseData {
  message: string;
  userID: string;
}

interface _vauldCrateUserResponse extends _vauldBaseResponseData {
  data?: _VauldCrateUserResponseData;
  error?: _VauldCrateUserResponseData;
}

export interface ICreateVauldUserAccountResponseData {
  data: _vauldCrateUserResponse;
}
