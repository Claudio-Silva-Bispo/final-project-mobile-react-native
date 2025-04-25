import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getFirestore, collection, query, where, getDocs, doc, getDoc, DocumentData } from 'firebase/firestore';
import firebase from '../../../firebaseConfig';
import { useIdCliente } from '@/hooks/useIdCliente';

const AppointmentsScreen = () => {
  const { idCliente, loading: loadingId } = useIdCliente();
  interface AppointmentData {
    consulta: {
      data: string;
      hora: string;
      turno: string;
    };
    clinica: DocumentData | null;
    rotina: DocumentData | null;
    preferencia: DocumentData | null;
    usuario: DocumentData | null;
  }
  
  const [appointmentData, setAppointmentData] = useState<AppointmentData | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [historyExpanded, setHistoryExpanded] = useState(false);

  // Dados fictícios para histórico de consultas
  const fakeHistory = [
    {
      id: 1,
      data: '15/03/2024',
      hora: '10:30',
      especialidade: 'Clareamento',
      dentista: 'Dra. Maria Oliveira',
      turno: 'Manhã',
      clinica: 'Clínica Sorriso Feliz',
      endereco: 'Av. Central, 100 - São Paulo/SP'
    },
    {
      id: 2,
      data: '28/02/2024',
      hora: '16:00',
      especialidade: 'Ortodontia',
      dentista: 'Dr. João Souza',
      turno: 'Tarde',
      clinica: 'Clinica Bem Estar',
      endereco: 'Rua das Acácias, 200 - São Paulo/SP'
    },
  ];

  useEffect(() => {
    const loadAppointment = async () => {
      try {
        // Inicializa a referência ao Firestore
        const db = getFirestore(firebase);

        // 1. Buscar o registro da consulta aceita na t_sugestao_consulta_cliente
        const sugestaoRef = collection(db, 't_sugestao_consulta_cliente');
        const qSugestao = query(sugestaoRef, where('status', '==', 'aceita'), where('idCliente', '==', idCliente));
        const sugestaoSnapshot = await getDocs(qSugestao);

        if (!sugestaoSnapshot.empty) {
          
          const sugestaoDoc = sugestaoSnapshot.docs[0];
          const sugestaoData = sugestaoDoc.data();
          // Desestruture os dados necessários
          const { clinicaId, data, Horario, turno } = sugestaoData;

          // 2. Buscar os dados da clínica na coleção t_clinica
          const clinicaRef = doc(db, 't_clinica', clinicaId);
          const clinicaSnap = await getDoc(clinicaRef);
          const clinicaData = clinicaSnap.exists() ? clinicaSnap.data() : null;

          // 3. Buscar os dados da rotina de cuidado na t_rotina_cuidado
          const rotinaRef = collection(db, 't_rotina_cuidado');
          const qRotina = query(rotinaRef, where('idCliente', '==', idCliente));
          const rotinaSnapshot = await getDocs(qRotina);
          const rotinaData = !rotinaSnapshot.empty ? rotinaSnapshot.docs[0].data() : null;

          // 4. Buscar os dados da preferência de atendimento na t_tipo_atendimento_preferencia_usuario
          const preferenciaRef = collection(db, 't_tipo_atendimento_preferencia_usuario');
          const qPreferencia = query(preferenciaRef, where('idCliente', '==', idCliente));
          const preferenciaSnapshot = await getDocs(qPreferencia);
          const preferenciaData = !preferenciaSnapshot.empty ? preferenciaSnapshot.docs[0].data() : null;

          // 5. Buscar os dados do usuário na t_usuario
          const usuarioRef = collection(db, 't_usuario');
          const qUsuario = query(usuarioRef, where('idCliente', '==', idCliente));
          const usuarioSnapshot = await getDocs(qUsuario);
          const usuarioData = !usuarioSnapshot.empty ? usuarioSnapshot.docs[0].data() : null;

          // Montar um objeto consolidado com todos os dados da consulta agendada
          const consolidatedData = {
            consulta: {
              data,
              hora: Horario,
              turno,
            },
            clinica: clinicaData,
            rotina: rotinaData,
            preferencia: preferenciaData,
            usuario: usuarioData,
          };

          setAppointmentData(consolidatedData);
        }
      } catch (error) {
        console.error('Erro ao buscar dados da consulta agendada:', error);
      } finally {
        setLoadingData(false);
      }
    };

    if (idCliente) {
      loadAppointment();
    }
  }, [idCliente]);

  if (loadingId || loadingData) {
    return (
      <View style={[styles.centered, {flex:1}]}>
        <ActivityIndicator size="large" color="#003EA6" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Cabeçalho */}
      <View style={styles.headerImage}>
        <View style={styles.headerContent}>
          <Ionicons name="calendar-outline" size={32} color="#fff" />
          <Image source={require('@/assets/images/logo/logo-branco.png')} style={styles.logo} />
          <Image source={require('@/assets/images/main/imagem-dois.png')} style={styles.avatar} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Consulta Agendada</Text>

        {appointmentData ? (
          <View style={styles.card}>
            <Ionicons name="medkit-outline" size={24} color="#003EA6" style={styles.icon} />
            <View style={styles.cardContent}>
              <Text style={styles.label}>Data:</Text>
              <Text style={styles.value}>{appointmentData.consulta.data} às {appointmentData.consulta.hora}</Text>

              <Text style={styles.label}>Turno:</Text>
              <Text style={styles.value}>{appointmentData.consulta.turno}</Text>

              {appointmentData.clinica && (
                <>
                  <Text style={styles.label}>Clínica:</Text>
                  <Text style={styles.value}>{appointmentData.clinica.nome}</Text>

                  <Text style={styles.label}>Endereço:</Text>
                  <Text style={styles.value}>
                    {appointmentData.clinica.Rua}, Nº {appointmentData.clinica.Numero} - {appointmentData.clinica.Cidade} / {appointmentData.clinica.Estado}
                  </Text>
                  <Text style={styles.label}>CEP:</Text>
                  <Text style={styles.value}>{appointmentData.clinica.CEP}</Text>
                  <Text style={styles.label}>Bairro:</Text>
                  <Text style={styles.value}>{appointmentData.clinica.Bairro}</Text>
                </>
              )}

              {appointmentData.usuario && (
                <>
                  <Text style={styles.label}>Paciente:</Text>
                  <Text style={styles.value}>{appointmentData.usuario.nome}</Text>
                  <Text style={styles.label}>Contato:</Text>
                  <Text style={styles.value}>{appointmentData.usuario.telefone}</Text>
                </>
              )}

              {appointmentData.preferencia && (
                <>
                  <Text style={styles.label}>Preferência de Atendimento:</Text>
                  <Text style={styles.value}>{appointmentData.preferencia.preferencia}</Text>
                </>
              )}

              {appointmentData.rotina && (
                <>
                  <Text style={styles.label}>Rotina de Cuidado:</Text>
                  <Text style={styles.value}>Escovação Diária: {appointmentData.rotina.escovacaoDiaria} | Uso de fio dental: {appointmentData.rotina.usoDeFioDental}</Text>
                </>
              )}
            </View>
          </View>
        ) : (
          <Text style={styles.value}>Nenhuma consulta aceita encontrada.</Text>
        )}

        {/* Seção de Histórico */}
        <View style={styles.historySection}>
          <TouchableOpacity onPress={() => setHistoryExpanded(!historyExpanded)} style={styles.historyButton}>
            <Text style={styles.historyButtonText}>
              {historyExpanded ? 'Ocultar Histórico' : 'Ver Histórico'}
            </Text>
          </TouchableOpacity>
          {historyExpanded && (
            <View style={styles.historyContent}>
              {fakeHistory.map((item) => (
                <View key={item.id} style={styles.card}>
                  <Ionicons name="time-outline" size={24} color="#003EA6" style={styles.icon} />
                  <View style={styles.cardContent}>
                    <Text style={styles.label}>Data:</Text>
                    <Text style={styles.value}>{item.data} às {item.hora}</Text>
                    <Text style={styles.label}>Especialidade:</Text>
                    <Text style={styles.value}>{item.especialidade}</Text>
                    <Text style={styles.label}>Profissional:</Text>
                    <Text style={styles.value}>{item.dentista}</Text>
                    <Text style={styles.label}>Turno:</Text>
                    <Text style={styles.value}>{item.turno}</Text>
                    <Text style={styles.label}>Clínica:</Text>
                    <Text style={styles.value}>{item.clinica}</Text>
                    <Text style={styles.label}>Endereço:</Text>
                    <Text style={styles.value}>{item.endereco}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 150,
    
  },
  headerImage: {
    height: 180,
    backgroundColor: '#003EA6',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 100,
    resizeMode: 'contain',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003EA6',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#f0f6ff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  icon: {
    marginRight: 12,
    marginTop: 4,
  },
  cardContent: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#003EA6',
  },
  value: {
    fontSize: 14,
    color: '#000',
    marginBottom: 6,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  historySection: {
    marginTop: 20,
  },
  historyButton: {
    backgroundColor: '#003EA6',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  historyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  historyContent: {
    marginTop: 16,
  },
});

export default AppointmentsScreen;
