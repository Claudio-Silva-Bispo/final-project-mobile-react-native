import { db } from '@/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { addDoc, collection, doc, getDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { query, where, getDocs } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebaseConfig"; 

export default function SenhaScreen() {
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const { idCliente } = useLocalSearchParams() || { idCliente: 'default-id' };

  // Coletar o email que foi salvo no banco para criar a atutenticação
  const buscarEmailPorId = async (idCliente: string) => {
    const ref = doc(db, "t_usuario", idCliente);
    const snapshot = await getDoc(ref);
  
    if (snapshot.exists()) {
      return snapshot.data().email;
    } else {
      throw new Error("Email não encontrado para o ID informado.");
    }
  };

  const validarSenha = (senha: string) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    return regex.test(senha);
  };

  const handleRegister = async () => {
    if (!validarSenha(senha)) {
      Alert.alert("Erro", "A senha não atende aos critérios de segurança.");
      return;
    }
  
    if (senha !== confirmarSenha) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }
  
    try {
      console.log("🔍 Buscando e-mail...");
      const email = await buscarEmailPorId(Array.isArray(idCliente) ? idCliente[0] : idCliente);
  
      console.log("🔐 Criando usuário no Firebase Auth...");
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const uid = userCredential.user.uid;
  
      console.log("💾 Salvando dados da Etapa 4...");
      await addDoc(collection(db, "t_seguranca_usuario"), {
        idCliente,
        email: email,
        senha: senha,
        idAutenticacao: uid,
        criadoEm: new Date().toISOString()
      });
  
      //Alert.alert("Sucesso", "Conta criada com sucesso!");
  
      router.push({
        pathname: "/register/etapa5",
        params: { idCliente }
      });
    } catch (error: any) {
      console.error("❌ Erro ao registrar:", error);
      Alert.alert("Erro", error.message || "Ocorreu um erro.");
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
      <Text style={styles.subtitle}>escolher a sua <Text style={styles.bold}>senha</Text></Text>

      <Text style={styles.label}>Senha</Text>
      <TextInput
        secureTextEntry
        style={styles.input}
        value={senha}
        onChangeText={setSenha}
      />

      <Text style={styles.label}>Confirmar Senha</Text>
      <TextInput
        secureTextEntry
        style={styles.input}
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
      />

      <View style={styles.requisitos}>
        <Text style={styles.reqTitle}>Sua senha deve conter:</Text>
        <Text style={styles.req}>• Deve conter no mínimo 8 caracteres</Text>
        <Text style={styles.req}>• Pelo menos uma letra maiúscula (A-Z)</Text>
        <Text style={styles.req}>• Pelo menos uma letra minúscula (a-z)</Text>
        <Text style={styles.req}>• Pelo menos um número (0-9)</Text>
        <Text style={styles.req}>• Pelo menos um caractere especial (!@#$%^&*)</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Continuar   ›››</Text>
      </TouchableOpacity>

      {/* Indicador de progresso */}
      <View style={styles.dots}>
        <View style={styles.dot} />
        <View style={styles.dot} />
        <View style={styles.dot} />
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
    marginBottom: 4,
    color: '#081828',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  requisitos: {
    marginBottom: 24,
  },
  reqTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
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
