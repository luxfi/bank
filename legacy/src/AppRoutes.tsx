import { Route, Routes } from "react-router-dom";
import Login from "./pages/auth/Login";
import VerifyEmail from "./pages/auth/VerifyEmail";
import Profile from "./pages/dashboard/profile/Profile";
import BeneficiariesList from "./pages/dashboard/beneficiaries/BeneficiariesList";
import BeneficiaryForm from "./pages/dashboard/beneficiaries/BeneficiaryForm";
import Dashboard from "./pages/dashboard/dashboard/Dashboard";
import Index from "./pages/index/Index";
import DashboardDocuments from "./pages/dashboard/documents/Documents";
import Documents from "./pages/registration/Documents";
import Metadata from "./pages/registration/Metadata";
import Registration from "./pages/registration/Registration";
import ThankYou from "./pages/registration/ThankYou";
import TermsAndConditions from "./pages/registration/TermsAndConditions";
import Invite from "./pages/dashboard/users/Invite";
import { default as AdminDashboard } from "./pages/admin/dashboard/Dashboard";
import AdminUsers from "./pages/admin/users/AdminUsers";
import AdminUsersForm from "./pages/admin/users/AdminUsersForm";
import AdminClients from "./pages/admin/clients/AdminClients";
import _AdminClients from "./pages/admin/clients/_AdminClients";
import AdminClientUserForm from "./pages/admin/clients/AdminClientUserForm";
import ResetPassword from "./pages/dashboard/profile/ResetPassword";
import ClientProfile from "./pages/admin/clients/ClientProfile";
import ClientCalendar from "./pages/admin/clients/ClientCalendar";
import RiskAssessment from "./pages/admin/clients/RiskAssessment";
import ComplyLaunchSearch from "./pages/admin/clients/ComplyLaunchSearch";
import BalancesList from "./pages/dashboard/balances/BalancesList";
import BalanceForm from "./pages/dashboard/balances/BalanceForm";
import SubAccount from "./pages/dashboard/balances/SubAccount";
import BalanceCountry from "./pages/dashboard/balances/BalanceCountry";
import BalanceDetails from "./pages/dashboard/balances/BalanceDetails";
import PercentTopUp from "./pages/dashboard/percents/PercentTopUp";
import PaymentControl from "./pages/dashboard/payments/PaymentControl";
import CurrencyControl from "./pages/dashboard/currency/CurrencyControl";
import SubAccountDetail from "./pages/dashboard/balances/SubAccountDetail";
import Conversion from "./pages/dashboard/balances/Conversion";
import Payment from "./pages/dashboard/balances/Payment";
import Transaction from "./pages/dashboard/balances/Transaction";
import UsersList from "./pages/dashboard/users/UsersList";
import Search from "./pages/dashboard/search/Search";
import TermsAndConditionsPage from "./pages/registration/TermsAndConditionsPage";
import PrivacyPage from "./pages/registration/PrivacyPage";
import MobileVerification from "./pages/registration/MobileVerification";
import AdminInvitation from "./pages/registration/AdminInvitation";
import ArchivedUsers from "./pages/admin/users/ArchivedUsers";
import RequestRegistration from "./pages/request-registration/RequestRegistration";
import RequestRegistrationSucess from "./pages/request-registration/Success";
import TwoFactorAuth from "./pages/two-factor-auth/TwoFactorAuth";
import PendingPayments from "./pages/dashboard/pending/Pending";
import PendingPaymentDetails from "./pages/dashboard/pending/Details";
export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Index />} />
            {/* Authentication */}
            <Route path="/login" element={<Login />} />
            <Route
                path="/mobile_verification"
                element={<MobileVerification />}
            />
            <Route path="/2fa" element={<TwoFactorAuth />} />
            {/* Registration */}

            <Route path="registration">
                <Route path="" element={<RequestRegistration />} />
                <Route path="success" element={<RequestRegistrationSucess />} />
            </Route>

            {/* <Route path="registration">
                <Route path="" element={<Registration />} />
                <Route path="metadata" element={<Metadata />} />
                <Route path="documents" element={<Documents />} />
                <Route path="thanks" element={<ThankYou />} />
            </Route> */}
            <Route path="admin-invitation" element={<AdminInvitation />} />
            <Route path="/verify" element={<VerifyEmail />} />
            <Route path="/terms" element={<TermsAndConditions />} />
            <Route
                path="/terms_and_conditions"
                element={<TermsAndConditionsPage />}
            />
            <Route path="/privacy_policy" element={<PrivacyPage />} />

            {/* User dashboard */}
            <Route path="dashboard">
                <Route path="" element={<Dashboard />} />
                <Route path="search" element={<Search />} />

                <Route path="pending">
                    <Route path="" element={<PendingPayments />} />
                    <Route path=":uuid" element={<PendingPaymentDetails />} />
                </Route>

                <Route path="profile" element={<Profile />} />
                <Route
                    path="profile/reset-password"
                    element={<ResetPassword />}
                />
                <Route path="beneficiaries">
                    <Route path=":uuid" element={<BeneficiaryForm />} />
                    <Route path="" element={<BeneficiariesList />} />
                </Route>
                <Route path="conversion">
                    <Route path=":uuid" element={<Conversion init={0} />} />
                    <Route path="" element={<Conversion init={0} />} />
                </Route>
                <Route path="payment">
                    <Route path=":uuid" element={<Payment init={0} />} />
                    <Route path="" element={<Payment init={0} />} />
                </Route>
                <Route path="inbound_funds">
                    <Route path=":uuid" element={<Transaction init={0} />} />
                    <Route path="" element={<Transaction init={0} />} />
                </Route>
                <Route path="balances">
                    <Route path="" element={<BalancesList />} />
                    <Route path="add" element={<BalanceForm />} />
                    <Route path="sub-accounts" element={<SubAccount />} />
                    <Route
                        path=":currency/transactions/:account_id"
                        element={<BalanceCountry />}
                    />
                    <Route
                        path=":currency/account_details/:account_id"
                        element={<BalanceDetails />}
                    />
                </Route>
                <Route path="accounts">
                    <Route
                        path=":account_id/contacts"
                        element={<SubAccountDetail />}
                    />
                </Route>
                <Route path="percent">
                    <Route path="" element={<PercentTopUp />} />
                </Route>
                <Route path="payments/wizard">
                    <Route path=":selCurrency" element={<PaymentControl />} />
                    <Route path="" element={<PaymentControl />} />
                    <Route path="details" element={<BeneficiaryForm />} />
                </Route>
                <Route path="currencies">
                    <Route path=":selCurrency" element={<CurrencyControl />} />
                    <Route path=" " element={<CurrencyControl />} />
                    {/* <Route path="date" element={<CurrencyDate/>} />
                    <Route path="quote" element={<CurrencyQuote/>} />
                    <Route path="complete" element={<CurrencyComplete/>} /> */}
                </Route>
                <Route path="users">
                    <Route path="invite" element={<Invite />} />
                    <Route path="" element={<UsersList />} />
                </Route>
                <Route path="documents" element={<DashboardDocuments />} />
            </Route>

            {/* Admin routes */}
            <Route path="admin">
                <Route path="" element={<AdminDashboard />} />
                <Route path="search" element={<Search />} />
                <Route path="beneficiaries" element={<BeneficiariesList />} />
                <Route path="admins" element={<AdminUsers />} />
                <Route path="users" element={<UsersList />} />
                <Route path="archived-users" element={<ArchivedUsers />} />
                <Route path="users/:uuid" element={<AdminUsersForm />} />
                <Route path="clients" element={<AdminClients />} />
                {/* <Route path='clients-old' element={<_AdminClients />} /> */}
                <Route
                    path="clients/:uuid/profile/:client_id?"
                    element={<ClientProfile />}
                />
                <Route
                    path="clients/:uuid/profile/risk-assessment"
                    element={<RiskAssessment />}
                />
                <Route
                    path="clients/:uuid/profile/risk-assessment/calendar"
                    element={<ClientCalendar />}
                />
                <Route path="clients/new" element={<AdminClientUserForm />} />
                <Route
                    path="clients/:uuid/account"
                    element={<AdminClientUserForm />}
                />
                <Route
                    path="clients/comply-launch-search-result"
                    element={<ComplyLaunchSearch />}
                />
            </Route>
        </Routes>
    );
}
