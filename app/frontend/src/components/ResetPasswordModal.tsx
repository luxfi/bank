import Button from "./Button";
import { Form, Input, Row, Col, Typography, DatePicker, Select } from "antd";
import { Modal } from "./Modal";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { useEffect, useState } from "react";
import {
    submitResetPasswordData,
} from "../features/admin-clients/AdminClientsSlice";
import { openNotification, openErrorNotification } from "./Notifications";
import { Spinner } from "./Spinner";

export const ResetPasswordModal = ({uuid, ModalFunc}: any) => {
    const dispatch = useAppDispatch();
    const [isResetModalVisible, showResetModal] = ModalFunc;
    const [resetPasswordData, setResetPasswordData] = useState({
        newPassword: "",
        confirmPassword: "",
    });
    const [resetPasswordStatus, setResetPasswordStatus] = useState(false);
    const resetPassword = async () => {
        if (resetPasswordData.newPassword === "") {
            openErrorNotification(
                "Reset password",
                "The new password should not be empty."
            );
        }
        if (
            resetPasswordData.newPassword != resetPasswordData.confirmPassword
        ) {
            openErrorNotification(
                "Reset password",
                "The password does not match. Please confirm your pasword again."
            );
        }
        setResetPasswordStatus(true);
        try {
            await dispatch(
                submitResetPasswordData({ resetPasswordData, uuid })
            ).unwrap();
            openNotification(
                "Reset Password",
                "Password has been reset successfully"
            );
            setResetPasswordStatus(false);
            showResetModal(false);
        } catch (err: any) {
            openErrorNotification("Reset Password", err.message);
            setResetPasswordStatus(false);
        }
        setResetPasswordStatus(false);
    };
    return (
        <Modal
            title="Reset Password"
            open={isResetModalVisible}
            onCancel={() => showResetModal(false)}
            footer={[
                resetPasswordStatus ? (
                    <Spinner />
                ) : (
                    <Button secondary size="long" onClick={resetPassword}>
                        Save
                    </Button>
                ),
            ]}
        >
            <Form
                name="editClient"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                autoComplete="off"
            >
                <Form.Item
                    label="New Password"
                    name="new_password"
                    style={{ marginBottom: "10px" }}
                    required
                >
                    <Input.Password
                        value={resetPasswordData.newPassword}
                        required
                        onChange={(e) =>
                            setResetPasswordData({
                                ...resetPasswordData,
                                newPassword: e.target.value,
                            })
                        }
                    />
                </Form.Item>
                <Form.Item
                    label="Confirm Password"
                    name="confirm_password"
                    style={{ marginBottom: "10px" }}
                    required
                >
                    <Input.Password
                        value={resetPasswordData.confirmPassword}
                        required
                        onChange={(e) =>
                            setResetPasswordData({
                                ...resetPasswordData,
                                confirmPassword: e.target.value,
                            })
                        }
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};
