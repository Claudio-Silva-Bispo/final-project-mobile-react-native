import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView, 
  StyleSheet, 
  Alert 
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useIdCliente } from '@/hooks/useIdCliente';
import { getFirestore, collection, doc, updateDoc, addDoc, Timestamp, query, where, getDocs } from 'firebase/firestore';
import firebase from '../../../firebaseConfig';

export default function AceiteConsultaScreen() {
  const { idCliente } = useIdCliente();
  const db = getFirestore(firebase);
  const [consulta, setConsulta] = useState<any | null>(null);

  // Recupera os dados da consulta passados via rota
  const { 
    consultaId,   // Id do documento da sugestão que será atualizado
    data,         // Data da consulta (ex: "01/04/2025")
    horario,      // Horário (ex: "08:00")
    clinicaId,    // Id da clínica, para depois buscar mais dados, se necessário
    turno,        // Turno (ex: "Tarde")
    dentista,     // Nome do dentista (ex: "Dra. Leticia Almeida")
    especialidade // Especialidade (ex: "Limpeza")
  } = useLocalSearchParams();

  const handleAceitarConsulta = async () => {
    if (!idCliente) {
      Alert.alert('Erro', 'Cliente não identificado.');
      return;
    }
    if (!consultaId) {
      Alert.alert('Erro', 'Consulta não identificada.');
      return;
    }

    try {

        console.log('Aceitando consulta...');
        console.log('Dados da consulta:', consultaId);

        const sugestaoRef = collection(db, 't_sugestao_consulta_cliente');
        const qSugestao = query(sugestaoRef, where('status', '==', 'pendente'), where('idCliente', '==', idCliente));
        const sugestaoSnapshot = await getDocs(qSugestao);

        // Precisa alterar o status da sugestão para "aceita"
        sugestaoSnapshot.forEach(async (docSnap) => {
          const docRef = doc(db, 't_sugestao_consulta_cliente', docSnap.id);
          await updateDoc(docRef, { status: "aceita" });
        });
      
        // 2. Cria novo registro de consulta na coleção t_consulta
        await addDoc(collection(db, 't_consultas'), {
            idSugestaoConsulta: consultaId,
            idCliente: idCliente,
            criadoEm: Timestamp.now(),
        });

        Alert.alert('Sucesso', 'Consulta aceita com sucesso!');
        console.log('Consulta aceita!');
        router.back();
    } catch (error) {
      console.error('Erro ao aceitar consulta:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao aceitar a consulta. Tente novamente.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Aceitar Consulta</Text>
      </View>

      {/* Conteúdo */}
      <View style={styles.content}>
        <Text style={styles.title}>Detalhes da Consulta</Text>
        
        <View style={styles.detailRow}>
          <Text style={styles.label}>Dentista:</Text>
          <Text style={styles.value}>{dentista}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Especialidade:</Text>
          <Text style={styles.value}>{especialidade}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Data:</Text>
          <Text style={styles.value}>{data}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Horário:</Text>
          <Text style={styles.value}>{horario}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Turno:</Text>
          <Text style={styles.value}>{turno}</Text>
        </View>
        
        {/* Pode incluir mais informações (ex: dados da clínica, etc.) se necessário */}

        <TouchableOpacity style={styles.acceptButton} onPress={handleAceitarConsulta}>
          <Text style={styles.acceptButtonText}>ACEITAR CONSULTA</Text>
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
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
    marginRight: 10,
  },
  backButtonText: {
    fontSize: 18,
    color: '#007BFF',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    width: 100,
    color: '#333',
  },
  value: {
    fontSize: 16,
    color: '#555',
    flexShrink: 1,
  },
  acceptButton: {
    backgroundColor: '#007BFF',
    marginTop: 30,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
