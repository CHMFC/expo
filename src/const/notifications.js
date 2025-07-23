import axios from "axios";
import { API_URL } from "./apiUrl";

export async function registerDeviceForRemoteMessages() {
  try {
    await requestUserPermission();
  } catch (error) {
    return null;
  }
}

export async function requestUserPermission() {
  const hasPermission = true; // No messaging library, so assume true for now

  if (!hasPermission) {
    const authStatus = true; // No messaging library, so assume true for now
    const enabled =
      authStatus === true || // No messaging library, so assume true for now
      authStatus === true; // No messaging library, so assume true for now

    if (enabled) {
      return null;
    }
  }
}

export const removerFuncionarioNotification = async (nome, tokenCelular) => {
  try {
    await axios.post(
      `${API_URL.base}/pushnotification`,
      {
        tokenCelular: [tokenCelular],
        title: "Funcionário removido",
        body: `Olá ${nome}, você foi removido da loja.`,
      }
    );
  } catch (err) {
    return null;
  }
};

export const FuncionarioNotification = async (nome, tokenCelular, ativo) => {
  try {
    await axios.post(
      `${API_URL.base}/pushnotification`,
      {
        tokenCelular: [tokenCelular],
        title: ativo ? "Funcionário reativado" : "Funcionário desativado",
        body: `Olá ${nome}, seu status foi ${ativo ? "reativado" : "desativado"
          } pela loja.`,
      }
    );
  } catch (err) {
    return null;
  }
};

