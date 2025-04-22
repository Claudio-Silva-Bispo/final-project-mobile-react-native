import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Image,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

export default function Etapa2() {
  const router = useRouter();

  const [cep, setCep] = useState('');
  const [estado, setEstado] = useState('');
  const [cidade, setCidade] = useState('');
  const [bairro, setBairro] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  
 
  const { idCliente } = useLocalSearchParams() || { idCliente: 'default-id' };

  const handleRegister = async () => {
      console.log("🔹 Salvando dados da Etapa 2...");
      try {
        const docRef = await addDoc(collection(db, "t_endereco_residencia_usuario"), {
          idCliente: idCliente,
          cep: cep,
          estado: estado,
          cidade: cidade,
          bairro: bairro,
          rua: rua,
          numero: numero,
          complemento: complemento,
          criadoEm: new Date().toISOString()
        });
    
        console.log("✅ Dados salvos com sucesso! ID do cliente:", docRef.id);
        Alert.alert("Sucesso", "Dados salvos com sucesso!");
    
        // Leva o ID gerado para a próxima etapa
        router.push({
          pathname: "/register/etapa3",
          params: { idCliente: idCliente }
        });
      } catch (error) {
        console.error("❌ Erro ao salvar dados:", error);
        Alert.alert("Erro", "Não foi possível salvar os dados.");
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

      {/* Título */}
      <Text style={styles.title}>
        Agora informe o seu <Text style={{ fontWeight: 'bold' }}>endereço residencial</Text>
      </Text>

      {/* Campos */}
      <View style={styles.row}>
        <View style={styles.inputHalf}>
          <Text style={styles.label}>CEP</Text>
          <TextInput
            style={styles.input}
            placeholder="00000-000"
            placeholderTextColor="#999"
            value={cep}
            onChangeText={setCep}
            autoComplete='postal-code'
          />
        </View>

        <View style={styles.inputHalf}>
          <Text style={styles.label}>Número</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 51"
            placeholderTextColor="#999"
            value={numero}
            onChangeText={setNumero}
          />
        </View>
      </View>

      <Text style={styles.label}>Rua</Text>
      <TextInput
        style={styles.input}
        value={rua}
        onChangeText={setRua}
        autoComplete='street-address'
        placeholder="Ex: Rua das Flores"
        placeholderTextColor="#999"
      />

      <Text style={styles.label}>Bairro</Text>
      <TextInput
        style={styles.input}
        placeholder="Exemplo: Centro"
        placeholderTextColor="#999"
        value={bairro}
        onChangeText={setBairro}
      />

      <Text style={styles.label}>Complemento</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Próximo a Avenida"
        placeholderTextColor="#999"
        value={complemento}
        onChangeText={setComplemento}
      />

      <View style={styles.row}>
        <View style={styles.inputHalf}>
          <Text style={styles.label}>Cidade</Text>
          <TextInput
            style={styles.input}
            placeholder="Exemplo Salvador"
            placeholderTextColor="#999"
            value={cidade}
            onChangeText={setCidade}
          />
        </View>

        <View style={styles.inputHalf}>
          <Text style={styles.label}>Estado</Text>
          <TextInput
            style={styles.input}
            placeholder="Exemplo: BA"
            placeholderTextColor="#999"
            value={estado}
            onChangeText={setEstado}
          />
        </View>
      </View>

      {/* Botão continuar */}
      <TouchableOpacity style={styles.button} onPress={handleRegister}> {/*onPress={() => router.push('/(auth)/register/etapa3')}>*/}
        <Text style={styles.buttonText}>Continuar ›››</Text>
      </TouchableOpacity>

      {/* Indicador de progresso */}
      <View style={styles.dotsContainer}>
        <View style={styles.dot} />
        <View style={[styles.dot, styles.dotActive]} />
        <View style={styles.dot} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    padding: 20, 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  backButton: { 
    marginBottom: 10,
    paddingTop: 40 
  },
  logo: { 
    width: 250, 
    height: 120, 
    alignSelf: 'center', 
    marginBottom: 10 
  },
  title: { 
    fontSize: 20, 
    textAlign: 'center', 
    marginBottom: 20, 
    color: '#081828' 
  },
  label: { 
    marginBottom: 4, 
    color: '#081828', 
    fontWeight: '500' 
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  inputHalf: {
    flex: 1,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#007aff',
    padding: 14,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    gap: 10,
  },
  buttonText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 16 
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
  },
  dotActive: {
    backgroundColor: '#0057FF',
  },
});
