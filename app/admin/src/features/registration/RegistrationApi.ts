import Cookies from "js-cookie";
import * as yup from "yup";
import "yup-phone";
import Constants from "../../Constants";
import * as ApiHelpers from "../../utils/api-helpers";
import { RegistrationData } from "./RegistrationSlice";
import { AdminInvitationDto } from "./model/AdminInvitationDto";
import { UserMetadataDto } from "./model/UserMetadataDto";

export const verificationSchema = yup.object({
  mobileNumber: yup.string().phone().required(),
});
export type VerificationDto = yup.TypeOf<typeof verificationSchema>;

export const checkVerificationSchema = yup.object({
  mobileNumber: yup.string().phone(),
  verificationCode: yup.string().length(6),
});
export type CheckVerificationDto = yup.TypeOf<typeof checkVerificationSchema>;

export const checkVerificationBasisSchema = yup.object({
  mobileNumber: yup.string().phone(),
  code1: yup.string().length(1).required("Please enter code 1."),
  code2: yup.string().length(1).required("Please enter code 2."),
  code3: yup.string().length(1).required("Please enter code 3."),
  code4: yup.string().length(1).required("Please enter code 4."),
  code5: yup.string().length(1).required("Please enter code 5."),
  code6: yup.string().length(1).required("Please enter code 6."),
});
export type CheckVerificationBasisDto = yup.TypeOf<
  typeof checkVerificationBasisSchema
>;

export const emailExists = async (email: string): Promise<any> => {
  const res = await ApiHelpers.fetch(
    `/api/v1/admin/users/${encodeURIComponent(email)}/exists`,
    { method: "GET" }
  );

  const { data, statusCode, error, message } = await res.json();

  if (statusCode !== 200) {
    const err = {
      statusCode,
      message,
      error,
    };
    throw err;
  }

  return data;
};

export const verifyMobile = async (data: VerificationDto): Promise<boolean> => {
  try {
    const res = await ApiHelpers.fetch("/api/v1/auth/mobile/verify", {
      method: "POST",
      body: JSON.stringify(data),
    });

    const {
      data: { verified },
      statusCode,
    } = await res.json();
    if (statusCode !== 200) {
      new Error("Mobile verification failed, please try again.");
    }

    return verified;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export const checkVerifyMobile = async (
  check_data: CheckVerificationDto
): Promise<boolean> => {
  try {
    // console.log('check', data);

    const res = await ApiHelpers.fetch("/api/v1/auth/mobile/check", {
      method: "POST",
      body: JSON.stringify(check_data),
    });

    const { data, message, statusCode } = await res.json();
    if (statusCode !== 200) {
      new Error(message);
      return false;
    }
    const verified = data.verified;
    return verified;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export const register = async (data: RegistrationData): Promise<any> => {
  const res = await ApiHelpers.fetch("/api/v1/users", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (res.ok) {
    const {
      data: { user, credentials },
    } = await res.json();

    // log in the user to continue registration
    //if (isInUk(data.country)) {
    Cookies.set(Constants.JWT_COOKIE_NAME, credentials?.accessToken);
    //}

    return { user };
  } else {
    return { error: await res.json() };
  }
};

export const submitUserMetadata = async (
  data: UserMetadataDto
): Promise<any> => {
  const res = await ApiHelpers.fetch("/api/v1/users/current/metadata", {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (res.ok) {
    const {
      data: { user },
    } = await res.json();

    return user;
  } else {
    const data = await res.json();
    return data;
  }
};

export const acceptTerms = async (): Promise<any> => {
  const res = await ApiHelpers.fetch("/api/v1/users/current/terms", {
    method: "POST",
    body: JSON.stringify({ terms: true }),
  });

  if (res.ok) {
    const {
      data: { user },
    } = await res.json();

    return user;
  }

  throw new Error("Submission failed, please try again.");
};

export const resetPasswordFromAdminInvitation = async (
  data: AdminInvitationDto
): Promise<any> => {
  const res = await ApiHelpers.fetch("/api/v1/users/invited", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (res.ok) {
    const user = await res.json();
    return user;
  }
  const error = await res.json();
  if (error.message) throw new Error(error.message);
  else throw new Error("Sorry, something broke. Please try again.");
};
