export enum RoutingCodeType {
    SortCode = 'SORT_CODE', //UK
    ABA = 'ABA', //US
    BlzCode = 'BLZ_CODE', //Germany
    BsbCode = 'BSB_CODE', //Australia
    BranchCode = 'BRANCH_CODE', // ?
    CLABE = 'CLABE_CODE', //Mexico
    //CNAPS = 'cnaps',
    CTN = 'CTN', // China
    IFSC = 'IFS_CODE', // INDIA
}

export const getRoutingCodeByCountry = (country: string) => {
    switch (country) {
        case 'GB':
            return RoutingCodeType.SortCode;
        case 'US':
            return RoutingCodeType.ABA;
        case 'DE':
            return RoutingCodeType.BlzCode;
        case 'AU':
            return RoutingCodeType.BsbCode;
        case 'XX':
            return RoutingCodeType.BranchCode;
        case 'MX':
            return RoutingCodeType.CLABE;
        case 'CN':
            return RoutingCodeType.CTN;
        case 'IN':
            return RoutingCodeType.IFSC;
        default:
            break;
    }
    return null;
}
