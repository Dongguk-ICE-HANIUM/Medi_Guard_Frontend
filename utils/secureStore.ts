import * as SecureStore from "expo-secure-store";

async function saveSecureStore(key: string, value: string) {
  await SecureStore.setItemAsync(key, value);
}

// secure 조회하는 경우
async function getSecureStore(key: string) {
  const storedData = (await SecureStore.getItemAsync(key)) ?? null;

  return storedData;
}

async function deleteSecureStore(key: string) {
  await SecureStore.deleteItemAsync(key);
}

export { deleteSecureStore, getSecureStore, saveSecureStore };
