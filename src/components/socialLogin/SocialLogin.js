import { Text, TouchableOpacity, View, SafeAreaView,Alert } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { styles } from "./socialLoginStyle";
import { memo, useEffect } from "react";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import usePersist from "../../hooks/usePersist";
import { API_URL } from "../../const/apiUrl";
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export default function SocialLoginComponent({ label }) {
  const navigation = useNavigation();
  const { setTokenStored, setUserStored } = usePersist();
  const pegarUsuario = async (userData) => {
    const token = userData.token;
    const instance = axios.create({
      baseURL: `${API_URL.base}/usuarios/${userData.user}`,
      timeout: 1000,
      headers: { Authorization: "Bearer " + token },
    });

    instance.get("/").then(async (response) => {
      try {
        const json = JSON.stringify(response.data);
        await AsyncStorage.setItem("userData", json);
        setUserStored(response.data)
      } catch (error) {
        return null;
      }
    });
  };

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: 'SEU_CLIENT_ID_EXPO_APPS.apps.googleusercontent.com',
    iosClientId: 'SEU_CLIENT_ID_IOS.apps.googleusercontent.com',
    androidClientId: 'SEU_CLIENT_ID_ANDROID.apps.googleusercontent.com',
    webClientId: 'SEU_CLIENT_ID_WEB.apps.googleusercontent.com',
  });

  useEffect(() => {
    WebBrowser.maybeCompleteAuthSession();
    if (response?.type === 'success') {
      const { authentication } = response;
      // Aqui você pode usar o token para autenticar no seu backend ou Firebase
      // Exemplo: enviar o token para sua API, buscar dados do usuário, etc.
      // authentication.accessToken
    }
  }, [response]);

  return (
    <SafeAreaView style={styles.socialLoginContainer}>
      <Text style={styles.socialText}>{label}</Text>
      <View style={styles.socialLogin}>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.socialContainer}
          onPress={() => promptAsync()}
        >
          <Icon name="logo-google" color="black" size={24} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export const SocialLogin = memo(SocialLoginComponent);
