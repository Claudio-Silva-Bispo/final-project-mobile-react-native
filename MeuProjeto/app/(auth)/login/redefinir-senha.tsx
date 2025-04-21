import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';

export default function RedefinirSenhaScreen() {
  const [cpf, setCPF] = useState('');
  const [confirmarCPF, setConfirmarCPF] = useState('');
  const [confirmarDataNascimento, setConfirmarDataNascimento] = useState('');

  const validarCPF = (cpf: string): boolean => {
    // Confirmar CPF no banco
    // Example validation logic
    return cpf.length === 11; // Replace with actual validation logic
  };

  const handleContinuar = () => {
    /*if (cpf !== confirmarCPF  ) {
      Alert.alert('Erro', 'Os dados não conferem com o sistema.');
      return;
    }
  
    if (!validarCPF(cpf)) {
      Alert.alert('Erro', 'Os dados não conferem com o sistema.');
      return;
    }
    */
    // Rota da próxima etapa (etapa 5)
    router.push('/login/cadastrar-nova-senha'); 
  };

  return (
    <View style={styles.container}>

      {/* Voltar */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={26} color="#0057FF" />
      </TouchableOpacity>
      
      {/* Logo */}
      <Image source={require('@/assets/images/logo/logo.png')} style={styles.logo} resizeMode="contain" />

      <Text style={styles.title}>Chegou a hora de</Text>
      <Text style={styles.subtitle}>confirmar seus <Text style={styles.bold}>dados</Text></Text>

      <TextInput
        secureTextEntry
        style={styles.input}
        placeholder='CPF ou Carteirinha'
        value={cpf}
        onChangeText={setCPF}
      />

      <Text style={styles.label}></Text>
      <TextInput
        secureTextEntry
        style={styles.input}
        placeholder='Data de Nascimento'
        value={confirmarDataNascimento}
        onChangeText={setConfirmarDataNascimento}
      />

      <View style={styles.requisitos}>
        <Text style={styles.reqTitle}>Atenção:</Text>
        <Text style={styles.req}>• Os dados devem conferir no cadastro</Text>
        <Text style={styles.req}>• Modelo do seu nascimento: 10/05/1993</Text>
        <Text style={styles.req}>• Confira seus dados</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleContinuar}>
        <Text style={styles.buttonText}>RECUPERAR SENHA   ›››</Text>
      </TouchableOpacity>

      {/* Indicador de progresso */}
      <View style={styles.dots}>
        <View style={styles.dotActive} />
        <View style={styles.dot} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
    justifyContent: 'center',
  },
  backButton: { 
    marginBottom: 10,
    paddingTop: 20 
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
  },
  subtitle: {
    fontSize: 20,
    color: '#081828',
    marginBottom: 24,
  },
  bold: {
    fontWeight: 'bold',
    color: '#081828',
  },
  label: {
    fontSize: 14,
    color: '#081828',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 5,
  },
  requisitos: {
    marginBottom: 24,
  },
  reqTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    paddingTop: 20,
  },
  req: {
    fontSize: 13,
    color: '#333',
    marginBottom: 2,
  },
  button: {
    backgroundColor: '#007aff',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    backgroundColor: '#ccc',
    borderRadius: 5,
    marginHorizontal: 4,
  },
  dotActive: {
    width: 10,
    height: 10,
    backgroundColor: '#0070f0',
    borderRadius: 5,
    marginHorizontal: 4,
  },
});
