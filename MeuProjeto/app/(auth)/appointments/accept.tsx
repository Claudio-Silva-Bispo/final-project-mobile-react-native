import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView, 
  StyleSheet, 
  Alert 
} from 'react-native';
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { useIdCliente } from '@/hooks/useIdCliente';
import { getFirestore, collection, doc, updateDoc, addDoc, Timestamp, query, where, getDocs, getDoc } from 'firebase/firestore';
import firebase from '../../../firebaseConfig';

export default function AceiteConsultaScreen() {
  const { idCliente } = useIdCliente();
  const db = getFirestore(firebase);
  const [clinica, setClinica] = useState<any | null>(null);

  // Recupera os dados da consulta passados via rota
  const { 
    consultaId,  
    data,         
    horario,     
    turno,       
    dentista,     
    especialidade,
    clinicaId,
    clienteId
  } = useLocalSearchParams();

  // Função para carregar os dados da clínica
  const carregarDadosClinica = async () => {
    try {

      console.log('Consultando os dados da clinica...');
      const id = idCliente === null ? clienteId : idCliente;
      console.log('idCliente para pesquisa dos dados...', id);

      // 1. Procurar a tabela para inserir o aceite do cliente
      const sugestaoRef = collection(db, 't_sugestao_consulta_clinica');
      const qSugestao = query(sugestaoRef, where('status', '==', 'pendente'), where('idCliente', '==', id));
      const sugestaoSnapshot = await getDocs(qSugestao); 

      if (sugestaoSnapshot.empty) {
        throw new Error('Nenhuma sugestão encontrada para o cliente.');
      }
      
      // Pegando o primeiro documento da consulta
      const sugestaoDoc = sugestaoSnapshot.docs[0];
      const sugestaoData = sugestaoDoc.data();

      // Extraindo o clinicaId dos dados da sugestão
      const { clinicaId } = sugestaoData;
      console.log('idClinica para pesquisa dos dados...', clinicaId);

      if (typeof clinicaId !== 'string') {
        throw new Error('Invalid clinicaId: Expected a string.');
      }

      // 2. Buscar os dados da clínica na coleção t_clinica usando o clinicaId extraído
      const clinicaRef = doc(db, 't_clinica', clinicaId);
      const clinicaSnap = await getDoc(clinicaRef);
      const clinicaData = clinicaSnap.exists() ? clinicaSnap.data() : null;
      setClinica(clinicaData);

      console.log('IdClinica recuperado:', clinicaId);

      if (!clinicaId || typeof clinicaId !== 'string') {
        console.log('ID da clínica não disponível ainda');
        return;
      }

    } catch (error) {
      console.error('Erro ao carregar dados da clínica:', error);
    }
  };

  // Carregar os dados quando a tela for focada ou quando clinicaId mudar
  useFocusEffect(
    useCallback(() => {
      carregarDadosClinica();
      return () => {};
    }, [clinicaId])
  );


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

        // 1. Procurar a tabela para inserir o aceite do cliente
        const sugestaoRef = collection(db, 't_sugestao_consulta_cliente');
        const qSugestao = query(sugestaoRef, where('status', '==', 'aceita'), where('idCliente', '==', idCliente));
        const sugestaoSnapshot = await getDocs(qSugestao); 

        if (sugestaoSnapshot.empty) {
          throw new Error('Nenhuma sugestão encontrada para o cliente.');
        }
        
        // Pegando o primeiro documento da consulta
        const sugestaoDoc = sugestaoSnapshot.docs[0];
        const sugestaoData = sugestaoDoc.data();

        // Precisa alterar o status da sugestão para "aceita"
        sugestaoSnapshot.forEach(async (docSnap) => {
          const docRef = doc(db, 't_sugestao_consulta_cliente', docSnap.id);
          await updateDoc(docRef, { status: "aceita" });
        });

        // Precisa finalizar o processo da clinicaId
        const sugestaoRefClinica = collection(db, 't_sugestao_consulta_clinica');
        const qSugestaoClinica = query(sugestaoRefClinica, where('status', '==', 'aceita'), where('idCliente', '==', idCliente));
        const sugestaoClinicaSnapshot = await getDocs(qSugestaoClinica);

        sugestaoClinicaSnapshot.forEach(async (docSnap) => {
            const docRef = doc(db, 't_sugestao_consulta_clinica', docSnap.id);
            await updateDoc(docRef, { status: "finalizado" });
          });
      
        // 2. Cria novo registro de consulta na coleção t_consulta
        await addDoc(collection(db, 't_agendamento_consulta'), {
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
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={router.back}>
            <View style={styles.backButtonCircle}>
            <Text style={styles.backButtonIcon}>←</Text>
            </View>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sugestão de Consulta</Text>
      </View>

      {/* Conteúdo */}
      <View style={styles.content}>

        {/* Detalhes da clinica */}
        <Text style={styles.title}>Clínica</Text>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Nome:</Text>
          <Text style={styles.value}>{clinica?.nome || 'Carregando...'}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>CNPJ:</Text>
          <Text style={styles.value}>{clinica?.CNPJ || 'Carregando...'}</Text>
        </View>

        {/* Detalhes do endereço */}
        <Text style={styles.title}>Endereço</Text>

        <View style={styles.detailRow}>
          <Text style={styles.label}>CEP:</Text>
          <Text style={styles.value}>{clinica?.CEP || 'Carregando...'}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Estado:</Text>
          <Text style={styles.value}>{clinica?.Estado || 'Carregando...'}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Cidade:</Text>
          <Text style={styles.value}>{clinica?.Cidade || 'Carregando...'}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Bairro:</Text>
          <Text style={styles.value}>{clinica?.Bairro || 'Carregando...'}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Rua:</Text>
          <Text style={styles.value}>{clinica?.Rua || 'Carregando...'}</Text>
        </View>

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
    paddingLeft: 25
  },
  content: {
    flexDirection: 'column',
    backgroundColor: '#f0f6ff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'flex-start',
    margin: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#007BFF'
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    width: 115,
    color: '#333',
  },
  value: {
    fontSize: 16,
    color: '#555',
    flexShrink: 1,
    paddingLeft: 30
  },
  acceptButton: {
    backgroundColor: '#007BFF',
    marginTop: 30,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%'
  },
  acceptButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});


