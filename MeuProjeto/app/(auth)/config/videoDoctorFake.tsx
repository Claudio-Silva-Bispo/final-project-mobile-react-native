import { router } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function VideoDoctorFake({ navigation }: any) {
  return (
    <View style={styles.container}>
      {/* Imagem de fundo simulando o vídeo */}
      <Image
        source={require('@/assets/images/video/imagem-um.png')}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />

      {/* Botão de fechar (X) */}
      <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
        <Text style={styles.closeText}>×</Text>
      </TouchableOpacity>

      {/* Botão de play no centro */}
      <TouchableOpacity style={styles.playButton}>
        <Text style={styles.playText}>▶</Text>
      </TouchableOpacity>

      {/* Rodapé com informações */}
      <View style={styles.footer}>
        <View style={styles.profileContainer}>
          <Image
            source={require('@/assets/images/video/imagem-um.png')}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.name}>Dra. Letícia Almeida</Text>
            <Text style={styles.specialty}>Especialidade: Clínico Geral</Text>
            <Text style={styles.city}>Cidade: Adamantina</Text>
          </View>
        </View>

        {/* Barra de progresso simulada */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: '40%' }]} />
          </View>
          <Text style={styles.timer}>1:33</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  playButton: {
    position: 'absolute',
    top: height * 0.4,
    left: width * 0.43,
    zIndex: 5,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 50,
    padding: 12,
  },
  playText: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    paddingHorizontal: 20,
    paddingVertical: 25,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  name: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  specialty: {
    color: '#dcdcdc',
    fontSize: 14,
  },
  city: {
    color: '#dcdcdc',
    fontSize: 14,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressBarBackground: {
    flex: 1,
    height: 5,
    backgroundColor: '#888',
    borderRadius: 3,
  },
  progressBarFill: {
    height: 5,
    backgroundColor: '#08c8f8',
    borderRadius: 3,
  },
  timer: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 8,
  },
});
