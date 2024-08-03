import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { Card } from "../../../../components/Card";
import { LeftPart, RightPart, Comment, ButtonContainer } from "../../../../components/LeftPart";
import { openNotification } from "../../../../components/Notifications";
import { RowItem } from "../../../../components/RowItem";
import { selectAdminClientBrokers, setAdminClientBrokers, submitAdminClientBrokers } from "../../../../features/admin-clients/AdminClientsSlice";
import { EntityType } from "../../../../features/registration/RegistrationSlice";
import { EditButton } from "../../../../components/Button";
import { BrokerDto } from "../../../../features/registration/model/brokerSchema";

export const ClientBrokersList = ({createModal, remove}:{createModal: any, remove: any}): JSX.Element => {
    const dispatch = useAppDispatch();
    const { uuid } = useParams();
    const removeBroker = async (index: number) => {
        dispatch(setAdminClientBrokers({ index, remove: true }));
        await dispatch(
            submitAdminClientBrokers({
                uuid: String(uuid),
                entityType: EntityType.Business,
            })
        ).unwrap();
        openNotification(
            "Broker Details",
            "Brokers have been updated successfully!"
        );
    };
    const brokers = useAppSelector(selectAdminClientBrokers);
    let Brokers: any[] = [];
    brokers.forEach((broker: BrokerDto) => {
        let temp = {
            uuid: broker.uuid,
            name: broker.name ? broker.name : "New Broker",
            details: [
                { name: "name", label: "Name", text: broker.name, rules: [{ required: true, message: "Required field!" }] },
                { name: "address", label: "Address", text: broker.address },
                { name: "kyc", label: "KYC", text: broker.kyc },
                { name: "client", label: "Client", text: broker.client },
                {
                    name: "percentageSplit",
                    label: "Percentage Split",
                    text: broker.percentageSplit,
                    format: 'number',
                },
                { name: "payment", label: "Payment", text: broker.payment },
                {
                    name: "bankAccount",
                    label: "Bank Account",
                    text: broker.bankAccount,
                },
                { name: "contract", label: "Contract", text: broker.contract },
                { name: "uuid", text: broker.uuid },
            ],
            comment: {
                name: "comment",
                label: "Comments",
                text: broker.comment,
                type: "textarea",
            },
        };
        Brokers.push(temp);
    });
    return <>
    {Brokers.map((broker:any, index:number) => (
        <Card key={index} title={broker.name} type="wide">
            <LeftPart>
                {broker.details.map((detail: any, index: any) =>
                    detail.name === "uuid" ? (
                        ""
                    ) : (
                        <RowItem
                            key={index}
                            label={detail.label}
                            text={detail.text}
                            odd={index % 2 === 1 ? "even" : "odd"}
                        />
                    )
                )}
            </LeftPart>
            <RightPart>
                <RowItem label="Comments" text="" odd="odd" />
                <Comment>{broker.comment.text}</Comment>
            </RightPart>
            <ButtonContainer>
                <EditButton
                    secondary
                    size="small"
                    onClick={() =>
                        createModal({
                            url: index,
                            title: "Broker Details",
                            fields: [...broker.details, broker.comment],
                            uuid: broker.uuid,
                        })
                    }
                >
                    Edit
                </EditButton>
                <EditButton
                    danger
                    size="small"
                    onClick={() => {
                        if (broker.uuid) {
                            remove(
                                String(broker.uuid),
                                removeBroker,
                                index
                            );
                        } else {
                            dispatch(
                                setAdminClientBrokers({
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
}