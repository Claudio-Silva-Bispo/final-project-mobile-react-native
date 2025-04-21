import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';

export default function PartnerScreen() {
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Botões de Ação */}
      <View style={styles.topIcons}>
        <TouchableOpacity style={styles.backButton} onPress={router.back}>
                  <View style={styles.backButtonCircle}>
                    <Text style={styles.backButtonIcon}>←</Text>
                  </View>
                </TouchableOpacity>
        <View style={styles.rightIcons}>
          <TouchableOpacity style={styles.iconCircle} onPress={() => router.push('/(auth)/config/feedback')}><Text style={styles.icon}>♡</Text></TouchableOpacity>
          <TouchableOpacity style={styles.iconCircle}><Text style={styles.icon}>⇪</Text></TouchableOpacity>
        </View>
      </View>

      {/* Foto e Nome */}
      <View style={styles.profileSection}>
        <Text style={styles.categoria}>Clínico Geral</Text>
        <Text style={styles.nome}>Dr. Carlos Almendra</Text>
        <Text style={styles.instituicao}>UNESP</Text>
        <Text style={styles.valor}>R$ 89 <Text style={styles.aPartir}>a partir</Text></Text>
        <Image
          source={require('@/assets/images/partners/imagem-um.png')} // substitua pelo seu caminho
          style={styles.foto}
        />
      </View>

      {/* Cards Horizontais */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardRow}>
        <View style={styles.card}><Text style={styles.cardTitle}>12 anos</Text><Text style={styles.cardDesc}>experiência</Text></View>
        <View style={styles.card}><Text style={styles.cardTitle}>4.8</Text><Text style={styles.cardDesc}>feedback</Text></View>
        <View style={styles.card}><Text style={styles.cardTitle}>500+</Text><Text style={styles.cardDesc}>pacientes</Text></View>
      </ScrollView>

      {/* Abas de navegação */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabs}>
        {['Sobre Mim', 'Disponibilidade', 'Experiência', 'Educação', 'Feedback'].map((item, i) => (
          <TouchableOpacity key={i}>
            <Text style={styles.tabItem}>{item}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Conteúdo da aba "Sobre Mim" */}
      <Text style={styles.subtitulo}>Especialista em odontologia com mais de 10 anos de experiência, comprometido em proporcionar saúde bucal de qualidade e cuidar do bem-estar de seus pacientes. Sempre atualizado com as melhores práticas, sua missão é oferecer atendimento humanizado e resultados que geram sorrisos saudáveis e duradouros.</Text>

      {/* Card de Atendimento */}
      <View style={styles.clinicaCard}>
        <Text style={styles.clinicaTitulo}>Clínica Sorriso Perfeito <Text style={styles.nota}>4.9 ★</Text></Text>
        <Text style={styles.clinicaEndereco}>Endereço: Rua das Flores, 123 - Centro</Text>
        <Text style={styles.clinicaEndereco}>São Paulo, SP, 01000-000</Text>
        <Text style={styles.clinicaEndereco}>Telefone: (11) 1234-5678</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
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
  topIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop:40
  },
  rightIcons: {
    flexDirection: 'row',
    gap: 10,
  },
  iconCircle: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 30,
  },
  icon: {
    fontSize: 16,
  },
  profileSection: {
    alignItems: 'center',
    marginTop: 20,
  },
  categoria: {
    color: '#2a2a2a',
    fontSize: 16,
  },
  nome: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0a1e5e',
  },
  instituicao: {
    fontSize: 16,
    color: '#5e5e5e',
  },
  valor: {
    fontSize: 20,
    color: '#00aaff',
    marginVertical: 8,
  },
  aPartir: {
    fontSize: 14,
    color: '#999',
  },
  foto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginTop: 10,
  },
  cardRow: {
    flexDirection: 'row',
    marginTop: 20,
  },
  card: {
    backgroundColor: '#d0f2ff',
    borderRadius: 15,
    padding: 15,
    marginRight: 10,
    alignItems: 'center',
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#054e70',
  },
  cardDesc: {
    fontSize: 14,
    color: '#054e70',
  },
  tabs: {
    flexDirection: 'row',
    marginTop: 25,
    marginBottom: 10,
  },
  tabItem: {
    marginRight: 20,
    fontWeight: '600',
    color: '#003EA6',
    fontSize: 14,
    borderBottomWidth: 2,
    borderBottomColor: '#003EA6',
  },
  subtitulo: {
    marginTop: 10,
    fontSize: 15,
    color: '#333',
    textAlign: 'justify',
  },
  clinicaCard: {
    backgroundColor: '#004080',
    padding: 15,
    borderRadius: 12,
    marginTop: 25,
  },
  clinicaTitulo: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  nota: {
    fontWeight: '400',
    fontSize: 14,
    color: '#fff',
  },
  clinicaEndereco: {
    color: '#e0e0e0',
    fontSize: 14,
  },
});
