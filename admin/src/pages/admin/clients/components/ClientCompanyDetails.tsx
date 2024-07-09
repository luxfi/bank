import { useAppSelector } from "../../../../app/hooks";
import { Card } from "../../../../components/Card";
import { LeftPart, RightPart, ButtonContainer } from "../../../../components/LeftPart";
import { RowItem } from "../../../../components/RowItem";
import { selectAdminClientBusinessMetadata } from "../../../../features/admin-clients/AdminClientsSlice";
import { EditButton } from "../../../../components/Button";
import { companyTypes } from "../../../../features/beneficiaries/model/entity-types";
import { countries } from "../../../../features/registration/model/countries";
import moment from "moment";
import { yesOrNo } from "../../../../utils/select-options";

export const ClientCompanyDetails = ({createModal}:{createModal: any}): JSX.Element => {
    const metaData = useAppSelector(selectAdminClientBusinessMetadata);
    const companyDetails = {
        left: [
            {
                name: "companyName",
                label: "Company Name",
                text: metaData?.companyName,
                key: "companyName",
            },
            {
                name: "tradingName",
                label: "Trading Name",
                text: metaData?.tradingName,
                key: "tradingName",
            },
            {
                name: "legalEntity",
                label: "Legal Entity",
                text: metaData?.legalEntity,
                key: "legalEntity",
            },
            {
                name: "email",
                label: "Email",
                text: metaData?.email,
                key: "email",
            },
            {
                name: "companyType",
                label: "Company Type",
                text: metaData?.companyType,
                type: "select",
                options: companyTypes,
                key: "companyType",
            },
            {
                name: "otherTradingNames",
                label: "Other Trading Names",
                text: metaData?.otherTradingNames,
                key: "otherTradingNames",
            },
            {
                name: "countryOfRegistration",
                label: "Country of Registration",
                text: metaData?.countryOfRegistration,
                type: "select",
                options: countries,
                search: true,
                key: "countryOfRegistration",
            },
            {
                name: "companyRegistrationNumber",
                label: "Company Reg Number",
                text: metaData?.companyRegistrationNumber,
                key: "Company Reg Number",
            },
            {
                name: "dateOfRegistration",
                label: "Date of Registration",
                text: moment(metaData?.dateOfRegistration || new Date()).format(
                    "YYYY-MM-DD"
                ),
                type: "date",
                key: "dateOfRegistration",
            },
        ],
        right: [
            {
                name: "telephoneNumber",
                label: "Tel No.",
                text: metaData?.telephoneNumber,
                key: "telephoneNumber",
            },
            {
                name: "dateOfIncorporation",
                label: "Date of Incorporation",
                text: moment(metaData?.dateOfIncorporation || new Date()).format(
                    "YYYY-MM-DD"
                ),
                type: "date",
                key: "dateOfIncorporation",
            },
            {
                name: "vatNumber",
                label: "Tax/VAT Number",
                text: metaData?.vatNumber,
                key: "vatNumber",
            },
            {
                name: "websiteUrl",
                label: "Website",
                text: metaData?.websiteUrl,
                key: "websiteUrl",
                rules: [{type:'url'}],
            },
            {
                name: "otherContactInfo",
                label: "Other contact info",
                text: metaData?.otherContactInfo,
                key: "otherContactInfo",
            },
            {
                name: "statutoryProvision",
                label: "Statutory provision under which it is incorporated",
                text: metaData?.statutoryProvision,
                key: "statutoryProvision",
            },
            {
                name: "isPubliclyTrading",
                label: "Publicly trading",
                text: metaData?.isPubliclyTrading ? "Yes" : "No",
                type: "select",
                options: yesOrNo,
                key: "isPubliclyTrading",
            },
            {
                name: "stockMarketLocation",
                label: "Where listed",
                text: metaData?.stockMarketLocation,
                key: "stockMarketLocation",
            },
            {
                name: "stockMarket",
                label: "Which market",
                text: metaData?.stockMarket,
                key: "stockMarket",
            },
            {
                name: "regulatorName",
                label: "Name of Regulator",
                text: metaData?.regulatorName,
                key: "regulatorName",
            },
        ],
    };
    return <>
        <Card title="Company Details" type="wide">
            <LeftPart>
                {companyDetails.left.map((detail, index) => (
                    <RowItem
                        key={index}
                        label={detail.label}
                        text={!detail?.options ? detail.text : detail.options?.get(detail.text || '') || detail.text}
                        odd={index % 2 === 1 ? "even" : "odd"}
                    />
                ))}
            </LeftPart>
            <RightPart>
                {companyDetails.right.map((detail, index) => (
                    <RowItem
                        key={index}
                        label={detail.label}
                        text={!detail?.options ? detail.text : detail.options?.get(detail.text || '') || detail.text}
                        odd={index % 2 === 1 ? "even" : "odd"}
                    />
                ))}
            </RightPart>
            <ButtonContainer>
                <EditButton
                    secondary
                    size="small"
                    onClick={() =>
                        createModal({
                            url: "company-details",
                            title: "Company Details",
                            fields: [
                                ...companyDetails.left,
                                ...companyDetails.right,
                            ],
                        })
                    }
                >
                    Edit
                </EditButton>
            </ButtonContainer>
        </Card>
    </>
}
