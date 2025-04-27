import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
// Pegar o idCliente com base no idAutenticacao ou seja, do usuário logado
import { useIdCliente } from '@/hooks/useIdCliente';

const { width } = Dimensions.get('window');

const atividades = [
  { nome: 'Completar o cadastro pessoal', tabela: 't_usuario', pontos: 20 },
  { nome: 'Cadastrar endereço de residência', tabela: 't_endereco_residencia_usuario', pontos: 20 },
  { nome: 'Cadastrar endereço de preferência', tabela: 't_endereco_preferencia_usuario', pontos: 20 },
  { nome: 'Cadastrar dia de preferência', tabela: 't_dia_preferencia_usuario', pontos: 20 },
  { nome: 'Cadastrar turno de preferência', tabela: 't_turno_preferencia_usuario', pontos: 20 },
  { nome: 'Responder um feedback', tabela: 't_feedback', pontos: 50 },
  { nome: 'Realizar uma consulta sugerida', tabela: 't_consultas', pontos: 300 },
  { nome: 'Assistir três vídeos preventivos', tabela: 't_videos', pontos: 200 },
];

export default function BenefictsProgram() {
  const [atividadesConcluidas, setAtividadesConcluidas] = useState<string[]>([]);
  const [pontosTotais, setPontosTotais] = useState(0);
  const { idCliente, loading: loadingId } = useIdCliente();

  useEffect(() => {
    const carregarStatus = async () => {
      if (!idCliente || loadingId) return;
      
      const firestore = getFirestore();
      const concluídas: string[] = [];
      let pontos = 0;

      // Verificar cada atividade usando queries para encontrar documentos com o idCliente
      for (const atividade of atividades) {
        const colecaoRef = collection(firestore, atividade.tabela);
        const q = query(colecaoRef, where("idCliente", "==", idCliente));
        
        try {
          const querySnapshot = await getDocs(q);
          
          // Se encontrou pelo menos um documento com este idCliente, considera a atividade concluída
          if (!querySnapshot.empty) {
            concluídas.push(atividade.nome);
            pontos += atividade.pontos;
          }
        } catch (error) {
          console.error(`Erro ao verificar atividade ${atividade.nome}:`, error);
        }
      }

      setAtividadesConcluidas(concluídas);
      setPontosTotais(pontos);
    };

    carregarStatus();
  }, [idCliente, loadingId]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={32} color="#005DFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Recompensas</Text>
        <Text style={styles.gift}>🎁</Text>
      </View>

      {/* Pontos totais */}
      <View style={styles.pointsBox}>
        <Text style={styles.pointsText}>Você acumulou:</Text>
        <Text style={styles.totalPoints}>{pontosTotais} pontos</Text>
        <Text style={styles.pointsDesc}>
          Complete atividades e acumule pontos para trocar por recompensas exclusivas!
        </Text>
        <TouchableOpacity style={styles.exchangeBtn} onPress={() => router.push('/(auth)/config/trocarPontosScreen')}>
          <Text style={styles.exchangeText}>trocar pontos</Text>
        </TouchableOpacity>
      </View>

      {/* Título da seção */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Como avançar</Text>
        <Text style={styles.sectionSubtitle}>
          Realize as atividades abaixo para acumular pontos e subir de nível.
        </Text>
      </View>

      {/* Lista de atividades */}
      {atividades.map((atividade, index) => {
        const concluido = atividadesConcluidas.includes(atividade.nome);
        return (
          <View key={index} style={[styles.card, concluido && styles.cardCompleted]}>
            <View style={styles.cardTop}>
              <View style={styles.cardIconPlaceholder}>
                <Text style={{ color: '#999' }}>✓</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{atividade.nome}</Text>
                <Text style={styles.cardDesc}>{atividade.pontos} pontos</Text>
              </View>
              <View style={concluido ? styles.statusTagCompleted : styles.statusTag}>
                <Text style={styles.statusText}>{concluido ? 'completo' : `${atividade.pontos}pts`}</Text>
              </View>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    flex: 1,
  },
  header: {
    marginTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backArrow: {
    fontSize: 22,
    color: '#08c8f8',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#005DFF',
  },
  gift: {
    fontSize: 22,
  },
  pointsBox: {
    backgroundColor: '#005DFF',
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
  },
  pointsText: {
    fontSize: 16,
    color: '#fff',
  },
  totalPoints: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 4,
  },
  pointsDesc: {
    color: '#fff',
    marginTop: 8,
    marginBottom: 15,
  },
  exchangeBtn: {
    backgroundColor: '#f35d5d',
    alignSelf: 'flex-start',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  exchangeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  section: {
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#002B7F',
    fontWeight: 'bold',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#444',
    marginTop: 4,
  },
  card: {
    marginTop: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 14,
    backgroundColor: '#fff',
  },
  cardCompleted: {
    backgroundColor: '#e0f8e9',
    borderColor: '#0f9954',
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardIconPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    color: '#002B7F',
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 13,
    color: '#555',
  },
  statusTag: {
    backgroundColor: '#eee',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusTagCompleted: {
    backgroundColor: '#0f9954',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});