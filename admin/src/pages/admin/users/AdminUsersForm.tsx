import { Formik } from "formik";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import Button from "../../../components/Button";
import InputField from "../../../components/InputField";
import { openErrorNotification } from "../../../components/Notifications";
import { Spinner } from "../../../components/Spinner";
import { fetchAdminUser, resetAdminUsersData, resetSelectedAdminUser, selectAdminUserData, selectAdminUsersError, selectAdminUsersLoadingStatus, setSelectedAdminUserData, submitAdminUser } from "../../../features/admin-users/AdminUsersSlice";
import { adminUserSchema } from "../../../features/admin-users/model/adminUserSchema";
import RequireAuth from "../../../features/auth/RequireAuth";
import { AdminRoles, UserRole } from "../../../features/auth/user-role.enum";
import { ButtonsRow } from "../../dashboard/components/ButtonsRow";
import { ErrorText } from "../../dashboard/components/ErrorText";
import { FlexibleForm, FlexibleFormField } from "../../dashboard/components/FlexibleForm";
import { FormRow } from "../../dashboard/components/FormRow";
import { HalfWidth } from "../../dashboard/components/HalfWidth";
import { PageTitle } from "../../dashboard/components/PageTitle";
import AdminDashboardLayout from "../components/AdminDashboardLayout";

export default function AdminUsersForm() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { uuid } = useParams();

    const status = useAppSelector(selectAdminUsersLoadingStatus);
    const isLoading = status === 'loading';
    const error = useAppSelector(selectAdminUsersError);
    const formData = useAppSelector(selectAdminUserData);

    useEffect(() => {
        if (uuid && uuid !== 'new') {
            dispatch(fetchAdminUser({ uuid: uuid }));
        } else {
            dispatch(resetSelectedAdminUser());
        }
    }, [dispatch, uuid]);
    // console.log(formData);
    console.log(status);
    return <RequireAuth roles={AdminRoles}>
        <AdminDashboardLayout>
            {
                isLoading
                    ? <Spinner />
                    : <>
                        <PageTitle>
                            Admin Users
                        </PageTitle>

                        <Formik
                            enableReinitialize
                            initialValues={formData}
                            validationSchema={adminUserSchema}
                            onSubmit={async (values) => {
                                values.role = UserRole.SuperAdmin;
                                dispatch(setSelectedAdminUserData(values));
                                await dispatch(submitAdminUser({ uuid: uuid || 'new' })).unwrap().then(() => {
                                    dispatch(resetAdminUsersData());
                                    navigate('/admin/admins');
                                }).catch((error) => {
                                    openErrorNotification('Admin User', error.message);
                                });  
                            }}
                        >
                            <FlexibleForm>
                                <FlexibleFormField
                                    labeltext="First name"
                                    name="firstname"
                                    placeholder="John"
                                />

                                <FlexibleFormField
                                    labeltext="Last name"
                                    name="lastname"
                                    placeholder="Smith"
                                />

                                <FlexibleFormField
                                    labeltext="E-mail"
                                    name="email"
                                    placeholder="email@example.com"
                                />

                                <FlexibleFormField
                                    helpText={uuid !== 'new' ? 'Leave empty to keep the password unchanged.' : undefined}
                                    type="password"
                                    labeltext="Password"
                                    name="password"
                                    placeholder="Password"
                                />

                                <FlexibleFormField
                                    type="password"
                                    labeltext="Confirm password"
                                    name="confirmPassword"
                                    placeholder="Password"
                                />

                                <ButtonsRow>
                                    <Button type="button" danger onClick={() => navigate('/admin/admins')}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" secondary>{uuid !== 'new' ? 'Update' : 'Create'} Admin</Button>
                                </ButtonsRow>

                                {
                                    error
                                        ? <ErrorText>{error}</ErrorText>
                                        : null
                                }
                            </FlexibleForm>
                        </Formik>
                    </>
            }
        </AdminDashboardLayout>
    </RequireAuth>;
}
