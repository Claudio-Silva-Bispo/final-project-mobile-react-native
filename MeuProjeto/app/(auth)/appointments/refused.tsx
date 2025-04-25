
import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, SafeAreaView, Alert } from 'react-native';
import { useIdCliente } from '@/hooks/useIdCliente';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';
import { useLocalSearchParams } from 'expo-router';

export default function RecusaConsultaScreen() {
  const [motivoRecusa, setMotivoRecusa] = useState('');
  const { idCliente, loading: loadingId } = useIdCliente();
  const db = getFirestore();

  // Recuperar os dados da consulta para atualizar ela.
    const { consultaId, data, horario, status } = useLocalSearchParams();
    console.log("O id da consulta recuperado:", consultaId)

  const handleEnviarRecusa = async () => {
    if (!motivoRecusa.trim()) {
      Alert.alert('Erro', 'Por favor, escreva o motivo da recusa.');
      return;
    }

    try {
      await addDoc(collection(db, 't_sugestoes_consultas_recusadas'), {
        idSugestaoConsulta: consultaId,
        motivo: motivoRecusa.trim(),
        idCliente: idCliente,
        criadoEm: Timestamp.now(),
      });

      Alert.alert('Sucesso', 'Motivo enviado com sucesso!');
      setMotivoRecusa('');
      router.back();
    } catch (error) {
      console.error('Erro ao enviar motivo de recusa:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao enviar. Tente novamente.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <View style={styles.backButtonCircle}>
            <Text style={styles.backButtonIcon}>←</Text>
          </View>
        </TouchableOpacity>
      </View>
      
      {/* Main Content */}
      <View style={styles.contentContainer}>
        <Text style={styles.sectionTitle}>Recusa da Consulta</Text>
        
        <Text style={styles.inputLabel}>Digite o motivo da recusa:</Text>
        
        <TextInput
          style={styles.textAreaInput}
          multiline={true}
          numberOfLines={6}
          placeholder="Digite sua mensagem aqui"
          placeholderTextColor="#A0A0A0"
          value={motivoRecusa}
          onChangeText={setMotivoRecusa}
        />
        
        <TouchableOpacity style={styles.sendButton} onPress={handleEnviarRecusa}>
          <Text style={styles.sendButtonText}>ENVIAR</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
    padding: 5,
  },
  backButtonCircle: {
    backgroundColor: '#007BFF',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonIcon: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  calendarButton: {
    padding: 8,
  },
  calendarIcon: {
    fontSize: 24,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0A3D91',
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    color: '#0A3D91',
    marginBottom: 12,
  },
  textAreaInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 16,
    height: 150,
    textAlignVertical: 'top',
    fontSize: 16,
    color: '#333',
  },
  sendButton: {
    backgroundColor: '#007BFF',
    borderRadius: 4,
    padding: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});