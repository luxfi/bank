import { PageTitle } from "../components/PageTitle";
import { Card as DefaultCard } from "antd";
import { FlexContainer } from "../../../components/Card";
import styled from "styled-components";
import { device } from "../../../utils/media-query-helpers";
import {
    ToDoList,
    selectToDoStatus,
    selectToDoError,
} from "../../../features/dashboard/DashboardSlice";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    pendingTransactions,
    selectPendingPagination,
} from "../../../features/pending/PendingSlice";
export default function ToDoWidget(toDoList: ToDoList) {
    const dispatch = useAppDispatch();

    const rejectedCount = useAppSelector(selectPendingPagination);

    const loading =
        useAppSelector(selectToDoStatus) === "loading" ? true : false;
    const error = useAppSelector(selectToDoError);
    const gateway = window.localStorage.getItem("gateway") || "currencyclound";
    const hasAwaiting = gateway !== "openpayd";
    const hasTxs = gateway !== "openpayd";

    const navigate = useNavigate();
    let today: any = new Date();
    today = today.toISOString();
    today = today.split("T")[0];

    useEffect(() => {
        dispatch(
            pendingTransactions({
                query: "?status_approval=rejected",
                gateway,
            })
        );
    }, [gateway, toDoList]);

    return (
        <>
            <PageTitle style={toDoStyle}>
                To Do
                {loading ? <Spin style={{ marginLeft: "10px" }} /> : <></>}
            </PageTitle>
            {error ? (
                <p style={{ marginRight: "auto", marginLeft: "20px" }}>
                    Data not found.
                </p>
            ) : (
                <FlexContainer>
                    {hasAwaiting && (
                        <Card
                            title="Awaiting Funds"
                            onClick={() =>
                                navigate(
                                    `/dashboard/search?settles_at_from=${today}&status=pending&type=debit`
                                )
                            }
                        >
                            <Number color="#d75645">
                                {toDoList.awaitingFunds}
                            </Number>
                        </Card>
                    )}
                    <Card
                        title="Failed Payments"
                        onClick={() =>
                            navigate(`/dashboard/search?action=payment_failure`)
                        }
                    >
                        <Number color="#d75645">
                            {toDoList.failedPayments}
                        </Number>
                    </Card>
                    <Card
                        title="Pending Transactions"
                        onClick={() =>
                            navigate(`/dashboard/search?status=pending`)
                        }
                    >
                        <Number color="#d75645">
                            {toDoList.pendingTransactions}
                        </Number>
                    </Card>
                    <Card
                        title="Rejected Payments"
                        onClick={() =>
                            navigate(
                                "/dashboard/pending?status_approval=rejected"
                            )
                        }
                    >
                        <Number color="#d75645">
                            {rejectedCount.total_entries}
                        </Number>
                    </Card>
                    <Card
                        title="Completed Conversions Today"
                        onClick={() =>
                            navigate(
                                `/dashboard/search?action=conversion&status=completed&completed_at_from=${today}&completed_at_to=${today}`
                            )
                        }
                    >
                        <Number color="#e99f3b">
                            {toDoList.completedConversions}
                        </Number>
                    </Card>
                    {hasTxs && (
                        <Card
                            title="Completed Transactions Today"
                            onClick={() =>
                                navigate(
                                    `/dashboard/search?status=completed&completed_at_from=${today}&completed_at_to=${today}`
                                )
                            }
                        >
                            <Number color="#e99f3b">
                                {toDoList.completedTransactions}
                            </Number>
                        </Card>
                    )}
                    <Card
                        title="Completed Payments Today"
                        onClick={() =>
                            navigate(
                                `/dashboard/search?action=payment&status=completed&completed_at_from=${today}&completed_at_to=${today}`
                            )
                        }
                    >
                        <Number color="#e99f3b">
                            {toDoList.completedPayments}
                        </Number>
                    </Card>
                </FlexContainer>
            )}
        </>
    );
}
const toDoStyle = {
    marginRight: "auto",
    color: "#414042",
    fontWeight: 700,
    marginTop: "10px",
    marginBottom: "0px",
};
const Card = styled(DefaultCard)`
    @media ${device.lg} {
        width: 30%;
    }
    text-align: center;
    margin-top: 20px;
    border: 1px solid lightgray;
    border-radius: 5px;
    background-color: white;
    .ant-card-head {
        background-color: rgb(245, 245, 245);
    }
    cursor: pointer;
`;
interface NumberProps {
    color?: string;
}

const Number = styled.span<NumberProps>`
    color: white;
    background-color: ${(props) => props.color};
    padding: 15px;
    border-radius: 7px;
    display: inline-block;
    min-width: 50px;
    min-height: 50px;
`;
