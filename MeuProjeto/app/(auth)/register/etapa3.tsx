import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Pressable, Image, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

export default function Etapa3() {
  const router = useRouter();
  
  const [cep, setCep] = useState('');
  const [numero, setNumero] = useState('');
  const [rua, setRua] = useState('');
  const [bairro, setBairro] = useState('');
  const [complemento, setComplemento] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');

  // Corrigindo a forma de obter o parâmetro
  const params = useLocalSearchParams();
  const idClienteArmazenado = params?.idCliente ? String(params.idCliente) : 'default-id';
  
  useEffect(() => {
    // Debug: verifique o valor e o tipo de idCliente
    console.log("Dado recebido:", idClienteArmazenado, "Tipo:", typeof idClienteArmazenado);
  }, [idClienteArmazenado]);

  const handleRegister = async () => {
    console.log("🔹 Salvando dados da Etapa 3...");
    try {
      const docRef = await addDoc(collection(db, "t_endereco_preferencia_usuario"), {
        idCliente: idClienteArmazenado,
        cep: cep,
        estado: estado,
        cidade: cidade,
        bairro: bairro,
        rua: rua,
        numero: numero,
        complemento: complemento,
        criadoEm: new Date().toISOString()
      });
  
      console.log("✅ Dados salvos com sucesso! ID do cliente:", idClienteArmazenado);
      Alert.alert("Sucesso", "Dados salvos com sucesso!");
  
      // Leva o ID gerado para a próxima etapa
      router.push({
        pathname: "/register/etapa4",
        params: { idCliente: idClienteArmazenado }
      });
    } catch (error) {
      console.error("❌ Erro ao salvar dados:", error);
      Alert.alert("Erro", "Não foi possível salvar os dados.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Voltar */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={26} color="#0057FF" />
      </TouchableOpacity>
      
      {/* Logo */}
      <Image source={require('@/assets/images/logo/logo.png')} style={styles.logo} resizeMode="contain" />
      
      <Text style={styles.title}>
        Agora informe o seu <Text style={styles.bold}>endereço de preferência</Text>
      </Text>

      <View style={styles.doubleInput}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>CEP</Text>
          <TextInput
            style={styles.input}
            placeholder="00000-000"
            value={cep}
            onChangeText={setCep}
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Número</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 51"
            value={numero}
            onChangeText={setNumero}
            placeholderTextColor="#999"
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Rua</Text>
        <TextInput
          style={styles.input}
          value={rua}
          onChangeText={setRua}
          placeholder="Digite o nome da rua"	
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Bairro</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite seu bairro"
          placeholderTextColor="#999"
          value={bairro}
          onChangeText={setBairro}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Complemento</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: próximo à avenida"
          placeholderTextColor="#999"
          value={complemento}
          onChangeText={setComplemento}
        />
      </View>

      <View style={styles.doubleInput}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Cidade</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: São Paulo"
            placeholderTextColor="#999"
            value={cidade}
            onChangeText={setCidade}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Estado</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: SP"
            placeholderTextColor="#999"
            value={estado}
            onChangeText={setEstado}
          />
        </View>
      </View>

      {/* Botão continuar */}
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Continuar ›››</Text>
      </TouchableOpacity>

      {/* Indicador de progresso */}
      <View style={styles.dotsContainer}>
        <View style={styles.dot} />
        <View style={styles.dot} />
        <View style={[styles.dot, styles.dotActive]} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  backButton: { 
    marginBottom: 10,
    paddingTop: 40 
  },
  logo: { 
    width: 250, 
    height: 120, 
    alignSelf: 'center', 
    marginBottom: 0 
  },
  title: {
    fontSize: 18,
    fontWeight: '400',
    marginBottom: 20,
    color: '#081828',
  },
  bold: {
    fontWeight: 'bold',
    color: '#081828',
  },
  label: {
    fontWeight: 'bold',
    color: '#004aad',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#f9f9f9',  // Alterado de '#0000' para '#f9f9f9'
    color: '#333'
  },
  inputContainer: {
    flex: 1,
    marginBottom: 15,
    marginRight: 10,
    color: '#000'
  },
  doubleInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  button: {
    marginTop: 40,
    backgroundColor: '#007aff',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 14,
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginBottom: 60,
  },
  dotActive: {
    backgroundColor: '#0057FF',
  },
});