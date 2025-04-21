import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {  db } from '@/firebaseConfig';
import { query, where, getDocs, collection } from 'firebase/firestore';

export default function RegisterScreen() {
  const router = useRouter();
  const [data, setData] = useState('');

  const handleCadastro = async () => {
    if (!data) {
      Alert.alert('Atenção', 'Por favor, preencha o Email, CPF ou número da carteirinha.');
      return;
    }
  
    console.log("🔹 Verificando e-mail existente...");
    try {
      const usuariosRef = collection(db, "t_usuario");
      const q = query(usuariosRef, where("email", "==", data));
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        Alert.alert("Atenção", "Este e-mail já está cadastrado. Use outro e-mail ou faça login.");
        return;
      }
  
      // Redireciona para a etapa 1 do cadastro, passando o email como parâmetro
      router.push({
        pathname: '/(auth)/register/etapa1',
        params: { data },
      });
  
    } catch (error) {
      console.error("Erro ao verificar e-mail:", error);
      Alert.alert("Erro", "Não foi possível verificar o e-mail. Tente novamente.");
    }
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
        placeholder="Email"
        placeholderTextColor="#999"
        value={data}
        onChangeText={setData}
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
