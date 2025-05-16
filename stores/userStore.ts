import { signal } from "@preact/signals-react";

export const userStore = signal<User>({
  userName: "",
  password: "",
  customerId: 0,
  database: "",
});

export const setUser = (
  username: string,
  password: string,
  customerId: number,
  database: string
) => {
  userStore.value = {
    userName: username,
    password: password,
    customerId: customerId,
    database: database,
  };
};

export const clearUser = () => {
  userStore.value = {
    userName: "",
    password: "",
    customerId: 0,
    database: "",
  };
};

export const isLoggedIn = (): boolean => {
  const { userName, password, customerId, database } = userStore.value;

  return !!(userName && password && customerId && database);
};
