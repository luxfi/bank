import { InfoCircleOutlined } from "@ant-design/icons";
import { Modal, Select, Tooltip } from "antd";
import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
    changeClient,
    selectAuthError,
    selectAuthStatus,
    selectCurrentUser,
} from "../features/auth/AuthSlice";
import { openNotification } from "./Notifications";
import { Spinner } from "./Spinner";

export default function ClientSelector() {
    const dispatch = useAppDispatch();

    const currentUser = useAppSelector(selectCurrentUser);
    const error = useAppSelector(selectAuthError);
    const loading = useAppSelector(selectAuthStatus);

    const [showModal, setShowModal] = useState(false); //deprecated
    const [selectdClient, setSelectdClient] = useState("");

    const [options, setOptions] = useState<
        Array<{ label: string; value: string }>
    >([]);

    const handleChangeCurrentClient = useCallback(
        (uuid: string) => {
            const selected = options.find((c) => c.value === uuid)?.label || "";
            setSelectdClient(selected);
            if (uuid) {
                dispatch(changeClient(uuid)).then(() => {
                    window.location.href = "/dashboard";
                    if (!currentUser?.currentClient?.name) return;
                    localStorage.setItem(
                        "_changeClient_notify",
                        "notify"
                    );
                });
            }
        },
        [currentUser]
    );

    useEffect(() => {
        const notification = localStorage.getItem("_changeClient_notify");
        if (!notification) return;
        openNotification(
            "Client Changed",
            `The client was successfully changed to ${currentUser?.currentClient?.name}`
        );
        localStorage.removeItem("_changeClient_notify");
    }, []);

    useEffect(() => {
        if (!currentUser) return;
        const { clients } = currentUser;
        if (!clients?.length) return;

        const clientsOptions = clients
            .filter((c) => c.name)
            .map((c) => {
                return {
                    value: c.uuid,
                    label: c.name,
                };
            });
        setOptions(clientsOptions);
    }, [currentUser]);

    useEffect(() => {
        if (!error) return;
        openNotification("Change client:", error);
    }, [error]);

    useEffect(() => {
        const notifyInfo = localStorage.getItem("_currentClient_notify");
        if (!notifyInfo) return;
        const { account, user } = JSON.parse(notifyInfo);
        openNotification(
            `Welcome back, ${user}`,
            `You are currently logged into the account ${account}`
        );

        localStorage.removeItem("_currentClient_notify");
    }, []);

    return (
        <>
            <Container>
                <span className="title">Active account</span>
                <Tooltip title="Select the account you would like to access. You can navigate between your accounts using the selection item on the side, every action you perform will refer to the account that is currently selected.">
                    <span style={{ fontSize: "20px" }}>
                        <InfoCircleOutlined />
                    </span>
                </Tooltip>

                <CustomSelect
                    value={currentUser?.currentClient?.uuid || ""}
                    onChange={(e) => handleChangeCurrentClient(e as string)}
                    options={options}
                />
            </Container>
            <Modal
                centered
                open={showModal}
                footer={false}
                closeIcon={<></>}
                destroyOnClose
            >
                <ModalContentContainer>
                    <h2>Changing data for {`${selectdClient}`}</h2>
                    <Spinner
                        color="#F49C0E"
                        style={{ width: "40px", height: "40px", margin: "0" }}
                    />
                    <span>Loading information ...</span>
                </ModalContentContainer>
            </Modal>
        </>
    );
}

const Container = styled.div`
    display: flex;
    align-items: center;
    padding: 0.5rem 1rem;
    margin-left: 1rem;
    border-radius: 10px;
    width: auto;
    gap: 1.3rem;

    .title {
        display: flex;
        width: auto;
        font-weight: 600;
        color: ${(p) => p.theme.colors.primary};
    }
`;

const CustomSelect = styled(Select)`
    width: 250px;
    height: 45px;

    .ant-select-selector {
        width: 250px;
        min-height: 100%;
    }

    .ant-select-selection-item {
        display: flex;
        align-items: center;
    }
`;
const ModalContentContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1.5rem;

    h2 {
        font-weight: 600;
    }
`;
