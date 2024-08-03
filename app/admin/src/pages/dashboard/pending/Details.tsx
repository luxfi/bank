import { Input } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import Button from "../../../components/Button";
import { Modal } from "../../../components/Modal";
import { openErrorNotification } from "../../../components/Notifications";
import { Spinner } from "../../../components/Spinner";
import { selectCurrentUser } from "../../../features/auth/AuthSlice";
import { UserAdminRoles } from "../../../features/auth/user-role.enum";
import {
    approveTransaction,
    rejectTransaction,
} from "../../../features/pending/ApproveDenySlice";
import {
    pendingTransactions,
    selectPendingDetails,
    selectPendingStatus,
    setQuery,
} from "../../../features/pending/PendingSlice";
import DashboardLayout from "../components/DashboardLayout";
import { Title, TitleContainer } from "./Pending";
import { getLists, statusMap } from "./helpers";

export default function PendingPaymentDetails() {
    const currentUser = useAppSelector(selectCurrentUser);
    const navigate = useNavigate();
    const params = useParams();
    const dispatch = useAppDispatch();
    const transaction = useAppSelector(selectPendingDetails);
    const loading =
        useAppSelector(selectPendingStatus) === "loading" ? true : false;

    const [openApprovalModal, setOpenApprovalModal] = useState(false);
    const [openDenyModal, setOpenDenyModal] = useState(false);
    const [denyReason, setDenyReason] = useState("");

    const [gateway, setGateway] = useState(
        window.localStorage.getItem("gateway") || "currencycloud"
    );

    const processQuery = () => {
        setQuery(`/${params.uuid}`);
        if (gateway) {
            dispatch(
                pendingTransactions({
                    query: `/${params.uuid}`,
                    gateway,
                })
            );
        } else {
            openErrorNotification(
                "Pending Transactions",
                "You do not have a trading account associated. Please contact the consultant to get one."
            );
        }
    };

    useEffect(() => {
        if (currentUser?.role == "admin:super") {
            setGateway("transactions");
        }
    }, [currentUser]);

    useEffect(() => {
        processQuery();
    }, [gateway, currentUser, params]);

    const handleApprove = async () => {
        if (!params.uuid) return;
        await dispatch(approveTransaction(params.uuid));
        setOpenApprovalModal(false);
        navigate("/dashboard/pending");
    };

    const handleDeny = async (reason: string) => {
        if (!params.uuid) return;
        await dispatch(rejectTransaction({ id: params.uuid, reason }));
        setOpenDenyModal(false);
        setDenyReason("");
        navigate("/dashboard/pending");
    };

    const ListComponent = (title: string, key: string) => {
        return (
            <List>
                <thead>
                    <tr className="title">{title}</tr>
                </thead>
                <tbody>
                    {transaction &&
                        getLists(transaction)[key].map(
                            (item: any, index: number) => {
                                if (item.value)
                                    return (
                                        <tr
                                            key={index}
                                            className={
                                                index % 2 === 0 ? "light" : ""
                                            }
                                        >
                                            <span>{item.title}</span>
                                            <span>{item.value}</span>
                                        </tr>
                                    );
                            }
                        )}
                </tbody>
                {}
            </List>
        );
    };

    const showActionsButtons = useMemo(() => {
        if (!currentUser) return false;

        const conditions = [
            !loading,
            UserAdminRoles.includes(currentUser.role),
            transaction.status_approval === "pending",
        ];
        return conditions.every((v) => v === true);
    }, [loading, currentUser, transaction]);

    return (
        <DashboardLayout>
            <>
                <TitleContainer style={{ marginBottom: "2rem" }}>
                    <Wrapper>
                        <Title className="title">Transaction Details</Title>-
                        {!loading && (
                            <span className="subtitle">{`Reference: ${transaction?.reference}`}</span>
                        )}
                    </Wrapper>
                    <StatusTag>{`${
                        statusMap[transaction.status_approval]
                    } Payment`}</StatusTag>
                </TitleContainer>
                {loading ? (
                    <div
                        style={{
                            display: "flex",
                            flex: "1",
                            height: "50%",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Spinner
                            style={{
                                width: "50px",
                                height: "50px",
                                fontSize: "16px",
                            }}
                        />
                    </div>
                ) : (
                    <>
                        {ListComponent("Receipt", "receiptList")}
                        {ListComponent("Creator", "creatorList")}
                        {ListComponent("Payer", "payerList")}
                        {ListComponent(
                            "Beneficiary Details",
                            "beneficiaryDetails"
                        )}
                        {ListComponent(
                            "Beneficiary Bank Details",
                            "beneficiaryBankDetails"
                        )}
                    </>
                )}
                <ActionsContainer style={{ marginTop: "3rem" }}>
                    <Button onClick={() => navigate(-1)} secondary>
                        Back
                    </Button>
                    {showActionsButtons && (
                        <Wrapper>
                            <Button
                                onClick={() => setOpenDenyModal(true)}
                                danger
                            >
                                Deny payment
                            </Button>
                            <Button
                                onClick={() => setOpenApprovalModal(true)}
                                primary
                            >
                                Approve payment
                            </Button>
                        </Wrapper>
                    )}
                </ActionsContainer>
            </>
            <Modal
                title="Confirm Approval"
                open={openApprovalModal}
                onCancel={() => setOpenApprovalModal(false)}
                footer={
                    <div
                        style={{
                            display: "flex",
                            gap: "1rem",
                            justifyContent: "flex-end",
                        }}
                    >
                        <Button
                            style={{ margin: 0 }}
                            secondary
                            onClick={() => setOpenApprovalModal(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            style={{ margin: 0 }}
                            primary
                            onClick={() => handleApprove()}
                        >
                            Approve
                        </Button>
                    </div>
                }
            >
                <span>You would like to approve the transaction?</span>
            </Modal>
            <Modal
                title="Deny transaction, why?"
                open={openDenyModal}
                onCancel={() => setOpenDenyModal(false)}
                footer={
                    <div
                        style={{
                            display: "flex",
                            gap: "1rem",
                            justifyContent: "flex-end",
                        }}
                    >
                        <Button
                            style={{ margin: 0 }}
                            secondary
                            onClick={() => setOpenDenyModal(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            style={{ margin: 0 }}
                            danger
                            onClick={() => handleDeny(denyReason)}
                        >
                            Deny and Submit
                        </Button>
                    </div>
                }
            >
                <Input
                    placeholder="Description"
                    value={denyReason}
                    onChange={(e) => setDenyReason(e.target.value)}
                />
            </Modal>
        </DashboardLayout>
    );
}

const StatusTag = styled.span`
    display: flex;
    border-radius: 8px;
    border: 1px solid #f7bebe;
    padding: 0.3rem 0.7rem;
    background-color: #fff5f5;
    color: #751d1d;
    font-size: 12px;
`;

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;

    .subtitle {
        color: #0f244da3;
        font-size: 12px;
    }
`;
const ActionsContainer = styled.div`
    display: flexbox;
    justify-content: space-between;
`;

const List = styled.table`
    width: 100%;

    th,
    tr {
        display: flex;
        align-items: center;
        padding: 0 1rem;
        color: #0b1936;
    }

    tr {
        height: 28px;
        justify-content: space-between;
        background-color: #f5f8ff;
    }

    .title {
        justify-content: flex-start;
        background-color: #edf1f5;
        height: 40px;
        font-weight: 600;
    }

    .light {
        background-color: #fff;
    }
`;
