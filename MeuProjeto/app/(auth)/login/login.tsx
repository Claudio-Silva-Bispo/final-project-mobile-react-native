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
import { auth, db } from "../../../firebaseConfig";
import { collection, documentId, getDocs, query, where } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthContext } from '@/components/AuthProvider';

const LoginScreen = () => {
  const [saveData, setSaveData] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

   // Estados para armazenar os IDs encontrados no Firestore
   const [idAutenticacao, setIdAutenticacao] = useState(null);
   const [idCliente, setIdCliente] = useState(null);
   const [userName, setUserName] = useState<string | null>(null);

   // Contexto de autenticação
  const { addUser, signIn: contextSignIn, isSignedIn } = useAuthContext();
  
  const handleLogin = async () => {
    try {
      console.log("🔹 Tentando fazer login...");
    
      // Tenta autenticar o usuário com Firebase Authentication usando email e senha
      const userCredential = await signInWithEmailAndPassword(auth, email, senha); 
      const user = userCredential.user;
      
      console.log("Usuário autenticado:", user);

      // Agora que o usuário foi autenticado, mostramos o email recebido
      console.log("Email recebido para consulta no Firestore:", email);
    
      // Agora que o usuário foi autenticado, buscamos no Firestore pela correspondência do email
      const userQuery = query(
        collection(db, "t_seguranca_usuario"),
        where("email", "==", email) // Verificamos se o email existe no Firestore
      );
    
      const querySnapshot = await getDocs(userQuery);
      
      // Verifica se a consulta retornou algum documento
      if (querySnapshot.empty) {
        console.log("Nenhum documento encontrado para o email:", email);
      } else {
        console.log("Documento(s) encontrado(s) para o email:", email);
        querySnapshot.forEach((doc) => {
          console.log("Dados do documento:", doc.data());
        });
      }

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();

       // Extrai os IDs da consulta
       const idClienteFromDoc = userData?.idCliente;
       const idAutenticacaoFromDoc = userData?.idAutenticacao;
  
        // Armazena os IDs nos estados para uso posterior
        setIdCliente(idClienteFromDoc);
        setIdAutenticacao(idAutenticacaoFromDoc);

        await AsyncStorage.setItem('idCliente', idClienteFromDoc);
        await AsyncStorage.setItem('idAutentication', idAutenticacaoFromDoc);

        console.log("IDs armazenados em memória:");
        console.log("idCliente:", idClienteFromDoc);
        console.log("idAutenticacao:", idAutenticacaoFromDoc);
        

        // Agora, vamos buscar o nome na tabela 't_usuario' com o idCliente
        const usuarioQuery = query(
          collection(db, "t_usuario"),
          where(documentId(), "==", idClienteFromDoc)
        );

        const usuarioSnapshot = await getDocs(usuarioQuery);

        if (!usuarioSnapshot.empty) {
          usuarioSnapshot.forEach((doc) => {
            const usuarioData = doc.data();
            const nome = usuarioData?.nome;
            console.log("Nome do usuário:", nome);
            setUserName(nome);

            // Adiciona o usuário ao contexto para persistência
            addUser({
              name: nome,
              email: email,
              password: senha
            });
            
            // Autentica através do contexto
            contextSignIn(email, senha);

          });

        } else {
          console.log("Usuário não encontrado na tabela 't_usuario'.");
        }

        // comparar se o idAutenticacao do Firestore corresponde ao uid do usuário autenticado
        if (user.uid === idAutenticacaoFromDoc) {
          console.log("✅ Login bem-sucedido!");
          //Alert.alert("Sucesso", "Login realizado com sucesso!");
  
          // Navega para a sessão restrita do cliente
          router.push("/(auth)/main/inicio");
        } else {
          console.error("❌ Perfil inválido ou os IDs não correspondem.");
          Alert.alert("Erro", "Você não tem permissão para acessar esta área.");
        }
      } else {
        console.error("❌ Usuário não encontrado no Firestore");
        Alert.alert("Erro", "Email ou senha incorretos.");
      }
  
    } catch (error: any) {
      console.error("❌ Erro ao fazer login:", error.message);
      Alert.alert("Erro", "Email ou senha incorretos.");
    }
  };
  
  const handleForgotPassword = () => {
    router.push('/(auth)/login/redefinir-senha');
  };

  // Função para lidar com o clique no botão de testes
  const handleTests = () => {
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
          placeholder="Digite seu Email"
          placeholderTextColor="#555"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#555"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />
      </View>

      {/* Salvar dados e Esqueci a senha */}
      <View style={styles.optionsRow}>
        <Pressable onPress={() => setSaveData(!saveData)} style={styles.checkboxContainer}>
          <View style={styles.checkbox}>
            {saveData && <Ionicons name="checkmark" size={16} color="#fff" />}
          </View>
          <Text style={styles.checkboxLabel}>Lembre-se de mim</Text>
        </Pressable>

        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.forgotPasswordText}>Esqueci minha senha</Text>
        </TouchableOpacity>
      </View>

      {/* Botão de login */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>ACESSAR</Text>
      </TouchableOpacity>

      {/* Card inferior */}
      <View style={styles.card}>
        <Image
          source={require('@/assets/images/login/imagem-um.png')}
          style={styles.cardImage}
        />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>Ainda não é cliente?</Text>
          <Text style={styles.cardText}>Clique abaixo para adquirir um plano</Text>
          <TouchableOpacity style={styles.planButton} onPress={() => router.push('/(auth)/config/productPurchaseScreen')}>
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
    color: '#000',
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
    maxWidth: '70%',
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
    width: '100%',
  },
  planButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default LoginScreen;


