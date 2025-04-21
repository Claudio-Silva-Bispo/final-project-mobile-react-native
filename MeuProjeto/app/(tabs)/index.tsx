import { router } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const carouselItems = [
  {
    image: require('@/assets/images/onboarding/imagem-um.png'),
    title: 'Agendamento Fácil e Rápido',
    description: 'Agende consultas diretamente pelo app e acompanhe seu histórico de atendimento',
  },
  {
    image: require('@/assets/images/onboarding/imagem-dois.png'),
    title: 'Dicas de Saúde Bucal com Nossos Dentistas',
    description: 'Assista a vídeos educativos e aprenda a cuidar melhor do seu sorriso',
  },
  {
    image: require('@/assets/images/onboarding/imagem-tres.png'),
    title: 'Dicas para sua Saúde',
    description: 'Assista vídeos educativos com dicas de cuidado bucal',
  },
  {
    image: require('@/assets/images/onboarding/imagem-quatro.png'),
    title: 'Dicas para sua Saúde',
    description: 'Assista vídeos educativos com dicas de cuidado bucal',
  },
];

export default function HomeScreen() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (event: any) => {
    const slide = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(slide);
  };

  return (
    <View style={styles.container}>

      <Image source={require('@/assets/images/logo/logo-branco.png')} style={styles.logo} resizeMode="contain" />

      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.carousel}
      >
        {carouselItems.map((item, index) => (
          <View key={index} style={styles.slide}>
            <Image source={item.image} style={styles.slideImage} />
            <Text style={styles.slideTitle}>{item.title}</Text>
            <Text style={styles.slideDescription}>{item.description}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.dotsContainer}>
        {carouselItems.map((_, i) => (
          <View key={i} style={[styles.dot, i === activeIndex && styles.activeDot]} />
        ))}
      </View>

      <TouchableOpacity 
        style={styles.loginButton}
        onPress={() => router.push('/(auth)/login/login')}>
        <Text style={styles.loginText}>ENTRAR</Text>
      </TouchableOpacity>

      <Text style={styles.noAccessText}>Não tem acesso? Faça agora mesmo:</Text>

      <TouchableOpacity 
        style={styles.firstAccessButton}
        onPress={() => router.push('/(auth)/cadastro/register')}>
        <Text style={styles.firstAccessText}>PRIMEIRO ACESSO</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    paddingTop: 60,
  },
  logo: {
    height: 120
  },
  carousel: {
    flexGrow: 0,
  },
  slide: {
    width: width * 0.8,
    height: 350,
    alignItems: 'center',
    padding: 5,
    backgroundColor: 'white',
    borderRadius: 12,
    marginHorizontal: width * 0.1,
  },
  slideImage: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
  slideTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  slideDescription: {
    fontSize: 14,
    textAlign: 'left',
    color: '#666',
  },
  dotsContainer: {
    flexDirection: 'row',
    marginTop: 12,
  },
  dot: {
    width: 8,
    height: 8,
    backgroundColor: '#fff',
    borderRadius: 4,
    marginHorizontal: 4,
    opacity: 0.5,
  },
  activeDot: {
    opacity: 1,
  },
  loginButton: {
    backgroundColor: '#78F1FF',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 24,
    width: '80%',
    alignItems: 'center',
  },
  loginText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  noAccessText: {
    color: '#fff',
    marginTop: 24,
    fontSize: 14,
    paddingBottom: 20,
  },
  firstAccessButton: {
    borderColor: '#fff',
    borderWidth: 1,
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 8,
    width: '80%',
    alignItems: 'center',
  },
  firstAccessText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
