import Cookies from 'js-cookie';
import { create } from 'zustand';

import { setLoadingState } from '../helpers/setStates';
import { ICurrentUser } from './../../models/auth';
import {
  changeClient,
  check2faCode,
  checkAuthenticatedUser,
  forgotPassword,
  getCurrentClientInfoAPI,
  send2faCode,
  setImpersonateAPI,
  signIn,
} from './fetchers';
import { TActions, TState } from './types';

export const useAuth = create<TState & TActions>((set) => ({
  currentUser: null,
  currentClientInfo: {} as TState['currentClientInfo'],
  isLoading: false,
  errors: {} as TState['errors'],
  loading: {} as TState['loading'],

  setCheckAuthenticatedUser: async () => {
    set({ isLoading: true });

    return await checkAuthenticatedUser()
      .then(async (user) => {
        return user;
      })
      .finally(() => set({ isLoading: false }));
  },

  setUser: (data) => {
    set({ currentUser: data });
  },

  setClearUser: () => {
    Cookies.remove(process.env.NEXT_PUBLIC_JWT_COOKIE ?? '');
    Cookies.remove(process.env.NEXT_PUBLIC_CURRENT_USER_COOKIE ?? '');
    Cookies.remove(process.env.NEXT_PUBLIC_JWT_COOKIE_IMPERSONATE ?? '');

    set({ currentUser: null });
  },

  setSignIn: async (payload) => {
    set({ isLoading: true });

    await signIn(payload)
      .then(({ user, accessToken }) => {
        Cookies.set(process.env.NEXT_PUBLIC_JWT_COOKIE ?? '', accessToken);
        set({ currentUser: user });
      })
      .finally(() => set({ isLoading: false }));
  },

  setForgotPassword: async (email) => {
    set({ isLoading: true });
    await forgotPassword(email).finally(() => set({ isLoading: false }));
  },

  set2fa: async (payload) => {
    set({ isLoading: true });

    setLoadingState(useAuth, 'set2fa', true);

    return await check2faCode(payload)
      .then(({ accessToken, user }) => {
        if (!user || !accessToken) {
          return {
            accessToken: '',
            user: {} as ICurrentUser,
          };
        }

        set({ currentUser: user });

        Cookies.set(process.env.NEXT_PUBLIC_JWT_COOKIE ?? '', accessToken);
        Cookies.set(
          process.env.NEXT_PUBLIC_CURRENT_USER_COOKIE ?? '',
          JSON.stringify({ userId: user.uuid, role: user.role })
        );

        return {
          accessToken: accessToken,
          user: user,
        };
      })
      .catch((error) => {
        throw new Error((error as any)?.message ?? '');
      })
      .finally(() => {
        set({ isLoading: false });
        setLoadingState(useAuth, 'set2fa', false);
      });
  },

  setSend2Fa: async (payload) => {
    set({ isLoading: true });

    await send2faCode(payload).finally(() => set({ isLoading: false }));
  },

  setChangeClient: async (id: string) => {
    await changeClient(id)
      .then(({ user, credentials }) => {
        set({ currentUser: user });
        Cookies.set(
          process.env.NEXT_PUBLIC_JWT_COOKIE ?? '',
          credentials.accessToken
        );
      })
      .finally(() => set({ isLoading: false }));
  },

  getCurrentClientInfo: async () => {
    return await getCurrentClientInfoAPI().then((res) => {
      set({ currentClientInfo: res });
      return res;
    });
  },

  setSignOut: () => {
    Cookies.remove(process.env.NEXT_PUBLIC_JWT_COOKIE ?? '');
    Cookies.remove(process.env.NEXT_PUBLIC_CURRENT_USER_COOKIE ?? '');
    Cookies.remove(process.env.NEXT_PUBLIC_JWT_COOKIE_IMPERSONATE ?? '');

    window.location.replace('/');

    set({ currentUser: null });
  },

  setImpersonate: async (payload) => {
    setLoadingState(useAuth, 'setImpersonate', true);

    await setImpersonateAPI(payload)
      .then((response) => {
        Cookies.set(
          process.env.NEXT_PUBLIC_JWT_COOKIE ?? '',
          response.accessToken
        );
        Cookies.set(
          process.env.NEXT_PUBLIC_JWT_COOKIE_IMPERSONATE ?? '',
          response.superAdminToken
        );
      })
      .finally(() => {
        setLoadingState(useAuth, 'setImpersonate', false);
      });
  },

  setChangeUserImpersonateAndCurrentUser: (payload) => {
    set({ currentUser: payload });
    Cookies.set(
      process.env.NEXT_PUBLIC_CURRENT_USER_COOKIE ?? '',
      JSON.stringify({
        userId: payload.uuid,
        role: payload.role,
      })
    );
  },

  setReturnWithSuperAdminUser: async () => {
    const checkAuthUser = useAuth.getState().setCheckAuthenticatedUser;
    const tokenSuperAdmin =
      Cookies.get(process.env.NEXT_PUBLIC_JWT_COOKIE_IMPERSONATE ?? '') ?? '';

    Cookies.set(process.env.NEXT_PUBLIC_JWT_COOKIE ?? '', tokenSuperAdmin);
    Cookies.remove(process.env.NEXT_PUBLIC_JWT_COOKIE_IMPERSONATE ?? '');

    const currentUser = await checkAuthUser();

    Cookies.set(
      process.env.NEXT_PUBLIC_CURRENT_USER_COOKIE ?? '',
      JSON.stringify({
        userId: currentUser!.uuid,
        role: currentUser!.role,
      })
    );

    set({ currentUser });
  },
}));
