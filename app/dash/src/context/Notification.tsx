'use client';

import React, { createContext, useCallback, useContext, useMemo } from 'react';

import { notification } from 'antd';

type TNotification = 'ERROR' | 'SUCCESS' | 'INFO' | 'WARNING';

interface INotificationProps {
  message: string;
  description: string;
  type: TNotification;
}

interface IProps {
  onShowNotification(data: INotificationProps): void;
}

const Context = createContext<IProps>({} as IProps);

export function Provider({ children }: { children: React.ReactNode }) {
  const [api, contextHolder] = notification.useNotification();

  const handleShowNotification = useCallback(
    (data: INotificationProps) => {
      api.open({
        message: data.message,
        description: data.description,
        type: data.type.toLocaleLowerCase() as any,
      });
    },
    [api]
  );

  const values = useMemo(
    (): IProps => ({
      onShowNotification: handleShowNotification,
    }),
    [handleShowNotification]
  );
  return (
    <Context.Provider value={values}>
      {contextHolder}
      {children}
    </Context.Provider>
  );
}

export function useNotification() {
  return useContext(Context);
}
