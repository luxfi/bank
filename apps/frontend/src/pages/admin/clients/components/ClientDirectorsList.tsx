import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { Card } from "../../../../components/Card";
import { LeftPart, RightPart, ButtonContainer } from "../../../../components/LeftPart";
import { openNotification } from "../../../../components/Notifications";
import { RowItem } from "../../../../components/RowItem";
import { fetchAdminClient, selectAdminClientDirectors, setAdminClientDirectors, submitAdminClientDirectors } from "../../../../features/admin-clients/AdminClientsSlice";
import { EntityType } from "../../../../features/registration/RegistrationSlice";
import { EditButton } from "../../../../components/Button";
import { DirectorDto } from "../../../../features/registration/model/directorSchema";
import moment from "moment";
import { countries } from "../../../../features/registration/model/countries";

export const ClientDirectorsList = ({ createModal, remove }: { createModal: any, remove: any }): JSX.Element => {
    
    
    const dispatch = useAppDispatch();
    const { uuid, client_id } = useParams();
    const removeDirector = async (index: number) => {
        dispatch(setAdminClientDirectors({ index, remove: true }));
        await dispatch(
            submitAdminClientDirectors({
                uuid: String(uuid),
                entityType: EntityType.Business,
                clientId: client_id,
            })
        ).unwrap();
        dispatch(
            fetchAdminClient({ uuid: uuid || '', clientId: client_id })
        ).unwrap();
        openNotification(
            "Director Details",
            "Directors have been updated successfully!"
        );
    };
    const directorsData = useAppSelector(selectAdminClientDirectors);
    let directors: any[] = [];
    directorsData.forEach((director: DirectorDto, index: number) => {
        let temp = {
            name: "Director " + (index + 1),
            uuid: director.uuid,
            details: {
                left: [
                    {
                        name: "fullName",
                        label: "Full Name",
                        text: director.fullName,
                        key: "sh-fullname",
                        rules: [{required:true, message: 'This is a required field.'}],
                    },
                    {
                        name: "dob",
                        label: "DOB",
                        text: director.dob ? new Date(director.dob || '').toISOString().split("T").shift() : null,
                        type: "date",
                        key: "sh-dob",
                        rules: [{ required: true, message: 'This is a required field.' }, ({ getFieldValue }: any) => ({
                            validator(_: any, value: any) {
                                if (
                                    !value ||
                                    moment(new Date()).subtract(18, 'y').unix() > moment(value).unix()
                                ) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(
                                    new Error(
                                        "Must be at least 18 years old!"
                                    )
                                );
                            },
                        }),],
                    },
                    {
                        name: "occupation",
                        label: "Occupation",
                        text: director.occupation,
                        key: "sh-occupation",
                    },
                    {
                        name: "telephoneNumber",
                        label: "Telephone number",
                        text: director.telephoneNumber,
                        key: "sh-telephone",
                    },
                    {
                        name: "email",
                        label: "Email address",
                        text: director.email,
                        key: "sh-email",
                    },
                    {
                        name: "nationality",
                        label: "Nationality",
                        text: director.nationality,
                        type: "select",
                        options: countries,
                        search: true,
                        key: "sh-nt",
                    },
                ],
                right: [
                    {
                        name: "address1",
                        label: "Address 1",
                        text: director.address1,
                        key: "sh-ad1",
                    },
                    {
                        name: "address2",
                        label: "Address 2",
                        text: director.address2,
                        key: "sh-ad2",
                    },
                    {
                        name: "previousAddress1",
                        label: "Previous Address 1",
                        text: director.previousAddress1,
                        key: "sh-previous-ad1",
                    },
                    {
                        name: "previousAddress2",
                        label: "Previous Address 2",
                        text: director.previousAddress2,
                        key: "sh-previous-ad2",
                    },
                    {
                        name: "country",
                        label: "Country",
                        text: director.country,
                        type: "select",
                        options: countries,
                        search: true,
                        key: "sh-country",
                    },
                ],
            },
        };
        directors.push(temp);
    });
    return <>
        {directors.map((director, index) => (
            <Card key={index} title={director.name} type="wide">
                <LeftPart>
                    {director.details.left.map(
                        (detail: any, field_index: number) => (
                            <RowItem
                                key={index + " " + field_index}
                                label={detail.label}
                                text={!detail?.options ? detail.text : detail.options?.get(detail.text || '') || detail.text}
                                odd={index % 2 === 1 ? "even" : "odd"}
                            />
                        )
                    )}
                </LeftPart>
                <RightPart>
                    {director.details.right.map(
                        (detail: any, field_index: number) => (
                            <RowItem
                                key={index + " " + field_index}
                                label={detail.label}
                                text={!detail?.options ? detail.text : detail.options?.get(detail.text || '') || detail.text}
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
                                title: "Director Details",
                                fields: [
                                    ...director.details.left,
                                    ...director.details.right,
                                ],
                                uuid: director.uuid,
                            })
                        }
                    >
                        Edit
                    </EditButton>
                    <EditButton
                        danger
                        size="small"
                        onClick={() => {
                            if (director.uuid) {
                                remove(
                                    String(director.uuid),
                                    removeDirector,
                                    index
                                );
                            } else {
                                dispatch(
                                    setAdminClientDirectors({
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
