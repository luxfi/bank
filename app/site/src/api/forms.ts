import { dataFetch } from "./fetcher";

export async function ContactSubmit(formData: any): Promise<any> {
  try {
    const response = await dataFetch({
      endpoint: "/api/v1/mail-contact/cdax",
      method: "POST",
      bodyParams: formData,
    });

    const { statusCode, data, message } = response;

    if (statusCode === 200 && data) {
      return {
        data,
        statusCode: statusCode,
      };
    }

    throw new Error(message ?? "");
  } catch (error) {
    throw new Error((error as any)?.message ?? "");
  }
}

export async function NewsLetterJoin(formData: any): Promise<any> {
  try {
    const response = await dataFetch({
      endpoint: "/api/v1/mail-contact/news-letter",
      method: "POST",
      bodyParams: formData,
    });

    const { statusCode, data, message } = response;

    if (statusCode === 200 && data) {
      return {
        data,
        statusCode: statusCode,
      };
    }

    throw new Error(message ?? "");
  } catch (error) {
    throw new Error((error as any)?.message ?? "");
  }
}
