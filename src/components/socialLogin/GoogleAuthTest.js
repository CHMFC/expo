import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { GOOGLE_AUTH_CONFIG } from '../../const/googleAuthConfig';

export default function GoogleAuthTest() {
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
      console.log('✅ Google Auth Success:', authentication);
      Alert.alert(
        'Sucesso!',
        `Token: ${authentication.accessToken.substring(0, 20)}...`
      );
    } else if (response?.type === 'error') {
      console.error('❌ Google Auth Error:', response.error);
      Alert.alert(
        'Erro no Login',
        `Erro: ${response.error}\n\nVerifique as configurações no Google Cloud Console.`
      );
    }
  }, [response]);

  const handleGoogleLogin = () => {
    console.log('🔍 Tentando login Google...');
    promptAsync();
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 20 }}>
        Teste de Login Google
      </Text>
      
      <Text style={{ marginBottom: 10 }}>
        Client ID: {GOOGLE_AUTH_CONFIG.expoClientId}
      </Text>
      
      <TouchableOpacity
        onPress={handleGoogleLogin}
        style={{
          backgroundColor: '#4285F4',
          padding: 15,
          borderRadius: 8,
          alignItems: 'center',
        }}
        disabled={request === null}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>
          {request === null ? 'Carregando...' : 'Testar Login Google'}
        </Text>
      </TouchableOpacity>
      
      {response && (
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontWeight: 'bold' }}>Status: {response.type}</Text>
          {response.error && (
            <Text style={{ color: 'red' }}>Erro: {response.error}</Text>
          )}
        </View>
      )}
    </View>
  );
} 