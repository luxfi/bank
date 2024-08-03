import { Formik } from "formik";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import * as yup from 'yup';
import { useAppDispatch } from "../../app/hooks";
import CheckboxField from "../../components/CheckboxField";
import Layout from "../../components/Layout";
import { setCurrentUser } from "../../features/auth/AuthSlice";
import RequireAuth from "../../features/auth/RequireAuth";
import { UserRoles } from "../../features/auth/user-role.enum";
import { acceptTerms } from "../../features/registration/RegistrationApi";
import { ButtonsContainer } from "./components/ButtonsContainer";
import { SlideButton } from "./components/SlideButton";
import { StyledForm } from "./slides/BaseSlide";

export default function TermsAndConditions() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    return <RequireAuth roles={UserRoles}>
        <Layout>
            <Container>
                <Text>
                    You have to agree to the following terms and conditions:
                </Text>
                <TermsContainer>
                    The parties to this agreement are: CDAX Limited whose registered office is 2nd Floor, St Mary’s Court, 20 Hill Street, Isle of Man, IM1 1EU (incorporated in the Isle of Man, No. 016219V) trading as CDAX Forex (‘CDAX Forex’) and the client (the ‘Client’) named in the account opening form associated to these terms or on the relevant part of CDAX Forex’s website (the ‘Account Opening Form’).  All business undertaken with CDAX Forex is conducted in and from the Isle of Man.<br />
                    <br />
                    1. INTRODUCTION<br />
                    1.1 CDAX Limited is licenced by the Isle of Man Financial Services Authority (‘FSA‘) for the provision of payment services as a regulated activity under class 8 (2) (a), our licence number is FSA1389.<br />
                    1.2 The Client wishes to enter into a contract or contracts with CDAX Forex for the purchase and redemption of electronic money, the purchase, sale and delivery of currency and for money remittance. The Client agrees with CDAX Forex that all transactions shall be carried out on the terms and conditions set out below (the ‘Terms’). The Terms shall come into force as soon as the Client signs the Account Opening Form or accepts the Terms online and shall continue until terminated in accordance with these Terms.<br />
                    1.3 It is important that the Client reads and understands these Terms, which will apply to all dealings between the Client and CDAX Forex. If there are any terms that the Client does not understand or does not wish to agree to, the Client should discuss it with CDAX Forex before signing the Account Opening Form or accepting the Terms online. The Client should only sign the Account Opening Form or accept the Terms online if the Client agrees to be bound by these Terms.<br />
                    1.4 Please note that foreign currency exchange rates are subject to fluctuations outside the control of CDAX Forex. Historical prices are not a reliable indicator of future prices.<br />
                    1.5 A reference to the Terms shall include any addendum to the Terms.<br />
                    <br />
                    2. CDAX FOREX’S SERVICES<br />
                    2.1 CDAX Forex may in its absolute discretion provide, or continue to provide, the following services to the Client:<br />
                    (a) Electronic Money Services: CDAX Forex may enter into transactions for the issuance and redemption of electronically stored monetary value as represented by a claim against CDAX Forex (‘Electronic Money’) with the Client (“Electronic Money Contracts”) in accordance with an instruction by the Client (such an instruction being an ‘Electronic Money Order’). Electronic Money Contracts may include Uploads and Withdrawals (as such terms are defined in Clause 4.2);<br />
                    (b) Payment Services: Following the execution of an FX Contract or if the Client holds Electronic Money and subject to these Terms, CDAX Forex may transfer the converted currency or the funds corresponding to Electronic Money after redemption of the Electronic Money to the bank account of a third party (the ‘Payee’) in accordance with an instruction by the Client (such instruction being a ‘Payment Instruction’ and the onward transfer being an ‘Onward Payment’). <br />
                    2.2 CDAX Forex will always contract as principal with the Client and deal with the Client on an execution only basis.<br />
                    2.3 FX Contracts are for settlement or delivery. That means at maturity of the FX Contract the Client must either: (a) take or give instructions for delivery of all of currency purchased; or (b) give instructions for all of the currency purchased to be sent to CDAX Forex in exchange for Electronic Money.<br />
                    2.4 CDAX Forex provides facilities for the Client to enter into FX Contracts. If the FX Contract:<br />
                    (a) is to be concluded within 2 Business Days of the Client entering into the FX Contract, then that FX Contract can be for any purpose;<br />
                    (b) is to be concluded more than 2 Business Days after the Client entering into the FX Contract, then the FX Contract must be for the purpose of:<br />
                    (i) facilitating a means for the Client to pay for identifiable goods and/or services; or<br />
                    (ii) facilitating direct investment by the Client.<br />
                    2.5 The Client confirms that:<br />
                    (a) if it places an Order with CDAX Forex to enter into an FX Contract, of the type described in clause 2.4(b) above, its purpose is for facilitating payment for identifiable goods and/or services or direct investment,<br />
                    (b) it is acting on its own account and not on behalf of any other person. <br />
                    2.6 CDAX Forex may provide information about foreign exchange markets and related matters from time to time. However, CDAX Forex does not provide advice and will not provide advice to the Client upon the merits of a proposed Electronic Money Contract, FX Contract or Payment Service, or provide taxation or other advice to the Client. In entering into an FX Contract and/or issuing a Payment Instruction the Client must not treat any information or comments by CDAX Forex as advice and the Client must rely only on its own judgement (or the judgement of the Client’s third party adviser)<br />
                    <br />
                    3. INSTRUCTIONS AND COMMUNICATIONS<br />
                    3.1 The Client may provide instructions (including Electronic Money Orders, FX Orders and Payment Instructions) and other communications to CDAX Forex: <br />
                    (a) in person at a CDAX Forex office at the address and during the opening hours listed on the CDAX Forex website; <br />
                    (b) by telephone through the CDAX Forex helpline on the number shown on the website; or <br />
                    (c) by email via your designated account manager; or <br />
                    (d) using the online system provided by CDAX Forex (the ‘Online System’) in accordance with Clause 32; or <br />
                    (e) for Payment Instructions only, using a payment initiation service provider where the Client has Electronic Money held with CDAX Forex which it can view using the Online System (the Online being referred to in these Terms as the ‘Online Resources’); or <br />
                    (f) automatically, by entering into a Limit Order Contract, as set out in Clause 10.10; or<br />
                    (g) automatically, by setting a Rule (as defined in the addendum) on an Electronic Money Account as set out in the addendum.<br />
                    Unless a Clause provides otherwise, if instructions are required to be provided “in writing”, then the Client must provide such instructions either by fax, email or, where made available to the Client, using the Online System.<br />
                    3.2 The Client may authorise another named person (an ‘Authorised Person’) to give Electronic Money Orders and / or FX Orders and/or Payment Instructions to CDAX Forex on behalf of the Client by providing written instructions to CDAX Forex in accordance with Clause 3.1.<br />
                    3.3 CDAX Forex is entitled (but not obliged) to act upon instructions which are or reasonably appear to be from the Client or any Authorised Person. In particular, an Order received from an e-mail address or telephone number, set out by the Client in the Account Opening Form or otherwise used by the Client or an Authorised Person to communicate with CDAX Forex, shall be sufficient to authenticate an Order as being from the Client and shall be deemed authorised by the Client pursuant to these Terms. In addition, CDAX Forex shall be entitled to act upon Orders and instructions received from communication channels used by the Client or an Authorised Person to communicate with CDAX Forex.<br />
                    3.4 CDAX Forex may contact the Client or their Authorised Person by telephone, fax, email or by post at the contact details provided by the Client in the Account Opening Form or, where made available to the Client, by the Online System. It shall be the Client’s responsibility to inform CDAX Forex of any changes to the Client’s or Authorised Person’s contact details.<br />
                    3.5 All communications between CDAX Forex and the Client (including information and notifications which CDAX Forex is required to provide to the Client in relation to the Payment Services) shall be in English.<br />
                    <br />
                    TERMS APPLYING TO ELECTRONIC MONEY SERVICES<br />
                    4. INITIATING AN ELECTRONIC MONEY TRANSACTION<br />
                    4.1 The Client or its Authorised Person may from time to time provide an Electronic Money Order to CDAX Forex in accordance with Clause 3. Following receipt of an FX Order, CDAX Forex shall, if it is willing to accept the Electronic Money Order, agree with the Client the terms on which it is willing to enter into the Electronic Money Contract.<br />
                    4.2 An Electronic Money Order and an Electronic Money Contract may consist of:<br />
                    (a) the Client sending CDAX Forex money in exchange for CDAX Forex issuing Electronic Money to the Client (“Upload”); or<br />
                    (b) the Client redeeming Electronic Money contained in an Electronic Money Account (“Withdrawal”) and send the corresponding funds to the Client’s Bank Account. <br />
                    <br />
                    5. PAYMENTS IN RELATION TO UPLOADS<br />
                    5.1 If CDAX Forex accepts the Electronic Order for an Upload, the Client shall pay CDAX Forex the full amount by electronic transmission (or by such other means as agreed with CDAX Forex in any particular case) in cleared funds into a bank account nominated by CDAX Forex for this purpose (‘Segregated Bank Account’) and CDAX Forex shall issue Electronic Money to the Client to be held in the appropriate Electronic Money Account. CDAX Forex does not accept payments in physical cash (coins and banknotes) from any Client.<br />
                    5.2 The Client and CDAX Forex (on the Client’s behalf) are able to redeem this Electronic Money and use the corresponding funds when the Client enters into FX Contracts and/or Onward Payments.<br />
                    <br />
                    6. ELECTRONIC MONEY ACCOUNTS<br />
                    6.1 When the Client has been issued Electronic Money by CDAX Forex, it will be held in a virtual account (an ‘Electronic Money Account’) of the same currency as the funds which were sent to CDAX Forex. The Client can hold Electronic Money Accounts in different currencies. The currencies of Electronic Money Accounts available will vary from time to time. The Client should contact CDAX Forex if it would like an up to date list of the currencies which it can hold Electronic Money in.<br />
                    6.2 The Client can view the amount of Electronic Money it holds in each of its Electronic Money Accounts at any time by logging onto the Online System or through the CDAX Forex helpline.<br />
                    <br />
                    7. WITHDRAWALS<br />
                    7.1 The Client can enter into a Withdrawal, when it holds Electronic Money, by issuing a Payment Instruction to CDAX Forex in accordance with Clause 19 and selecting its own Bank Account as the Payee Bank Account.<br />
                    <br />
                    8. CDAX FOREX’S RIGHT TO REDEEM AND ISSUE ELECTRONIC MONEY ON BEHALF OF THE CLIENT<br />
                    8.1 Where the Client pays money to CDAX Forex in advance of entering into an FX Contract or an Onward Payment, such money will be held by CDAX Forex in a Segregated Bank Account in exchange for the issuance of Electronic Money into the Client’s appropriate Electronic Money Account.<br />
                    8.2 CDAX Forex will redeem Electronic Money held by the Client and use the corresponding funds to pay for any amount the Client owes to CDAX Forex including:<br />
                    (a) any sums owing to CDAX Forex under any FX Contract including, without limitation, the amount required to be paid in any Deal Confirmation, any Security Payment and/or Margin Call;<br />
                    (b) any sums required by CDAX Forex to make any Onward Payment;<br />
                    (c) any other fees, costs, taxation liabilities, margin calls, or charges incurred by CDAX Forex in relation to the Client or for the payment of interest in accordance with Clause 25. <br />
                    8.3 Following fulfilment of all outstanding FX Contracts between CDAX Forex and the Client under these Terms, any excess amount held by CDAX Forex for the Client in respect of the Client’s FX Contracts shall be, after first being applied by payment to CDAX Forex in satisfaction of all claims of <br />
                    CDAX Forex against the Client arising under these Terms or under any FX Contract, sent to a Segregated Bank Account in exchange for the issuance of Electronic Money into an Electronic Money Account belonging to the Client.<br />
                    <br />
                    9. TERMS OF CDAX FOREX HOLDING ELECTRONIC MONEY<br />
                    9.1 When CDAX Forex holds Electronic Money on the Client’s behalf, CDAX Forex holding the funds corresponding to the Electronic Money is not the same as a Bank holding money in that: (a) CDAX Forex cannot and will not use the funds to invest or lend to other persons or entities; (b) the Electronic <br />
                    Money will not accrue interest; and (c) the Electronic Money is not covered by the Financial Services Compensation Scheme. <br />
                    9.2 CDAX Forex may hold the Client’s Electronic Money indefinitely. However, if CDAX Forex holds Electronic Money for a Client for more than two years, CDAX Forex shall use reasonable endeavours to contact the Client to redeem the Electronic Money and return the corresponding funds to the <br />
                    Client. If CDAX Forex is unable to contact the Client, it may redeem the Electronic Money and send the corresponding funds, less any of its costs incurred, to the last known bank account CDAX Forex has on file for the Client.<br />
                    <br />
                    TERMS APPLYING TO FOREIGN EXCHANGE SERVICES<br />
                    10. INITIATING A FOREIGN EXCHANGE TRANSACTION<br />
                    10.1 The Client or its Authorised Person may from time to time provide an FX Order to CDAX Forex in accordance with Clause 3.<br />
                    10.2 Following receipt of an FX Order, CDAX Forex shall, if it is willing to accept the FX Order, agree with the Client the terms on which it is willing to enter into the FX Contract.<br />
                    10.3 If CDAX Forex accepts the FX Order, CDAX Forex shall subsequently provide a Deal Confirmation to the Client confirming the details of the FX Order (the ‘Deal Confirmation’) either by fax or email, or (where the Client has not advised CDAX Forex of its fax or email contact details) by post. The Deal Confirmation shall include details of:<br />
                    (a) the FX Order and the exchange rate applying;<br />
                    (b) the date for delivery of or payment for the currency (the ‘Maturity Date’);<br />
                    (c) CDAX Forex’s charges in relation to the FX Contract;<br />
                    (d) CDAX Forex’s charges in relation to the Payment Service;<br />
                    (e) in the case of an FX Contract which is not a spot contract, instalment payments to be made by the Client as determined in CDAX Forex’s absolute discretion; and<br />
                    (f) in the case of an FX Contract where payment for currency is to be made in a currency other than sterling, the currency in which payments by the Client are to be made. <br />
                    10.4 Upon receipt by the Client of the Deal Confirmation, the Client should check the Deal Confirmation for any omissions and/or errors. In the event of any omission and/or error, the Client must provide immediate notice in writing to CDAX Forex in accordance with Clause 3 setting out full details of the omission and/or error. Subject to Clause 10.5, notwithstanding any omission and/or error in the Deal Confirmation, the FX Contract relating to the FX Order detailed in the Deal Confirmation will be binding on the Client and CDAX Forex, and CDAX Forex’s and the Client’s rights under these Terms in respect of the FX Contract shall apply with full effect. <br />
                    10.5 CDAX Forex will not be bound by any FX Contract where it is reasonably determined by CDAX Forex that there is a Manifest Error in the purchase or sale price quoted in the Deal Confirmation. In these Terms, a “Manifest Error” refers to a manifest or obvious misquote of the purchase or sale price quoted to the Client, including a misquote based on a published price source on which CDAX Forex has relied in connection with the FX Contract, having regard to the market conditions at the time the FX Order was received. <br />
                    10.6 Once CDAX Forex has transmitted a Deal Confirmation confirming an FX Order in writing, the Client may only amend or cancel the Deal Confirmation if CDAX Forex expressly agrees (and any such amendment or cancellation shall be on the conditions specified by CDAX Forex) or otherwise in accordance with the provisions of Clause 10.9.<br />
                    10.7 CDAX Forex may at its absolute discretion refuse any FX Order or instructions given by the Client without giving any reason or being liable for any loss the Client suffers as a result of such refusal.<br />
                    10.8 CDAX Forex may (but shall not be obliged to) require further confirmation or information from the Client or an Authorised Person of any FX Order or instruction if:<br />
                    (a) CDAX Forex considers that such confirmation or information is desirable or that an FX Order or instruction is ambiguous;<br />
                    (b) CDAX Forex has not satisfied itself that the person giving the FX Order is the Client or an Authorised Person; or <br />
                    (c) the instruction is to close the Client‘s account or to remit the Client’s funds to a third party. <br />
                    10.9 The Client may terminate an FX Contract entered into under these Terms prior to the Maturity Date of such FX Contract by giving notice in writing to CDAX Forex in accordance with Clause 3 subject to the following conditions:<br />
                    (a) Each party will remain liable to perform accrued but unperformed obligations which have fallen due before termination, but all other rights will cease upon such termination.<br />
                    (b) The Client will be liable for all of the costs, expenses and losses (and interest at the rate referred to in Clause 25 on any such sums) that CDAX Forex may incur (including any action it may take or have taken to cover or reduce its exposure) as a result of CDAX Forex entering into such FX Contract with the Client (including the actual or hypothetical costs of unwinding any hedging arrangements which are referable to such FX Contract). Any excess amount held by CDAX Forex in respect of an FX Contract shall be returned to the Client after deducting all other sums due to CDAX Forex. <br />
                    10.10 Limit Order Contracts<br />
                    (a) CDAX Forex may agree to enter into a contract with the Client (a “Limit Order Contract”) in consideration for the promise by the Client to abide by its obligation under the corresponding FX Contract if entered into, whereby an FX Order is deemed to have been sent from the Client to CDAX Forex without further notice being provided to the Client, upon CDAX Forex being able to provide the <br />
                    Client with an exchange rate which is the same as the exchange rate which the Client requested upon entering into the Limit Order Contract (the “Limit Order Threshold Exchange Rate”). Limit Order Contracts can either be entered into for a specified period of time (referred to as the “Validity Period”) or indefinitely.<br />
                    (b) The Limit Order Contract may be entered into either by email, telephone (using the details set out in Clause 3(b)) or by using the Online System, between the hours of 9am and 5pm on a ‘Business Day’ (being a day, other than a Saturday or Sunday, on which banks are open for business in London and any other geographic locations required to complete the transaction). <br />
                    Should the Client place an order to enter into a Limit Order Contract outside these hours, the order will only be considered on the next Business Day. CDAX Forex will send a confirmation of the details of the Limit Order Contract immediately after the Limit Order Contract has been agreed. If the Client notices any error or discrepancy, it must inform CDAX Forex as soon as reasonably possible.<br />
                    (c) Upon entering into a Limit Order Contract, the Client and CDAX Forex shall agree:<br />
                    (i) the Limit Order Threshold Exchange Rate;<br />
                    (ii) the currencies which the Client wishes to purchase and sell under associated FX Contract;<br />
                    (iii) the amount of the currencies which the Client wishes to purchase and sell under the associated FX Contract;<br />
                    (iv) the Validity Period, if any.<br />
                    (d) Should CDAX Forex be able to offer the Limit Order Threshold Exchange Rate whilst the Limit Order Contract is live, then:<br />
                    (i) the Client will be deemed to have sent the FX Order to CDAX Forex, at the time CDAX Forex is able to offer the Client the Limit <br />
                    Order Threshold Exchange Rate; and<br />
                    (ii) the terms of the associated FX Order and FX Contract shall be those agreed in the Limit Order Contract and CDAX Forex and the Client shall be bound by the terms of such associated FX Contract.<br />
                    (e) If the Limit Order Contract has been entered into:<br />
                    (i) for a Validity Period and CDAX Forex is unable to offer the Client the Limit Order Threshold Exchange Rate during the Validity Period, then no FX Order will be deemed to have been sent from the Client to CDAX Forex and the Limit Order Contract will expire and be null and void at 4pm (London time) on the last Business Day of the Validity Period;<br />
                    (ii) for a Validity Period, then the Client may terminate the Limit Order Contract prior to the expiry of the Validity Period in accordance with Clause 10.10(f); and<br />
                    (iii) for an indefinite period, then the Limit Order Contract will only become null and void upon termination in accordance with Clause 10.10(f).<br />
                    (f) The Client may terminate a Limit Order Contract either by phone during business hours or by sending a notice in writing to CDAX Forex. If the written notice is sent to CDAX Forex on a day which is not a Business Day or outside the hours of 9 am and 5 pm on a Business Day, then the notice of termination will not be deemed to have been received by CDAX Forex until the following Business Day. <br />
                    (g) For the avoidance of doubt, the termination of a Limit Order Contract will not be effective if the associated FX Order has already been deemed to have been sent to CDAX Forex and the FX Contract entered into. If the Client wishes to cancel the FX Contract, the terms of Clause 10.9 shall apply.<br />
                    <br />
                    11. UPLOADS RELATING TO FX CONTRACTS AND DEDUCTIONS<br />
                    11.1 Where CDAX Forex and the Client enter into an FX Contract, the Client must make sure that it holds enough Electronic Money, in the currency specified in the Deal Confirmation, on or before the Maturity Date. <br />
                    11.2 If an FX Contract is not a spot contract then the Client will need to hold enough Electronic Money, in the currency specified in the Deal Confirmation, on or before the times specified in the Deal Confirmation and/or subsequently notified to the Client from time to time. <br />
                    11.3 Failure by the Client to hold the correct amount and currency of Electronic Money on the date(s) (a) specified in the Deal Confirmation; and/or<br />
                    (b) (if applicable) as notified to the Client from time to time, shall relieve CDAX Forex of any obligation to redeem the Electronic Money to make a corresponding payment under the relevant FX Contract. <br />
                    <br />
                    12. REDEMPTION OF ELECTRONIC MONEY TO FULFIL FX CONTRACTS AND DEDUCTIONS<br />
                    12.1 After CDAX Forex and the Client have entered into an FX Contract and subject to Clause 12.2, CDAX Forex shall redeem the Electronic Money and use the corresponding funds for payment of monies owing to CDAX Forex under the FX Contract including, without limitation, any Security Payment or Margin Call (as defined below).<br />
                    12.2 The Client accepts that, prior to undertaking an FX Contract, CDAX Forex will deduct from the corresponding funds set out in Clause 12.1 those costs and charges which CDAX Forex is entitled to pursuant to these Terms including any advance or instalment payments, transfer charges, deal profit and interest.<br />
                    12.3 The Client is solely responsible for ensuring that, following the deductions referred to in Clause 12.2 and the application of the exchange rate agreed in the Deal Confirmation, the amount of any Onward Payment will be sufficient to fulfil any obligations that Client has to the relevant Payee. <br />
                    <br />
                    13. FOREIGN EXCHANGE CHARGES<br />
                    CDAX Forex’s charges in relation to Foreign Exchange Services will be as set out in the Deal Confirmation. The Client understands that because CDAX Forex deals as principal the exchange rate it offers the Client will not be the same as the rate CDAX Forex obtains itself.<br />
                    <br />
                    <br />
                    14. ADDITIONAL CONDITIONS FOR FORWARD FX CONTRACTS<br />
                    14.1 This Clause 14 applies in respect of any forward FX Contract, meaning an FX Contract under which currency is bought and sold for delivery at a future time.<br />
                    14.2 Subject to any facility, CDAX Forex will require an agreed security payment (“Security Payment”) from the Client for each order for a forward FX Contract and CDAX Forex will be entitled to request from the Client immediate additional security payments in amounts notified by CDAX Forex to the <br />
                    Client in the event of exchange rate fluctuations at any time prior to the Maturity Date (‘Margin Call’). The Client agrees that it is the Client’s responsibility to ensure that it is contactable and has provided sufficient contact details so that CDAX Forex can contact the Client in the event of a Margin Call. If CDAX Forex is unable to contact the Client by the end of the day in which a Margin Call occurs CDAX Forex will be entitled to terminate the FX Contract in accordance with Clause 17. CDAX Forex may redeem Electronic Money held by the Client to pay for any Margin Call.<br />
                    14.3 With CDAX Forex’s agreement the Client may draw down against an open forward FX Contract at any time up until its Maturity Date.<br />
                    <br />
                    15. USE OF MONEY PURCHASED IN AN FX CONTRACT<br />
                    15.1 The Client may use the money purchased in an FX Contract (Purchase Monies) to enter into an Onward Payment. If the Client wishes to so do, then it must notify CDAX Forex not less than 2 Business Days before the Maturity Date of the FX Contract of the details of the beneficiaries of Onward Payment. <br />
                    15.2 As an alternative to Clause 15.1 or if details of the beneficiary are not provided on time, then the Purchase Monies will be sent to the Segregated Bank Account in exchange for the issuance to the Client of Electronic Money into the Client’s appropriate Electronic Money Account, provided CDAX Forex is able to provide an Electronic Money Account in the same currency as the Purchase Monies.<br />
                    15.3 If details of the beneficiary are not provided on time and CDAX Forex is unable to provide an Electronic Money Account in the same currency as the Purchase Monies, then CDAX Forex reserves the right to use the Purchase Monies to purchase money in a currency which CDAX Forex can provide <br />
                    an Electronic Money Account and send the exchanged money to one of CDAX Forex’s Segregated Bank Accounts in exchange for the issuance of Electronic Money into the Client’s appropriate Electronic Money Account.<br />
                    <br />
                    CLAUSE 16 Deleted.<br />
                    <br />
                    17. DEFAULT, CLOSE OUT & REFUSAL TO PERFORM FX CONTRACTS<br />
                    17.1 CDAX Forex may refuse to perform or may close out all or any part of any FX Contract, without incurring any liability to the Client for losses that may be sustained as a result and without giving notice to the Client or receiving any instructions from it, upon or at any time after the happening of any of the following events:<br />
                    (a) The Client fails to hold the correct amount of Electronic Money in the correct currency at the stipulated time or otherwise is unable to make any payment when due under these Terms or any FX Contract. <br />
                    (b) CDAX Forex has been unable to contact the Client by the end of the day in which a Margin Call occurs. <br />
                    (c) For a Client who is an individual, the Client:<br />
                    (i) dies or, in CDAX Forex’s reasonable suspicion, becomes of unsound mind; or<br />
                    (ii) suspends payment of its debts, makes or takes steps with a view to making any moratorium, assignment, composition or similar arrangement with creditors, has a receiver appointed in respect of some or all assets, takes or has any proceedings taken against them in bankruptcy, or has anything similar to any of the events described in this Clause 17.1(c) happen to the Client anywhere in the world. <br />
                    (d) For a Client who is not an individual, the Client:<br />
                    (i) suspends payment of its debts;<br />
                    (ii) makes or takes steps with a view to making any moratorium, assignment, composition or similar arrangement with its creditors;<br />
                    (iii) has a liquidator, trustee in bankruptcy, judicial custodian, compulsory manager, receiver, administrative receiver, administrator or similar officer appointed in respect of some or all of its assets;<br />
                    (iv) is the subject of a winding up, administration or dissolution;<br />
                    (v) any person takes any steps, or the Client allows any steps to be taken, for its winding up, administration or dissolution (except for a solvent amalgamation or reconstruction approved in advance in writing by CDAX Forex) or gives notice to CDAX Forex of an intention to appoint an administrator;<br />
                    (vi) is the subject of a meeting of its shareholders, directors or other officers, which meeting was convened for the purpose of considering any resolution for, to petition for or to make application to or to file documents with a court or any registrar for, its winding up, administration or dissolution or If any such resolution is passed;<br />
                    (vii) is subject to a request from its shareholders, directors or other officers for the appointment of, or giving notice of their intention to appoint, a liquidator, trustee in bankruptcy, judicial custodian, compulsory manager, receiver, administrative receiver, administrator or similar officer; or<br />
                    (viii) suffers anything similar to the events described in this Clause 17.1(d) anywhere in the world. <br />
                    (e) The Client fails in any respect to fully and promptly comply with any obligations to CDAX Forex under these Terms. <br />
                    (f) If any of the representations made or information supplied by the Client are or become materially inaccurate or materially changed.<br />
                    (g) If it becomes or may become unlawful for CDAX Forex to maintain or give effect to all or any of the obligations under these Terms or otherwise to carry on its business.<br />
                    (h) If CDAX Forex or the Client is requested not to perform or to close out an FX Contract (or any part thereof) by any governmental or <br />
                    regulatory authority whether or not that request is legally binding.<br />
                    (i) CDAX Forex considers it necessary to do so for its own protection including (without limitation) in the following circumstances:<br />
                    (i) protection from fraud or money laundering; <br />
                    (ii) protection from Client default; <br />
                    (iii) protection from market failure; <br />
                    (iv) protection from adverse or volatile market conditions; and<br />
                    (v) protection from loss by CDAX Forex. <br />
                    17.2 If the Client becomes aware of the occurrence or likely occurrence of any event referred to in Clauses 17.1(a) to 17.1(h) above, it shall notify CDAX Forex immediately.<br />
                    17.3 If any event referred to in Clause 17.1 above takes place CDAX Forex shall at its discretion be entitled to cancel any FX Contract then outstanding and charge the Client with all of the costs, expenses and losses (and interest at the rate referred to in Clause 25 on any such sums) that CDAX Forex may incur (including any action it may take to cover or reduce its exposure) as a result of CDAX Forex cancelling FX Contracts with the Client (including the actual or hypothetical costs of unwinding any hedging arrangements which are referable to the FX Contracts). Any excess amount held by CDAX Forex in respect of the FX Contracts shall be returned to the Client after deducting all other sums due to CDAX Forex.<br />
                    17.4 If for any reason an FX Contract is closed out or does not proceed to completion, CDAX Forex will send to the Client any sum due to the Client or a notice setting out the sum due from the Client (as appropriate). The Client shall bear all the losses/ expenses of CDAX Forex whatsoever that may arise on account of such close out or cancellation, and CDAX Forex shall have the right to use any monies of the Client held by it to offset such amounts as are owed by the Client to CDAX Forex. For such purpose, CDAX Forex shall be entitled to convert any currency held by it and such conversion shall be at the rate of exchange available to it. Any fee or charge which CDAX Forex incurs as a result of such conversion shall be paid for by the Client.<br />
                    17.5 If the Client’s method of payment is not met or stopped for whatever reason, CDAX Forex shall levy an administrative charge. This administrative charge will become payable by the Client in addition to any other sums due under these Terms. <br />
                    <br />
                    18. LIMITATION OF LIABILITY AND INDEMNITY FOR FOREIGN EXCHANGE SERVICES<br />
                    18.1 In addition to any limitation on liability under Clause 21 below which may apply to the Foreign Exchange Services, CDAX Forex shall not be liable to the Client: <br />
                    (a) for any delay or failure to perform its obligations under these Terms relating to Foreign Exchange Services or any FX Contract by reason of any cause beyond the reasonable control of CDAX Forex, but CDAX Forex shall try to perform those obligations as soon as it reasonably can in any event;<br />
                    (b) for any loss resulting from the determination of Manifest Error by CDAX Forex;<br />
                    (c) CDAX Forex acting on a written, oral, telephone, fax or electronic FX Order which reasonably appeared to CDAX Forex to be from the Client or an Authorised Person; or<br />
                    (d) for any consequential or indirect loss (such as loss of profits, loss of contract or opportunity) the Client may incur as a result of CDAX Forex failing to perform its duties under an FX Contract; or<br />
                    (e) for an amount greater than the maxima stated in Clauses 18.2 and 18.4. <br />
                    18.2 Without prejudice to Clause 18.1 above, CDAX Forex shall not be responsible in any way for any delay in payment by it under these Terms relating to the Foreign Exchange Services which is caused by the Client or any other third party, including but not limited to bank delay, postal delay, payment network delay, the failure or delay of any fax or electronic transmission, or delay caused by accident, emergency or act of god. For the avoidance of doubt the Client accepts that the Client is solely responsible for ensuring that all payments which the Client is required to make under any FX Contract are made promptly and within the time limits specified by the particular FX Contract and these Terms<br />
                    18.3 The maximum liability of CDAX Forex under a particular FX Contract, whether arising in contract, tort or otherwise, shall in no circumstances exceed an amount equal to the value (expressed in sterling) of the currency sold by CDAX Forex under that FX Contract as at the due date of settlement of that FX Contract. <br />
                    18.4 The maximum aggregate liability of CDAX Forex to a Client in respect of Foreign Exchange Services provided under these Terms, whether arising in contract, tort or otherwise, shall in no circumstances exceed an amount equal to the aggregate value of currency sold by CDAX Forex to the Client under FX Contracts issued in accordance with these Terms expressed in Sterling as at the due date of settlement of each FX Contract less any amounts previously settled. <br />
                    18.5 The Client shall, on demand by CDAX Forex, compensate CDAX Forex from and against all liabilities, damages, losses and costs (including reasonable legal costs), duties, taxes, charges, commissions or other expenses incurred by CDAX Forex in the proper performance of Foreign Exchange Services or the enforcement of its rights under these Terms relating to Foreign Exchange Services and, in particular, but without limitation, against all amounts which CDAX Forex may certify to be necessary to compensate it for all liabilities, damages, losses and costs (including reasonable legal costs), duties, taxes, charges, commissions or other expenses incurred by CDAX Forex (including loss of profit and losses and expenses from any action CDAX Forex takes to seek to cover or reduce its exposure under any FX Contracts) as a result of:<br />
                    (a) the Client breaching any provision of these Terms relating to Foreign Exchange Services or any FX Contract; <br />
                    (b) CDAX Forex acting on a written, oral, telephone, fax or electronic FX Order which reasonably appeared to CDAX Forex to be from the Client or an Authorised Person; or <br />
                    (c) CDAX Forex or the Client exercising its rights under these Terms to close out all or any part of any FX Contract before its applicable Maturity Date. <br />
                    18.6 Any certificate given by CDAX Forex under Clause 18.5 shall, unless it is manifestly inaccurate, be conclusive evidence of any amounts payable under that provision. The provision in this Clause 18 shall survive termination of any FX Contract or other agreement under these Terms relating to the Foreign Exchange Services. <br />
                    <br />
                    TERMS APPLYING TO PAYMENT SERVICES <br />
                    19. PAYMENT INSTRUCTIONS<br />
                    19.1 The Client or its Authorised Person may from time to time provide a Payment Instruction to CDAX Forex in accordance with Clause 3. Such Payment Instruction must confirm the details of the proposed Payee including its full name, account details for payment and any unique identifier confirmed to the Client by the Payee. The provision of a Payment Instruction by the Client to CDAX Forex in accordance with Clause 3 is deemed, under these Terms, to be the Client’s consent for CDAX Forex to execute the corresponding Onward Payment.<br />
                    19.2 The Payment Instruction shall be deemed to be received at the time at which it is received except that:<br />
                    (a) where the Payment Instruction would otherwise be deemed to be received on a day which is not a Business Day or is received after 2.30 pm, London time (the ‘Cut-Off Time’) on a Business Day, CDAX Forex has the right to treat the Client’s Payment Instruction as having been received on the next Business Day; and <br />
                    (b) if the Onward Payment is to be made on a specified day or on the last day of a specified period and such specified day or last day of a specified period shall be on or after whichever is the later in time of:<br />
                    (i) the Maturity Date;<br />
                    (ii) the Business Day on which Electronic Money is available in the relevant currency and/or the Purchase Monies is received as cleared funds in the Transaction Account, for the full amount required and subject to the Electronic Money and/or funds being available by 2.30pm; and the Client’s Payment Instruction shall be deemed to be received on the day stated for the making of that Onward Payment <br />
                    or, if that is not a Business Day, on the Business Day immediately following that date.<br />
                    19.3 Following receipt of a Payment Instruction, CDAX Forex may:<br />
                    (a) refuse that Payment Instruction and if it does so, CDAX Forex shall (unless it would be unlawful for CDAX Forex to do so) notify the Client of that refusal, the reasons for that refusal (if possible), and the procedure for rectifying any factual errors that lead to that refusal. Such notification shall be given to the Client as soon as practicable following the refusal and CDAX Forex may charge the Client for such notification where the refusal is reasonably justified. A Payment Instruction which is refused by CDAX Forex shall be deemed not to have been received for the purposes of Clause 19.2; and/or <br />
                    (b) request further confirmation or information from the Client or Authorised Person of any Payment Instruction, including if CDAX Forex considers that such confirmation or information is desirable or that a Payment Instruction is ambiguous; and/or<br />
                    (c) stop the use of all passwords and PINs used by the Client or an Authorised Person to access the Online Resources (“Personalised Security Credentials”), any foreign currency or Sterling Draft and information or other payment procedure or instrument in accordance with Clause 20.2. <br />
                    19.4 Deleted.<br />
                    19.5 The Client may not revoke:<br />
                    (a) a Payment Instruction initiated through a payment initiation service provider;<br />
                    (b) a Payment Instruction initiated in any way, other than through a payment initiation service provider, after it has been received by CDAX Forex except: <br />
                    (i) if Clause 20.3 applies and the Onward Payment has not been debited from CDAX Forex’s accounts before the Client notifies CDAX Forex; or <br />
                    (ii) if the Client has agreed with CDAX Forex that the Onward Payment is to be made on a specific day or on the last day of a certain period and the revocation is received by CDAX Forex prior to the Cut-Off Time on the Business Day preceding the specified day for the making of the Onward Payment.<br />
                    Any revocation of a Payment Instruction in accordance with this Clause 19.5 must be received in writing to CDAX Forex by email in accordance with Clause 3, such email to include an image of the relevant Payment Instruction. Such a revocation is deemed to be a withdrawal of consent.<br />
                    19.6 CDAX Forex may charge the Client for any revocation by the Client of a Payment Instruction. In particular, but not by way of limitation: <br />
                    (a) the Client shall bear all costs, expenses and losses of CDAX Forex whatsoever that may arise on account of the revocation; and <br />
                    (b) CDAX Forex may charge interest at the rate referred to in Clause 24.1 on any sums due to CDAX Forex pursuant to this Clause 19.6.<br />
                    19.7 CDAX Forex may either use:<br />
                    (a) Purchase Monies from the completion of an FX Contract; or <br />
                    (b) Monies received from redeeming the Client’s Electronic Money in accordance with Clause 8.2,<br />
                    to fund an Onward Payment.<br />
                    19.8 CDAX Forex shall:<br />
                    (a) if the Client requests, make available to the Client prior to making the Onward Payment details of the maximum execution time for that Onward Payment and details of any charges payable by the Client (including a breakdown of those charges where applicable); and<br />
                    (b) as soon as reasonably practicable after the amount of the Onward Payment is debited from its accounts, make available to the Client:<br />
                    (i) a reference enabling the Client to identify the Onward Payment made;<br />
                    (ii) information on the Payee;<br />
                    (iii) the amount of the payment, shown in the currency of the Onward Payment; and <br />
                    (iv) a breakdown of charges and/or interest payable by the Client. <br />
                    19.9 Where the Onward Payment is denominated in: <br />
                    (a) Euro or Sterling, CDAX Forex shall ensure that the amount of the Onward Payment is credited to the Payee’s payment service provider’s account by the end of the Business Day following that on which the Client’s Payment Instruction was deemed to be received;<br />
                    (b) a currency other than Euro or Sterling but the account of the Payee’s payment service provider is located within the European Economic Area (‘EEA’), CDAX Forex shall ensure that the amount of the Onward Payment is credited to that account by the end of the fourth Business Day following that on which the Client’s Payment Instruction was deemed to be received; and <br />
                    (c) a currency other than Euro or Sterling and the account of the Payee’s payment service provider is located outside the EEA, CDAX Forex shall endeavour to ensure that it actions the Onward Payment as soon as is reasonably practicable. <br />
                    <br />
                    20. SAFEGUARDS AND SECURITY<br />
                    20.1 The Client must take all reasonable precautions to prevent fraudulent or unauthorised use of Payment Services. In particular, it is essential that the Client, among other security measures:<br />
                    (a) takes all reasonable steps to ensure that the Online Resources are kept safe. This includes each Authorised Person and the Client:<br />
                    (i) not telling anyone their Personalised Security Credentials;<br />
                    (ii) notifying CDAX Forex using the contact details set out in clause 3.1(b) or Clause 3.1(d) as soon as it suspects or knows that someone other than themselves knows their Personalised Security Credentials or can otherwise gain access to the Online Resources or if a virus is found on the computer or other device the Client or any Authorised Person uses to obtain access to the Online Resources;<br />
                    (iii) logging off the Online Resources every time the computer (or other device used to gain access to the Online Resources) is left by the Client or the relevant Authorised Person; <br />
                    (iv) always ensuring that Personalised Security Credentials are not stored by the browser or cached or otherwise recorded by the computer or other device used to gain access to the Online Resources;<br />
                    (v) having recognised anti-virus software out on the computer or other device you use to gain access to the Online Resources;<br />
                    (vi) ensuring that the e-mail account(s), phone number, mobile phone number, computer and other network used to communicate with CDAX Forex are secure and only accessed by the relevant Client or Authorised Person as these may be used to reset the Personalised Security Credentials;<br />
                    (vii) regularly checking your emails to that you are aware if there are unauthorised changes to your account such as new or amended payee details or new Payment Instructions.<br />
                    (b) take all reasonable steps to keep safe its Drafts and other documentary payment methods it receives;<br />
                    (c) uses the Payment Services provided by CDAX Forex in accordance with the terms and conditions for their use as indicated in these Terms and on the CDAX Forex website (and in the event of any conflict, these Terms shall prevail);<br />
                    (d) notifies CDAX Forex in accordance with Clause 3.1(b) or Clause 3.1(d) without undue delay on becoming aware of the loss, theft, misappropriation or unauthorised use of any Personalised Security Credentials or the misappropriation of the Online Resources;<br />
                    (e) notify CDAX Forex in accordance with Clause 3 without undue delay on becoming aware of any other unauthorised use of the Payment Service;<br />
                    (f) where CDAX Forex communicates with and accepts written instructions from the Client’s e-mail address the Client must ensure that its e-mail account is secure.<br />
                    20.2 CDAX Forex may stop or suspend any Onward Payment (in whole or in part) and/or the Client’s use of the Payment Services and the Online Resources including all Personalised Security Credentials if it has reasonable grounds for doing so relating to:<br />
                    (a) the security of the Online Resources, the Payment Service or an Onward Payment; <br />
                    (b) the suspected unauthorised or fraudulent use of the Online Resources, the Personalised Security Credentials or an Onward Payment; and/or <br />
                    (c) where the Onward Payment is being made in connection with a credit line, if CDAX Forex believes that there is a significantly increased risk that the Client may be unable to fulfil its liability to pay.<br />
                    Unless doing so would compromise reasonable security measures or be unlawful, before stopping or suspending any Onward Payment (in whole or in part) or the Client’s use of the Payment Service (as appropriate) or immediately after doing so, CDAX Forex must inform the Client and give its reasons for doing so. As soon as practicable after the reason for stopping or suspending any Onward Payment (in whole or in part) or the Client’s use of the Payment Service (as appropriate) has ceased to exist, CDAX Forex must allow the outstanding element of the Onward Payment or the resumption of the Client’s use of the Payment Service (as appropriate). <br />
                    20.3 CDAX Forex may stop or suspend the ability of the Client to use an account information service provider or a payment initiation service provider if CDAX Forex has reasonably justified and duly evidenced reasons for same relating to unauthorised or fraudulent access to the Client’s Electronic Money information by that account information service provider or payment initiation service provider and/or the risk of unauthorised or fraudulent initiation of an Onward Payment. If CDAX Forex does deny access to an account information service provider or payment initiation service provider in accordance with this Clause 20.3, unless doing so would compromise security or is unlawful, CDAX Forex shall notify the Client as soon as possible using one of the methods set out in Clause 3.4.<br />
                    20.4 CDAX Forex shall contact the Client either:<br />
                    (a) via email to the email account it holds on record as belonging to the Client; and/or<br />
                    (b) via one or both of the Online Resources if the Client has registered for same, in the event of suspected or actual fraud or security threats.<br />
                    20.5 If the Client believes that a Payment Instruction has been given, or an Onward Payment made, in error and/ or was unauthorised by it, the Client must notify CDAX Forex as soon as possible via the helpline or e-mail address listed in Clause 3. Failure to notify CDAX Forex immediately on becoming aware of within the relevant timescale set out in clause 21.1 could result in the Client losing its entitlement to have the matter corrected<br />
                    <br />
                    <br />
                    21. LIABILITY AND INDEMNITY FOR PAYMENT SERVICES<br />
                    21.1 Subject to the remainder of this clause 21, where it is established that an Onward Payment was not authorised by the Client in accordance with Clauses 3 and 19.1 or that an Onward Payment was not correctly executed by CDAX Forex and that Client has notified CDAX Forex using the contact details set out in Clause 3.1(b) or Cause 3.1(d) in a timely manner:<br />
                    (a) within 13 months of the monies being debited from its accounts, if the Client is a consumer, a micro-enterprise or a charity; or<br />
                    (b) within 6 months of the monies being debited from its accounts, if the Client is not a consumer, a micro-enterprise or a charity, CDAX Forex shall refund to the Client the full amount debited erroneously or without authorisation as soon as practicable and in any event no later than the end of the Business Day following the day on which CDAX Forex became aware of the unauthorised or incorrectly executed Onward Payment, unless CDAX Forex has reasonable grounds to suspect fraud and notifies the appropriate authorities.<br />
                    21.2 The Client will be liable for:<br />
                    (a) all payments made by CDAX Forex pursuant to a particular unauthorised Onward Payment if the Client has acted fraudulently, or has intentionally or with gross negligence not complied with its obligations under Clause 20.1(a); and<br />
                    (b) subject to Clause 21.3 and where Clause 21.2(a) does not apply, up to £35 of any monies paid by CDAX Forex pursuant to a particular unauthorised Onward Payment where the Client has otherwise failed to comply with its obligations under Clause 20.1(a) except where:<br />
                    (i) the failure to comply with Clause 20.1(a) was not detectable by the Client prior to the Onward Payment, except where the Client has acted fraudulently; or<br />
                    (ii) the loss was caused by acts or omissions of any employee, agent or branch of CDAX Forex or of an entity which carries out activities on behalf of CDAX Forex. <br />
                    (c) all unauthorised Onward Payments made by CDAX Forex before it notified CDAX Forex in accordance with clause 20.1(d).<br />
                    21.3 Except where the Client has acted fraudulently, the Client shall not be liable for unauthorised Onward Payments:<br />
                    (a) executed by CDAX Forex after the Client has notified CDAX Forex in accordance with Clause 20.1(d), if the corresponding losses are directly related to the notification; and<br />
                    (b) where CDAX Forex has failed at any time to provide appropriate means for notification.<br />
                    21.4 CDAX Forex shall not be liable for non-execution or defective execution in relation to an Onward Payment which it has made in accordance with a unique identifier given to it by the Client which proves to be incorrect. However, CDAX Forex shall make efforts to trace funds involved in that transaction and notify the Client of the outcome.<br />
                    21.5 CDAX Forex is liable to the Client for the correct execution of a Payment Instruction unless:<br />
                    (a) Clause 21.4 applies; or<br />
                    (b) CDAX Forex can prove to the Client (and where relevant, to the Payee’s payment services provider) that the Payee’s payment services provider received the Onward Payment within the appropriate time period described in Clause 19.9.<br />
                    21.6 CDAX Forex shall not be liable to the Client for any:<br />
                    (a) delay or failure to perform its obligations under these Terms or any FX Contract (including any delay in payment) by reason of any cause beyond the reasonable control of CDAX Forex including but not limited to any action or inaction of the Client or any third party, bank delay, postal delay, failure or delay of any fax or electronic transmission, any accident, emergency, act of god or any abnormal or unforeseeable circumstances; or<br />
                    (b) consequential or indirect loss (such as loss of profits or opportunity) the Client may incur as a result of CDAX Forex failing to perform its duties under an FX Contract; or <br />
                    (c) contravention of a requirement imposed on CDAX Forex by regulations where that contravention is due to CDAX Forex complying with its obligations under the laws of any EEA state or other jurisdiction. <br />
                    21.7 the Client may be entitled to a refund in certain circumstances where an Onward Payment is <br />
                    initiated by the Payee. It is not anticipated that any Onward Payment will be initiated by a Payee under any Payment Services provided by CDAX Forex and the Client represents and undertakes to that effect in Clause 27.1(i). However, details of the circumstances in which a refund may apply are available on CDAX Forex’s website.<br />
                    21.8 The provisions in this Clause 21 shall survive termination of these Terms or any agreement under these Terms.<br />
                    <br />
                    22. OTHER TERMS RELATING TO PAYMENT SERVICES<br />
                    22.1 CDAX Forex will send the full amount of the Onward Payment to the Payee in accordance with the Payment Instruction. However, CDAX Forex cannot guarantee the Payee’s payment service provider or an intermediary payment service provider will not deduct a charge for receiving any <br />
                    Onward Payment. It is the responsibility of the Client to confirm with the Payee’s payment service provider the details of any charges. CDAX Forex shall if it is able to, upon request from the Client, provide an estimation of any intermediary payment service provider charges which may be deducted.<br />
                    22.2 CDAX Forex shall make available to the Client the information which the Client is entitled to receive under Regulations. That information shall be provided to the Client by email or made available via CDAX Forex’s website or (where made available to the Client) via the Online Resources. In addition, the Client may at any time request from CDAX Forex a copy of: <br />
                    (a) the then-current Terms applying between the Client and CDAX Forex in relation to Payment Services; and/or<br />
                    (b) any information to which the Client is entitled under regulations.<br />
                    22.3 The Client may terminate these Terms in relation to Payment Services at any time by giving notice to CDAX Forex in accordance with Clause 3. Any such termination shall be subject to Clause 25.4. <br />
                    <br />
                    TERMS APPLYING GENERALLY <br />
                    23. SAFEGUARDING OF CLIENT FUNDS<br />
                    23.1 Where CDAX Forex receives funds for the purpose of issuing Electronic Money, the funds corresponding to Electronic Money will be held in one or more Segregated Bank Accounts, which are bank accounts separate from the bank accounts upon which CDAX Forex’s own funds are held in accordance with Isle of Man Financial Services Authority Rules. <br />
                    23.2 Where CDAX Forex:<br />
                    (a) receives funds directly from the Client for the purpose of using those funds; or<br />
                    (b) redeems the Client’s Electronic Money for the purpose of using the corresponding funds to pay any monies owing to CDAX Forex under any FX Contract, including any Security Payment or Margin Call, in accordance with Clause 12.1, CDAX Forex will hold those monies in an account specifically for this purpose (Transaction Account), which is not a Segregated Bank Account or CDAX Forex’s bank account where it holds its own funds, until the FX Contract is executed.<br />
                    <br />
                    24. INTEREST<br />
                    24.1 If the Client fails to make any payment required under these Terms (including under any FX Contract or Payment Instruction) when it falls due, interest will be charged on the outstanding sum at a rate specified over the base rate of the Bank of England (or of such monetary authority as may replace it). Such interest shall accrue and be calculated daily from the date payment was due until the date the Client pays in full and shall be compounded monthly.<br />
                    24.2 CDAX Forex may receive and retain or apply for its own benefit any interest which arises in respect of any sum held by CDAX Forex in its Segregated Bank Accounts and Transaction Accounts.<br />
                    <br />
                    25. CHANGES TO THESE TERMS<br />
                    25.1 CDAX Forex may amend these Terms insofar as they relate to Foreign Exchange Services by notice in writing or in accordance with Clause 3.4 to the Client at any time and such amendments shall take effect from the date specified by CDAX Forex but may not affect any rights or obligations that have already arisen and will not be retrospective. <br />
                    25.2 Subject to Clause 25.3, CDAX Forex may amend these Terms insofar as they relate to Payment Services by giving at least 2 months’ notice in writing to the Client. If the Client objects to the proposed amendments, it has the right, subject to Clause 25.4, to terminate these Terms as regards Payment Services without charge before the date proposed by CDAX Forex for the entry into force of the changes. The Client will be deemed to accept the proposed amendments unless it notifies CDAX Forex and terminates these Terms insofar as they relate to Payment Services before the date proposed by CDAX Forex for the entry into force of the changes. If no objection is received from the Client, such <br />
                    amendments shall take effect from the date specified by CDAX Forex but may not affect any rights or obligations that have already arisen and will not be retrospective.<br />
                    25.3 CDAX Forex does not need to provide any notice to the Client of: <br />
                    (a) any change to these Terms insofar as they relate to Payment Services which is more favourable to the Client; or <br />
                    (b) a change to the standard interest rate applying pursuant to Clause 24.1, which in each case may be applied immediately.<br />
                    25.4 For the avoidance of doubt, the termination of these Terms by the Client pursuant to Clause 22.3 or Clause 25.2 shall not affect any FX Contract nor any rights or obligations that have already arisen at the date of the termination. Following any such termination, any onward transfer of converted currency to a Payee shall be subject to such terms as CDAX Forex and the Client shall agree. <br />
                    <br />
                    26. DISPUTES AND COMPLAINTS<br />
                    26.1 If a Client is dissatisfied with any aspect of the services provided by CDAX Forex, the Client may inform CDAX Forex. All complaints should in the first instance be made in writing to CDAX Forex in accordance with Clause 3 marked for the attention of the CEO. CDAX Forex will endeavour to review <br />
                    each complaint carefully and promptly.<br />
                    26.2 If a complaint relates to the provision by CDAX Forex of Payment Services or the issuance or redemption of Electronic Money, if the Client is not satisfied with CDAX Forex’s resolution of the complaint, the Client may be entitled to refer the matter to the Isle of Man Financial Services Ombudsman Scheme (FSOS). <br />
                    The FSOS provides an out-of-court redress mechanism. Please see their website https://www.gov.im/about-the-government/statutory-boards/isle-of-man-office-of-fair-trading/financial-services-ombudsman-scheme/ for information about how to contact the FSOS and how to bring a complaint.<br />
                    26.3 If a dispute arises between CDAX Forex and the Client relating to the existence or terms of any FX Contract (a ‘Disputed FX Contract’), CDAX Forex may close out or take any other action it reasonably considers appropriate in relation to the Disputed FX Contract (which may include suspension of performance of the Disputed FX Contract) pending settlement of the dispute without previously notifying and/or without having received instruction from the Client. CDAX Forex will try to notify the Client (orally or in writing) what action it has taken, as soon afterwards as it practically can, but if it does not, the validity of its action shall not be affected. <br />
                    <br />
                    27. CLIENT’S REPRESENTATIONS AND UNDERTAKINGS<br />
                    27.1 The Client represents to CDAX Forex that, at the date of acceptance by the Client of these Terms, at the time each Electronic Money Order, FX Order and each Payment Instruction is made, at the time each Electronic Money Contract and FX Contract is entered into and carried out and at the time each Onward Payment is made:<br />
                    (a) the Client is acting as principal for its own account;<br />
                    (b) the Client has full power, legal capacity and authority and has taken all necessary steps to enable it lawfully to enter into and perform these Terms and every FX Contract and Payment Instruction under these Terms;<br />
                    (c) for a Client who is not an individual, the person(s) entering into these Terms and executing the Account Opening Form on its behalf has been duly authorised to do so;<br />
                    (d) these Terms are binding upon the Client and enforceable against the Client (subject to applicable bankruptcy, reorganisation, insolvency, moratorium or similar laws affecting creditors’ rights generally and applicable principles of equity);<br />
                    (e) all sums paid to CDAX Forex by the Client under these Terms belong to the Client and are not subject to any charge or other rights of third parties;<br />
                    (f) all information supplied to CDAX Forex by the Client is, or at the time it is supplied will be, up to date, accurate in all material respects and the Client has not omitted or withheld any information which would make such information inaccurate in any material respect;<br />
                    (g) if the Client is entering into an FX Contract where the Maturity Date is more than 2 Business Days after the date the FX Contract is entered into, the purpose of same is to facilitate the payment of identifiable goods and/or services or direct investment;<br />
                    (h) the Client will take physical delivery of the currency bought; and<br />
                    (i) no Onward Payment has been or will be initiated by the Payee (save where the Client is the Payee). <br />
                    27.2 The Client will promptly provide to CDAX Forex:<br />
                    (a) on request such information regarding its financial and business affairs and/or identity, as CDAX Forex may reasonably require (including without limitation any information required by CDAX Forex to be able to comply with its anti-money laundering obligations and policies); and<br />
                    (b) written confirmation of any changes to the Client’s telephone and facsimile number(s) and email and postal address(es). <br />
                    27.3 For the avoidance of doubt, the Client will notify CDAX Forex immediately if it becomes aware of the occurrence, or likely occurrence, of any of the events specified at Clause 17.1 above.<br />
                    27.4 The Client undertakes to CDAX Forex that it shall promptly perform in timely fashion its obligations under these Terms, each Electronic Money Contract, each FX Contract and each Payment Instruction.<br />
                    <br />
                    28. RECORDING TELEPHONE CONVERSATIONS<br />
                    28.1 CDAX Forex may record telephone conversations with the Client, including recording oral instructions given by telephone, but CDAX Forex is not obliged to do this. The parties agree to:<br />
                    (a) the electronic recording by either party of telephone conversations between the parties with or without an automatic tone warning device; and<br />
                    (b) the use of such recordings as evidence by either party in any dispute or anticipated dispute between the parties or relating to dealings between the parties.<br />
                    28.2 If CDAX Forex makes any recordings or transcripts it may also destroy them in accordance with its normal procedures. <br />
                    <br />
                    29. GENERAL<br />
                    29.1 These Terms, the Account Opening and the Online User Guide (defined in Clause 31) set out the entire agreement and understanding of the parties on their subject matter and supersede all previous oral and written communications on the same subject matter. In the event of any inconsistency, discrepancy or ambiguity between these Terms, the Account Opening Form and the Online User Guide, the provisions of these Terms (subject to Clause 31), then these Terms shall prevail.<br />
                    29.2 If at any time any provision of these Terms or any Contract is or becomes illegal, invalid or unenforceable under the laws of any jurisdiction, neither the legality, validity or enforceability of such provision under the laws of any other jurisdiction nor the legality validity or enforceability of any other provision of these Terms or any Contract shall in any way be affected as a result.<br />
                    29.3 Where the Client comprises two or more people as named in the Account Opening Form each person named in the Account Opening Form will be jointly and severally liable to CDAX Forex in respect of all obligations contained in these Terms. Any reference to the “Client” in these Terms means all persons named in the Account Opening Form jointly and severally.<br />
                    29.4 The Client must make all payments under these Terms in full without any deduction, set-off, counterclaim or withholding of any kind.<br />
                    29.5 If a party fails to exercise or delays in exercising any right under these Terms, by doing so it does not waive such right. The rights provided in these Terms do not exclude other rights provided by law.<br />
                    29.6 The Client acknowledges and agrees that CDAX Forex is permitted to carry out an electronic database search and search credit reference agencies in order to verify the Client’s, or any shareholder or officer of the Client’s, identity and credit standing. If such searches are carried out, CDAX Forex may keep records of the contents and results of such searches in accordance with all current and applicable laws. <br />
                    29.7 The provisions of the Contracts (Rights of Third Parties) Act 2001 shall not apply to these Terms or to any FX Contract. <br />
                    <br />
                    30. DATA PROTECTION<br />
                    30.1 The Client authorises CDAX Forex to collect, use, store or otherwise process any personal information provided by the Client or from the searches referred at Clause 29.6 above (‘Personal Information’) to enable CDAX Forex and/or members of CDAX Forex’s group and/or the organisation which introduced or referred the Client to CDAX Forex to provide and/or improve its services. This may mean passing Personal Information to individuals or organisations which may be located in countries outside the EEA. Where the Client’s Personal Information is transferred outside the EEA, CDAX Forex will take steps to ensure that it is appropriately protected. <br />
                    30.2 CDAX Forex may also use the Personal Information to provide the Client with news and other information on CDAX Forex’s services and activities which may be useful to the Client, subject to the Client’s consent. If the Client would prefer its Personal Information not to be used for such purposes, it should contact CDAX Forex at the above address.<br />
                    30.3 CDAX Forex may pass on Personal Information to any organisations which CDAX Forex considers may be of assistance to the Client (which may be located outside the EEA) so that they may contact the Client with details of products and services which may interest the Client, subject to the Client’s consent. The Client has indicated in the Account Opening Form, or subsequently, whether it consents to receiving information from such organisations (including by e-mail or other electronic means) and where it consents to receiving information from organisations outside the EEA.<br />
                    30.4 Other than as stated in these Terms or in CDAX Forex’s Privacy Policy (which is available on CDAX Forex’s website), CDAX Forex will not disclose the Client’s Personal Information unless required by law.<br />
                    30.5 The Client, if it is an individual, will be given additional rights with respect to its Personal Information when the General Data Protection Regulation (GDPR) (Regulation (EU) 2016/679) comes into force on 25 May 2018. Our Privacy Policy will be updated to reflect your rights at the appropriate time.<br />
                    30.6 If the Client wishes to obtain a copy of its Personal Information, it should contact CDAX Forex in writing in accordance with Clause 3.<br />
                    <br />
                    31. USE OF THE ONLINE SYSTEM (WHERE APPLICABLE)<br />
                    31.1 The Client may be required to complete a user set up form providing details of any Authorised Person whom may use any Online System which CDAX Forex may make available to the Client. The Client will be required to confirm its agreement to any system restrictions and limits prior to the Client being granted access to access to the Online System. Such access will be on the terms and conditions as to the use of the Online System as may be made available by CDAX Forex to the Client (the ‘Online User Guide’), which shall form part of these Terms. This Clause 31 applies subject to the provisions of the Online User Guide in relation to the Online System, and if there are any inconsistencies between this Clause 31 and the Online User Guide, the provisions of the Online User Guide will prevail. Terms which are not defined in this Clause 31 will have the meaning (if any) given to them in the Online User Guide.<br />
                    31.2 The Client agrees to use the Online System only in accordance with the Online User Guide and maintain any minimum operating and browser specifications as advised by CDAX Forex from time to time.<br />
                    31.3 The Client agrees to be solely responsible for the protection of all passwords and the Client should notify CDAX Forex immediately of any actual or suspected compromise of any password.<br />
                    31.4 If there are any interruptions in the Online System which result in the Client being unable to use the Online System the Client should fax or telephone FX Orders and Payment Instructions to CDAX Forex.<br />
                    <br />
                    32. APPLICABLE LAW<br />
                    32.1 These Terms and any relationship between CDAX Forex and the Client shall be governed by Isle of Man law and subject to the exclusive jurisdiction of the Isle of Man courts.<br />
                    <br />
                    ADDENDUM RELATING TO (A) ELECTRONIC MONEY ACCOUNTS USED BY ONLINE SELLERS; (B) CREATING RULES TO AUTOMATICALLY PLACE FX ORDERS AND PAYMENT INSTRUCTIONS; AND (C) THE USE OF THE CLIENT’S SECURE AREA OF THE ONLINE SELLER SITE<br />
                    <br />
                    1. ACCEPTANCE AS AN ONLINE SELLER CLIENT <br />
                    1.1 Before the Client is able to make use of the services provided by CDAX which are described in this addendum and become an “Online Seller Client”, the Client has to be accepted by CDAX as an Online Seller Client. <br />
                    1.2 In order to be accepted by CDAX as an Online Seller Client, the Client has to, among other things, be an existing client of CDAX and sell products online. <br />
                    1.3 Once the Client has been accepted as an Online Seller Client, it will be able to: <br />
                    (a) log onto the Client’s secure area of the Online Seller Site; <br />
                    (b) open Electronic Money Accounts; <br />
                    (c) send online proceeds of sale and other monies agreed by CDAX from time to time (“Collection Monies”) to the Electronic Money Accounts; and<br />
                    (d) set, amend pause and cancel Rules (as defined below) on Electronic Money Accounts and consequently automatically place FX Orders and Payment Instructions with CDAX.<br />
                    <br />
                    2. ELECTRONIC MONEY ACCOUNTS <br />
                    2.1 If the Client has been accepted as an Online Seller Client in accordance with paragraph 1 above, then:<br />
                    (a) CDAX can receive Collection Monies on behalf of the Client into a Segregated Bank Account in exchange for CDAX issuing the Client with the equivalent amount and currency of Electronic Money. This Electronic Money will be stored in the Client’s Electronic Money Account; and <br />
                    (b) Rules over the Electronic Money Accounts can be set, amended, paused and cancelled. <br />
                    2.2 The Client is responsible for providing CDAX with clear instruction on which Electronic Money Account is to be credited with Electronic Money upon receipt of Collection Monies. Collection Monies sent to CDAX will be subject to a receipt fee upon issuance of Electronic Money into the relevant Electronic Money Account. <br />
                    2.3 The Client can ascertain how much money is held in each Electronic Money Account either via telephone using the contact details set out in Clause 3 or by logging onto the Client’s secure area of the Online Seller Site in accordance with paragraph 6 of this addendum. <br />
                    <br />
                    3. SETTING RULES ON ELECTRONIC MONEY ACCOUNTS <br />
                    3.1 The Client is able to set rules (“Rules”) on each of its Electronic Money Accounts. When a Rule is set and the condition (the “Condition”) in that Rule is satisfied, then an automatic Payment Instruction and/ or an automatic FX Order (depending on whether the Customer Account and the Destination Account (defined below) are the same currency or not) will be placed by the Client with CDAX. <br />
                    3.2 There are three Rules which may be set on an Electronic Money Account, namely the Immediate AutoWithdraw Rule, the Threshold AutoWithdaw Rule and the Exchange Rate AutoWithdraw Rule. Only one rule may be set on an Electronic Money Account at a time.  <br />
                    3.3 If the Immediate AutoWithdraw Rule applies to an Electronic Money Account, then the condition which, when satisfied, triggers the automatic placing of a Payment Instruction and/or the automatic placing of an FX Order, is that any amount of Electronic Money is received by the Electronic Money Account (the “Immediate AutoWithdraw Condition”).<br />
                    3.4 If the Threshold AutoWithdraw Rule applies to an Electronic Money Account, then the condition which, when satisfied, triggers the automatic placing of a Payment Instruction and/or an FX Order, is that the balance of Electronic Money in the Electronic Money Account reaches or exceeds an amount which the Client determined (the “Threshold Amount”) when setting the Rule (the “Threshold AutoWithdraw Condition”). <br />
                    3.5 If the Exchange Rate AutoWithdraw Rule applies to an Electronic Money Account, then the condition which, when satisfied, triggers the automatic placing of a Payment Instruction and/or the automatic placing of an FX Order, is that the exchange rate which the Client can obtain from CDAX to use the Electronic Money to purchase the currency the client chooses when setting the Rule, is the same as or more beneficial to the Client than the exchange rate which the Client determined (the “Threshold Exchange Rate”) when setting the Rule (the “Exchange Rate AutoWithdraw Rule”). <br />
                    3.6 The following information is required in order to set a Rule: (a) the details of the Electronic Money Account the Rule is to apply to; (b) the details of the bank account which the monies, subject to the Payment Instruction, are to be sent to (the “Destination Account”) and the currency of same; (c) whether the Immediate AutoWithdraw Rule or the Threshold AutoWithdraw Rule or the Exchange Rate AutoWithdraw Rule is to apply to the Electronic Money Account; (d) if the Threshold AutoWithdraw Rule is to apply to the Electronic Money Account, the relevant Threshold Amount; (e) if the Exchange Rate AutoWithdraw Rule is to apply to the Electronic Money Account, the relevant Threshold Exchange Rate.<br />
                    3.7 The Client is able to set, amend, pause or delete the Rules applying to each of its Electronic Money Accounts either via telephone using the contact details set out in Clause 3 or via the Client’s secure area of the Online Seller Site. For the avoidance of doubt, the Client setting and pausing or cancelling a Rule on an Electronic Money Account is the Client consenting and withdrawing consent to the execution the payment instruction. <br />
                    3.8 The Client will receive notifications from CDAX when it sets, amends or cancels a Rule or when the condition of a Rule set on an Electronic Money Account has been satisfied. If the Client receives a notification which it, or an authorised user did not action or which it otherwise should not have received, then the Client must inform CDAX as soon as it becomes aware by using the contact details set out in Clause 3. 4. <br />
                    <br />
                    TERMS OF AN FX ORDER AUTOMATICALLY PLACED<br />
                    4.1 If: (a) the conditions of a Rule applying to an Electronic Money Account are satisfied; and (b) in that Rule the currency of the Electronic Money Account is different to the currency of the Destination Account, (c) (then an FX Order will automatically be placed by the Client with CDAX. <br />
                    4.2 The terms of an FX Order, which is automatically placed with CDAX, will be as follows: (a) the foreign exchange contract is to be a spot contract redeeming all of the Electronic Money in the relevant Electronic Money Account and using the equivalent amount of money in the same currency as the Electronic Money to purchase money in the currency of the Destination Account; (b) the exchange rate is the sum of: (i) the margin agreed between CDAX and the Client for the purchase of the currency of the Destination Account using the currency of the Electronic Money Account; and (ii) the exchange rate which CDAX believes, acting reasonably, that it would be able obtain if it were to purchase the currency of the Destination Account using the currency of the Electronic Money Account on the wholesale markets at the time the FX Order is accepted by CDAX. <br />
                    4.3 The Client acknowledges that, even if the Exchange Rate AutoWithdraw Rule applies, the exchange rate applied will still be as set out in paragraph 4.2(b). Accordingly, in rare cases, the exchange rate which applies to the Client’s FX Contract might be less beneficial to the Client than the Threshold Exchange Rate. <br />
                    <br />
                    5. TERMS OF A PAYMENT INSTRUCTION AUTOMATICALLY PLACED <br />
                    5.1 The terms of a Payment Instruction, which is automatically placed with CDAX, will be as follows: (a) the monies to be sent are: (i) (all of the money which is available to the Client (less any charges) as a result of the Electronic Money in the Electronic Money Account being redeemed in the event that no FX Order has automatically been placed with CDAX; (ii) the money which is purchased using the money which is available to the Client (less any charges) as a result of the Electronic Money in the Electronic Money Account being redeemed in the event that an FX Order was automatically placed at the same time the Payment Instruction was automatically placed. (b) the details of the Payee will be the details of the Destination Account supplied when creating or amending the relevant Rule. <br />
                    <br />
                    6. ACCESS TO CLIENT’S SECURE AREA OF THE ONLINE SELLER SITE<br />
                    6.1 The Client’s secure area of the Online Seller Site (the “Online Seller Site”) is accessed by entering the Client’s username and password on the appropriate page of CDAX’s website .<br />
                    6.2 The Client’s secure area of the Online Seller Site allows the Client to view the amount of money held in each Electronic Money Account and set, amend, pause and delete Rules to those Electronic Money Accounts.
                </TermsContainer>

                <Formik
                    initialValues={{ terms: false }}
                    validationSchema={yup.object({
                        terms: yup.boolean()
                            .isTrue('You have to agree to the terms and conditions.')
                            .required('You have to agree to the terms and conditions.')
                    })}
                    onSubmit={async (values, formik) => {
                        try {
                            const user = await acceptTerms();
                            if (user.hasAcceptedTerms) {
                                dispatch(setCurrentUser(user));
                            }
                            navigate('/dashboard');
                        } catch (err) {
                            console.error(err);
                            formik.setFieldError('terms', 'Request failed, please try again.');
                        }
                    }}>

                    <StyledForm>
                        <CheckboxField
                            name="terms"
                            labeltext='I agree to the Terms and Conditions' />

                        <ButtonsContainer>
                            <SlideButton primary type='submit'>Submit</SlideButton>
                        </ButtonsContainer>
                    </StyledForm>
                </Formik>
            </Container>
        </Layout>
    </RequireAuth>;
}

const Container = styled.div``;

const TermsContainer = styled.div`
max-height: 80vh;
overflow-y: scroll;
text-align: left;
white-space: pre-wrap;
border: 1px solid ${props => props.theme.colors.fg};
padding: 20px;
border-radius: 8px;
background: white;
`;

const Text = styled.div`
padding: 10px 20px;
font-weight: bolder;
`;
