import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';

export default function CadastrarNovaSenhaScreen() {
  const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');

    const validarSenha = (senha: string) => {
        const regex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
        return regex.test(senha);
    };

    const handleContinuar = () => {
        if (senha !== confirmarSenha) {
            Alert.alert('Erro', 'As senhas não coincidem.');
            return;
        }
        
        if (!validarSenha(senha)) {
            Alert.alert('Erro', 'A senha não atende aos requisitos.');
            return;
        }
        
        // Rota da próxima etapa (etapa 5)
        router.push('/cadastro/etapa5'); 
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
            value={senha}
            onChangeText={setSenha}
        />

        <TextInput
            secureTextEntry
            style={styles.input}
            placeholder='Confirme sua senha'
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
