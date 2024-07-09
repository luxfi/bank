/*
Bahrain (SWIFT payments in all currencies)
China (SWIFT CNY payments only)
India (local INR payments to India only)
Malaysia (local MYR payments to Malaysia only)
United Arab Emirates (SWIFT payments in all currencies)
*/
export const getPaymentReasonOptions = (gateway: string, country: string, currency: string, beneficiary_type: string) => {
    let paymentReasonOptions: Map<string, string> = new Map();
    if (gateway === 'openpayd') return paymentReasonOptions;
    paymentReasonOptions.set("-1", "Select Payment Purpose");
    if (country === 'BH') {
        paymentReasonOptions.set('GDE', `GDE - Goods sold (Exports in fob value)`);
        paymentReasonOptions.set('GDI', `GDI - Goods bought (Imports in cif value)`);
        paymentReasonOptions.set('STS', `STS - Sea Transport`);
        paymentReasonOptions.set('ATS', `ATS - Air transport`);
        paymentReasonOptions.set('OTS', `OTS - OTS Other methods of transport (including Postal and courier services)`);
        paymentReasonOptions.set('STR', `STR - Travel`);
        paymentReasonOptions.set('GMS', `GMS - Processing repair and maintenance services on goods`);
        paymentReasonOptions.set('SCO', `SCO - Construction`);
        paymentReasonOptions.set('INS', `INS - Insurance Services`);
        paymentReasonOptions.set('FIS', `FIS - Financial Services`);
        paymentReasonOptions.set('IPC', `IPC - Charges for the use of intellectual property royalties`);
        paymentReasonOptions.set('TCS', `TCS - Telecommunications services`);
        paymentReasonOptions.set('ITS', `ITS - Computer services`);
        paymentReasonOptions.set('IFS', `IFS - Information services`);
        paymentReasonOptions.set('RDS', `RDS - Research and development services`);
        paymentReasonOptions.set('PMS', `PMS - Professional and management consulting services`);
        paymentReasonOptions.set('TTS', `TTS - Technical, trade- related and other business services`);
        paymentReasonOptions.set('PRS', `PRS - Personal, cultural, audiovisual and recreational services`);
        paymentReasonOptions.set('IGD', `IGD - Dividends intragroup`);
        paymentReasonOptions.set('IID', `IID - Interest on debt intragroup`);
        paymentReasonOptions.set('PIP', `PIP - Profits on Islamic products`);
        paymentReasonOptions.set('PRR', `PRR - Profits or rents on real estate`);
        paymentReasonOptions.set('DOE', `DOE - Dividends on equity not Intragroup`);
        paymentReasonOptions.set('ISH', `ISH - Income on investment funds shares`);
        paymentReasonOptions.set('ISL', `ISL - Interest on securities more than a year`);
        paymentReasonOptions.set('ISS', `ISS - Interest on securities less than a year`);
        paymentReasonOptions.set('IOL', `IOL - Income on loans`);
        paymentReasonOptions.set('IOD', `IOD - Income on deposits`);
        paymentReasonOptions.set('GOS', `GOS - Government goods and services embassies etc`);
        paymentReasonOptions.set('GRI', `GRI - Government related income taxes, tariffs, capital transfers, etc`);
        paymentReasonOptions.set('CHC', `CHC - Charitable Contributions (Charity and Aid)`);
        paymentReasonOptions.set('FAM', `FAM - Family Support (Workers’ remittances)`);
        paymentReasonOptions.set('SAL', `SAL - Salary (Compensation of employees)`);
        paymentReasonOptions.set('PPA', `PPA - Purchase of real estate abroad from residents`);
        paymentReasonOptions.set('PPL', `PPL - Purchase of real estate in Bahrain from non-residents`);
        paymentReasonOptions.set('CEA', `CEA - Equity and Investment fund shares for the establishment of new company from residents abroad, equity of merger or acquisition of companies abroad from residents and participation to capital increase of related companies abroad`);
        paymentReasonOptions.set('DSF', `DSF - Debt instruments Intragroup foreign securities`);
        paymentReasonOptions.set('REL', `REL - Reverse equity share in Bahrain`);
        paymentReasonOptions.set('RDL', `RDL - Reverse debt instruments in Bahrain`);
        paymentReasonOptions.set('FSA', `FSA - Equity other than investment fund shares in not related companies abroad`);
        paymentReasonOptions.set('FIA', `FIA - Investment fund shares foreign`);
        paymentReasonOptions.set('DSA', `DSA - Purchases and sales of foreign debt securities in not related companies- Less than a year`);
        paymentReasonOptions.set('DLA', `DLA - Purchases and sales of foreign debt securities in not related companies- More than a year`);
        paymentReasonOptions.set('FDA', `FDA - Financial derivatives foreign`);
        paymentReasonOptions.set('DLF', `DLF - Debt Instruments Intragroup loans, deposits foreign (above 10% share)`);
        paymentReasonOptions.set('AFA', `AFA - Receipts or payments from personal residents bank account or deposits abroad`);
        paymentReasonOptions.set('SLA', `SLA - Loans- Drawings or Repayments on loans extended to nonresidents- Short-term`);
        paymentReasonOptions.set('LLA', `LLA - Loans- Drawings or Repayments on loans extended to nonresidents- Long-term`);
        paymentReasonOptions.set('LEA', `LEA - Leasing abroad`);
        paymentReasonOptions.set('RFS', `RFS - Repos on foreign securities`);
        paymentReasonOptions.set('TCR', `TCR - Trade credits and advances receivable`);
        paymentReasonOptions.set('CEL', `CEL - Equity and Investment fund shares for the establishment of new company in Bahrain from non-residents, equity of merger or acquisition of companies in Bahrain from non-residents and participation to capital increase of related companies from non-residents in Bahrain`);
        paymentReasonOptions.set('LDS', `LDS - Debt instruments intragroup securities in Bahrain`);
        paymentReasonOptions.set('REA', `REA - Reverse equity share abroad`);
        paymentReasonOptions.set('RDA', `RDA - Reverse debt instruments abroad`);
        paymentReasonOptions.set('FSL', `FSL - Equity other than investment fund shares in not related companies in Bahrain`);
        paymentReasonOptions.set('FIL', `FIL - Investment fund shares in Bahrain`);
        paymentReasonOptions.set('DSL', `DSL - Purchases and sales of securities issued by residents in not related companies- Less than a year`);
        paymentReasonOptions.set('DLL', `DLL - Purchases and sales of securities issued by residents in not related companies- More than a year`);
        paymentReasonOptions.set('FDL', `FDL - Financial derivatives in Bahrain`);
        paymentReasonOptions.set('LDL', `LDL - Debt Instruments Intragroup loans, deposits in Bahrain (above 10% share)`);
        paymentReasonOptions.set('AFL', `AFL - Receipts or payments from personal nonresidents bank account in Bahrain`);
        paymentReasonOptions.set('SLL', `SLL - Loans- Drawings or Repayments on foreign loans extended to residents- Short-term`);
        paymentReasonOptions.set('LLL', `LLL - Loans- Drawings or Repayments on foreign loans extended to residents- Long-term`);
        paymentReasonOptions.set('LEL', `LEL - Leasing in Bahrain`);
        paymentReasonOptions.set('RLS', `RLS - Repos on securities issued by residents`);
        paymentReasonOptions.set('TCP', `TCP - Trade credits and advances payable`);
    } else if (currency === 'CNY') {
        paymentReasonOptions.set('CTF', `CTF - Cross-border capital transfer`);
        paymentReasonOptions.set('GOD', `GOD - Cross-border goods trade`);
        paymentReasonOptions.set('STR', `STR - Cross-border service transfer`);
        paymentReasonOptions.set('RMT', `RMT - Cross-border individual remittance`);
        paymentReasonOptions.set('OTF', `OTF - Other transfers`);
    } else if (currency === 'INR' && country === 'IN') {
        
        paymentReasonOptions.set('advertising', `advertising - Advertising and public relations-related expenses`);
        paymentReasonOptions.set('advisor_fees', `advisor_fees - Fees for advisory, technical, academic or specialist assistance`);
        paymentReasonOptions.set('construction', `construction - Construction costs/expenses`);
        paymentReasonOptions.set('delivery', `delivery - Delivery fees for goods`);
        if (beneficiary_type == 'individual') {
            paymentReasonOptions.set('education', `education - Education-related student expenses`);
        } 
        paymentReasonOptions.set('exports', `exports - Payments for exported goods`);
        paymentReasonOptions.set('family', `family - Family maintenance`);
        if (beneficiary_type == 'individual') {
            paymentReasonOptions.set('fund_investment', `fund_investment - Mutual fund investment`);
        }
        paymentReasonOptions.set('goods', `goods - Trade settlement for goods and general goods trades`);
        if (beneficiary_type == 'individual') {
            paymentReasonOptions.set('hotel', `hotel - Hotel accommodation`);
        }
        paymentReasonOptions.set('insurance_claims', `insurance_claims - Insurance claims payment`);
        if (beneficiary_type == 'individual') {
            paymentReasonOptions.set('insurance_premium', `insurance_premium - Insurance premium`);
            paymentReasonOptions.set('loan_repayment', `loan_repayment - Repayment of loans`);
            paymentReasonOptions.set('medical', `medical - Medical treatment and expenses`);
        }
        paymentReasonOptions.set('office', `office - Representative office expenses`);
        paymentReasonOptions.set('other_fees', `other_fees - Broker, front end, commitment, guarantee and custodian fees`);
        if (beneficiary_type == 'individual') {
            paymentReasonOptions.set('property_purchase', `property_purchase - Purchase of residential property`);
        }
        paymentReasonOptions.set('royalties', `royalties - Royalty, trademark, patent and copyright fees`);
        paymentReasonOptions.set('services', `services - Information service charges`);
        if (beneficiary_type == 'individual') {
            paymentReasonOptions.set('share_investment', `share_investment - Investment in shares`);
            paymentReasonOptions.set('tax', `tax - Tax payment`);
        }
        paymentReasonOptions.set('transfer', `transfer - Transfer to own account`);
        paymentReasonOptions.set('transportation', `transportation - Transportation fees for goods`);
        if (beneficiary_type == 'individual') {
            paymentReasonOptions.set('travel', `travel - Travel`);
            paymentReasonOptions.set('utilities', `utilities - Utility bills`);
        }
    } else if (currency === 'MYR' && country === 'MY') {
        paymentReasonOptions.set('advertising', `advertising - Advertising and public relations-related expenses`);
        paymentReasonOptions.set('advisor_fees', `advisor_fees - Fees for advisory, technical, academic or specialist assistance`);
        paymentReasonOptions.set('business_insurance', `business_insurance - Product indemnity insurance`);
        paymentReasonOptions.set('construction', `construction - Construction costs/expenses`);
        paymentReasonOptions.set('delivery', `delivery - Delivery fees for goods`);
        paymentReasonOptions.set('education', `education - Education-related student expenses`);
        paymentReasonOptions.set('exports', `exports - Payments for exported goods`);
        paymentReasonOptions.set('family', `family - Family maintenance`);
        paymentReasonOptions.set('fund_investment', `fund_investment - Mutual fund investment`);
        paymentReasonOptions.set('homesend', `homesend - Homesend Payments`);
        paymentReasonOptions.set('hotel', `hotel - Hotel accommodation`);
        paymentReasonOptions.set('insurance_claims', `insurance_claims - Insurance claims payment`);
        paymentReasonOptions.set('insurance_premium', `insurance_premium - Insurance premium`);
        paymentReasonOptions.set('loan_repayment', `loan_repayment - Repayment of loans`);
        paymentReasonOptions.set('medical', `medical - Medical treatment and expenses`);
        paymentReasonOptions.set('office', `office - Representative office expenses`);
        paymentReasonOptions.set('other_fees', `other_fees - Broker, front end, commitment, guarantee and custodian fees`);
        paymentReasonOptions.set('property_purchase', `property_purchase - Purchase of residential property`);
        paymentReasonOptions.set('property_rental', `property_rental - Property rental payment`);
        paymentReasonOptions.set('royalties', `royalties - Royalty, trademark, patent and copyright fees`);
        paymentReasonOptions.set('services', `services - Information service charges`);
        paymentReasonOptions.set('share_investment', `share_investment - Investment in shares`);
        paymentReasonOptions.set('tax', `tax - Tax payment`);
        paymentReasonOptions.set('transfer', `transfer - Transfer to own account`);
        paymentReasonOptions.set('transportation', `transportation - Transportation fees for goods`);
        paymentReasonOptions.set('travel', `travel - Travel`);
        paymentReasonOptions.set('utilities', `utilities - Utility bills`);
    } else if (country === 'AE') {
        paymentReasonOptions.set('ACM', `ACM - Agency Commission`);
        paymentReasonOptions.set('AES', `AES - Advance payment against EOS`);
        paymentReasonOptions.set('AFA', `AFA - Receipts or payments from personal residents bank account or deposits abroad`);
        paymentReasonOptions.set('AFL', `AFL - Receipts or payments from personal non-resident bank account in the UAE`);
        paymentReasonOptions.set('ALW', `ALW - Allowances`);
        paymentReasonOptions.set('ATS', `ATS - Air transport`);
        paymentReasonOptions.set('BON', `BON - Bonus`);
        paymentReasonOptions.set('CCP', `CCP - Corporate Card Payment`);
        paymentReasonOptions.set('CEA', `CEA - Equity and investment fund shares for the establishment of new company from residents abroad, equity of merger or acquisition of companies abroad from residents and participation to capital increase of related companies abroad`);
        paymentReasonOptions.set('CEL', `CEL - Equity and investment fund shares for the establishment of new company in the UAE from non-residents, equity of merger or acquisition of companies in the UAE from non-residents and participation to capital increase of related companies from non-residents in the UAE`);
        paymentReasonOptions.set('CHC', `CHC - Charitable Contributions`);
        paymentReasonOptions.set('CIN', `CIN - Commercial Investments`);
        paymentReasonOptions.set('COM', `COM - Commission`);
        paymentReasonOptions.set('COP', `COP - Compensation`);
        paymentReasonOptions.set('CRP', `CRP - Credit Card Payments`);
        paymentReasonOptions.set('DCP', `DCP - Pre-Paid Reloadable & Personalized Debit Card Payments`);
        paymentReasonOptions.set('DIV', `DIV - Dividend Payouts`);
        paymentReasonOptions.set('DLA', `DLA - Purchases and sales of foreign debt securities in not related companies – More than a year`);
        paymentReasonOptions.set('DLF', `DLF - Debt instruments intragroup loans, deposits foreign`);
        paymentReasonOptions.set('DLL', `DLL - Purchases and sales of securities issued by residents in not related companies – More than a year`);
        paymentReasonOptions.set('DOE', `DOE - Dividends on equity not intra group`);
        paymentReasonOptions.set('DSA', `DSA - Purchases and sales of foreign debt securities in not related companies – Less than a year`);
        paymentReasonOptions.set('DSF', `DSF - Debt instruments intragroup foreign securities`);
        paymentReasonOptions.set('DSL', `DSL - Purchases and sales of securities issued by residents in not related companies – Less than a year`);
        paymentReasonOptions.set('EDU', `EDU - Educational Support`);
        paymentReasonOptions.set('EMI', `EMI - Equated Monthly Instalments`);
        paymentReasonOptions.set('EOS', `EOS - End of Service`);
        paymentReasonOptions.set('FAM', `FAM - Family Support`);
        paymentReasonOptions.set('FDA', `FDA - Financial derivatives foreign`);
        paymentReasonOptions.set('FDL', `FDL - Financial derivatives in the UAE`);
        paymentReasonOptions.set('FIA', `FIA - Investment fund shares foreign`);
        paymentReasonOptions.set('FIL', `FIL - Investment fund shares in the UAE`);
        paymentReasonOptions.set('FIS', `FIS - Financial services`);
        paymentReasonOptions.set('FSA', `FSA - Equity other than investment fund shares in not related companies abroad`);
        paymentReasonOptions.set('FSL', `FSL - Equity other than investment fund shares in not related companies in the UAE`);
        paymentReasonOptions.set('GDE', `GDE - Goods Sold`);
        paymentReasonOptions.set('GDI', `GDI - Goods bought`);
        paymentReasonOptions.set('GMS', `GMS - Processing repair and maintenance services on goods`);
        paymentReasonOptions.set('GOS', `GOS - Government goods and services embassies etc`);
        paymentReasonOptions.set('GRI', `GRI - Government related income taxes tariffs capital transfers etc`);
        paymentReasonOptions.set('IFS', `IFS - Information services`);
        paymentReasonOptions.set('IGD', `IGD - Intra group dividends`);
        paymentReasonOptions.set('IGT', `IGT - Inter group transfer`);
        paymentReasonOptions.set('IID', `IID - Intra group interest on debt`);
        paymentReasonOptions.set('INS', `INS - Insurance services`);
        paymentReasonOptions.set('IOD', `IOD - Income on deposits`);
        paymentReasonOptions.set('IOL', `IOL - Income on loans`);
        paymentReasonOptions.set('IPC', `IPC - Charges for the use of intellectual property royalties`);
        paymentReasonOptions.set('IPO', `IPO - IPO subscriptions`);
        paymentReasonOptions.set('IRP', `IRP - Interest rate swap payments`);
        paymentReasonOptions.set('IRW', `IRW - Interest rate unwind payments`);
        paymentReasonOptions.set('ISH', `ISH - Income on investment funds share`);
        paymentReasonOptions.set('ISL', `ISL - Interest on securities more than a year`);
        paymentReasonOptions.set('ISS', `ISS - Interest on securities less than a year`);
        paymentReasonOptions.set('ITS', `ITS - Computer services`);
        paymentReasonOptions.set('LAS', `LAS - Leave salary`);
        paymentReasonOptions.set('LDL', `LDL - Debt instruments intragroup loans, deposits in the UAE`);
        paymentReasonOptions.set('LDS', `LDS - Debt instruments intragroup securities in the UAE`);
        paymentReasonOptions.set('LEA', `LEA - Leasing abroad`);
        paymentReasonOptions.set('LEL', `LEL - Leasing in the UAE`);
        paymentReasonOptions.set('LIP', `LIP - Loan interest payments`);
        paymentReasonOptions.set('LLA', `LLA - Loans – Drawings or Repayments on loans extended to nonresidents – Long-term`);
        paymentReasonOptions.set('LLL', `LLL - Loans – Drawings or Repayments on foreign loans extended to residents – Long-term`);
        paymentReasonOptions.set('LNC', `LNC - Loan charges`);
        paymentReasonOptions.set('LND', `LND - Loan disbursements`);
        paymentReasonOptions.set('MCR', `MCR - Monetary Claim Reimbursements Medical Insurance or Auto Insurance etc.`);
        paymentReasonOptions.set('MWI', `MWI - Mobile wallet cash in`);
        paymentReasonOptions.set('MWO', `MWO - Mobile wallet cash out`);
        paymentReasonOptions.set('MWP', `MWP - Mobile wallet payments`);
        paymentReasonOptions.set('OAT', `OAT - Own account transfer`);
        paymentReasonOptions.set('OTS', `OTS - Other modes of transport`);
        paymentReasonOptions.set('OVT', `OVT - Overtime`);
        paymentReasonOptions.set('PEN', `PEN - Pension`);
        paymentReasonOptions.set('PIN', `PIN - Personal Investments`);
        paymentReasonOptions.set('PIP', `PIP - Profits on Islamic products`);
        paymentReasonOptions.set('PMS', `PMS - Professional and management consulting services`);
        paymentReasonOptions.set('POR', `POR - Refunds or Reversals on IPO subscriptions`);
        paymentReasonOptions.set('POS', `POS - POS Merchant Settlement`);
        paymentReasonOptions.set('PPA', `PPA - Purchase of real estate abroad from residents`);
        paymentReasonOptions.set('PPL', `PPL - Purchase of real estate in the UAE from non-residents`);
        paymentReasonOptions.set('PRP', `PRP - Profit rate swap payments`);
        paymentReasonOptions.set('PRR', `PRR - Profits or rents on real estate`);
        paymentReasonOptions.set('PRS', `PRS - Personal cultural audio visual and recreational services`);
        paymentReasonOptions.set('PRW', `PRW - Profit rate unwind payments`);
        paymentReasonOptions.set('RDS', `RDS - Research and development services`);
        paymentReasonOptions.set('RFS', `RFS - Repos on foreign securities`);
        paymentReasonOptions.set('RLS', `RLS - Repos on securities issued by residents`);
        paymentReasonOptions.set('RNT', `RNT - Rent payments`);
        paymentReasonOptions.set('SAA', `SAA - Salary advance`);
        paymentReasonOptions.set('SAL', `SAL - Salary`);
        paymentReasonOptions.set('SCO', `SCO - Construction`);
        paymentReasonOptions.set('SLA', `SLA - Loans – Drawings or Repayments on loans extended to nonresidents – Short-term`);
        paymentReasonOptions.set('SLL', `SLL - Loans – Drawings or Repayments on foreign loans extended to residents – Short-term`);
        paymentReasonOptions.set('STR', `STR - Travel`);
        paymentReasonOptions.set('STS', `STS - Sea transport`);
        paymentReasonOptions.set('SVI', `SVI - Stored value card cash-in`);
        paymentReasonOptions.set('SVO', `SVO - Stored value card cash-out`);
        paymentReasonOptions.set('SVP', `SVP - Stored value card payments`);
        paymentReasonOptions.set('TCP', `TCP - Trade credits and advances payable`);
        paymentReasonOptions.set('TCR', `TCR - Trade credits and advances receivable`);
        paymentReasonOptions.set('TCS', `TCS - Telecommunication services`);
        paymentReasonOptions.set('TKT', `TKT - Tickets`);
        paymentReasonOptions.set('TOF', `TOF - Transfer of funds between persons Normal and Juridical`);
        paymentReasonOptions.set('TTS', `TTS - Technical trade-related and other business services`);
        paymentReasonOptions.set('UTL', `UTL - Utility Bill Payments`);
    }
    return paymentReasonOptions;
}