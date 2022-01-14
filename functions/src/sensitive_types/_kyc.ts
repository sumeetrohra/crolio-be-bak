export interface ICreateVauldUserRequestData {
  orgID: string;
  userIdentifier: string;
  isCorporate: boolean;
}

interface _VauldCrateUserResponseData {
  message: string;
  userID: string;
}

interface _VauldCrateUserResponse {
  success: boolean;
  data?: _VauldCrateUserResponseData;
  error?: _VauldCrateUserResponseData;
}

export interface ICreateVauldUserAccountResponseData {
  data: _VauldCrateUserResponse;
}
