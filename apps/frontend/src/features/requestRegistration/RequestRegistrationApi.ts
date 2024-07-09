import * as ApiHelpers from "../../utils/api-helpers";

export const submitRegistrationRequestFn = async (
  data: any
): Promise<any> => {
  try {
    const res = await ApiHelpers.fetch("/api/v1/invitations/access", {
      method: "POST",
      body: JSON.stringify(data),
    });

    /* if (!res.ok) {
      throw new Error(`Request failed with status ${res}`);
    } */

    return await res.json();
  } catch (error) {
    throw error;
  }
};

