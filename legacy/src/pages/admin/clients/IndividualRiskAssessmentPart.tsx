import { Typography } from 'antd';
import { Card } from "../../../components/Card";
import styled from "styled-components";
import { device } from "../../../utils/media-query-helpers";
import { Row } from "antd";
import { Radio as R, Input, DatePicker } from 'antd';
import { PropsWithChildren } from 'react';

const { Text, Paragraph } = styled(Typography)`
    font-weight: 500;
`;
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

export default function IndividualRiskAssessmentPart({value, onChange}: any) {
    return (
        <>
            <Card title="JURISDICTION OF CLIENT RESIDENCE/NATIONALITY" type="wide">
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
            <Card title="HIGHER RISK CLIENT (e.g. PEP, adverse media or press profile)" type="wide">
                <BandedRow>
                    <LeftPart>
                        <Text>
                            Is the client a Politically Exposed Person (PEP) or family member/close associate of a PEP.
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
                        Any Adverse Information from Comply Launch screening check or other sources.
                        <br />
                        e.g. criminal activity/disqualified director.
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
                <BandedRow>
                    <LeftPart>
                        <Text>
                            Approximate Volume of trades (Per month)
                        </Text>
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
                            Approximate value of transactions (expected monthly figure)
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
