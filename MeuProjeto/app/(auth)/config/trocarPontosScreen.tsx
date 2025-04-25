import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import firebase, { auth } from '../../../firebaseConfig';
import { doc, getDoc, updateDoc, onSnapshot, increment, getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { router } from 'expo-router';
import { useIdCliente } from '@/hooks/useIdCliente';

const firestore = getFirestore(firebase);
const { width } = Dimensions.get('window');

const atividades = [
  { nome: 'Completar o cadastro pessoal', tabela: 't_usuario', pontos: 20 },
  { nome: 'Cadastrar endereço de residência', tabela: 't_endereco_residencia_usuario', pontos: 20 },
  { nome: 'Cadastrar endereço de preferência', tabela: 't_endereco_preferencia_usuario', pontos: 20 },
  { nome: 'Cadastrar dia de preferência', tabela: 't_dia_preferencia_usuario', pontos: 20 },
  { nome: 'Cadastrar turno de preferência', tabela: 't_turno_preferencia_usuario', pontos: 20 },
  { nome: 'Responder um feedback', tabela: 't_feedback', pontos: 50 },
  { nome: 'Realizar uma consulta sugerida', tabela: 't_consultas', pontos: 100 },
  { nome: 'Assistir três vídeos preventivos', tabela: 't_videos', pontos: 10 },
];

const beneficios = [
  {
    id: '1',
    titulo: 'Kit de Higiene Bucal',
    pontos: 750,
    descricao: 'Troque seus pontos por um kit com escova, fio dental e enxaguante',
    imagem: require('@/assets/images/programa-beneficios/imagem-dois.png'),
  },
  {
    id: '2',
    titulo: 'Clareamento Dental Caseiro',
    pontos: 2000,
    descricao: 'Sorriso Brilhante! Troque seus pontos por um clareamento dental caseiro',
    imagem: require('@/assets/images/programa-beneficios/imagem-tres.png'),
  },
  {
    id: '3',
    titulo: 'Voucher Netflix',
    pontos: 3000,
    descricao: 'Relax e Diversão! Aproveite suas séries favoritas',
    imagem: require('@/assets/images/programa-beneficios/imagem-quatro.png'),
  },
];

export default function TrocarPontosScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [beneficioSelecionado, setBeneficioSelecionado] = useState<any>(null);
  const [atividadesConcluidas, setAtividadesConcluidas] = useState<string[]>([]);
  const [pontosTotais, setPontosTotais] = useState(0);
  const { idCliente, loading: loadingId } = useIdCliente();

  // Calcular pontos com base nas atividades concluídas
  useEffect(() => {
    const carregarStatus = async () => {
      if (!idCliente || loadingId) return;
      
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

  const confirmarTroca = async () => {
    if (!idCliente || !beneficioSelecionado) return;

    const custo = beneficioSelecionado.pontos;

    if (pontosTotais < custo) {
      Alert.alert('Pontos insuficientes', 'Você não tem pontos suficientes para esta troca.');
      return;
    }

    try {
      // Atualizar os pontos no documento do usuário
      // Assumindo que você tem uma tabela especial para armazenar os pontos do usuário
      const userRef = doc(firestore, 't_usuario', idCliente);
      
      // Verificar se o documento existe
      const docSnap = await getDoc(userRef);
      
      if (docSnap.exists()) {
        // Atualizar documento existente com decremento de pontos
        await updateDoc(userRef, {
          pontos: increment(-custo),
        });
      } else {
        console.error("Documento do usuário não encontrado");
        Alert.alert('Erro', 'Não foi possível encontrar seus dados. Por favor, tente novamente mais tarde.');
        return;
      }

      // Registrar a troca de pontos
      // Você pode adicionar um novo documento em uma coleção 't_trocas_pontos' se quiser
      
      setModalVisible(false);
      Alert.alert('Sucesso!', `Você trocou seus pontos por: ${beneficioSelecionado.titulo}`);
      
      // Atualizar os pontos após a troca
      setPontosTotais(pontosTotais - custo);
      
    } catch (error) {
      console.error("Erro ao trocar pontos:", error);
      Alert.alert('Erro', 'Houve um problema ao processar a troca. Tente novamente.');
    }
  };

  const abrirModal = (beneficio: any) => {
    setBeneficioSelecionado(beneficio);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={32} color="#005DFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Trocar Pontos</Text>
        <Feather name="gift" size={22} color="#005DFF" />
      </View>

      {/* Pontos */}
      <View style={styles.cardPontos}>
        <Text style={styles.pontosLabel}>Pontos: <Text style={styles.pontos}>{pontosTotais} pontos</Text></Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>O que você tem disponível</Text>
        <Text style={styles.subtitle}>Conheça as bonificações que você terá ao realizar as atividades propostas</Text>
        <Text style={styles.section}>Conheça os Benefícios</Text>

        {beneficios.map((beneficio) => (
          <View key={beneficio.id} style={styles.card}>
            <Image source={beneficio.imagem} style={styles.imagem} />
            <View style={styles.cardContent}>
              <Text style={styles.beneficioTitulo}>{beneficio.titulo}</Text>
              <Text style={styles.pontosRequisito}>{beneficio.pontos}pts</Text>
              <Text style={styles.descricao}>{beneficio.descricao}</Text>
              <TouchableOpacity
                style={[
                  styles.botaoTrocar,
                  pontosTotais < beneficio.pontos && styles.botaoDesabilitado
                ]}
                onPress={() => abrirModal(beneficio)}
                disabled={pontosTotais < beneficio.pontos}
              >
                <Text style={styles.botaoTexto}>
                  {pontosTotais < beneficio.pontos ? 'Pontos insuficientes' : 'Trocar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Modal de confirmação */}
      <Modal isVisible={modalVisible}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTexto}>Deseja trocar {beneficioSelecionado?.pontos} pontos por:</Text>
          <Text style={styles.modalTitulo}>{beneficioSelecionado?.titulo}</Text>

          <View style={styles.modalBotoes}>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.btnCancelar}>
              <Text style={{ color: '#005DFF' }}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={confirmarTroca} style={styles.btnConfirmar}>
              <Text style={{ color: '#fff' }}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingTop: 40
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#005DFF',
  },
  cardPontos: {
    backgroundColor: '#005DFF',
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
  },
  pontosLabel: {
    fontSize: 16,
    color: '#fff',
  },
  pontos: {
    fontWeight: 'bold',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
    color: '#001C55',
  },
  subtitle: {
    fontSize: 14,
    color: '#444',
    marginBottom: 16,
  },
  section: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#001C55',
  },
  card: {
    backgroundColor: '#005DFF',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  imagem: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 12,
  },
  beneficioTitulo: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pontosRequisito: {
    color: '#FF4D4D',
    fontSize: 14,
    marginVertical: 4,
  },
  descricao: {
    color: '#fff',
    fontSize: 13,
  },
  botaoTrocar: {
    marginTop: 10,
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  botaoDesabilitado: {
    backgroundColor: '#ccc',
  },
  botaoTexto: {
    color: '#005DFF',
    fontWeight: 'bold',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
  },
  modalTexto: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  modalTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#005DFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalBotoes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btnCancelar: {
    padding: 10,
  },
  btnConfirmar: {
    backgroundColor: '#005DFF',
    padding: 10,
    borderRadius: 8,
  },
});