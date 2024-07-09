import { StoreApi, UseBoundStore } from 'zustand';

export interface IDefaultStates<T> {
  loading: { [key in keyof T]: boolean };
  errors: { [key in keyof T]: string };
}

export function setLoadingState<T>(
  hook: UseBoundStore<StoreApi<T>>,
  key: keyof T,
  state?: boolean
) {
  return hook.setState((prevState: T & IDefaultStates<T>) => {
    const newLoading = { ...prevState.loading };
    if (state) {
      newLoading[key] = state;
    } else {
      delete newLoading[key];
    }
    return {
      ...prevState,
      loading: newLoading,
    };
  });
}

export function setErrorState<T>(
  hook: UseBoundStore<StoreApi<T>>,
  key: keyof T,
  message?: string
) {
  return hook.setState((prevState: T & IDefaultStates<T>) => {
    const newErrors = { ...prevState.errors };
    if (message) {
      newErrors[key] = message;
    } else {
      delete newErrors[key];
    }
    return {
      ...prevState,
      errors: newErrors,
    };
  });
}
