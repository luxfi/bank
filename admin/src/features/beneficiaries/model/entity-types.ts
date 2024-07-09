export const entityTypes: Map<string, string> = new Map(
  Object.entries({
    business: "Business",
    individual: "Individual",
  })
);

export const companyTypes: Map<string, string> = new Map(
  Object.entries({
    LIMITED_LIABILITY: "Limited Liability",
    SOLE_TRADER: "Sole Trader",
    PARTNERSHIP: "Partnership",
    CHARITY: "Charity",
    JOINT_STOCK_COMPANY: "Joint Stock Company",
    PUBLIC_LIMITED_COMPANY: "Public Limited Company",
  })
);
