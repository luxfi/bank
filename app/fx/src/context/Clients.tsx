'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { IClients, ISubAccount } from '@/models/clients';

interface IProps {
  clear(): void;
  baseId: string;
  setBaseId(baseId: string): void;
  subAccounts?: Array<ISubAccount>;
  setSubAccount(data: Array<ISubAccount>): void;
  clientSelected?: IClients;
  clientsLists: Array<IClients>;
  setClientSelected(data: IClients): void;
}

const Context = createContext<IProps>({} as IProps);

export function Provider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<IClients>();
  const [baseId, setBaseId] = useState<string>('');
  const [subAccount, setSubAccount] = useState<Array<ISubAccount>>([]);
  const [list] = useState<Array<IClients>>([]);

  const handleChangeUserData = useCallback((data: IClients) => {
    setData(data);
  }, []);

  const handleClearUserData = useCallback(() => {
    setData(undefined);
  }, []);

  const handleSetSubAccount = useCallback((data: Array<ISubAccount>) => {
    setSubAccount(data);
  }, []);

  const values = useMemo(
    (): IProps => ({
      clientSelected: data,
      clear: handleClearUserData,
      clientsLists: list,
      baseId,
      setBaseId: setBaseId,
      subAccounts: subAccount,
      setSubAccount: handleSetSubAccount,
      setClientSelected: handleChangeUserData,
    }),
    [
      data,
      list,
      handleClearUserData,
      baseId,
      handleSetSubAccount,
      handleChangeUserData,
      subAccount,
    ]
  );
  return <Context.Provider value={values}>{children}</Context.Provider>;
}

export function useClient() {
  return useContext(Context);
}
