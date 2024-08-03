import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import RequireAuth from "../../../features/auth/RequireAuth";
import {
    fetchBeneficiary,
    resetBeneficiaryData,
} from "../../../features/beneficiaries/BeneficiariesSlice";
import DashboardLayout from "../components/DashboardLayout";
import ReviewBeneficiary from "./components/ReviewBeneficiary";
import { UserRoles } from "../../../features/auth/user-role.enum";
import { InternalForm } from "./components/InternalForm";
import { loadCurrenciesList } from "../../../features/balances/BalancesListSlice";
import { selectCurrentUser } from "../../../features/auth/AuthSlice";
import AdminDashboardLayout from "../../admin/components/AdminDashboardLayout";

export enum BeneficiaryFormStep {
    Form = 0,
    Review = 1,
    Complete = 2,
}

export default function BeneficiaryForm() {
    const [activeStep, setActiveStep] = React.useState(
        BeneficiaryFormStep.Form
    );
    const dispatch = useAppDispatch();
    const { uuid } = useParams();
    useEffect(() => {
        if (uuid && uuid !== "new") {
            dispatch(fetchBeneficiary(uuid));
        } else {
            dispatch(resetBeneficiaryData());
        }
    }, [dispatch, uuid]);
    useEffect(() => {
        window.scrollTo({top: 0, behavior: 'smooth'});
    }, []);
    useEffect(() => {
        dispatch(loadCurrenciesList());
    }, []);
    const currentUser = useAppSelector(selectCurrentUser);
    const Layout =
        currentUser?.role !== "admin:super"
            ? DashboardLayout
            : AdminDashboardLayout;
    return (
        <RequireAuth roles={UserRoles}>
            <Layout>
                {activeStep === BeneficiaryFormStep.Form ? (
                    <InternalForm setActiveStep={setActiveStep} />
                ) : (
                    <ReviewBeneficiary
                        setActiveStep={setActiveStep}
                        uuid={String(uuid)}
                    />
                )}
            </Layout>
        </RequireAuth>
    );
}