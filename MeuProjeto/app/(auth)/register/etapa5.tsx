import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { router } from 'expo-router';

export default function CadastroFinalizadoScreen() {

  const handleProsseguir = () => {
    router.push('/login/login'); 
  };

  return (
    <View style={styles.container}>
      
      {/* Logo */}
      <Image source={require('@/assets/images/logo/logo.png')} style={styles.logo} resizeMode="contain" />

      <Text style={styles.title}>
        Seu cadastro foi finalizado{'\n'}
        com <Text style={styles.success}>sucesso!</Text>
      </Text>

      <Text style={styles.description}>
        Agora você pode acessar todas as{'\n'}
        funcionalidades do aplicativo.{'\n'}
        Aproveite a experiência completa!
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleProsseguir}>
        <Text style={styles.buttonText}>Prosseguir   ›››</Text>
      </TouchableOpacity>

      <Image
        source={require('@/assets/images/register/imagem-dois.png')}
        style={styles.image}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: { 
    width: 250, 
    height: 120, 
    alignSelf: 'center', 
    marginBottom: 0 
  },
  title: {
    fontSize: 20,
    color: '#081828',
    textAlign: 'center',
    marginBottom: 16,
  },
  success: {
    color: '#0070f0',
    fontWeight: 'bold',
  },
  description: {
    textAlign: 'center',
    fontSize: 15,
    color: '#333',
    marginBottom: 32,
  },
  button: {
    backgroundColor: '#0070f0',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
    marginBottom: 24,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  image: {
    width: '100%',
    height: 350,
  },
});
