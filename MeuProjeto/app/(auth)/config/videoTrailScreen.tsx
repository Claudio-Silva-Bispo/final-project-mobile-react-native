import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions, 
  ActivityIndicator,
  Modal
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { getFirestore, collection, query, where, getDocs, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import firebase from '../../../firebaseConfig';
import { useIdCliente } from '@/hooks/useIdCliente';

const { width } = Dimensions.get('window');
const firestore = getFirestore(firebase);

interface VideoBase {
    id: string;
    titulo: string;
    descricao: string;
    duracao: string;
    thumbnail: any;
    url: string;
    categoria: string;
    pontos: number;
}

// Dados simulados de vídeos
const videosData: VideoBase[] = [
  {
    id: 'video1',
    titulo: 'Escovação Correta',
    descricao: 'Aprenda a técnica perfeita para escovação dos dentes',
    duracao: '3:45',
    thumbnail: require('@/assets/images/video/imagem-quatro.png'),
    url: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    categoria: 'Higiene',
    pontos: 3
  },
  {
    id: 'video2',
    titulo: 'Uso do Fio Dental',
    descricao: 'Instruções para usar corretamente o fio dental diariamente',
    duracao: '2:30',
    thumbnail: require('@/assets/images/video/imagem-cinco.png'),
    url: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    categoria: 'Higiene',
    pontos: 3
  },
  {
    id: 'video3',
    titulo: 'Alimentos para Dentes Saudáveis',
    descricao: 'Conheça alimentos que ajudam a manter seus dentes fortes',
    duracao: '4:15',
    thumbnail: require('@/assets/images/video/imagem-seis.png'),
    url: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    categoria: 'Alimentação',
    pontos: 4
  },
  {
    id: 'video4',
    titulo: 'Prevenção de Cáries',
    descricao: 'Dicas importantes para evitar o surgimento de cáries',
    duracao: '5:20',
    thumbnail: require('@/assets/images/video/imagem-sete.png'),
    url: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    categoria: 'Prevenção',
    pontos: 4
  },
  {
    id: 'video5',
    titulo: 'Saúde Bucal Infantil',
    descricao: 'Cuide da saúde bucal das crianças desde cedo',
    duracao: '3:50',
    thumbnail: require('@/assets/images/video/imagem-oito.png'),
    url: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    categoria: 'Infantil',
    pontos: 3
  }
];

export default function VideosTrilhaScreen() {
  const [videosAssistidos, setVideosAssistidos] = useState<Record<string, VideoStatus>>({});
  const [loading, setLoading] = useState(true);
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [videoAtual, setVideoAtual] = useState<Video | null>(null);
  const [videoStatus, setVideoStatus] = useState({});
  const [categorias, setCategorias] = useState<string[]>([]);
  const { idCliente, loading: loadingId } = useIdCliente();
  const [videoRef, setVideoRef] = useState<Video | null>(null);
  const [progresso, setProgresso] = useState(0);

  // Carregar status dos vídeos no carregamento inicial
  useEffect(() => {
    if (loadingId || !idCliente) return;

    // Agrupar vídeos por categoria
    const categoriasUnicas = [...new Set(videosData.map(v => v.categoria))];
    setCategorias(categoriasUnicas);

    const carregarStatusVideos = async () => {
      try {
        setLoading(true);
        const videosRef = collection(firestore, 't_videos');
        const q = query(videosRef, where("idCliente", "==", idCliente));
        const querySnapshot = await getDocs(q);
        
        const statusVideos: Record<string, { assistido: boolean; dataAssistido: Date; percentualAssistido: number }> = {};
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          statusVideos[data.videoId] = {
            assistido: true,
            dataAssistido: data.dataAssistido,
            percentualAssistido: data.percentualAssistido || 100
          };
        });
        
        setVideosAssistidos(statusVideos);
        
        // Calcular progresso geral
        const totalVideos = videosData.length;
        const assistidos = Object.keys(statusVideos).length;
        setProgresso(Math.round((assistidos / totalVideos) * 100));
        
      } catch (error) {
        console.error("Erro ao carregar status dos vídeos:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarStatusVideos();
  }, [idCliente, loadingId]);

interface VideoBase {
    id: string;
    titulo: string;
    descricao: string;
    duracao: string;
    thumbnail: any;
    url: string;
    categoria: string;
    pontos: number;
}

interface Video extends VideoBase {
    pauseAsync?(): unknown;
}

interface VideoStatus {
    assistido: boolean;
    dataAssistido: Date;
    percentualAssistido: number;
}

const registrarVisualizacao = async (video: Video): Promise<void> => {
    if (!idCliente) return;
    
    try {
        const videoId = video.id;
        const agora = new Date();
        
        // Criar ou atualizar o registro na coleção t_videos
        const videoDocRef = doc(firestore, 't_videos', `${idCliente}_${videoId}`);
        
        await setDoc(videoDocRef, {
            idCliente: idCliente,
            videoId: videoId,
            titulo: video.titulo,
            dataAssistido: agora,
            percentualAssistido: 100,
            pontos: video.pontos
        });
        
        // Atualizar a lista local de vídeos assistidos
        setVideosAssistidos((prev: Record<string, VideoStatus>) => ({
            ...prev,
            [videoId]: {
                assistido: true,
                dataAssistido: agora,
                percentualAssistido: 100
            }
        }));
        
        // Atualizar o progresso geral
        const totalVideos = videosData.length;
        const assistidos = Object.keys({ ...videosAssistidos, [videoId]: true }).length;
        setProgresso(Math.round((assistidos / totalVideos) * 100));
        
        // Opcional: Adicionar pontos ao usuário
        const userRef = doc(firestore, 't_usuario', idCliente);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
            await updateDoc(userRef, {
                pontos: (userDoc.data().pontos || 0) + video.pontos
            });
        }
        
    } catch (error) {
        console.error("Erro ao registrar visualização:", error);
    }
};

  const abrirVideo = (video: Video) => {
    setVideoAtual(video);
    setVideoModalVisible(true);
    
    // Simular que o vídeo foi assistido após 3 segundos
    setTimeout(() => {
      registrarVisualizacao(video);
    }, 3000);
  };

  const fecharVideo = () => {
    setVideoModalVisible(false);
    setVideoAtual(null);
    
  };

const getProgressoCategoria = (categoria: string): number => {
    const videosDaCategoria: Video[] = videosData.filter(v => v.categoria === categoria);
    const videosAssistidosDaCategoria: Video[] = videosDaCategoria.filter(v => videosAssistidos[v.id]);
    
    return Math.round((videosAssistidosDaCategoria.length / videosDaCategoria.length) * 100);
};

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#005DFF" />
        <Text style={styles.loadingText}>Carregando vídeos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={32} color="#005DFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Vídeos Educativos</Text>
        <Ionicons name="videocam" size={24} color="#005DFF" />
      </View>

      {/* Barra de progresso geral */}
      <View style={styles.progressoContainer}>
        <View style={styles.progressoHeader}>
          <Text style={styles.progressoTitulo}>Seu progresso</Text>
          <Text style={styles.progressoPorcentagem}>{progresso}%</Text>
        </View>
        <View style={styles.progressoBar}>
          <View style={[styles.progressoFill, { width: `${progresso}%` }]} />
        </View>
      </View>

      {/* Conteúdo principal - Lista de trilhas por categoria */}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {categorias.map((categoria) => (
          <View key={categoria} style={styles.categoriaSection}>
            <View style={styles.categoriaTituloRow}>
              <Text style={styles.categoriaTitulo}>{categoria}</Text>
              <Text style={styles.categoriaPorcentagem}>
                {getProgressoCategoria(categoria)}% completo
              </Text>
            </View>
            
            {/* Lista de vídeos nesta categoria */}
            {videosData
              .filter(video => video.categoria === categoria)
              .map((video) => {
                const assistido = videosAssistidos[video.id];
                
                return (
                  <TouchableOpacity 
                    key={video.id} 
                    style={[
                      styles.videoCard,
                      assistido ? styles.videoCardAssistido : {}
                    ]}
                    onPress={() => abrirVideo(video)}
                  >
                    <View style={styles.videoThumbnailContainer}>
                      <Image source={video.thumbnail} style={styles.videoThumbnail} />
                      {assistido && (
                        <View style={styles.videoWatched}>
                          <MaterialIcons name="check-circle" size={24} color="#0f9954" />
                        </View>
                      )}
                      <View style={styles.videoDuration}>
                        <Text style={styles.videoDurationText}>{video.duracao}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.videoInfo}>
                      <Text style={styles.videoTitulo}>{video.titulo}</Text>
                      <Text style={styles.videoDescricao}>{video.descricao}</Text>
                      <View style={styles.videoMetaInfo}>
                        <View style={styles.videoPontos}>
                          <Text style={styles.videoPontosText}>{video.pontos} pts</Text>
                        </View>
                        {assistido && (
                          <Text style={styles.videoAssistidoText}>Assistido</Text>
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
          </View>
        ))}
        
        <View style={styles.footer} />
      </ScrollView>
      
      {/* Modal do vídeo */}
      <Modal
        visible={videoModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={fecharVideo}
        >
            <View style={styles.videoModalContainer}>
            <View style={styles.videoModalHeader}>
                <TouchableOpacity onPress={fecharVideo} style={styles.videoModalClose}>
                <Ionicons name="close" size={28} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.videoModalTitle}>{videoAtual?.titulo}</Text>
                <View style={{ width: 28 }} />
            </View>

            <View style={styles.videoPlayer}>
                {videoAtual && (
                <Image
                    source={videoAtual.thumbnail}
                    style={styles.video}
                    resizeMode="contain"
                />
                )}
            </View>

            <View style={styles.videoModalInfo}>
                <Text style={styles.videoModalInfoTitle}>{videoAtual?.titulo}</Text>
                <Text style={styles.videoModalInfoDesc}>{videoAtual?.descricao}</Text>
                
                <View style={styles.videoModalMeta}>
                <View style={styles.videoModalPontos}>
                    <Text style={styles.videoModalPontosText}>
                    {videoAtual?.pontos} pontos
                    </Text>
                </View>
                <Text style={styles.videoModalDuracao}>{videoAtual?.duracao}</Text>
                </View>
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#005DFF',
  },
  progressoContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f8f8f8',
  },
  progressoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressoTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#002B7F',
  },
  progressoPorcentagem: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f9954',
  },
  progressoBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressoFill: {
    height: '100%',
    backgroundColor: '#0f9954',
    borderRadius: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  categoriaSection: {
    marginTop: 20,
    marginBottom: 10,
  },
  categoriaTituloRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoriaTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#002B7F',
  },
  categoriaPorcentagem: {
    fontSize: 14,
    color: '#0f9954',
  },
  videoCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  videoCardAssistido: {
    borderLeftWidth: 4,
    borderLeftColor: '#0f9954',
  },
  videoThumbnailContainer: {
    width: 120,
    height: 90,
    position: 'relative',
  },
  videoThumbnail: {
    width: '100%',
    height: '100%',
  },
  videoWatched: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 12,
    padding: 2,
  },
  videoDuration: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  videoDurationText: {
    color: '#fff',
    fontSize: 12,
  },
  videoInfo: {
    flex: 1,
    padding: 10,
  },
  videoTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#002B7F',
    marginBottom: 4,
  },
  videoDescricao: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
  },
  videoMetaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  videoPontos: {
    backgroundColor: '#005DFF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  videoPontosText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  videoAssistidoText: {
    color: '#0f9954',
    fontWeight: 'bold',
    fontSize: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#005DFF',
  },
  footer: {
    height: 40,
  },
  videoModalContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
  },
  videoModalClose: {
    padding: 4,
  },
  videoModalTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  videoPlayer: {
    width: '100%',
    height: 240,
    backgroundColor: '#000',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  videoModalInfo: {
    padding: 16,
    backgroundColor: '#fff',
    flex: 1,
  },
  videoModalInfoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#002B7F',
    marginBottom: 8,
  },
  videoModalInfoDesc: {
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
    lineHeight: 22,
  },
  videoModalMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  videoModalPontos: {
    backgroundColor: '#005DFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  videoModalPontosText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  videoModalDuracao: {
    color: '#666',
    fontWeight: 'bold',
  }
});