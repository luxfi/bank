import { Typography, RadioChangeEvent, Space } from 'antd';
import { Card, FlexContainer } from "../../../components/Card";
import styled from "styled-components";
import { device } from "../../../utils/media-query-helpers";
import { Row, Col } from "antd";
import { Radio as R, Input, DatePicker } from 'antd';
import { PropsWithChildren } from 'react';

const { Text, Paragraph } = styled(Typography)`
    font-weight: 500;
`;
const InputGroup = styled(Input)`
    .ant-input-group > .ant-input:last-child {
        padding-top: 10px;
        padding-bottom: 10px;
        border-radius: 0px 5px 5px 0px;
    }
    .ant-input-group-addon:first-child {
        width: 40%;
        text-align: left;
        background-color: #00569E;
        padding-top: 10px;
        padding-bottom: 10px;
        border-radius: 5px 0px 0px 5px;
        color: white;
        font-weight: 700;
    }
    margin-bottom: 30px;
`
const Radio = styled(R)`
    min-width: 65px;
`
const SmallText = styled(Text)`
    font-size: 11px;
    font-style: italic;
`
interface RowProps {
    odd?: string;
}
const BandedRow = ({children, odd} : PropsWithChildren<RowProps>) => (
    odd === 'even' ? 
        <Row style={{backgroundColor: "#F0F0F0"}}>
            {children}
        </Row>
    :
        <Row style={{backgroundColor: "white"}}>
            {children}
        </Row>
)
const SingleRow = styled.div`
    padding: 5px 15px;
    width: 100%;
    @media ${device.lg}, ${device.sm} {
        display: flex;
    }
`
const LeftPart = styled.div`
    @media ${device.lg} {
        width: 66%;
        float: left;
    }
    padding: 5px 15px;
    border-right: 1px solid lightgray;
`;
const RightPart = styled.div`
    @media ${device.lg} {
        width: 34%;
        float: right;
    }
    padding: 5px 15px;
`;

export default function BusinessRiskAssessmentPart({value, onChange}: any) {
    return (
        <>
            <InputGroup name = "clientName" addonBefore="Client Name: " value={value.clientName} onChange = {onChange}/>
            <Card title="RESIDENCE AND NATIONALITY OF BENEFICIAL OWNERS" type="wide">
                <BandedRow>
                    <LeftPart>
                        <Text>
                            Refer to List of High Risk and Sanctioned Countries
                        </Text>
                    </LeftPart>
                </BandedRow>
                <BandedRow>
                    <LeftPart>
                        <Text>
                            Is the country subject to any sanctions?
                        </Text>
                    </LeftPart>
                    <RightPart>
                        <Radio.Group name = "sanction" onChange={onChange} value={value.sanction}>
                            <Radio value={'yes'}>Yes</Radio>
                            <Radio value={'no'}>No</Radio>
                        </Radio.Group>
                    </RightPart>
                </BandedRow>
                <BandedRow odd = 'even'>
                    <LeftPart>
                        <Text>
                            What is the risk rating of the jurisdiction according to the Country Risk list* ?<br />
                        </Text>
                        <SmallText>
                            NOTE * Where the client has a material connection to a country covered by a statement from an international body (list in Appendix D (a) of FSA AML Hbk) or any Sanctions implications then MUST rate the relationship as High Risk and no downgrade can be applied.
                        </SmallText>
                    </LeftPart>
                    <RightPart>
                        <Radio.Group name = "rating" onChange={onChange} value={value.rating}>
                            <Radio value={'high'}>High</Radio>
                            <Radio value={'medium'}>Medium</Radio>
                            <Radio value={'low'}>Low</Radio>
                        </Radio.Group>
                    </RightPart>
                </BandedRow>
                <BandedRow>
                    <LeftPart>
                        <Text>
                            Does this apply in this case?
                        </Text>
                    </LeftPart>
                    <RightPart>
                        <Radio.Group name = "apply" onChange={onChange} value={value.apply}>
                            <Radio value={'yes'}>Yes</Radio>
                            <Radio value={'no'}>No</Radio>
                        </Radio.Group>
                    </RightPart>
                </BandedRow>
            </Card>
            <Card title="PRINCIPAL KNOWN TO CDAX" type="wide">
                <BandedRow>
                    <LeftPart>
                        <Text>
                            Is the Company known to CDAX?
                        </Text>
                    </LeftPart>
                    <RightPart>
                        <Radio.Group name = "known" onChange={onChange} value={value.known}>
                            <Radio value={'yes'}>Yes</Radio>
                            <Radio value={'no'}>No</Radio>
                        </Radio.Group>
                    </RightPart>
                </BandedRow>
                <BandedRow odd='even'>
                    <LeftPart>
                        <Text>
                            If yes, how long have we known them
                        </Text>
                    </LeftPart>
                    <RightPart>
                        <Radio.Group name = "yearsKnown" onChange={onChange} value={value.yearsKnown}>
                            <Radio value={'one'}>1 Years</Radio>
                            <Radio value={'five'}>5 Years</Radio>
                            <Radio value={'ten'}>10 Years</Radio>
                        </Radio.Group>
                    </RightPart>
                </BandedRow>
                <BandedRow>
                    <LeftPart>
                        <Text>
                            Have the clients ever been met face to face?
                        </Text>
                    </LeftPart>
                    <RightPart>
                        <Radio.Group name = "metFace" onChange={onChange} value={value.metFace}>
                            <Radio value={'yes'}>Yes</Radio>
                            <Radio value={'no'}>No</Radio>
                        </Radio.Group>
                    </RightPart>
                </BandedRow>
            </Card>
            <Card title="NUMBER OF BENEFICIAL OWNERS" type="wide">
                <BandedRow>
                    <LeftPart>
                        <Text>
                            Two or less Spouses/Partners
                        </Text>
                    </LeftPart>
                    <RightPart>
                        <Radio.Group name = "numberOfBeneficialOwners" onChange={onChange} value={value.numberOfBeneficialOwners}>
                            <Radio value={'less_than_5'}>Less than 5</Radio>
                            <Radio value={'more_than_5'}>More than 5</Radio>
                        </Radio.Group>
                    </RightPart>
                </BandedRow>
            </Card>
            <Card title="HIGHER RISK CLIENT (e.g. PEP, adverse media or press profile)" type="wide">
                <BandedRow>
                    <LeftPart>
                        <Text>
                        Are any of the beneficial owners or directors of the company a Politically Exposed Person (PEP) or family member/close associate of a PEP.
                        </Text>
                    </LeftPart>
                    <RightPart>
                        <Radio.Group name = "pep" onChange={onChange} value={value.pep}>
                            <Radio value={'yes'}>Yes</Radio>
                            <Radio value={'no'}>No</Radio>
                        </Radio.Group>
                    </RightPart>
                </BandedRow>
                <BandedRow odd='even'>
                    <LeftPart>
                        <Text>
                        Any Adverse Information from Comply Launch screening check or other sources on beneficial owners or Directors.
                        <br />
                        e.g. criminal activity/disqualiﬁed director.   Full rationale of the factors considered and the outcome must be documented clearly identifying who has compiled the rationale and date.
                        </Text>
                        <br /><br />
                        <Text italic>
                            ANY PEP SHOULD BE BROUGHT TO THE ATTENTION OF THE COMPLIANCE DEPARTMENT AND DETAILS OF THE PEP RECORDED IN THE PEPS REGISTER WHICH IS MAINTAINED BY THE COMPLIANCE DEPARTMENT. COMPLIANCE DEPARTMENT WILL DETERMINE WHETHER CDD IS SUFFICIENT OR IF ENHANCED DUE DILIGENCE ON THE INDIVIDUAL CONCERNED IS NEEDED.
                        </Text>
                        <br /><br/>
                        <SmallText>
                            For definition of persons who are regarded as PEP’s refer to AML/CFT Manual. 
                            <br />
                            Copy of ComplyLaunch screening check result to be retained with this risk assessment.
                        </SmallText>
                    </LeftPart>
                    <RightPart>
                        <Radio.Group name = "adverseInformation" onChange={onChange} value={value.adverseInformation}>
                            <Radio value={'yes'}>Yes</Radio>
                            <Radio value={'no'}>No</Radio>
                        </Radio.Group>
                    </RightPart>
                </BandedRow>
            </Card>
            <Card title="Classification of A" type="wide">
                <BandedRow>
                    <SingleRow>
                        <Text style={{whiteSpace: "nowrap", paddingTop: "5px", paddingBottom: "5px", marginRight: "10px"}}>
                            Applicant for Business
                        </Text>
                        <Input name = "applicantForBusiness" value = {value.applicantForBusiness} onChange = {onChange} />
                    </SingleRow>
                </BandedRow>
                <BandedRow odd='even'>
                    <LeftPart>
                        <Text>
                            Classify client as a PEP
                        </Text>
                    </LeftPart>
                    <RightPart>
                        <Radio.Group name = "classifyAsPep" onChange={onChange} value={value.classifyAsPep}>
                            <Radio value={'yes'}>Yes</Radio>
                            <Radio value={'no'}>No</Radio>
                        </Radio.Group>
                    </RightPart>
                </BandedRow>
                <BandedRow>
                    <LeftPart>
                        <Text>
                            Automatically starts as "HIGH" risk classification for relationship
                        </Text>
                    </LeftPart>
                    <RightPart>
                        <Radio.Group name = "automaticallyHigh" onChange={onChange} value={value.automaticallyHigh}>
                            <Radio value={'yes'}>Yes</Radio>
                            <Radio value={'no'}>No</Radio>
                        </Radio.Group>
                    </RightPart>
                </BandedRow>
            </Card>
            <Card title="SOURCE OF FUNDS/SOURCE OF WEALTH (Initial and on-going) " type="wide">
                <BandedRow>
                    <LeftPart>
                        <Text italic>
                        We must have adequate knowledge and understanding of how the client has acquired his wealth and the source of funds.
                        </Text>
                    </LeftPart>
                    <RightPart>
                        <Radio.Group name = "knowledge" onChange={onChange} value={value.knowledge}>
                            <Radio value={'yes'}>Yes</Radio>
                            <Radio value={'no'}>No</Radio>
                        </Radio.Group>
                    </RightPart>
                </BandedRow>
                <BandedRow  odd = 'even'>
                    <LeftPart>
                        <Text>
                            Are funds/assets in or derived from an AML Equivalent jurisdiction?
                        </Text>
                    </LeftPart>
                    <RightPart>
                        <Radio.Group name = "aml" onChange={onChange} value={value.aml}>
                            <Radio value={'yes'}>Yes</Radio>
                            <Radio value={'no'}>No</Radio>
                        </Radio.Group>
                    </RightPart>
                </BandedRow>
                <BandedRow>
                    <LeftPart>
                        <Text>
                            Do they originate from a sanctioned jurisdiction?
                        </Text>
                    </LeftPart>
                    <RightPart>
                        <Radio.Group name = "sanctionedJurisdiction" onChange={onChange} value={value.sanctionedJurisdiction}>
                            <Radio value={'yes'}>Yes</Radio>
                            <Radio value={'no'}>No</Radio>
                        </Radio.Group>
                    </RightPart>
                </BandedRow>
                <BandedRow odd = 'even'>
                    <LeftPart>
                        <Text>
                            Do they originate from a high risk jurisdiction? 
                        </Text>
                    </LeftPart>
                    <RightPart>
                        <Radio.Group name = "highRiskJurisdiction" onChange={onChange} value={value.highRiskJurisdiction}>
                            <Radio value={'yes'}>Yes</Radio>
                            <Radio value={'no'}>No</Radio>
                        </Radio.Group>
                    </RightPart>
                </BandedRow>
                <BandedRow>
                    <LeftPart>
                        <Text>
                        Are funds/assets coming from a 3rd  party?
                        </Text>
                    </LeftPart>
                    <RightPart>
                        <Radio.Group name = "thirdParty" onChange={onChange} value={value.thirdParty}>
                            <Radio value={'yes'}>Yes</Radio>
                            <Radio value={'no'}>No</Radio>
                        </Radio.Group>
                    </RightPart>
                </BandedRow>
                <BandedRow odd = 'even'>
                    <LeftPart>
                        <Text>
                            If yes is the rationale fully understood.
                        </Text>
                    </LeftPart>
                    <RightPart>
                        <Radio.Group name = "understood" onChange={onChange} value={value.understood}>
                            <Radio value={'yes'}>Yes</Radio>
                            <Radio value={'no'}>No</Radio>
                        </Radio.Group>
                    </RightPart>
                </BandedRow>
                <BandedRow>
                    <LeftPart>
                        <Text>
                            <SmallText>
                                Where the client has a material connection to a country covered by a statement from an international body (list in Appendix D (a) of FSA AML Hbk) then MUST rate the relationship as High Risk.<br />
                            </SmallText>
                            Does this apply in this case?
                        </Text>
                    </LeftPart>
                    <RightPart>
                        <Radio.Group name = "materialConnection" onChange={onChange} value={value.materialConnection}>
                            <Radio value={'yes'}>Yes</Radio>
                            <Radio value={'no'}>No</Radio>
                        </Radio.Group>
                    </RightPart>
                </BandedRow>
                <BandedRow odd='even'>
                    <LeftPart>
                        <Text>
                            Does the Source of Funds or Source of Wealth originate from a higher risk or sensitive business activity or profession.   For example,  Arms and Military, Mining, Gold or Precious metal trading, Gambling, Time share, Pharmaceutical, cross border trade. (See Client Risk Assessment Guidance)
                        </Text>
                    </LeftPart>
                    <RightPart>
                        <Radio.Group name = "sensitiveActivity" onChange={onChange} value={value.sensitiveActivity}>
                            <Radio value={'yes'}>Yes</Radio>
                            <Radio value={'no'}>No</Radio>
                        </Radio.Group>
                    </RightPart>
                </BandedRow>
            </Card>
            <Card title="JURISDICTION OF CLIENT ENTITY (Initial and on-going)" type="wide">
                <BandedRow>
                    <LeftPart>
                        <Paragraph italic><SmallText>See List of High Risk and Sanctioned Countries</SmallText></Paragraph>
                    </LeftPart>
                </BandedRow>
                <BandedRow>
                    <LeftPart>
                        <Text>
                            Within the Corporate structure/ownership is there any country of incorporation subject to Sanctions? 
                        </Text>
                    </LeftPart>
                    <RightPart>
                        <Radio.Group name = "sanctionedCorporate" onChange={onChange} value={value.sanctionedCorporate}>
                            <Radio value={'yes'}>Yes</Radio>
                            <Radio value={'no'}>No</Radio>
                        </Radio.Group>
                    </RightPart>
                </BandedRow>
                <BandedRow odd='even'>
                    <LeftPart>
                        <Text>
                            Within the Corporate structure/ownership is there any country of incorporation that is High Risk
                        </Text>
                    </LeftPart>
                    <RightPart>
                        <Radio.Group name = "highRiskCorporate" onChange={onChange} value={value.highRiskCorporate}>
                            <Radio value={'yes'}>Yes</Radio>
                            <Radio value={'no'}>No</Radio>
                        </Radio.Group>
                    </RightPart>
                </BandedRow>
                <BandedRow>
                    <LeftPart>
                        <Text>
                            What is the highest risk rating of the jurisdictions involved.  
                        </Text>
                    </LeftPart>
                    <RightPart>
                        <Radio.Group name = "highestRisk" onChange={onChange} value={value.highestRisk}>
                            <Radio value={'yes'}>Yes</Radio>
                            <Radio value={'no'}>No</Radio>
                        </Radio.Group>
                    </RightPart>
                </BandedRow>
                <BandedRow odd='even'>
                    <LeftPart>
                        <Text>
                            Is the entity a public listed company or wholly owned subsidiary?  
                        </Text>
                    </LeftPart>
                    <RightPart>
                        <Radio.Group name = "publicOrWholly" onChange={onChange} value={value.publicOrWholly}>
                            <Radio value={'yes'}>Yes</Radio>
                            <Radio value={'no'}>No</Radio>
                        </Radio.Group>
                    </RightPart>
                </BandedRow>
                <BandedRow>
                    <LeftPart>
                        <Text>
                            Are there any bearer shares issued? <br />
                            <SmallText italic>NB. If yes must be immobilised and undertaking obtained</SmallText>
                        </Text>
                    </LeftPart>
                    <RightPart>
                        <Radio.Group name = "bearer" onChange={onChange} value={value.bearer}>
                            <Radio value={'yes'}>Yes</Radio>
                            <Radio value={'no'}>No</Radio>
                        </Radio.Group>
                    </RightPart>
                </BandedRow>
                <BandedRow odd='even'>
                    <LeftPart>
                        <Text>
                            Is the Company ownership/Directors information publicly available? <br />
                            <SmallText italic>(Question does not apply to IOM 2006 incorporated company’s)</SmallText>
                        </Text>
                    </LeftPart>
                    <RightPart>
                        <Radio.Group name = "ownershipInfo" onChange={onChange} value={value.ownershipInfo}>
                            <Radio value={'yes'}>Yes</Radio>
                            <Radio value={'no'}>No</Radio>
                        </Radio.Group>
                    </RightPart>
                </BandedRow>
                <BandedRow>
                    <LeftPart>
                        <SmallText italic>
                            <Text strong>NOTE:</Text>
                            e.g. A Delaware Co would be rated low risk on US Country rating but could have bearer shares and no publicly accessible records.  Ownership could change without being able to ﬁnd out. !!  would therefore present a higher risk.
                            <br />
                            Where the client has a material connection to a country covered by a statement from an international body (list in Appendix D (a) of FSA AML Hbk) then MUST rate the relationship as High Risk and no downgrade can be applied.*
                        </SmallText>
                    </LeftPart>
                    <LeftPart>
                        Does this apply in this case
                    </LeftPart>
                    <RightPart>
                        <Radio.Group name = "clientEntityApply" onChange={onChange} value={value.clientEntityApply}>
                            <Radio value={'yes'}>Yes</Radio>
                            <Radio value={'no'}>No</Radio>
                        </Radio.Group>
                    </RightPart>
                </BandedRow>
            </Card>
            <Card title="PRINCIPAL AREAS OF OPERATION" type="wide">
                <BandedRow>
                    <LeftPart>
                        <Text strong>
                            Consider where the business principally conducts business and cross border operations
                        </Text>
                    </LeftPart>
                    <RightPart>
                        <Radio.Group name = "considerWhere" onChange={onChange} value={value.considerWhere}>
                            <Radio value={'yes'}>Yes</Radio>
                            <Radio value={'no'}>No</Radio>
                        </Radio.Group>
                    </RightPart>
                </BandedRow>
                <BandedRow odd='even'>
                    <LeftPart>
                        <Text>
                            Is the country subject to any sanctions? 
                        </Text>
                    </LeftPart>
                    <RightPart>
                        <Radio.Group name = "principalAreaSanction" onChange={onChange} value={value.principalAreaSanction}>
                            <Radio value={'yes'}>Yes</Radio>
                            <Radio value={'no'}>No</Radio>
                        </Radio.Group>
                    </RightPart>
                </BandedRow>
                <BandedRow>
                    <LeftPart>
                        <Text>
                            What is the risk rating of the jurisdiction? 
                        </Text>
                    </LeftPart>
                    <RightPart>
                        <Radio.Group name = "principalAreaRisk" onChange={onChange} value={value.principalAreaRisk}>
                            <Radio value={'yes'}>Yes</Radio>
                            <Radio value={'no'}>No</Radio>
                        </Radio.Group>
                    </RightPart>
                </BandedRow>
                <BandedRow odd='even'>
                    <LeftPart>
                        <Text>
                            Where the client has a material connection to a country covered by a statement from an international body (list in Appendix D (a) of FSA AML Hbk) then MUST rate the relationship as High Risk and no downgrade can be applied.*
                        </Text>
                    </LeftPart>
                </BandedRow>
                <BandedRow>
                    <LeftPart>
                        <Text>
                            Does this apply in this case? 
                        </Text>
                    </LeftPart>
                    <RightPart>
                        <Radio.Group name = "principalAreaApply" onChange={onChange} value={value.principalAreaApply}>
                            <Radio value={'yes'}>Yes</Radio>
                            <Radio value={'no'}>No</Radio>
                        </Radio.Group>
                    </RightPart>
                </BandedRow>
            </Card>
            <Card title="BUSINESS PURPOSE Consider the following factors" type="wide">
                <SingleRow>
                    <Text strong>
                        Consider where the business principally conducts business and cross border operations
                    </Text>
                </SingleRow>
                <SingleRow>
                    <Text style={{whiteSpace: "nowrap", paddingTop: "5px", paddingBottom: "5px", marginRight: "10px"}}>
                        What is the business activity /purpose of the company?
                    </Text>
                    <Input name = "businessPurpose" value = {value.businessPurpose} onChange = {onChange} />
                </SingleRow>
                <SingleRow>
                    <Radio.Group name = "businessPurposeOptions" onChange={onChange} value={value.businessPurposeOptions}>
                        <Radio value={'dormant'}>Dormant</Radio>
                        <Radio value={'no_income'}>Single Asset Holding (no income)</Radio>
                        <Radio value={'investment'}>Investment</Radio>
                        <Radio value={'asset'}>Asset Holding</Radio>
                        <Radio value={'dealing'}>Dealing</Radio>
                        <Radio value={'other'}>Other (e.g. Low Activity Trading) </Radio>
                    </Radio.Group>
                </SingleRow>
            </Card>
            <Card title="HIGH RISK BUSINESS ACTIVITY (see note below)" type="wide">
                <BandedRow>
                    <LeftPart>
                        <Paragraph>
                            Is this business a high risk business?
                        </Paragraph>
                        <Paragraph>
                        Business Type:  Need sufficient detail to determine that business does not involve any sensitive activity possibly subject to sanctions or greater potential of bribery and corruption. Must consider the reputational impact that might also arise from involvement in the activity. For new business this should be evident from Form 1.  
                        </Paragraph>
                        <Paragraph>
                            <SmallText italic>
                                Examples of  higher risk activity include Arms and military/ mining / oil/ gas / gambling / unlicenced pharmaceutical / unregulated charity / pornography or prostitution / contaminated waste / online mail order / overseas property development / time share / debt collection / unlicenced money lending / education services not recognised by an appropriate authority / government contracts.
                            </SmallText>
                        </Paragraph>
                    </LeftPart>
                    <RightPart>
                        <Radio.Group name = "highRiskActivity" onChange={onChange} value={value.highRiskActivity}>
                            <Radio value={'yes'}>Yes</Radio>
                            <Radio value={'no'}>No</Radio>
                        </Radio.Group>
                    </RightPart>
                </BandedRow>
            </Card>
            <Card title="OTHER" type="wide">
                <BandedRow>
                    <LeftPart>
                        <Text>
                            IS THE CLIENT’S ACTIVITY REGULATED?
                        </Text>
                        <br />
                        <SmallText>
                            e.g. CSP/TSP/Consumer Credit/ Brokers/Money Lending/Handling Client Funds/Investment
                        </SmallText>
                    </LeftPart>
                    <RightPart>
                        <Radio.Group name = "activityRegulated" onChange={onChange} value={value.activityRegulated}>
                            <Radio value={'yes'}>Yes</Radio>
                            <Radio value={'no'}>No</Radio>
                        </Radio.Group>
                    </RightPart>
                </BandedRow>
                <BandedRow odd='even'>
                    <LeftPart>
                        <Text>
                            VALUE OF ENTITY (total of assets under control of entity)
                        </Text>
                    </LeftPart>
                    <RightPart>
                        <Radio.Group name = "valueOfEntity" onChange={onChange} value={value.valueOfEntity}>
                            <Radio value={'small'}>&lt; £10m</Radio>
                            <Radio value={'medium'}>£10m - £20m</Radio>
                            <Radio value={'large'}>&gt;£20m</Radio>
                        </Radio.Group>
                    </RightPart>
                </BandedRow>
                <BandedRow>
                    <LeftPart>
                        <Text>
                            EXPECTED VOLUME OF TRANSACTIONS  [Per Month] 
                        </Text>
                        <SmallText italic>
                            Numbers quoted to be considered in light of practical experience ? <br />
                            How many transactions are expected to ﬂow through the entity (including bank accounts, income, expenses, loan positions, and any other transactions entered into by the company) during a typical year.
                        </SmallText>
                    </LeftPart>
                    <RightPart>
                        <Radio.Group name = "volume" onChange={onChange} value={value.volume}>
                            <Radio value={'low'}>0 - 25</Radio>
                            <Radio value={'med'}>26 - 50</Radio>
                            <Radio value={'hig'}>51 +</Radio>
                        </Radio.Group>
                    </RightPart>
                </BandedRow>
                <BandedRow odd='even'>
                    <LeftPart>
                        <Text>
                            EXPECTED VALUE OF ACCOUNT TURNOVER  (expected monthly figure)
                        </Text>
                    </LeftPart>
                    <RightPart>
                        <Radio.Group name = "transactions" onChange={onChange} value={value.transactions}>
                            <Radio value={'low'}>&lt;&pound;10k</Radio>
                            <Radio value={'med'}>&pound;10k - &pound;50k</Radio>
                            <Radio value={'hig'}>&pound;50k - &pound;100k</Radio>
                        </Radio.Group>
                        &gt;&pound;100k
                        <SmallText style={{marginLeft: "7px"}}>Approx.fig</SmallText>
                        <Input style = {{border: "none", borderBottom: "1px solid", background: "transparent"}} />
                    </RightPart>
                </BandedRow>
            </Card>
            <Card title="RISK RATING ASSESSMENT" type="wide">
                <BandedRow>
                    <LeftPart>
                        <Paragraph>
                            If the rating has attracted a  YES response to any of the questions (apart from whether known to CDAX)  or the client is associated to a high risk jurisdiction then the overall rating must automatically be regarded as High Risk to begin with. The rationale for any down-grade from this position must be fully documented.   All downgrades must be approved by a Director. 
                        </Paragraph>
                        <Paragraph>
                            <Text strong>NOTE. </Text>
                            <Text>
                                Where the rating is due to a connection to a country in Appdx D (A) of IOM FSA AML Handbook or any Sanctions implications MUST be categorised as high and no down-grade can be applied. 
                            </Text>
                        </Paragraph>
                    </LeftPart>
                    <LeftPart>
                        <Paragraph>
                            <Text strong>
                                Determination of Risk Rating. <br/>
                            </Text>
                            <Text>
                                Considering all the above information what is the risk rating of the client. <br />(add notes if required) 
                            </Text>
                        </Paragraph>
                    </LeftPart>
                    <RightPart>
                        <Radio.Group name = "riskRating" onChange={onChange} value={value.riskRating}>
                            <Radio value={'standard'}>Standard</Radio>
                            <Radio value={'high'}>High</Radio>
                        </Radio.Group>
                    </RightPart>
                    <LeftPart>
                        <Paragraph>
                                If higher risk client consider the <Text strong>enhanced CDD requirements</Text> , what on-going monitor-ing should be carried out, and any additional data required.
                        </Paragraph>
                        <Paragraph>
                                Notes re rationale to justify any changes to grading: 
                        </Paragraph>
                    </LeftPart>
                </BandedRow>
            </Card>
        </>
    );
}
