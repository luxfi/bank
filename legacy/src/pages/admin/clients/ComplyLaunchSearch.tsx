import styled from "styled-components";
import Layout from "../../../components/Layout";
import RequireAuth from "../../../features/auth/RequireAuth";
import { AdminRoles } from "../../../features/auth/user-role.enum";
import { device } from "../../../utils/media-query-helpers";
import { Card } from "antd";
import { selectAdminClientComplyLaunchSearchResult, submitAdminClientComplyLaunchSearch } from "../../../features/admin-clients/AdminClientsSlice";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { useEffect } from "react";

const CompanyCard = styled(Card)`
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    min-width: 300px;
    .ant-card-head {
        background-color: #00569E;
        color: white;
    }
`
export default function ComplyLaunchSearch() {
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(submitAdminClientComplyLaunchSearch({}))
    }, [dispatch]);
    const searchResult = useAppSelector(selectAdminClientComplyLaunchSearchResult);
    return (
        <RequireAuth roles={AdminRoles}>
            <Layout>
                <Container>
                    <CompanyCard title="Default size card">
                        <p>Card content</p>
                        <p>Card content</p>
                        <p>Card content</p>
                    </CompanyCard>
                </Container>
            </Layout>
        </RequireAuth>
    );
}

const Container = styled.section`
display: flex;
flex-direction: column;
margin-top: 30px;

@media ${device.sm} {
    flex-direction: row;
}
`;
