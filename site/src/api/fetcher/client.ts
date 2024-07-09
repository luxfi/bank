import { IFetchBase } from "./types";

export async function getFetchBaseClient(): Promise<IFetchBase> {
  const path = process.env.NEXT_PUBLIC_BASE_URL || "";

  const options = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };

  return {
    options: options,
    baseURL: path,
  };
}
