import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import firebase, { auth } from '../../../firebaseConfig';
import { doc, getDoc, updateDoc, onSnapshot, increment, getFirestore, collection } from 'firebase/firestore';
import { router } from 'expo-router';

const firestore = getFirestore(firebase);

const userId = auth.currentUser?.uid;



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
  const [pontosUsuario, setPontosUsuario] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [beneficioSelecionado, setBeneficioSelecionado] = useState<any>(null);

  const userId = auth.currentUser?.uid;

  useEffect(() => {
    if (!userId) return;
  
    const unsubscribe = onSnapshot(doc(firestore, 'usuarios', userId), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data?.pontos !== undefined) {
          setPontosUsuario(data.pontos);
        }
      }
    });
  
    return () => unsubscribe();
  }, [userId]);

  // Buscar pontos do Firestore
  useEffect(() => {
    if (!userId) return;

    const unsubscribe = onSnapshot(doc(collection(firestore, 't_usuario'), userId), (docSnap) => {
        const data = docSnap.data();
        if (data?.pontos !== undefined) {
          setPontosUsuario(data.pontos);
        }
    });

    return () => unsubscribe();
  }, [userId]);

  const confirmarTroca = async () => {
    if (!userId || !beneficioSelecionado) return;

    const custo = beneficioSelecionado.pontos;

    if (pontosUsuario < custo) {
      Alert.alert('Pontos insuficientes', 'Você não tem pontos suficientes para esta troca.');
      return;
    }

    try {
      await updateDoc(doc(collection(firestore, 't_usuario'), userId), {
        pontos: increment(-custo),
      });

      setModalVisible(false);
      Alert.alert('Sucesso!', `Você trocou seus pontos por: ${beneficioSelecionado.titulo}`);
    } catch (error) {
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
        <TouchableOpacity>
          <Ionicons name="arrow-back" size={32} color="#005DFF" onPress={() => router.back()}/>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Trocar Pontos</Text>
        <Feather name="gift" size={22} color="#005DFF" />
      </View>

      {/* Pontos */}
      <View style={styles.cardPontos}>
        <Text style={styles.pontosLabel}>Pontos: <Text style={styles.pontos}>{pontosUsuario} pontos</Text></Text>
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
                style={styles.botaoTrocar}
                onPress={() => abrirModal(beneficio)}
              >
                <Text style={styles.botaoTexto}>Trocar</Text>
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
function setPontosUsuario(pontos: any) {
    throw new Error('Function not implemented.');
}

