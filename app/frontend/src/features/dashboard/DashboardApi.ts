import * as ApiHelpers from "../../utils/api-helpers";
export const toDoList = async() => {
    const res = await ApiHelpers.fetch("/api/v1/currencycloud/dashboard-info", {
      method: "GET"    
    });
    const {statusCode, data, message} = await res.json();
    if(statusCode === 200){
      return data;
    }
    throw new Error(message || "Couldn't load dashboard information, please try again.");
}