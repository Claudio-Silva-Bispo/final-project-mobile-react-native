import { IconSymbol } from '@/components/ui/IconSymbol';
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Modal,
  FlatList,
} from 'react-native';
import { router } from 'expo-router';

type ConsultaCardProps = {
  doctor: string;
  specialty: string;
  time: string;
  date: string;
  image: any;
  isPast?: boolean;
  doctorDetails?: DoctorDetails;
  onShowDetails: () => void;
};

type DoctorDetails = {
  name: string;
  specialty: string;
  education: string[];
  patientCount: number;
  rating: number;
  specialties: string[];
  achievements: string[];
  feedbacks: {
    author: string;
    rating: number;
    comment: string;
    date: string;
  }[];
  bio: string;
  image: any;
};

type DoctorDetailsModalProps = {
  visible: boolean;
  onClose: () => void;
  doctor: DoctorDetails;
};

const RatingStars = ({ rating }: { rating: number }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Text key={i} style={{ color: i <= rating ? '#FFD700' : '#D3D3D3', fontSize: 18 }}>
        ★
      </Text>
    );
  }
  return <View style={{ flexDirection: 'row' }}>{stars}</View>;
};

const DoctorDetailsModal: React.FC<DoctorDetailsModalProps> = ({
  visible,
  onClose,
  doctor,
}) => {
  if (!doctor) return null;

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <SafeAreaView style={detailStyles.container}>
        <View style={detailStyles.header}>
          <TouchableOpacity style={detailStyles.closeButton} onPress={onClose}>
            <Text style={detailStyles.closeButtonText}>×</Text>
          </TouchableOpacity>
          <Text style={detailStyles.headerTitle}>Perfil do Especialista</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView style={detailStyles.scrollContent}>
          <View style={detailStyles.profileHeader}>
            <Image source={doctor.image} style={detailStyles.profileImage} />
            <View style={detailStyles.profileInfo}>
              <Text style={detailStyles.doctorName}>{doctor.name}</Text>
              <Text style={detailStyles.primarySpecialty}>{doctor.specialty}</Text>
              <View style={detailStyles.statsRow}>
                <View style={detailStyles.statItem}>
                  <RatingStars rating={doctor.rating} />
                  <Text style={detailStyles.statLabel}>{doctor.rating.toFixed(1)}/5.0</Text>
                </View>
                <View style={detailStyles.statDivider} />
                <View style={detailStyles.statItem}>
                  <Text style={detailStyles.statValue}>{doctor.patientCount}</Text>
                  <Text style={detailStyles.statLabel}>Atendimentos</Text>
                </View>
                <View style={detailStyles.statDivider} />
              </View>
            </View>
          </View>

          <View style={detailStyles.section}>
            <Text style={detailStyles.sectionTitle}>Sobre</Text>
            <Text style={detailStyles.bioText}>{doctor.bio}</Text>
          </View>

          <View style={detailStyles.section}>
            <Text style={detailStyles.sectionTitle}>Formação</Text>
            {doctor.education.map((edu, index) => (
              <View key={index} style={detailStyles.listItem}>
                <Text style={detailStyles.listItemBullet}>•</Text>
                <Text style={detailStyles.listItemText}>{edu}</Text>
              </View>
            ))}
          </View>

          <View style={detailStyles.section}>
            <Text style={detailStyles.sectionTitle}>Especialidades</Text>
            <View style={detailStyles.tagsContainer}>
              {doctor.specialties.map((spec, index) => (
                <View key={index} style={detailStyles.tagItem}>
                  <Text style={detailStyles.tagText}>{spec}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={detailStyles.section}>
            <Text style={detailStyles.sectionTitle}>Conquistas</Text>
            {doctor.achievements.map((achievement, index) => (
              <View key={index} style={detailStyles.achievementItem}>
                <View style={detailStyles.achievementIcon}>
                  <Text style={detailStyles.achievementIconText}>🏆</Text>
                </View>
                <Text style={detailStyles.achievementText}>{achievement}</Text>
              </View>
            ))}
          </View>

          <View style={detailStyles.section}>
            <Text style={detailStyles.sectionTitle}>Avaliações de Pacientes</Text>
            {doctor.feedbacks.map((feedback, index) => (
              <View key={index} style={detailStyles.feedbackItem}>
                <View style={detailStyles.feedbackHeader}>
                  <Text style={detailStyles.feedbackAuthor}>{feedback.author}</Text>
                  <RatingStars rating={feedback.rating} />
                </View>
                <Text style={detailStyles.feedbackDate}>{feedback.date}</Text>
                <Text style={detailStyles.feedbackComment}>{feedback.comment}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={detailStyles.scheduleButton}>
            <Text style={detailStyles.scheduleButtonText}>AGENDAR CONSULTA</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const ConsultaCard: React.FC<ConsultaCardProps> = ({
  doctor,
  specialty,
  time,
  date,
  image,
  isPast = false,
  doctorDetails,
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

        <TouchableOpacity style={styles.optionsButton} onPress={onShowDetails}>
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

// Dados mockados para os detalhes dos médicos
const doctorDetailsData = {
  "Dr. Carlos Almendra": {
    name: "Dr. Carlos Almendra",
    specialty: "Ortodontia",
    experience: "15 anos",
    education: [
      "Doutorado em Ortodontia - USP",
      "Especialização em Oclusão Dental - UFRJ",
      "Graduação em Odontologia - UNICAMP"
    ],
    patientCount: 3245,
    rating: 4.8,
    specialties: ["Ortodontia", "Oclusão", "Harmonização Facial", "DTM"],
    achievements: [
      "Prêmio de Excelência Clínica 2023",
      "Pesquisador do Ano em Ortodontia 2020",
      "Membro da Academia Brasileira de Odontologia"
    ],
    feedbacks: [
      {
        author: "Marcos Silva",
        rating: 5,
        comment: "Excelente profissional. Muito atencioso e dedicado. Resolveu meu problema de oclusão que já durava anos.",
        date: "15/03/2024"
      },
      {
        author: "Ana Beatriz",
        rating: 5,
        comment: "Atendimento excepcional. O Dr. Carlos explica tudo detalhadamente e é muito cuidadoso.",
        date: "28/01/2024"
      }
    ],
    bio: "Especialista em tratamentos ortodônticos e problemas de oclusão dental. Com mais de 15 anos de experiência, o Dr. Carlos Almendra dedica-se a oferecer soluções personalizadas para cada paciente, utilizando tecnologias avançadas e técnicas inovadoras.",
    image: require('@/assets/images/sugestion/imagem-um.png')
  },
  "Dra. Viviane Almeida": {
    name: "Dra. Viviane Almeida",
    specialty: "Periodontia",
    experience: "12 anos",
    education: [
      "Mestrado em Periodontia - UNESP",
      "Especialização em Implantodontia - ABO",
      "Graduação em Odontologia - UFF"
    ],
    patientCount: 2689,
    rating: 4.7,
    specialties: ["Periodontia", "Implantodontia", "Cirurgia Gengival", "Estética Periodontal"],
    achievements: [
      "Prêmio de Inovação em Periodontia 2022",
      "Autora de 15 artigos científicos",
      "Palestrante internacional"
    ],
    feedbacks: [
      {
        author: "Roberto Carlos",
        rating: 5,
        comment: "A Dra. Viviane salvou meus dentes! Depois de anos de problemas gengivais, finalmente encontrei uma solução.",
        date: "20/05/2024"
      },
      {
        author: "Juliana Mendes",
        rating: 4,
        comment: "Ótimo atendimento e resultados excelentes no tratamento de recessão gengival.",
        date: "03/04/2024"
      }
    ],
    bio: "Especialista em saúde gengival e tratamentos periodontais avançados. A Dra. Viviane Almeida combina técnicas convencionais e inovadoras para tratar desde problemas simples até casos complexos, sempre visando o conforto e bem-estar do paciente.",
    image: require('@/assets/images/sugestion/imagem-dois.png')
  },
  "Dra. Cristiane Silva": {
    name: "Dra. Cristiane Silva",
    specialty: "Clínica Geral",
    experience: "8 anos",
    education: [
      "Especialização em Odontologia Estética - APCD",
      "Aperfeiçoamento em Endodontia - CFO",
      "Graduação em Odontologia - UNIP"
    ],
    patientCount: 1856,
    rating: 4.9,
    specialties: ["Odontologia Geral", "Estética Dental", "Endodontia", "Dentística"],
    achievements: [
      "Prêmio Excelência em Atendimento 2023",
      "Certificação em Atendimento Humanizado",
      "Coordenadora de programas sociais de saúde bucal"
    ],
    feedbacks: [
      {
        author: "Mariana Costa",
        rating: 5,
        comment: "Melhor dentista que já tive! Super gentil, explica tudo detalhadamente e trabalha com muita competência.",
        date: "12/01/2024"
      },
      {
        author: "Pedro Henrique",
        rating: 5,
        comment: "Excelente profissional. Conseguiu resolver meu problema de sensibilidade dental que outros não conseguiram.",
        date: "07/12/2023"
      }
    ],
    bio: "Dedicada à odontologia geral e preventiva, a Dra. Cristiane Silva prioriza o atendimento humanizado e a educação dos pacientes para a manutenção da saúde bucal. Sua abordagem integra estética e funcionalidade para resultados duradouros.",
    image: require('@/assets/images/sugestion/imagem-tres.png')
  },
  "Dr. Clara Castanho": {
    name: "Dra. Clara Castanho",
    specialty: "Periodontia",
    experience: "10 anos",
    education: [
      "Doutorado em Ciências Odontológicas - UFRJ",
      "Especialização em Periodontia - USP",
      "Graduação em Odontologia - UERJ"
    ],
    patientCount: 2124,
    rating: 4.6,
    specialties: ["Periodontia", "Reabilitação Oral", "Terapia Regenerativa", "Laser em Odontologia"],
    achievements: [
      "Prêmio Jovem Pesquisadora 2021",
      "Desenvolvimento de protocolo inovador para regeneração gengival",
      "Professora convidada em diversas universidades"
    ],
    feedbacks: [
      {
        author: "Sandra Oliveira",
        rating: 5,
        comment: "A Dra. Clara tem mãos de fada! Tratamento indolor e resultados impressionantes.",
        date: "19/02/2024"
      },
      {
        author: "Carlos Eduardo",
        rating: 4,
        comment: "Profissional extremamente competente. Conseguiu reverter um quadro grave de periodontite que eu tinha.",
        date: "05/09/2023"
      }
    ],
    bio: "Especialista em tratamentos periodontais avançados e reabilitação oral, a Dra. Clara Castanho é reconhecida por sua abordagem minimamente invasiva e uso de tecnologias de ponta. Dedica-se à pesquisa e aplicação clínica de técnicas regenerativas inovadoras.",
    image: require('@/assets/images/sugestion/imagem-quatro.png')
  }
};

export default function MinhasConsultas() {
  const [selectedDoctor, setSelectedDoctor] = useState<keyof typeof doctorDetailsData | null>(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  
  const handleRefused = () => {
    router.push('/(auth)/appointments/refused');
  };

  const handleReschedule = () => {
    router.push('/(auth)/appointments/reschedule');
  };

  const showDoctorDetails = (doctorName: keyof typeof doctorDetailsData) => {
    setSelectedDoctor(doctorName);
    setDetailsModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
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

        {/* Próxima Consulta */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Próxima Consulta</Text>
          <ConsultaCard
            doctor="Dr. Carlos Almendra"
            specialty="Exame de Oclusão"
            time="14:20"
            date="02/10/2024"
            image={require('@/assets/images/sugestion/imagem-um.png')}
            onShowDetails={() => showDoctorDetails("Dr. Carlos Almendra")}
          />
          <TouchableOpacity style={styles.acceptButton}>
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
            onShowDetails={() => showDoctorDetails("Dra. Viviane Almeida")}
          />
          <ConsultaCard
            doctor="Dra. Cristiane Silva"
            specialty="Exame Clínico Odontológico"
            time="10:00"
            date="10/02/2024"
            image={require('@/assets/images/sugestion/imagem-tres.png')}
            isPast
            onShowDetails={() => showDoctorDetails("Dra. Cristiane Silva")}
          />
          <ConsultaCard
            doctor="Dr. Clara Castanho"
            specialty="Exame Periodontal"
            time="12:10"
            date="24/11/2023"
            image={require('@/assets/images/sugestion/imagem-quatro.png')}
            isPast
            onShowDetails={() => showDoctorDetails("Dr. Clara Castanho")}
          />
        </View>
      </ScrollView>

      {/* Modal de Detalhes do Médico */}
      {selectedDoctor && (
        <DoctorDetailsModal
          visible={detailsModalVisible}
          onClose={() => setDetailsModalVisible(false)}
          doctor={doctorDetailsData[selectedDoctor]}
        />
      )}
    </SafeAreaView>
  );
}

// Estilos existentes
const styles = StyleSheet.create({
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
});

// Novos estilos para a tela de detalhes
const detailStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: '#333',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0A3D91',
  },
  scrollContent: {
    flex: 1,
    padding: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E0E0E0',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  doctorName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0A3D91',
    marginBottom: 4,
  },
  primarySpecialty: {
    fontSize: 16,
    color: '#555',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#ddd',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0A3D91',
  },
  statLabel: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0A3D91',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
    paddingBottom: 8,
  },
  bioText: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  listItemBullet: {
    fontSize: 18,
    color: '#0A3D91',
    marginRight: 8,
    lineHeight: 22,
  },
  listItemText: {
    fontSize: 15,
    color: '#444',
    flex: 1,
    lineHeight: 22,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagItem: {
    backgroundColor: '#e6f0ff',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
  },
  tagText: {
    color: '#0A3D91',
    fontSize: 14,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
  },
  achievementIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  achievementIconText: {
    fontSize: 18,
  },
  achievementText: {
    fontSize: 15,
    color: '#444',
    flex: 1,
  },
  feedbackItem: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  feedbackHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  feedbackAuthor: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  feedbackDate: {
    fontSize: 12,
    color: '#777',
    marginBottom: 8,
  },
  feedbackComment: {
    fontSize: 14,
    color: '#444',
    fontStyle: 'italic',
  },
  scheduleButton: {
    backgroundColor: '#0A3D91',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  scheduleButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});