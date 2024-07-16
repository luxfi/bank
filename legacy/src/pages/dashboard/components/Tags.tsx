import { Tag } from 'antd';
import { CheckCircleOutlined, SyncOutlined, CloseOutlined } from '@ant-design/icons';
import { ucFirst } from '../../../utils/functions';

interface tagType {
    [key: string]: any
}
const colors: tagType = {
    approved: 'success',
    pending: 'processing',
    rejected: 'error'
}
const icons: tagType = {
    approved: <CheckCircleOutlined />,
    pending: <SyncOutlined />,
    rejected: <CloseOutlined />
}
export const Tags = ({style, text}: {style: string, text: string}) => {
    if(!style) style = 'pending';
    if(!text) text = 'pending';
    return (
        <Tag icon = {icons[style]} color = {colors[style]}>
            {text ? ucFirst(text) : 'Pending'}
        </Tag>
    )
}