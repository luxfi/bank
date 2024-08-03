import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { Card } from "../../../../components/Card";
import {
    LeftPart,
    RightPart,
    ButtonContainer,
} from "../../../../components/LeftPart";
import { openNotification } from "../../../../components/Notifications";
import { RowItem } from "../../../../components/RowItem";
import {
    fetchAdminClient,
    selectAdminClientShareholders,
    setAdminClientShareholders,
    submitAdminClientShareholders,
} from "../../../../features/admin-clients/AdminClientsSlice";
import { EntityType } from "../../../../features/registration/RegistrationSlice";
import { EditButton } from "../../../../components/Button";
import {
    shareholderCompanyTypes,
    ShareholderDto,
    shareholderTypes,
} from "../../../../features/registration/model/shareholderSchema";
import { countries } from "../../../../features/registration/model/countries";
import moment from "moment";
export const ClientShareholdersList = ({
    createModal,
    remove,
}: {
    createModal: any;
    remove: any;
}): JSX.Element => {
    const dispatch = useAppDispatch();
    const { uuid, client_id } = useParams();
    const shareholdersData = useAppSelector(selectAdminClientShareholders);
    let shareholders: any[] = [];
    const removeShareholder = async (index: number) => {
        dispatch(setAdminClientShareholders({ index, remove: true }));
        await dispatch(
            submitAdminClientShareholders({
                uuid: String(uuid),
                entityType: EntityType.Business,
                clientId: client_id || "",
            })
        ).unwrap();
        dispatch(
            fetchAdminClient({ uuid: uuid || '', clientId: client_id })
        ).unwrap();
        openNotification(
            "Shareholder Details",
            "Shareholders have been updated successfully!"
        );
    };
    shareholdersData.forEach((shareholder: ShareholderDto, index: number) => {
        let temp = {
            name: "Shareholder " + (index + 1),
            uuid: shareholder.uuid,
            details: {
                left: [
                    {
                        name: "entityType",
                        label: "Type",
                        text: shareholder.entityType?.toLowerCase(),
                        type: "select",
                        options: shareholderTypes,
                        rules: [
                            {
                                required: true,
                                message: "This is a required field.",
                            },
                        ],
                    },
                    {
                        name: "fullName",
                        label: "Full Name",
                        text: shareholder.fullName,
                        rules: [
                            {
                                required: true,
                                message: "This is a required field.",
                            },
                        ],
                    },
                    {
                        name: "dob",
                        label: "DOB",
                        text: shareholder.individualMetadata?.dateOfBirth
                            ? new Date(
                                  shareholder.individualMetadata?.dateOfBirth
                              )
                                  .toISOString()
                                  .split("T")
                                  .shift()
                            : null,
                        type: "date",
                        rules: [
                            {
                                required: true,
                                message: "This is a required field.",
                            },
                            ({ getFieldValue }: any) => ({
                                validator(_: any, value: any) {
                                    if (
                                        !value ||
                                        moment(new Date())
                                            .subtract(18, "y")
                                            .unix() > moment(value).unix()
                                    ) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(
                                        new Error(
                                            "Must be at least 18 years old!"
                                        )
                                    );
                                },
                            }),
                        ],
                    },
                    {
                        name: "occupation",
                        label: "Occupation",
                        text: shareholder.individualMetadata?.occupation,
                        rules: [
                            {
                                required: true,
                                message: "This is a required field.",
                            },
                        ],
                    },
                    {
                        name: "telephoneNumber",
                        label: "Telephone number",
                        text: shareholder.telephoneNumber,
                    },
                    {
                        name: "email",
                        label: "Email address",
                        text: shareholder.email,
                    },
                    {
                        name: "nationality",
                        label: "Nationality",
                        text: shareholder.individualMetadata?.nationality,
                        type: "select",
                        options: countries,
                        search: true,
                        rules: [
                            {
                                required: true,
                                message: "This is a required field.",
                            },
                        ],
                    },
                    {
                        name: "companyType",
                        label: "Company Type",
                        text: shareholder.businessMetadata?.companyType,
                        type: "select",
                        options: shareholderCompanyTypes,
                        rules: [
                            {
                                required: true,
                                message: "This is a required field.",
                            },
                        ],
                    },
                    {
                        name: "shares",
                        label: "Shares held",
                        text: shareholder.shares,
                        rules: [
                            {
                                required: true,
                                message: "This is a required field.",
                            },
                            {
                                validator(_: any, value: any) {
                                    if (
                                        value >= 0 &&
                                        Number(value).toFixed(0) == value
                                    ) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(
                                        new Error(
                                            "Please enter a number of shares."
                                        )
                                    );
                                },
                            },
                        ],
                    },
                ],
                right: [
                    {
                        name: "addressLine1",
                        label: "Address 1",
                        text:
                            shareholder?.entityType === "business"
                                ? shareholder.businessMetadata
                                      ?.registeredOffice1
                                : shareholder.individualMetadata?.addressLine1,
                        rules: [
                            {
                                required: true,
                                message: "This is a required field.",
                            },
                        ],
                    },
                    {
                        name: "addressLine2",
                        label: "Address 2",
                        text:
                            shareholder?.entityType === "business"
                                ? shareholder.businessMetadata
                                      ?.registeredOffice2
                                : shareholder.individualMetadata?.addressLine2,
                    },
                    {
                        name: "state",
                        label: "State",
                        text:
                            shareholder?.entityType === "business"
                                ? shareholder.businessMetadata?.previousOffice1
                                : shareholder.individualMetadata?.state,
                        rules: [
                            {
                                required: true,
                                message: "This is a required field.",
                            },
                        ],
                    },
                    {
                        name: "previousAddress1",
                        label: "Previous Address 1",
                        text:
                            shareholder?.entityType === "business"
                                ? shareholder.businessMetadata?.previousOffice1
                                : shareholder.individualMetadata
                                      ?.previousAddressLine1,
                    },
                    {
                        name: "previousAddress2",
                        label: "Previous Address 2",
                        text:
                            shareholder?.entityType === "business"
                                ? shareholder.businessMetadata?.previousOffice2
                                : shareholder.individualMetadata
                                      ?.previousAddressLine2,
                    },
                    {
                        name: "country",
                        label: "Country",
                        text:
                            shareholder?.entityType === "business"
                                ? shareholder.businessMetadata
                                      ?.countryOfRegistration
                                : shareholder.individualMetadata?.country,
                        type: "select",
                        options: countries,
                        search: true,
                        rules: [
                            {
                                required: true,
                                message: "This is a required field.",
                            },
                        ],
                    },
                ],
            },
        };
        shareholders.push(temp);
    });
    return (
        <>
            {shareholders.map((shareholder, index) => (
                <Card key={index} title={shareholder.name} type="wide">
                    <LeftPart>
                        {shareholder.details.left
                            .filter((detail: any) => {
                                const shareholderType = shareholder.details.left
                                    .filter(
                                        (l: any) => l.name === "entityType"
                                    )[0]
                                    .text?.toUpperCase();
                                return (
                                    !shareholderType ||
                                    (shareholderType === "BUSINESS" &&
                                        [
                                            "dob",
                                            "occupation",
                                            "nationality",
                                        ].indexOf(detail.name) === -1) ||
                                    ((!shareholderType ||
                                        shareholderType === "INDIVIDUAL") &&
                                        ["companyType"].indexOf(detail.name) ===
                                            -1)
                                );
                            })
                            .map((detail: any, index: number) => {
                                return (
                                    <RowItem
                                        key={index}
                                        label={detail.label}
                                        text={
                                            !detail?.options
                                                ? detail.text
                                                : detail.options?.get(
                                                      detail.text || ""
                                                  ) || detail.text
                                        }
                                        odd={index % 2 === 1 ? "even" : "odd"}
                                    />
                                );
                            })}
                    </LeftPart>
                    <RightPart>
                        {shareholder.details.right.map(
                            (detail: any, index: number) => (
                                <RowItem
                                    key={index}
                                    label={detail.label}
                                    text={
                                        !detail?.options
                                            ? detail.text
                                            : detail.options?.get(
                                                  detail.text || ""
                                              ) || detail.text
                                    }
                                    odd={index % 2 === 1 ? "even" : "odd"}
                                />
                            )
                        )}
                    </RightPart>
                    <ButtonContainer>
                        <EditButton
                            secondary
                            size="small"
                            onClick={() =>
                                createModal({
                                    url: index,
                                    title: "Shareholder Details",
                                    fields: [
                                        ...shareholder.details.left,
                                        ...shareholder.details.right,
                                    ],
                                    uuid: shareholder.uuid,
                                })
                            }
                        >
                            Edit
                        </EditButton>
                        <EditButton
                            danger
                            size="small"
                            onClick={() => {
                                if (shareholder.uuid) {
                                    remove(
                                        String(shareholder.uuid),
                                        removeShareholder,
                                        index
                                    );
                                } else {
                                    dispatch(
                                        setAdminClientShareholders({
                                            index,
                                            remove: true,
                                        })
                                    );
                                }
                            }}
                        >
                            Delete
                        </EditButton>
                    </ButtonContainer>
                </Card>
            ))}
        </>
    );
};
