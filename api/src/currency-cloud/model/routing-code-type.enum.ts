export enum RoutingCodeType {
    SortCode = 'sort_code',
    ABA = 'aba',
    BsbCode = 'bsb_code',
    InstitutionNo = 'institution_no',
    BankCode = 'bank_code',
    BranchCode = 'branch_code',
    CLABE = 'clabe',
    CNAPS = 'cnaps',
    IFSC = 'ifsc'
}


export const getRoutingCodeByCountry = (country: string) => {
    switch (country) {
        case 'GB':
            return RoutingCodeType.SortCode;
        case 'US':
            return RoutingCodeType.ABA;
        case 'AU':
            return RoutingCodeType.BsbCode;
        case 'XX':
            return RoutingCodeType.BranchCode;
        case 'MX':
            return RoutingCodeType.CLABE;
        case 'CN':
            return RoutingCodeType.CNAPS;
        case 'IN':
            return RoutingCodeType.IFSC;
        default:
            break;
    }
    return null;
};