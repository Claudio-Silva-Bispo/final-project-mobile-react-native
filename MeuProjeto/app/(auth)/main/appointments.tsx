import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const agendamentos = [
  {
    id: 1,
    data: '02/10/2024',
    hora: '14:20',
    especialidade: 'Ortodontia',
    dentista: 'Dra. Letícia Almeida',
    turno: 'Tarde',
    endereco: {
      rua: 'Av. Paulista, 1234',
      cidade: 'São Paulo',
      estado: 'SP',
    },
  },
  {
    id: 2,
    data: '10/11/2024',
    hora: '09:00',
    especialidade: 'Endodontia',
    dentista: 'Dr. Pedro Silva',
    turno: 'Manhã',
    endereco: {
      rua: 'Rua das Flores, 500',
      cidade: 'Campinas',
      estado: 'SP',
    },
  },
];

const AppointmentsScreen = () => {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.headerImage}>
        <View style={styles.headerContent}>
          <Ionicons name="calendar-outline" size={32} color="#fff" />
          <Image source={require('@/assets/images/logo/logo-branco.png')} style={styles.logo} />
          <Image source={require('@/assets/images/main/imagem-dois.png')} style={styles.avatar} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Consultas Agendadas</Text>

        {agendamentos.map((item) => (
          <View key={item.id} style={styles.card}>
            <Ionicons name="medkit-outline" size={24} color="#003EA6" style={styles.icon} />
            <View style={styles.cardContent}>
              <Text style={styles.label}>Data:</Text>
              <Text style={styles.value}>{item.data} às {item.hora}</Text>

              <Text style={styles.label}>Especialidade:</Text>
              <Text style={styles.value}>{item.especialidade}</Text>

              <Text style={styles.label}>Profissional:</Text>
              <Text style={styles.value}>{item.dentista}</Text>

              <Text style={styles.label}>Turno:</Text>
              <Text style={styles.value}>{item.turno}</Text>

              <Text style={styles.label}>Local:</Text>
              <Text style={styles.value}>{item.endereco.rua}, {item.endereco.cidade} - {item.endereco.estado}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 32,
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
});

export default AppointmentsScreen;
