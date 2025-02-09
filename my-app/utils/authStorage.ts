import * as SecureStore from "expo-secure-store";

export async function saveToken(token: string): Promise<void> {
    await SecureStore.setItemAsync('userToken', token);
}

export async function getToken(): Promise<string | null> {
    return await SecureStore.getItemAsync('userToken');
}

export async function deleteToken(): Promise<void> {
    await SecureStore.deleteItemAsync('userToken');
}