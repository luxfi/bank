'use client';
import { useEffect, useState } from 'react';

import Table from '@/components/Table';

import { ICurrentUser } from '@/models/auth';

import { useNotification } from '@/context/Notification';

import { formatDate } from '@/utils/lib';

import { UndoOutlined } from '@ant-design/icons';
import { Modal, Tooltip } from 'antd';

import { getArchivedUsers, restoreUser } from '@/api/users';

import { Container, IconButton } from './styles';

const columns = [
  {
    title: 'Name',
    render: (data: ICurrentUser) => {
      const firstName = data.firstname;
      const lastName = data.lastname;
      const fullName = `${firstName} ${lastName}`;
      return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span>{data.username}</span>
          {fullName}
        </div>
      );
    },
  },
  {
    title: 'Archived Date',
    render: (data: ICurrentUser) => {
      const date = data.archivedAt ? formatDate(data.archivedAt) : '--';
      return <div>{date}</div>;
    },
  },
  {
    title: 'Role',
    dataIndex: 'role',
  },
  {
    title: 'Actions',
    width: 100,
  },
];

export default function ArchivedUsers() {
  const [archivedUsers, setArchivedUsers] = useState<Array<ICurrentUser>>([]);
  const [loading, setLoading] = useState(true);
  const { onShowNotification } = useNotification();

  const handleGetArchivedUsers = async () => {
    setLoading(true);
    const res = await getArchivedUsers();
    if (res.data) setArchivedUsers(res.data);
    setLoading(false);
  };

  const handleRestoreUsers = async (uuid: string) => {
    await restoreUser(uuid)
      .then(() => {
        onShowNotification({
          type: 'SUCCESS',
          message: 'Success',
          description: 'User restored successfully',
        });
        handleGetArchivedUsers();
        return;
      })
      .catch((err) => {
        onShowNotification({
          type: 'ERROR',
          message: 'Error',
          description: err,
        });
      });
  };

  useEffect(() => {
    handleGetArchivedUsers();
  }, []);

  const actions = (data: ICurrentUser) => {
    return (
      <div style={{ display: 'flex', gap: '12px' }}>
        <Tooltip title="Restore user">
          <>
            <IconButton
              onClick={() => {
                const firstName = data.firstname;
                const lastName = data.lastname;
                return Modal.confirm({
                  title: 'Restore user',
                  content: `Are you sure you want to restore this user? '${firstName} ${lastName}' `,
                  centered: true,
                  onOk: async () => {
                    await handleRestoreUsers(data.uuid);
                  },
                  footer: (_, { OkBtn, CancelBtn }) => (
                    <>
                      <CancelBtn />
                      <OkBtn />
                    </>
                  ),
                });
              }}
            >
              <UndoOutlined />
            </IconButton>
          </>
        </Tooltip>
      </div>
    );
  };
  return (
    <Container>
      <Table
        columns={columns}
        dataSource={archivedUsers}
        actionsContainer={(data: ICurrentUser) => actions(data)}
        loading={loading}
        rowKey={(r) => r.uuid || r.id}
      />
    </Container>
  );
}
