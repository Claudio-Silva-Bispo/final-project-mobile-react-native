import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  Pressable,
  Alert,
} from 'react-native';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../../firebaseConfig"; // Instalar npm install firebase
import { doc, getDoc } from "firebase/firestore";

const LoginScreen = () => {

    const [saveData, setSaveData] = useState(false);
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    const handleLogin = async () => {
      try {
        console.log("🔹 Tentando fazer login...");
  
        const userCredential = await signInWithEmailAndPassword(auth, email, senha); 
        const user = userCredential.user;
  
        const userDocRef = doc(db, "t_usuarios", user.uid);
        const userDoc = await getDoc(userDocRef);
  
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const perfil = userData?.perfil;
  
          if (perfil === "comum") {
            console.log("✅ Login bem-sucedido!");
            Alert.alert("Sucesso", "Login realizado com sucesso!");
  
            // Navega para a Sessão Restrita de clientes
            router.push("/(auth)/main/inicio");
          } else {
            console.error("❌ Perfil inválido");
            Alert.alert("Erro", "Você não tem permissão para acessar esta área.");
          }
        } else {
          console.error("❌ Usuário não encontrado no Firestore");
          Alert.alert("Erro", "Usuário não encontrado.");
        }
  
      } catch (error: any) {
        console.error("❌ Erro ao fazer login:", error.message);
        Alert.alert("Erro", "Email ou senha incorretos.");
      }
    };

    const handleForgotPassword = () => {
        router.push('/(auth)/login/redefinir-senha');
    };

    const handleAccess = () => {
      router.push('/(auth)/main/inicio');
    };
    
    return (
        <SafeAreaView style={styles.container}>
        {/* Voltar */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={32} color="#fff" />
        </TouchableOpacity>

        {/* Logo */}
        <Image
            source={require('@/assets/images/logo/logo-branco.png')}
            style={styles.logo}
            resizeMode="contain"
        />

        {/* Campos de login */}
        <View style={styles.inputContainer}>
            <TextInput
            style={styles.input}
            placeholder="Email, CPF ou Carteirinha"
            placeholderTextColor="#555"
            />

            <TextInput
            style={styles.input}
            placeholder="Senha"
            placeholderTextColor="#555"
            secureTextEntry={true}
            />
        </View>

        {/* Salvar dados e Esqueci a senha */}
        <View style={styles.optionsRow}>
            {/* Salvar dados */}
            <Pressable
                onPress={() => setSaveData(!saveData)}
                style={styles.checkboxContainer}
            >
                <View style={styles.checkbox}>
                {saveData && <Ionicons name="checkmark" size={16} color="#fff" />}
                </View>
            <Text style={styles.checkboxLabel}>Lembre-se de mim</Text>
            </Pressable>

            {/* Esqueci a senha */}
            <TouchableOpacity onPress={handleForgotPassword}>
                <Text style={styles.forgotPasswordText}>Esqueci minha senha</Text>
            </TouchableOpacity>
            </View>


        {/* Botão de login */}
        <TouchableOpacity style={styles.loginButton}>
            <Text style={styles.loginButtonText} onPress={handleLogin}>ACESSAR</Text>
        </TouchableOpacity>

        {/* Seção com imagem de fundo no card */}
        <View style={styles.card}>
            {/* Imagem de fundo */}
            <Image
            source={require('@/assets/images/login/imagem-um.png')}
            style={styles.cardImage}
            />

            {/* Conteúdo sobre a imagem */}
            <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Ainda não é cliente?</Text>
            <Text style={styles.cardText}>
                Clique abaixo para adquirir um plano
            </Text>
            <TouchableOpacity style={styles.planButton}>
                <Text style={styles.planButtonText}>QUERO COMPRAR</Text>
            </TouchableOpacity>
            </View>
        </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#003EA6',
    alignItems: 'center',
    paddingTop: 60,
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 80,
    left: 20,
    zIndex: 10,
  },
  logo: {
    width: 300,
    height: 150,
    alignSelf: 'center',
    marginBottom: 10,
    paddingTop: 60,
  },
  inputContainer: {
    marginBottom: 30,
    paddingTop: 40,
    width: '90%',
  },
  input: {
    height: 50,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    color: '#00000',
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
    gap: 30,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    backgroundColor: '#fff',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxLabel: {
    color: '#fff',
    fontSize: 14,
  },
  forgotPasswordText: {
    color: '#fff',
    textDecorationLine: 'underline',
    fontSize: 14,

  },
  loginButton: {
    backgroundColor: '#0066FF',
    height: 50,
    width: '90%',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  card: {
    width: '90%',
    height: 220,
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 20,
    marginBottom: 20,
    position: 'relative',
    justifyContent: 'flex-end',
  },
  cardImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 12,
    zIndex: 0,
  },
  cardContent: {
    backgroundColor: 'transparent',
    padding: 16,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    zIndex: 1,
    maxWidth: '70%'
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#003399',
    marginBottom: 4,
  },
  cardText: {
    fontSize: 20,
    color: '#003EA6',
    marginBottom: 20,
  },
  planButton: {
    backgroundColor: '#FF6052',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-start',
    width: '100%'
  },
  planButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center'
  },
});

export default LoginScreen;
