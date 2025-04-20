import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function RegisterScreen() {
  const router = useRouter();
  const [cpf, setCpf] = useState('');

  const handleCadastro = () => {
    if (!cpf) {
      Alert.alert('Atenção', 'Por favor, preencha o CPF ou número da carteirinha.');
      return;
    }

    // Redireciona para a etapa 1 do cadastro, passando o CPF como parâmetro
    router.push({
      pathname: '/(auth)/cadastro/etapa1',
      params: { cpf },
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back-circle" size={40} color="#0057FF" />
      </TouchableOpacity>

      <Image source={require('@/assets/images/logo/logo.png')} style={styles.logo} resizeMode="contain" />

      <Text style={styles.title}>Primeiro Acesso</Text>

      <TextInput
        style={styles.input}
        placeholder="CPF ou Carteirinha"
        placeholderTextColor="#999"
        value={cpf}
        onChangeText={setCpf}
      />

      <TouchableOpacity style={styles.registerButton} onPress={handleCadastro}>
        <Text style={styles.registerText}>CADASTRAR</Text>
      </TouchableOpacity>

      <View style={styles.card}>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>Cuide da saúde de quem você ama.</Text>
          <Text style={styles.cardText}>
            Conte com uma rede de cobertura completa, preços que cabem no seu bolso e o melhor: você monta o plano que é ideal para o seu momento.
          </Text>
          <TouchableOpacity style={styles.planButton}>
            <Text style={styles.planButtonText}>Simule seu plano</Text>
          </TouchableOpacity>
        </View>
        <Image
          source={require('@/assets/images/register/imagem-um.png')}
          style={styles.cardImage}
          resizeMode="cover"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    backgroundColor: '#fff',
  },
  backButton: {
    marginBottom: 20,
    paddingTop:40
  },
  logo: {
    height: 120,
    alignSelf: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    color: '#003399',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    borderColor: '#DDD',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  registerButton: {
    backgroundColor: '#f85a5a',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 32,
  },
  registerText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  card: {
    flexDirection: 'row',
    borderColor: '#007bff40',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#003399',
    marginBottom: 4,
  },
  cardText: {
    fontSize: 14,
    color: '#003EA6',
    marginBottom: 8,
  },
  planButton: {
    backgroundColor: '#0057FF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  planButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginLeft: 12,
  },

});
