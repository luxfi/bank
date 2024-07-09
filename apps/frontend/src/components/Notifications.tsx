import { notification } from 'antd';
export const openNotification = (message: string, description: string) => {
    notification.success({
        message: message,
        description: description,
        duration: 3
    });
};
export const openErrorNotification = (message: string, description: string) => {
    notification.error({
        message: message,
        description: description,
        duration: 3
    });
};