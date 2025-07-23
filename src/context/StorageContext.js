import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useMemo, useState, createContext, useEffect } from "react";

export const StorageContext = createContext({
  userStored: {},
  setUserStored: () => {},
  tokenStored: {},
  setTokenStored: () => {},
  deviceToken: {},
  setDeviceToken: () => {},
});

export default function StorageContextProvider({ children }) {
  const [userStored, setUserStored] = useState();
  const [tokenStored, setTokenStored] = useState();
  const [deviceToken, setDeviceToken] = useState();

  useEffect(() => {
    // --- Código de push notification desativado para compatibilidade com Expo Go ---
    /*
    const fetchToken = async () => {
      const granted = await messaging().requestPermission();
      if (granted) {
        const token = await messaging().getToken();
        setDeviceToken(token);
        await AsyncStorage.setItem("fcmToken", token);
      }
    };

    fetchToken().catch((error) => {
    });

    const onTokenRefreshListener = messaging().onTokenRefresh(
      async (newToken) => {
        setDeviceToken(newToken);
        await AsyncStorage.setItem("fcmToken", newToken);
      }
    );

    return () => {
      onTokenRefreshListener();
    };
*/
  }, []);

  useEffect(() => {
    const getUser = async () => {
      await AsyncStorage.getItem("userData").then((res) => {
        const result = JSON.parse(res);
        setUserStored(result);
      });
    };
    getUser();
  }, []);

  useEffect(() => {
    const getToken = async () => {
      await AsyncStorage.getItem("token").then((res) => {
        const result = JSON.parse(res);
        setTokenStored(result);
      });
    };
    getToken();
  }, []);

  const currentUser = useMemo(() => {
    return {
      userStored,
      setUserStored,
      tokenStored,
      setTokenStored,
      deviceToken,
      setDeviceToken,
    };
  }, [userStored, tokenStored, deviceToken]);

  return (
    <StorageContext.Provider value={currentUser}>
      {children}
    </StorageContext.Provider>
  );
}

export const StorageContextConsumer = StorageContext.Consumer;
