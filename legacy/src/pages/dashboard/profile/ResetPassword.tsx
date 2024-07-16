import { Formik } from "formik";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import Button from "../../../components/Button";
import InputField from "../../../components/InputField";
import { Spinner } from "../../../components/Spinner";
import RequireAuth from "../../../features/auth/RequireAuth";
import { AdminRoles, UserRoles, UserOrAdminRoles, UserRole } from "../../../features/auth/user-role.enum";
import { ButtonsRow } from "../components/ButtonsRow";
import DashboardLayout from "../components/DashboardLayout";
import { ErrorText } from "../components/ErrorText";
import { FlexibleForm } from "../components/FlexibleForm";
import { FormRow } from "../components/FormRow";
import { HalfWidth } from "../components/HalfWidth";
import { HeaderContainer } from "../components/HeaderContainer";
import { PageTitle } from "../components/PageTitle";
import { passwordSchema, PASSWORD_REQUIREMENTS_TEXT } from '../../../features/registration/model/passwordSchema';
import { setResetPasswordInfo, selectResetPasswordError, selectResetPasswordStatus, submitResetPasswordData } from "../../../features/profile/ProfileSlice";
import { LayoutProps, notification } from 'antd';
import { logout, selectCurrentUser } from "../../../features/auth/AuthSlice";
import AdminDashboardLayout from "../../admin/components/AdminDashboardLayout";
import { PropsWithChildren } from "react";

const openNotification = () => {
    notification.success({
        message: 'Reset Password',
        description: 'Password has been reset successfully.',
        duration: 2
    });
};
const openErrorNotification = (message: string) => {
    notification.error({
        message: 'Reset Password',
        description: message,
        duration: 2
    });
};
export default function ResetPassword() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const navigationButtons = (
        <Button secondary size = 'long' margin = '10px' onClick={() => dispatch(logout())}>
            Log out
        </Button>
    )
    const error = useAppSelector(selectResetPasswordError);
    const loading = useAppSelector(selectResetPasswordStatus) === 'loading';
    const currentUser = useAppSelector(selectCurrentUser);
    function LayOut({ children }: PropsWithChildren<any>) {
        return currentUser?.role === UserRole.SuperAdmin ?
            <RequireAuth roles={AdminRoles}>
                <AdminDashboardLayout navigationButtons={navigationButtons}>
                    {children}
                </AdminDashboardLayout>
            </RequireAuth>
            :
            <RequireAuth roles={ UserOrAdminRoles }>
                <DashboardLayout>
                    {children}
                </DashboardLayout>
            </RequireAuth>;
    }
    return (
        <LayOut>
            <HeaderContainer>
                <PageTitle>Reset Password</PageTitle>
            </HeaderContainer>
            <Formik
                initialValues={{ currentPassword: '', confirmPassword: '',  password: ''}}
                validateOnChange={false}
                validationSchema={passwordSchema} 
                onSubmit={async (values) => {
                    try {
                        dispatch(setResetPasswordInfo(values));
                        await dispatch(submitResetPasswordData()).unwrap();
                        openNotification();
                        setTimeout(() => {
                            navigate('/dashboard/profile');
                        }, 2000);
                    } catch (err: any) {
                        openErrorNotification(err.message);
                    }
                }}
            >
                <FlexibleForm>
                    <FormRow>
                        <HalfWidth>
                            <InputField type = "password" name = "currentPassword" labeltext="Current Password" placeholder="Type your current password" />
                        </HalfWidth>
                    </FormRow>

                    <FormRow>
                        <HalfWidth>
                            <InputField type = "password" name="password" labeltext="New Password" placeholder="Type your new password" />
                        </HalfWidth>
                    </FormRow>

                    <FormRow>
                        <HalfWidth>
                            <InputField type="password" name="confirmPassword" labeltext="Confirm Password" placeholder="Confirm your password" />
                        </HalfWidth>
                    </FormRow>

                    {error ? <ErrorText>{error}</ErrorText> : null}

                    <ButtonsRow>
                        {
                            loading
                                ? <Spinner />
                                : <Button type = "submit" primary>Reset Password</Button>
                        }
                    </ButtonsRow>
                </FlexibleForm>
            </Formik>
        </LayOut>
    )
}
