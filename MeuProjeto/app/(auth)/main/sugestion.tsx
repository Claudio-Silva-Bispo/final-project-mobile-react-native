import { IconSymbol } from '@/components/ui/IconSymbol';
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useIdCliente } from '@/hooks/useIdCliente';
import { getFirestore, collection, query, where, getDocs, doc, updateDoc, addDoc } from 'firebase/firestore';
import firebase, { db } from '../../../firebaseConfig';

type ConsultaCardProps = {
  doctor: string;
  specialty: string;
  time: string;
  date: string;
  image: any;
  isPast?: boolean;
  onShowDetails: (doctor: string) => void;
};


const ConsultaCard: React.FC<ConsultaCardProps> = ({
  doctor,
  specialty,
  time,
  date,
  image,
  isPast = false,
  onShowDetails,
}) => {
  return (
    <View style={[styles.consultaCard, isPast ? styles.pastConsultaCard : styles.nextConsultaCard]}>
      <View style={styles.cardContent}>
        <Image source={image} style={styles.doctorImage} />
        <View style={styles.doctorDetails}>
          <Text style={styles.doctorName}>{doctor}</Text>
          <Text style={styles.examType}>{specialty}</Text>
          <View style={styles.dateTimeRow}>
            <Text style={styles.timeText}>{time}</Text>
            <Text style={styles.dateText}>{date}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.optionsButton} onPress={() => onShowDetails(doctor)} /*onPress={closeModal}*/>
          <View style={styles.dotsContainer}>
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function MinhasConsultas() {
  const { idCliente, loading: loadingId } = useIdCliente();
  const [consulta, setConsulta] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);


  // Primeiro consultar as sugestões de consultas
  const consultarSugestao = async () => {
    try {
      const db = getFirestore(firebase);
      const sugestaoRef = collection(db, 't_sugestao_consulta_clinica');

      // Olhar as consultas aceitas e pelo idCliente e não do autenticado
      const q = query(sugestaoRef, where('idCliente', '==', idCliente), where('status', '==', 'aceita'));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const docData = snapshot.docs[0];

        // Salvar o id da sugestão pois vou usar nos demais métodos.
        const dados = { id: docData.id, ...docData.data() };
        
        setConsulta(dados);
      } else {
        setConsulta(null);
      }
    } catch (error) {
      console.error("Erro ao buscar sugestão de consulta:", error);
    } finally {
      setLoading(false);
    }
  };

  // Consultar o cliente
  useEffect(() => {
    if (idCliente) consultarSugestao();
  }, [idCliente]);



  // Aceitar a sugestão de consulta
  const handleAceitarAgendamento = async () => {
    try {
      if (!consulta) return;
      
      /*
      // 1. Atualizar o status do agendamento para "aceito"
      const agendamentoRef = doc(db, "t_sugestao_consulta_clinica", consulta.id);
      await updateDoc(agendamentoRef, {
        status: "em momento de aceite",
      });
      */
  
      // Navegar para a tela de aceite passando os dados necessários
      router.push({
        pathname: '/(auth)/appointments/accept',
        params: { 
          consultaId: consulta.id,
          idCliente: idCliente,
          dentista: consulta.Dentista,
          especialidade: consulta.Especialidade,
          data: consulta.data,
          turno: consulta.turno
        }
      });

    } catch (error) {
      console.error("Erro ao aceitar agendamento:", error);
      Alert.alert("Erro", "Não foi possível aceitar o agendamento.");
    }
  };

   
  // Para direcionar para a tela de consulta reagendada
  const handleReschedule = async () => {
    try {
      if (!consulta) return;
      
      // Atualizar o status para "reagendado"
      const agendamentoRef = doc(db, "t_sugestao_consulta_clinica", consulta.id);
      await updateDoc(agendamentoRef, {
        status: "reagendado",
      });
      
      // Navegar para a tela de reagendamento passando os dados necessários
      router.push({
        pathname: '/(auth)/appointments/reschedule',
        params: { 
          consultaId: consulta.id,
          idCliente: idCliente,
          dentista: consulta.Dentista,
          especialidade: consulta.Especialidade,
          data: consulta.data,
          turno: consulta.turno
        }
      });
    } catch (error) {
      console.error("Erro ao reagendar consulta:", error);
      Alert.alert("Erro", "Não foi possível reagendar a consulta.");
    }
  };
  
  // Para direcionar para a tela de consulta recusada ou reagendada
  const handleRefused = async () => {
    try {
      if (!consulta) return;
      
      // Atualizar o status para "recusado"
      const agendamentoRef = doc(db, "t_sugestao_consulta_clinica", consulta.id);
      await updateDoc(agendamentoRef, {
        status: "recusado",
      });
      
      // Navegar para a tela de recusa passando os dados necessários
      router.push({
        pathname: '/(auth)/appointments/refused',
        params: { 
          consultaId: consulta.id,
          idCliente: idCliente
        }
      });
    } catch (error) {
      console.error("Erro ao recusar consulta:", error);
      Alert.alert("Erro", "Não foi possível recusar a consulta.");
    }
  };

  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleShowDetails = (doctor: string) => {
    setSelectedDoctor(doctor);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedDoctor(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <View style={styles.backButtonCircle}>
              <Text style={styles.backButtonIcon}>←</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Minhas Consultas</Text>
          <TouchableOpacity style={styles.calendarButton}>
            <IconSymbol size={38} name="calendar" color={'#0066FF'} />
          </TouchableOpacity>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Próxima Consulta</Text>

          {loading ? (
            <ActivityIndicator size="large" color="#007BFF" />
          ) : consulta ? (
            <>
              <ConsultaCard
                doctor={consulta.Dentista}
                specialty={consulta.Especialidade}
                time={consulta.Horario}
                date={consulta.data}
                image={require('@/assets/images/sugestion/imagem-um.png')}
                onShowDetails={handleShowDetails}
              />
              <TouchableOpacity style={styles.acceptButton} onPress={handleAceitarAgendamento}>
                <Text style={styles.acceptButtonText}>ACEITAR</Text>
              </TouchableOpacity>
              <View style={styles.secondaryButtonsContainer}>
                <TouchableOpacity style={styles.rescheduleButton} onPress={handleReschedule}>
                  <Text style={styles.secondaryButtonText}>REAGENDAR</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.declineButton} onPress={handleRefused}>
                  <Text style={styles.secondaryButtonText}>RECUSAR</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <Text style={{ color: '#333' }}>Nenhuma sugestão de consulta disponível.</Text>
          )}
        </View>

        {/* Consultas Anteriores */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Consultas Anteriores</Text>
          <ConsultaCard
            doctor="Dra. Viviane Almeida"
            specialty="Exame Periodontal"
            time="16:50"
            date="14/06/2024"
            image={require('@/assets/images/sugestion/imagem-dois.png')}
            isPast
            onShowDetails={handleShowDetails}
          />
          <ConsultaCard
            doctor="Dra. Cristiane Silva"
            specialty="Exame Clínico Odontológico"
            time="10:00"
            date="10/02/2024"
            image={require('@/assets/images/sugestion/imagem-tres.png')}
            isPast
            onShowDetails={handleShowDetails}
          />
          <ConsultaCard
            doctor="Dr. Clara Castanho"
            specialty="Exame Periodontal"
            time="12:10"
            date="24/11/2023"
            image={require('@/assets/images/sugestion/imagem-quatro.png')}
            isPast
            onShowDetails={handleShowDetails}
          />
        </View>

        {/* Doctor Details Modal */}
        {isModalVisible && selectedDoctor && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Detalhes do Médico</Text>
              <Text style={styles.modalText}>{selectedDoctor}</Text>
              {/* Add more doctor details here */}
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Text style={styles.closeButtonText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // ... [o mesmo bloco de estilos que você já tem] ...
  // 👇 mantive igual, então nem precisa alterar nada aqui
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  sectionContainer: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0A3D91',
    marginBottom: 12,
  },
  consultaCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  nextConsultaCard: {
    backgroundColor: '#1054CC',
  },
  pastConsultaCard: {
    backgroundColor: '#6A90CD',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  doctorImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E0E0E0',
  },
  doctorDetails: {
    flex: 1,
    marginLeft: 12,
  },
  doctorName: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  examType: {
    color: 'white',
    fontSize: 14,
    opacity: 0.9,
    marginBottom: 8,
  },
  dateTimeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  timeText: {
    color: 'white',
    fontSize: 14,
  },
  dateText: {
    color: 'white',
    fontSize: 14,
    opacity: 0.9,
  },
  optionsButton: {
    padding: 8,
    marginLeft: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 4,
    width: 20,
    height: 20,
    alignItems: 'center'
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'white',
  },
  acceptButton: {
    backgroundColor: '#007BFF',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  acceptButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  secondaryButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  rescheduleButton: {
    backgroundColor: '#B8B8B8',
    borderRadius: 8,
    padding: 14,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  declineButton: {
    backgroundColor: '#FF6052',
    borderRadius: 8,
    padding: 14,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },

  // modal
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: '80%',
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#0A3D91',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  closeButton: {
    backgroundColor: '#007BFF',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
