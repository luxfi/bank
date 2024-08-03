import Constants from "../Constants";
import Cookies from "js-cookie";

const apiCall = (
  endpoint: string,
  options: RequestInit,
  changeGateway = true
) => {
  const token = Cookies.get(Constants.JWT_COOKIE_NAME);

  options.headers = {
    Accept: "application/json",
    ...options.headers,
  } as { [key: string]: string };

  if (!(options.body instanceof FormData)) {
    options.headers["Content-Type"] = "application/json";
  }

  if (token && !options.headers.Authorization) {
    options.headers.Authorization = `Bearer ${token}`;
  }
  const gateway = window.localStorage.getItem("gateway") || "currencycloud";
  if(changeGateway) endpoint = endpoint.replace("currencycloud", gateway);
  // console.log(`${Constants.API_BASE_URL}${endpoint}`, 'option', options);
  return fetch(`${Constants.API_BASE_URL}${endpoint}`, { ...options });
};
export { apiCall as fetch };
