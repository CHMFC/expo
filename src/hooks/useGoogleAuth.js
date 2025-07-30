import { useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { GOOGLE_AUTH_CONFIG } from '../const/googleAuthConfig';
import axios from 'axios';
import { API_URL } from '../const/apiUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useGoogleAuth = (onSuccess, onError) => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: GOOGLE_AUTH_CONFIG.expoClientId,
    iosClientId: GOOGLE_AUTH_CONFIG.iosClientId,
    androidClientId: GOOGLE_AUTH_CONFIG.androidClientId,
    webClientId: GOOGLE_AUTH_CONFIG.webClientId,
  });

  useEffect(() => {
    WebBrowser.maybeCompleteAuthSession();
  }, []);

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      handleGoogleLogin(authentication.accessToken);
    } else if (response?.type === 'error') {
      console.error('Google Auth Error:', response.error);
      onError && onError(response.error);
    }
  }, [response]);

  const handleGoogleLogin = async (accessToken) => {
    try {
      // Enviar o token do Google para sua API
      const response = await axios.post(`${API_URL.base}/login/google`, {
        accessToken: accessToken
      });

      if (response.data.success) {
        const userData = {
          token: response.data.token,
          user: response.data.usuarioId,
        };
        
        await AsyncStorage.setItem("token", JSON.stringify(userData.token));
        onSuccess && onSuccess(userData);
      } else {
        onError && onError('Falha na autenticação');
      }
    } catch (error) {
      console.error('Erro no login Google:', error);
      onError && onError('Erro na comunicação com o servidor');
    }
  };

  const signInWithGoogle = () => {
    promptAsync();
  };

  return {
    signInWithGoogle,
    isLoading: request === null,
  };
}; 