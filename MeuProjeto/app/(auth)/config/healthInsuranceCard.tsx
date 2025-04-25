import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, StatusBar, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg'; // Instalar npm install react-native-qrcode-svg
import { router } from 'expo-router';

// Importar o hook para obter o idCliente que já temos salvo
import { useIdCliente } from '@/hooks/useIdCliente';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { auth, db } from "../../../firebaseConfig";

export default function HealthInsuranceCardScreen() {
  const [activeTab, setActiveTab] = useState('frente');
  const [userData, setUserData] = useState<{
    nome: string;
    email: string;
    nascimento: string;
    telefone: string;
    codigo: string;
    qrCodeData: string;
    cpf: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  // Obter o idCliente do usuário logado
  const { idCliente, loading: loadingId } = useIdCliente();
  
  /*
  const userData = {
    nome: 'MARIA SILVA SANTOS',
    identificacao: '123.456.789-00',
    nascimento: '15/05/1985',
    plano: 'ODONTO PREMIUM',
    validade: '31/12/2025',
    codigo: 'ODT123456789',
    emissao: '01/01/2023',
    contato: '(11) 98765-4321',
    qrCodeData: 'https://app.odontopremium.com.br/carteira/ODT123456789'
  };
  */

  // Dados fixos para o plano
   const planoData = {
    nome: 'ODONTO PREMIUM',
    validade: '31/12/2025',
    emissao: '01/01/2023',
    qrCodeBase: 'https://app.odontopremium.com.br/carteira/'
  };

   // Buscar dados do usuário do Firestore
   useEffect(() => {
    const fetchUserData = async () => {
      if (!idCliente) return;
      
      try {
        setLoading(true);
        const firestore = db;
        const userDocRef = doc(firestore, 't_usuario', idCliente);
        const userDoc = await getDoc(userDocRef);
          
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData({
            nome: data.nome || 'Nome não informado',
            cpf: data.cpf || 'CPF não informado',
            email: data.email || 'Email não informado',
            nascimento: data.dataNascimento || 'Data não informada',
            telefone: data.telefone || 'Telefone não informado',
            codigo: idCliente, // Usando o idCliente como código
            qrCodeData: `${planoData.qrCodeBase}${idCliente}`
          });
        } else {
          console.log('Documento do usuário não encontrado');
          setUserData({
            nome: 'USUÁRIO NÃO ENCONTRADO',
            cpf: 'CPF NÃO ENCONTRADO',
            email: 'Email não disponível',
            nascimento: 'Data não disponível',
            telefone: 'Telefone não disponível',
            codigo: idCliente,
            qrCodeData: `${planoData.qrCodeBase}${idCliente}`
          });
        }
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [idCliente]);

  // Mostrar indicador de carregamento enquanto os dados estão sendo buscados
  if (loadingId || loading) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#0D6EFD" />
        <Text style={styles.loadingText}>Carregando carteirinha...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#0D6EFD" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Minha Carteirinha</Text>
        <TouchableOpacity>
          <MaterialIcons name="more-vert" size={24} color="#0D6EFD" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Carteirinha */}
        <View style={styles.carteirinhaContainer}>
          {/* Tabs */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'frente' && styles.activeTab]}
              onPress={() => setActiveTab('frente')}
            >
              <Text style={[styles.tabText, activeTab === 'frente' && styles.activeTabText]}>Frente</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'verso' && styles.activeTab]}
              onPress={() => setActiveTab('verso')}
            >
              <Text style={[styles.tabText, activeTab === 'verso' && styles.activeTabText]}>Verso</Text>
            </TouchableOpacity>
          </View>

          {/* Cartão */}
          <View style={styles.cartao}>
            {activeTab === 'frente' ? (
              // Frente do cartão
              <View style={styles.cartaoFrente}>
                <View style={styles.logoContainer}>
                  <View style={styles.logoCircle}>
                    <FontAwesome5 name="tooth" size={28} color="#0D6EFD" />
                  </View>
                  <Text style={styles.logoText}>Odonto Premium</Text>
                </View>
                
                <View style={styles.infoContainer}>
                  <Text style={styles.infoLabel}>Nome</Text>
                  <Text style={styles.infoValue}>{userData?.nome || 'Nome não disponível'}</Text>
                  
                  <View style={styles.infoRow}>
                    <View style={styles.infoCol}>
                      <Text style={styles.infoLabel}>CPF</Text>
                      <Text style={styles.infoValue}>{userData?.cpf || 'Identificação não disponível'}</Text>
                    </View>
                    <View style={styles.infoCol}>
                      <Text style={styles.infoLabel}>Nascimento</Text>
                      <Text style={styles.infoValue}>{userData?.nascimento || 'Data não disponível'}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.infoRow}>
                    <View style={styles.infoCol}>
                      <Text style={styles.infoLabel}>Plano</Text>
                      <Text style={styles.infoValue}>Básico Familiar</Text>
                    </View>
                    <View style={styles.infoCol}>
                      <Text style={styles.infoLabel}>Validade</Text>
                      <Text style={styles.infoValue}>01/12/2025</Text>
                    </View>
                  </View>
                </View>
              </View>
            ) : (
              // Verso do cartão
              <View style={styles.cartaoVerso}>
                <View style={styles.versoContainer}>
                  <View style={styles.qrCodeContainer}>
                    <QRCode
                      value={userData?.qrCodeData || ''}
                      size={120}
                      color="#0D6EFD"
                      backgroundColor="white"
                    />
                  </View>
                  
                  <View style={styles.codigoContainer}>
                    <Text style={styles.codigoLabel}>Código do Beneficiário</Text>
                    <Text style={styles.codigoValue}>{userData?.codigo}</Text>
                  </View>
                  
                  <View style={styles.versoInfoContainer}>
                    <View style={styles.versoInfoItem}>
                      <Text style={styles.versoInfoLabel}>Data de Emissão</Text>
                      <Text style={styles.versoInfoValue}>25/04/2025</Text>
                    </View>
                    <View style={styles.versoInfoItem}>
                      <Text style={styles.versoInfoLabel}>Contato</Text>
                      <Text style={styles.versoInfoValue}>{userData?.telefone}</Text>
                    </View>
                  </View>
                  
                  <Text style={styles.disclaimerText}>
                    Apresente esta carteirinha digital em todos os atendimentos junto com um documento de identificação com foto.
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>
        
        {/* Botões de Ação */}
        <View style={styles.acaoContainer}>
          <TouchableOpacity style={styles.acaoButton}>
            <MaterialIcons name="share" size={20} color="#0D6EFD" />
            <Text style={styles.acaoText}>Compartilhar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.acaoButton, styles.acaoPrimaryButton]}>
            <MaterialIcons name="file-download" size={20} color="white" />
            <Text style={styles.acaoPrimaryText}>Salvar PDF</Text>
          </TouchableOpacity>
        </View>
        
        {/* Informações de contato */}
        <View style={styles.contatoContainer}>
          <Text style={styles.contatoTitle}>Central de Atendimento</Text>
          <View style={styles.contatoItem}>
            <FontAwesome5 name="phone-alt" size={16} color="#0D6EFD" />
            <Text style={styles.contatoText}>0800 123 4567</Text>
          </View>
          <View style={styles.contatoItem}>
            <MaterialIcons name="email" size={16} color="#0D6EFD" />
            <Text style={styles.contatoText}>atendimento@odontopremium.com.br</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#0D6EFD',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0D6EFD',
  },
  scrollContent: {
    padding: 16,
  },
  carteirinhaContainer: {
    marginBottom: 24,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#EEEEEE',
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#777777',
  },
  activeTabText: {
    color: '#0D6EFD',
    fontWeight: '600',
  },
  cartao: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cartaoFrente: {
    padding: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0D6EFD',
  },
  infoContainer: {
    paddingTop: 10,
  },
  infoLabel: {
    fontSize: 12,
    color: '#888888',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoCol: {
    width: '48%',
  },
  cartaoVerso: {
    padding: 20,
  },
  versoContainer: {
    alignItems: 'center',
  },
  qrCodeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  codigoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  codigoLabel: {
    fontSize: 12,
    color: '#888888',
    marginBottom: 4,
  },
  codigoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  versoInfoContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  versoInfoItem: {
    width: '48%',
  },
  versoInfoLabel: {
    fontSize: 12,
    color: '#888888',
    marginBottom: 2,
  },
  versoInfoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
  },
  disclaimerText: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 18,
  },
  acaoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  acaoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#0D6EFD',
    width: '48%',
  },
  acaoPrimaryButton: {
    backgroundColor: '#0D6EFD',
    borderColor: '#0D6EFD',
  },
  acaoText: {
    marginLeft: 8,
    color: '#0D6EFD',
    fontWeight: '600',
    fontSize: 14,
  },
  acaoPrimaryText: {
    marginLeft: 8,
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  contatoContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
  contatoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
  },
  contatoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  contatoText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#333333',
  },
});