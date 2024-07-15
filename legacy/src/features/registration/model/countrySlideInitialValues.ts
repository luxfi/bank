import { businessRolesObject } from "./businessRoles";
import { CountrySlideDto } from "./countrySlideSchema";

export const countrySlideInitialValues: CountrySlideDto = {
  country: "GB",
  businessRole: "",
  companyType: "LIMITED_LIABILITY",
  businessRoleSelect: Object.keys(businessRolesObject)[0],
};
