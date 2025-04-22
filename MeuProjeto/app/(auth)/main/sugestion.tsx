import { IconSymbol } from '@/components/ui/IconSymbol';
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';

type ConsultaCardProps = {
  doctor: string;
  specialty: string;
  time: string;
  date: string;
  image: any;
  isPast?: boolean;
};

const handleShowDetails = (doctor: string) => {
  router.push({
    pathname: '/(auth)/config/doctorDetails',
    params: { 
      doctor: encodeURIComponent(doctor),
      t: Date.now().toString() 
    }
  });
};

const ConsultaCard: React.FC<ConsultaCardProps> = ({
  doctor,
  specialty,
  time,
  date,
  image,
  isPast = false,
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

        <TouchableOpacity style={styles.optionsButton} onPress={() => handleShowDetails(doctor)}>
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
  
  const handleRefused = () => {
    router.push('/(auth)/appointments/refused');
  };

  const handleReschedule = () => {
      router.push('/(auth)/appointments/reschedule');
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
          />
          <ConsultaCard
            doctor="Dra. Cristiane Silva"
            specialty="Exame Clínico Odontológico"
            time="10:00"
            date="10/02/2024"
            image={require('@/assets/images/sugestion/imagem-tres.png')}
            isPast
          />
          <ConsultaCard
            doctor="Dr. Clara Castanho"
            specialty="Exame Periodontal"
            time="12:10"
            date="24/11/2023"
            image={require('@/assets/images/sugestion/imagem-quatro.png')}
            isPast
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

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
