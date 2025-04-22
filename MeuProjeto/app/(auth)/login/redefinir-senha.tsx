import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { db } from "../../../firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useLocalSearchParams } from 'expo-router';


export default function RedefinirSenhaScreen() {
  const [cpf, setCPF] = useState('');
  const [confirmarDataNascimento, setConfirmarDataNascimento] = useState('');

  const handleContinuar = async () => {

    console.log("🔹 Tentando conferir dados inseridos pelo usuário...");

    if (!cpf || !confirmarDataNascimento) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }
  
    try {
      const usuariosRef = collection(db, "t_usuario");
  
      // Tenta encontrar por CPF OU por Email
      const consultaPorCpf = query(usuariosRef, where("cpf", "==", cpf));
      const consultaPorEmail = query(usuariosRef, where("email", "==", cpf));
  
      const [resCpf, resEmail] = await Promise.all([
        getDocs(consultaPorCpf),
        getDocs(consultaPorEmail)
      ]);
  
      const documentoEncontrado = resCpf.docs[0] || resEmail.docs[0];
  
      if (!documentoEncontrado) {
        Alert.alert("Erro", "Usuário não encontrado. Verifique os dados.");
        return;
      }
  
      const dadosUsuario = documentoEncontrado.data();
      const nascimentoSalvo = dadosUsuario?.dataNascimento;
      const idCliente = documentoEncontrado.id;
  
      // Aqui comparamos a data de nascimento
      if (nascimentoSalvo !== confirmarDataNascimento) {
        Alert.alert("Erro", "Data de nascimento incorreta.");
        return;
      }
      
      console.log("🔹 Dados existem no banco e o idCliente é: ", idCliente);

      console.log("🔹 Dados existem no banco...");
      // Tudo certo, vai pra próxima tela
      //router.push('/login/cadastrar-nova-senha');
      router.push({
        pathname: '/(auth)/login/cadastrar-nova-senha',
        params: { idUsuario: idCliente },
      });
  
    } catch (error) {
      console.error("Erro na verificação:", error);
      Alert.alert("Erro", "Houve um erro ao verificar os dados. Tente novamente.");
    }
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
        //secureTextEntry
        style={styles.input}
        placeholder='Email ou CPF'
        placeholderTextColor={'#999'}
        value={cpf}
        onChangeText={setCPF}
      />

      <Text style={styles.label}></Text>
      <TextInput
        //secureTextEntry
        style={styles.input}
        placeholder='Data de Nascimento 01/01/2025'
        placeholderTextColor={'#999'}
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
