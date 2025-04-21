import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { db } from '../../../firebaseConfig';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

export default function FeedbackScreen() {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      alert('Por favor, selecione uma nota de 1 a 5 estrelas.');
      return;
    }

    setIsSubmitting(true);

    try {
      await addDoc(collection(db, 't_feedback'), {
        nota: rating,
        comentario: comment,
        dataEnvio: Timestamp.now()
      });

      alert('Feedback enviado com sucesso!');
      setRating(0);
      setComment('');
      router.back();
    } catch (error) {
      console.error('Erro ao enviar feedback:', error);
      alert('Erro ao enviar feedback. Tente novamente mais tarde.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <View style={styles.backButtonCircle}>
            <Text style={styles.backButtonIcon}>←</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Conteúdo */}
      <View style={styles.contentContainer}>
        <Text style={styles.sectionTitle}>Feedback</Text>

        <Text style={styles.inputLabel}>Como você avalia o atendimento?</Text>

        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((i) => (
            <TouchableOpacity key={i} onPress={() => setRating(i)}>
              <FontAwesome
                name={i <= rating ? 'star' : 'star-o'}
                size={36}
                color={i <= rating ? '#FFC107' : '#007BFF'}
              />
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.inputLabel}>Deixe um comentário:</Text>
        <TextInput
          style={styles.textAreaInput}
          multiline
          numberOfLines={6}
          placeholder="Digite aqui"
          placeholderTextColor="#A0A0A0"
          value={comment}
          onChangeText={setComment}
        />

        <TouchableOpacity style={styles.sendButton} onPress={handleSubmit} disabled={isSubmitting}>
          <Text style={styles.sendButtonText}>ENVIAR</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: { padding: 5 },
  backButtonCircle: {
    backgroundColor: '#007BFF',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonIcon: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  contentContainer: { paddingHorizontal: 20, paddingTop: 10 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0A3D91',
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    color: '#0A3D91',
    marginBottom: 12,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 8,
  },
  textAreaInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 16,
    height: 150,
    textAlignVertical: 'top',
    fontSize: 16,
    color: '#333',
  },
  sendButton: {
    backgroundColor: '#007BFF',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
