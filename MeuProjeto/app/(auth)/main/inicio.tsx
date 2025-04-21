import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ParallaxScrollView from '@/components/ParallaxScrollView';

const InicioScreen = () => {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#0066FF', dark: '#003EA6' }}
      headerImage={
        <Image
          source={require('@/assets/images/logo/logo-branco.png')}
          style={styles.headerImage}
        />
      }>

        {/** 🔔 Cabeçalho com sininho, logo no centro e foto da pessoa logada */}
        <View style={styles.headerContent}>
          <Ionicons name="notifications-outline" size={28} color="#003EA6" />
          <Image source={require('@/assets/images/logo/logo-branco.png')} style={styles.logo} />
          <Image
            source={require('@/assets/images/main/imagem-dois.png')}
            style={styles.avatar}
          />
        </View>

        {/** 📅 Próximo Agendamento com ícone de calendário + linha separadora + pontos */}
        <View style={styles.appointment}>
          <View><Ionicons name="calendar-outline" size={20} color="#003EA6" style={{ marginRight: 8 }} /></View>
          <View style={styles.appointmentHeader}>
            <Text style={styles.appointmentText}>Próximo Agendamento</Text>
            <Text style={styles.appointmentDate}>02/10/2024 às 14:20</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.appointmentContent}>
            
            <Text style={styles.points}>Você tem 184 Pontos</Text>
          </View>
        </View>

        {/** 💡 Card com dica e imagem */}
        <View style={styles.tipSection}>
          <Image source={require('@/assets/images/main/imagem-um.png')} style={styles.tipImage} />
          <Text style={styles.tipTitle}>#OdontoDica</Text>
          <Text style={styles.tipText}>
            Dente do siso{'\n'}
            Todo mundo precisa fazer a extração? Confira a dica da Dra. Letícia Almeida.{'\n\n'}
            <Text style={{ color: '#003EA6', fontWeight: 'bold' }}>Saiba mais</Text>
          </Text>
        </View>

        {/** 🎁 Card de pontos e recompensas */}
        <View style={styles.pointsSection}>
          <Text style={styles.pointsTitle}>Acompanhe sua pontuação e ganhe recompensas!</Text>
          <Text style={styles.pointsText}>
            Cada consulta ou indicação conta pontos que você pode trocar por benefícios exclusivos.{'\n\n'}
            Mantenha seu sorriso em dia e acumule muitas vantagens!
          </Text>
        </View>

    </ParallaxScrollView>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 0,
    backgroundColor: '#fff',
  },
  headerImage: {
    width: 180,
    height: 60,
    resizeMode: 'contain',
    marginTop: 60,
    alignSelf: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 20,
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 40,
    resizeMode: 'contain',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  appointment: {
    marginTop: 30,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
  },
  appointmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appointmentText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003EA6',
  },
  divider: {
    height: 2,
    backgroundColor: '#003EA6',
    marginVertical: 10,
    width: '100%',
  },
  appointmentContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  appointmentDate: {
    fontSize: 16,
    color: '#333',
  },
  points: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#003EA6',
  },
  tipSection: {
    marginBottom: 20,
  },
  tipImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
  tipTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#003EA6',
  },
  tipText: {
    fontSize: 16,
    color: '#555',
    marginTop: 6,
  },
  pointsSection: {
    marginBottom: 30,
    backgroundColor: '#f2f8ff',
    borderRadius: 12,
    padding: 16,
  },
  pointsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003EA6',
    marginBottom: 8,
  },
  pointsText: {
    fontSize: 16,
    color: '#555',
  },
});

export default InicioScreen;
