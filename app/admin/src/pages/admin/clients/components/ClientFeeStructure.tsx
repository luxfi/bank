import { useAppSelector } from "../../../../app/hooks";
import { Card } from "../../../../components/Card";
import { LeftPart, RightPart, ButtonContainer } from "../../../../components/LeftPart";
import { RowItem } from "../../../../components/RowItem";
import { selectAdminClientFeeStructure, selectAdminClientUserData } from "../../../../features/admin-clients/AdminClientsSlice";
import { EditButton } from "../../../../components/Button";
import { currencies } from "../../../../features/beneficiaries/model/currencies";
function IsNumeric(input:any)
{
    return (input - 0) == input && (''+input).trim().length > 0;
}
const decimalValidator = () => ({
    validator(_: any, value: any) {
        if (!value || IsNumeric(value)) {
            return Promise.resolve();
        }
        return Promise.reject(
            new Error(
                "Please enter a valid number!"
            )
        );
    },
});
const percentageValidator = () => ({
    validator(_: any, value: any) {
        if (value >= 0 && value <= 100) {
            return Promise.resolve();
        }
        return Promise.reject(
            new Error(
                "Please enter a positive number less than 100!"
            )
        );
    },
});
const feeValidator = () => ({
    validator(_: any, value: any) {
        if (value >= 0 && Number(value).toFixed(2) == value) {
            return Promise.resolve();
        }
        return Promise.reject(
            new Error(
                "Please enter a positive number with 2 decimal places!"
            )
        );
    },
});
export const ClientFeeStructure = ({createModal}:{createModal: any}): JSX.Element => {
    const client = useAppSelector(selectAdminClientUserData);
    const fee = useAppSelector(selectAdminClientFeeStructure);
    if (!client.contact?.account?.openPaydId) return <></>;
    const feeStructure = {
        left: [
            {
                name: "conversion_amount",
                label: "Conversion fee (%)",
                text: fee.conversion_amount,
                key: 'conversion_amount',
                rules: [decimalValidator, percentageValidator],
            },
            {
                name: "SEPA_amount",
                label: "SEPA fee amount",
                text: fee.SEPA_amount,
                rules: [decimalValidator, feeValidator],
                key: 'SEPA_amount',
            },
            {
                name: "SEPA_currency",
                label: "SEPA fee currency",
                text: fee.SEPA_currency,
                type: "select",
                options: currencies,
                key: 'SEPA_currency',
            },
            {
                name: "SEPA_INSTANT_amount",
                label: "SEPA_INSTANT fee amount",
                text: fee.SEPA_INSTANT_amount,
                rules: [decimalValidator, feeValidator],
                key: 'SEPA_INSTANT_amount',
            },
            {
                name: "SEPA_INSTANT_currency",
                label: "SEPA_INSTANT fee currency",
                text: fee.SEPA_INSTANT_currency,
                type: "select",
                options: currencies,
                key: 'SEPA_INSTANT_currency',
            },
            {
                name: "TARGET2_amount",
                label: "TARGET2 fee amount",
                text: fee.TARGET2_amount,
                rules: [decimalValidator, feeValidator],
                key: 'TARGET2_amount',
            },
            {
                name: "TARGET2_currency",
                label: "TARGET2 fee currency",
                text: fee.TARGET2_currency,
                type: "select",
                options: currencies,
                key: 'TARGET2_currency',
            },
        ],
        right: [
            {
                name: "SWIFT_amount",
                label: "SWIFT fee amount",
                text: fee.SWIFT_amount,
                rules: [decimalValidator, feeValidator],
                key: 'SWIFT_amount',
            },
            {
                name: "SWIFT_currency",
                label: "SWIFT fee currency",
                text: fee.SWIFT_currency,
                type: "select",
                options: currencies,
                key: 'SWIFT_currency',
            },
            {
                name: "CHAPS_amount",
                label: "CHAPS fee amount",
                text: fee.CHAPS_amount,
                rules: [decimalValidator, feeValidator],
                key: 'CHAPS_amount',
            },
            {
                name: "CHAPS_currency",
                label: "CHAPS fee currency",
                text: fee.CHAPS_currency,
                type: "select",
                options: currencies,
                key: 'CHAPS_currency',
            },
            {
                name: "FASTER_PAYMENTS_amount",
                label: "FASTER PAYMENTS fee amount",
                text: fee.FASTER_PAYMENTS_amount,
                rules: [decimalValidator, feeValidator],
                key: 'FASTER_PAYMENTS_amount',
            },
            {
                name: "FASTER_PAYMENTS_currency",
                label: "FASTER PAYMENTS fee currency",
                text: fee.FASTER_PAYMENTS_currency,
                type: "select",
                options: currencies,
                key: 'FASTER_PAYMENTS_currency',
            },
        ],
    };
    return <>
        <Card title="Fee Structure" type="wide">
            <LeftPart>
                {feeStructure.left.map((detail, index) => (
                    <RowItem
                        key={index}
                        label={detail.label}
                        text={!detail?.options ? detail.text : detail.options?.get(detail.text || '') || detail.text}
                        odd={index % 2 === 1 ? "even" : "odd"}
                    />
                ))}
            </LeftPart>
            <RightPart>
                {feeStructure.right.map((detail, index) => (
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
                            url: "fee-structure",
                            title: "Fee Structure",
                            fields: [
                                ...feeStructure.left,
                                ...feeStructure.right,
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