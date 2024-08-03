import Button from "../../../components/Button";
import { Modal } from "../../../components/Modal";
import { Spinner } from "../../../components/Spinner";
import { Form, Input } from 'antd';
import { string } from "yup";
import { setUserData, submitUser } from "../../../features/profile/ProfileSlice";
import { useAppDispatch } from "../../../app/hooks";
import { openErrorNotification, openNotification } from "../../../components/Notifications";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../../features/auth/AuthSlice";
interface EmailModalProps {
    previousEmail: string | undefined,
    emailModalStatus: any,
    closeEmailModal: any,
    uuid: string,
}
export const EmailModal = (props: EmailModalProps) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const previousEmail = props.previousEmail;
    const updateEmail = (email: string) => {
        console.log(previousEmail, email);
    }
    const dispatch = useAppDispatch();
    return (
        <Modal
            title='Update Email'
            open={props.emailModalStatus}
            onCancel={props.closeEmailModal}
            footer={[
                loading ? (
                    <Spinner />
                ) : (
                    <Button secondary size="long" onClick={() => form.submit()}>
                        Save
                    </Button>
                ),
            ]}
        >
            <Form
                form={form}
                name='email-modal'
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                autoComplete="off"
                onFinish={async (values) => {
                    if(!props.uuid) return;
                    setLoading(true);
                    dispatch(setUserData({email: values.username}));
                    dispatch(
                        submitUser({uuid: props.uuid})
                    ).unwrap().then(() => {
                        openNotification('Change Email', 'The email address has been changed successfully. Please log in again using the new email.');
                        setTimeout(() => {
                            props.closeEmailModal();
                            setLoading(false);
                            dispatch(logout());
                        }, 2500);
                    })
                    .catch((error) => {
                        openErrorNotification('Change Email', error.message ? error.message : 'Failed to change your email address.');
                        setLoading(false);
                    });
                }}
            >
                <Form.Item
                    key='email'
                    label='Email'
                    name='username'
                    style={{ marginBottom: "10px" }}
                    rules={[{ required: true, type: 'email', message: 'Please input a valid email address' }]}
                    hasFeedback
                >
                    <Input placeholder="Email" />
                </Form.Item>
                <Form.Item
                    key='confirm-email'
                    label='Confirm Email'
                    name='confirm-email'
                    style={{ marginBottom: "10px" }}
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: 'Please input a valid email address',
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('username') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('The two emails that you entered do not match!'));
                            },
                        }),
                    ]}
                >
                    <Input placeholder="Confirm Email" />
                </Form.Item>
            </Form>
        </Modal>
    )
}