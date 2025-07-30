import { Text, TouchableOpacity, View, SafeAreaView, Alert } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { styles } from "./socialLoginStyle";
import { memo } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import usePersist from "../../hooks/usePersist";
import { useGoogleAuth } from "../../hooks/useGoogleAuth";
import axios from "axios";
import { API_URL } from "../../const/apiUrl";

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

  const handleGoogleSuccess = async (userData) => {
    setTokenStored(userData.token);
    pegarUsuario(userData);

    // Verificar status do onboarding
    const checkOnboardingStatus = async () => {
      try {
        const onboardingCompleted = await AsyncStorage.getItem("bemVindo");
        if (onboardingCompleted === "true") {
          return navigation.navigate("Home", { token: userData.token });
        } else {
          await axios
            .get(`${API_URL.base}/mensagensapresentacao`)
            .then((res) => {
              return navigation.navigate("BemVindo", {
                token: userData.token,
                bemVindo: res.data,
              });
            })
            .catch((error) => {
              navigation.navigate("Home", { token: userData.token });
            });
        }
      } catch (error) {
        navigation.navigate("Home", { token: userData.token });
      }
    };

    checkOnboardingStatus();
  };

  const handleGoogleError = (error) => {
    Alert.alert(
      "Erro no Login",
      "Não foi possível fazer login com o Google. Tente novamente."
    );
  };

  const { signInWithGoogle, isLoading } = useGoogleAuth(handleGoogleSuccess, handleGoogleError);

  return (
    <SafeAreaView>
      <Text style={styles.socialText}>{label}</Text>
      <View style={styles.socialLogin}>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.socialContainer}
          onPress={signInWithGoogle}
          disabled={isLoading}
        >
          <Icon name="logo-google" color="black" size={24} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export const SocialLogin = memo(SocialLoginComponent);
