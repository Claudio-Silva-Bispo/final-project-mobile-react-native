import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { useIdCliente } from '@/hooks/useIdCliente';

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

const InicioScreen = () => {
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
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.headerImage}>
        <View style={styles.headerContent}>
          <Ionicons name="notifications-outline" size={32} color="#fff" onPress={() => router.push('/(auth)/config/notification')}/>
          <Image source={require('@/assets/images/logo/logo-branco.png')} style={styles.logo} />
          <TouchableOpacity onPress={() => router.push('/(auth)/config/clienteDetails')}>
            <Image source={require('@/assets/images/main/imagem-dois.png')} style={styles.avatar} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.container}>
        {/* Próximo Agendamento */}
        <View style={styles.appointment}>
          <Ionicons name="calendar-outline" size={32} color="#003EA6" />
          <View style={styles.divider} />
          <View style={styles.appointmentDetails}>
            <Text style={styles.appointmentText}>Próximo Agendamento</Text>
            <Text style={styles.appointmentDate}>02/10/2024 às 14:20</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.pointsContainer}>
            <Text style={styles.points}>Você tem</Text>
            {/*<Text style={styles.textAppointment}>184</Text>*/} 
            <Text style={styles.textAppointment}>{pontosTotais}</Text>
            <Text style={styles.points}>Pontos</Text>
          </View>
        </View>

        {/* OdontoDica */}
        <View style={styles.tipSection}>
          <Text style={styles.tipTitle}>#OdontoDica</Text>
          <Image source={require('@/assets/images/main/imagem-um.png')} style={styles.tipImage} />
          <Text style={styles.tipText}>
            Dente do siso{'\n'}
            Todo mundo precisa fazer a extração? Confira a dica da Dra. Letícia Almeida.{'\n\n'}
            <Text style={styles.linkText} onPress={() => router.push('/(auth)/config/videoTrailScreen')}>Saiba mais</Text>
          </Text>
        </View>

        {/* Pontuação */}
        <View style={styles.card}>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>Acompanhe sua pontuação e ganhe recompensas!</Text>
            <Text style={styles.cardText}>
              Cada consulta ou indicação conta pontos que você pode trocar por benefícios exclusivos. Mantenha seu sorriso em dia e acumule vantagens!
            </Text>
            <TouchableOpacity style={styles.planButton} onPress={() => router.push('/(auth)/config/benefictsProgram')}>
              <Text style={styles.planButtonText}>Confira seus pontos</Text>
            </TouchableOpacity>
          </View>
          <Image
            source={require('@/assets/images/main/imagem-tres.png')}
            style={styles.cardImage}
            resizeMode="cover"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: '#fff',
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
  appointment: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f6ff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  appointmentDetails: {
    flex: 1,
    alignItems: 'center',
  },
  appointmentText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#003EA6',
  },
  appointmentDate: {
    fontSize: 12,
    color: '#333',
    marginTop: 4,
  },
  divider: {
    width: 1,
    height: '70%',
    backgroundColor: '#007bff',
    marginHorizontal: 8,
  },
  pointsContainer: {
    alignItems: 'center',
  },
  textAppointment: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  points: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#003EA6',
  },
  tipSection: {
    marginBottom: 20,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#003EA6',
    marginBottom: 8,
  },
  tipImage: {
    width: '100%',
    height: 150,
    borderRadius: 12,
  },
  tipText: {
    fontSize: 14,
    color: '#444',
    marginTop: 5,
  },
  linkText: {
    color: '#003EA6',
    fontWeight: 'bold',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#f2f8ff',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#003399',
    marginBottom: 6,
  },
  cardText: {
    fontSize: 10,
    color: '#003EA6',
    marginBottom: 12,
  },
  planButton: {
    backgroundColor: '#0057FF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  planButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginLeft: 16,
  },
});

export default InicioScreen;
