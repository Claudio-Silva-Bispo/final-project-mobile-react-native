import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Image,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Etapa1() {
  const router = useRouter();
  const { cpf } = useLocalSearchParams();
  const [genero, setGenero] = useState('Feminino'); 

  return (
    <View style={styles.container}>
      {/* Voltar */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={32} color="#0057FF" />
      </TouchableOpacity>

      {/* Logo */}
      <Image source={require('@/assets/images/logo/logo.png')} style={styles.logo} resizeMode="contain" />

      {/* Título */}
      <Text style={styles.title}>
        Vamos iniciar o seu <Text style={{ fontWeight: 'bold' }}>cadastro?</Text>
      </Text>

      {/* Nome */}
      <Text style={styles.label}>Nome Completo</Text>
      <TextInput style={styles.input} placeholder="Ex. João da Silva" placeholderTextColor="#999" />

      {/* Telefone */}
      <Text style={styles.label}>Telefone</Text>
      <TextInput style={styles.input} placeholder="Ex: (11)99999-9999" placeholderTextColor="#999" />

      {/* E-mail */}
      <Text style={styles.label}>E-mail</Text>
      <TextInput style={styles.input} placeholder="Ex: joao@dominio.com.br" placeholderTextColor="#999" />

      {/* CPF */}
      <Text style={styles.label}>CPF</Text>
      <TextInput style={styles.input} placeholder="Ex: 999.999.999-99" placeholderTextColor="#999" value={cpf?.toString()} />

      {/* Gênero */}
      <Text style={styles.label}>Gênero</Text>
      <View style={styles.genderContainer}>
        {['Masculino', 'Feminino', 'Outro'].map((option) => (
          <TouchableOpacity
            key={option}
            style={[styles.genderButton, genero === option && styles.genderButtonSelected]}
            onPress={() => setGenero(option)}
          >
            <Text style={[styles.genderText, genero === option && styles.genderTextSelected]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Data de Nascimento */}
      <Text style={styles.label}>Data de Nascimento</Text>
      <TextInput style={styles.input} placeholder="Ex: 01/01/1990" placeholderTextColor="#999" />

      {/* Botão continuar */}
      <TouchableOpacity style={styles.button} onPress={() => router.push('/(auth)/register/etapa2')}>
        <Text style={styles.buttonText}>Continuar ›››</Text>
      </TouchableOpacity>

      {/* Indicador de progresso */}
      <View style={styles.dotsContainer}>
        <View style={[styles.dot, styles.dotActive]} />
        <View style={styles.dot} />
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
    backgroundColor: '#fff' },
  backButton: { 
    marginBottom: 10,
    paddingTop:50
   },
  logo: { 
    width: 250, 
    height: 60, 
    alignSelf: 'center', 
    marginBottom: 10 },
  title: { 
    fontSize: 20, 
    textAlign: 'center', 
    marginBottom: 20, 
    color: '#081828' },
  label: { 
    marginBottom: 4, 
    color: '#081828', 
    fontWeight: '500' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  genderButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  genderButtonSelected: {
    backgroundColor: '#0057FF',
    borderColor: '#0057FF',
  },
  genderText: {
    color: '#081828',
    fontWeight: '500',
  },
  genderTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
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
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
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
