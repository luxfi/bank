import Cookies from "js-cookie";
import * as yup from "yup";
import Constants from "../../Constants";
import * as ApiHelpers from "../../utils/api-helpers";
import {
  AccountResponse,
  ContactResponse,
} from "../accounts/model/account-response";
import { UserRole } from "./user-role.enum";

export interface User {
  uuid: string;
  name: string;
  username: string;
  firstname: string;
  lastname: string;
  role: UserRole;
  isMetadataSet: boolean;
  isSubAccount: boolean;
  hasAcceptedTerms?: boolean;
  accountType: string;
  currencyCloudPasswordUrl: string;
  invitedBy?: string;
  complyLaunchId?: string;
  isApproved: boolean;
  country: string;
  is2FAOK?: boolean;
  archivedAt?: string;
  contact: ContactResponse;
  clients?: Array<IClient>;
  currentClient?: ICurrentClient;
  mobileNumber?: string;
}
export interface IClient {
  uuid: string;
  createdAt: string;
  updatedAt: string;
  email: string;
  name: string;
}

export interface ICurrentClient extends IClient {
  account: AccountResponse;
}

export interface ForgotPasswordData {
  email: string;
}

export const forgotPasswordDtoSchema = yup.object({
  email: yup.string().email("Please enter the email address.").required(),
});
export const loginDtoSchema = yup.object({
  username: yup
    .string()
    .email("Please enter the email address.")
    .required("Please enter the email address."),
  password: yup.string().required("Please enter the password."),
});
export type LoginDto = yup.TypeOf<typeof loginDtoSchema>;

export const verifyEmailDtoSchema = yup.object({
  email: yup.string().email().required(),
  code: yup.string().required(),
});
export type VerifyEmailDto = yup.TypeOf<typeof verifyEmailDtoSchema>;

export const logout = async () => {
  Cookies.remove(Constants.JWT_COOKIE_NAME);
};
export const check2FAVerificationSchema = yup.object({
  verificationCode: yup.string().length(6),
});
export type Check2FAVerificationDto = yup.TypeOf<
  typeof check2FAVerificationSchema
> & {
  provider?: "sms" | "email";
};

export const login2FA = async (
  check_data: Check2FAVerificationDto
): Promise<string | User | boolean> => {
  try {
    const res = await ApiHelpers.fetch("/api/v1/2fa/verification/check", {
      method: "POST",
      body: JSON.stringify({
        provider: check_data.provider,
        code: check_data.verificationCode,
      }),
    });

    if (res.ok) {
      const {
        data: {
          user,
          credentials: { accessToken },
        },
      } = await res.json();
      Cookies.set(Constants.JWT_COOKIE_NAME, accessToken);

      return user;
    } else {
      const { data, message, statusCode } = await res.json();
      if (statusCode !== 200) {
        return message;
      }
      const verified = data.verified;
      return verified;
    }
  } catch (err) {
    console.error(err);
    return false;
  }
};

export const login = async (data: LoginDto): Promise<User> => {
  try {
    const res = await ApiHelpers.fetch("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (res.ok) {
      const {
        data: {
          user,
          credentials: { accessToken },
        },
      } = await res.json();
      Cookies.set(Constants.JWT_COOKIE_NAME, accessToken);

      return user;
    }

    const body = await res.text();
    const message = JSON.parse(body)?.message;
    throw new Error(message);
  } catch (err) {
    throw err;
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  const res = await ApiHelpers.fetch("/api/v1/users/current", {
    method: "GET",
  });
  const {
    data: { user },
  } = await res.json();

  if (user) {
    return user;
  }

  return null;
};

export const changeCurrentClient = async (uuid: string): Promise<User> => {
  try {
    const res = await ApiHelpers.fetch(`/api/v1/clients/${uuid}`, {
      method: "GET",
    });

    if (res.ok) {
      const {
        data: {
          user,
          credentials: { accessToken },
        },
      } = await res.json();
      Cookies.set(Constants.JWT_COOKIE_NAME, accessToken);

      return user;
    }

    const body = await res.text();
    const message = JSON.parse(body)?.message;
    throw new Error(message);
  } catch (err) {
    throw err;
  }
};

export const verifyEmail = async (data: VerifyEmailDto): Promise<boolean> => {
  const res = await ApiHelpers.fetch(`/api/v1/users/${data.email}/verify`, {
    method: "POST",
    body: JSON.stringify({ code: data.code }),
  });

  if (res.ok) {
    const {
      data: { verified },
    } = await res.json();
    return verified;
  } else {
    const text = await res.text();
    const body = JSON.parse(text);
    if (body?.message) {
      throw new Error(body.message);
    }

    throw new Error("Verification failed, please try again.");
  }
};

export const forgotPassword = async (
  data: ForgotPasswordData
): Promise<boolean> => {
  const res = await ApiHelpers.fetch("/api/v1/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify(data),
  });

  const { statusCode, message } = await res.json();

  if (statusCode === 200) {
    return true;
  }

  if (message) {
    throw new Error(message);
  }
  throw new Error("Sorry. Something went wrong.");
};

export const resend2faCode = async (
  provider: "sms" | "email"
): Promise<any> => {
  const res = await ApiHelpers.fetch("/api/v1/2fa/verification/send", {
    method: "POST",
    body: JSON.stringify({ provider: provider }),
  });

  const { statusCode, message } = await res.json();

  if (statusCode === 200) {
    return true;
  }

  if (message) {
    throw new Error(message);
  }
  throw new Error("Sorry. Something went wrong.");
};
