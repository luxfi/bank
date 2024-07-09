import { useAppSelector } from "../../../../app/hooks";
import { Card } from "../../../../components/Card";
import { LeftPart, RightPart, ButtonContainer } from "../../../../components/LeftPart";
import { RowItem } from "../../../../components/RowItem";
import { selectAdminClientBusinessMetadata } from "../../../../features/admin-clients/AdminClientsSlice";
import { EditButton } from "../../../../components/Button";

export const ClientOfficeAddresses = ({createModal}:{createModal: any}): JSX.Element => {
    const metaData = useAppSelector(selectAdminClientBusinessMetadata);
    const addresses = {
        left: [
            {
                name: "registeredOffice1",
                label: "Address Line 1",
                text: metaData?.registeredOffice1,
                key: "registeredOffice1",
                rules: [{ required: true, message: "Please enter the Address Line 1" }],
            },
            {
                name: "registeredOffice1_address2",
                label: "Address Line 2",
                text: metaData?.registeredOffice1_address2,
                key: "registeredOffice1_address2",
            },
            {
                name: "registeredOffice1_city",
                label: "City",
                text: metaData?.registeredOffice1_city,
                key: "registeredOffice1_city",
                rules: [{ required: true, message: "Please enter the City" }],
            },
            {
                name: "registeredOffice1_postcode",
                label: "Postcode",
                text: metaData?.registeredOffice1_postcode,
                key: "registeredOffice1_postcode",
                rules: [{ required: true, message: "Please enter the Postcode" }],
            },
            {
                name: "registeredOffice1_state",
                label: "State",
                text: metaData?.registeredOffice1_state,
                key: "registeredOffice1_state",
                rules: [{ required: true, message: "Please enter the State" }],
            },
            {
                name: "registeredOffice2",
                label: "Registered Office 2",
                text: metaData?.registeredOffice2,
                key: "registeredOffice2",
            },
            {
                name: "registeredOffice3",
                label: "Registered Office 3",
                text: metaData?.registeredOffice3,
                key: "registeredOffice3",
            },
            {
                name: "principalPlace",
                label: "Principal place of business",
                text: metaData?.principalPlace,
                key: "principalPlace",
            },
            {
                name: "mailingAddress",
                label: "Mailing Address",
                text: metaData?.mailingAddress,
                key: "mailingAddress",
            },
        ],
        right: [
            {
                name: "previousOffice1",
                label: "Previous registered offices",
                text: metaData?.previousOffice1,
                key: "previousOffice1",
            },
            {
                name: "previousOffice2",
                label: "Previous registered offices",
                text: metaData?.previousOffice2,
                key: "previousOffice2",
            },
            {
                name: "previousOffice3",
                label: "Previous registered offices",
                text: metaData?.previousOffice3,
                key: "previousoffice3",
            },
        ],
    };
    return <>
        <Card title="Addresses" type="wide">
            <LeftPart>
                {addresses.left.map((detail, index) => (
                    <RowItem
                        key={index}
                        label={detail.label}
                        text={detail.text}
                        odd={index % 2 === 1 ? "even" : "odd"}
                    />
                ))}
            </LeftPart>
            <RightPart>
                {addresses.right.map((detail, index) => (
                    <RowItem
                        key={index}
                        label={detail.label}
                        text={detail.text}
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
                            url: "addresses",
                            title: "Addresses",
                            fields: [...addresses.left, ...addresses.right],
                        })
                    }
                >
                    Edit
                </EditButton>
            </ButtonContainer>
        </Card>
    </>
}
