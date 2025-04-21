import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function NotificacoesScreen() {
  const notificacoes = [
    {
      id: '1',
      titulo: 'Lembrete de Consulta Preventiva!',
      data: '12/10/2024',
      mensagem: 'Não se esqueça da sua consulta preventiva agendada para amanhã às 10h no consultório XYZ. A prevenção é o melhor cuidado! 😊',
    },
    {
      id: '2',
      titulo: 'Hora de Cuidar do Sorriso!',
      data: '01/10/2024',
      mensagem: 'Que tal assistir a um vídeo rápido sobre cuidados com as gengivas? Aproveite para pontuar no nosso programa de recompensas!',
    },
    {
      id: '3',
      titulo: 'Pontos de Recompensa Acumulados!',
      data: '30/09/2024',
      mensagem: 'Você ganhou 10 pontos por manter seus cuidados diários em dia! Continue assim e troque seus pontos por recompensas no app!',
    },
    {
      id: '4',
      titulo: 'Dicas Rápidas de Higiene Bucal!',
      data: '29/09/2024',
      mensagem: 'Escovar os dentes após as refeições é essencial, mas você sabia que o cuidado com a língua também é importante? Clique aqui e veja como manter uma higiene bucal completa em poucos minutos!',
    },
    // Adicione mais notificações se quiser garantir que haja scroll
    {
      id: '5',
      titulo: 'Lembrete de Consulta',
      data: '22/09/2024',
      mensagem: 'Sua próxima consulta está agendada para o próximo mês. Fique atento!',
    },
    {
      id: '6',
      titulo: 'Novo Artigo Disponível',
      data: '18/09/2024',
      mensagem: 'Confira nosso novo artigo sobre os benefícios do uso correto do fio dental para saúde bucal completa.',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={router.back}>
            <View style={styles.backButtonCircle}>
            <Text style={styles.backButtonIcon}>←</Text>
            </View>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notificações</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.notificacoesContainer}>
          {notificacoes.map((notificacao) => (
            <TouchableOpacity key={notificacao.id} style={styles.notificacaoCard}>
              <View style={styles.notificacaoHeader}>
                <Text style={styles.notificacaoTitulo}>{notificacao.titulo}</Text>
                <Text style={styles.notificacaoData}>{notificacao.data}</Text>
              </View>
              <Text style={styles.notificacaoMensagem}>{notificacao.mensagem}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
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
    fontSize: 18,
    fontWeight: '600',
    color: '#0D6EFD',
  },
  headerRight: {
    width: 40,
  },
  scrollContainer: {
    flex: 1,
  },
  notificacoesContainer: {
    padding: 16,
  },
  notificacaoCard: {
    backgroundColor: '#6A98E3',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  notificacaoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  notificacaoTitulo: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
    paddingRight: 8,
  },
  notificacaoData: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.85,
  },
  notificacaoMensagem: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
  },
});