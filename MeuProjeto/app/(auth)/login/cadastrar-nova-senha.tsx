import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { db } from '../../../firebaseConfig';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';


export default function CadastrarNovaSenhaScreen() {
    const { idUsuario } = useLocalSearchParams();
    const idCliente = String(idUsuario); // converter
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');

    useEffect(() => {
      // Debug: verifique o valor e o tipo de idCliente
      console.log("ID recebido:", idCliente, "Tipo:", typeof idCliente);
    }, [idCliente]);
    
    const validarSenha = (senha: string) => {
        const regex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
        return regex.test(senha);
    };

    const handleContinuar = async () => {

        console.log("🔹 Tentando confirmar senhas inseridas...");
        if (senha !== confirmarSenha) {
            Alert.alert('Erro', 'As senhas não coincidem.');
            return;
        }
        
        if (!validarSenha(senha)) {
            Alert.alert('Erro', 'A senha não atende aos requisitos.');
            return;
        }

        try {
          // Cria a referência ao documento do usuário na coleção t_seguranca_usuario usando o idCliente
          if (typeof idCliente !== 'string') {
              throw new Error('Invalid idCliente: Expected a string.');
          }

          const segCollection = collection(db, "t_seguranca_usuario");

          // Cria uma query para buscar onde o campo idCliente é igual ao valor recebido
          const q = query(segCollection, where("idCliente", "==", idCliente));

          const querySnapshot = await getDocs(q);
          
          if (querySnapshot.empty) {
            Alert.alert("Erro", "Usuário não encontrado na tabela de segurança. Verifique os dados.");
            return;
          }
          
          // Pega o primeiro documento retornado (caso exista apenas um)
          const segDocRef = querySnapshot.docs[0].ref;
          
          // Atualiza o campo "senha" no documento encontrado
          await updateDoc(segDocRef, { senha });
          
          console.log("🔹 Alteração de senha realizada com sucesso!");
          Alert.alert("Sucesso", "Senha alterada com sucesso!");
          
          // Encaminha para a tela de sucesso ou para o Login
          router.push('/login/success');
        } catch (error) {
          console.error("Erro na atualização da senha:", error);
          Alert.alert("Erro", "Houve um erro ao atualizar a senha. Tente novamente.");
        }
        
        /*
        console.log("🔹 Alteração de senha realizada com sucesso!");
        // Encaminhar para o Login
        router.push('/login/success'); 
        */
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
        <Text style={styles.subtitle}>cadastrar uma nova <Text style={styles.bold}>senha</Text></Text>

        <View style={styles.requisitos}>
            <Text style={styles.reqTitle}>Para sua segurança, por favor, crie uma nova senha seguindo as diretrizes abaixo:</Text>
            <Text style={styles.req}>• Deve conter no mínimo 8 caracteres</Text>
            <Text style={styles.req}>• Pelo menos uma letra maiúscula (A-Z)</Text>
            <Text style={styles.req}>• Pelo menos uma letra minúscula (a-z)</Text>
            <Text style={styles.req}>• Pelo menos um número (0-9) (a-z)</Text>
            <Text style={styles.req}>• Pelo menos um caractere especial (!@#$%^&*) (a-z)</Text>
        </View>

        <TextInput
            secureTextEntry
            style={styles.input}
            placeholder='Nova senha'
            placeholderTextColor={'#999'}
            value={senha}
            onChangeText={setSenha}
        />

        <TextInput
            secureTextEntry
            style={styles.input}
            placeholder='Confirme sua senha'
            placeholderTextColor={'#999'}
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
        />

        

        <TouchableOpacity style={styles.button} onPress={handleContinuar}>
            <Text style={styles.buttonText}>ENVIAR</Text>
        </TouchableOpacity>

        {/* Indicador de progresso */}
        <View style={styles.dots}>
            <View style={styles.dot} />
            <View style={styles.dotActive} />
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
    fontWeight: 'regular',
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
