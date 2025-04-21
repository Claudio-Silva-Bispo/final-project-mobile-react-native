import { router } from 'expo-router';
import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';

const PrivacyPolicyScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Política de Privacidade</Text>
      </View>
      
      <ScrollView style={styles.contentContainer}>
        <Text style={styles.title}>Política de Privacidade</Text>
        <Text style={styles.lastUpdated}>Última atualização: 21 de abril de 2025</Text>
        
        <Text style={styles.paragraph}>
          Bem-vindo à nossa Política de Privacidade. Sua privacidade é importante para nós, e estamos comprometidos em proteger e respeitar suas informações pessoais.
        </Text>
        
        <Text style={styles.sectionTitle}>1. Quais informações coletamos</Text>
        <Text style={styles.paragraph}>
          Podemos coletar os seguintes tipos de informações:
        </Text>
        <Text style={styles.bulletPoint}>• Informações que você nos fornece: nome, endereço de e-mail, número de telefone e outras informações de contato.</Text>
        <Text style={styles.bulletPoint}>• Informações de uso: como você utiliza nosso aplicativo e serviços.</Text>
        <Text style={styles.bulletPoint}>• Informações do dispositivo: modelo do dispositivo, sistema operacional, identificadores únicos.</Text>
        <Text style={styles.bulletPoint}>• Dados de localização: com sua permissão, podemos coletar dados sobre sua localização.</Text>
        
        <Text style={styles.sectionTitle}>2. Como usamos suas informações</Text>
        <Text style={styles.paragraph}>
          Utilizamos suas informações para:
        </Text>
        <Text style={styles.bulletPoint}>• Fornecer, manter e melhorar nossos serviços</Text>
        <Text style={styles.bulletPoint}>• Personalizar sua experiência</Text>
        <Text style={styles.bulletPoint}>• Comunicar-nos com você sobre atualizações e promoções</Text>
        <Text style={styles.bulletPoint}>• Análise de uso e melhorias no aplicativo</Text>
        <Text style={styles.bulletPoint}>• Cumprir obrigações legais</Text>
        
        <Text style={styles.sectionTitle}>3. Compartilhamento de informações</Text>
        <Text style={styles.paragraph}>
          Podemos compartilhar suas informações com:
        </Text>
        <Text style={styles.bulletPoint}>• Parceiros de negócios e prestadores de serviços que nos ajudam a operar nosso aplicativo</Text>
        <Text style={styles.bulletPoint}>• Autoridades públicas quando exigido por lei</Text>
        <Text style={styles.bulletPoint}>• Em caso de fusão, venda ou transferência de ativos</Text>
        
        <Text style={styles.sectionTitle}>4. Segurança dos dados</Text>
        <Text style={styles.paragraph}>
          Implementamos medidas técnicas e organizacionais apropriadas para proteger suas informações pessoais contra perda acidental ou acesso, uso, alteração ou divulgação não autorizados.
        </Text>
        
        <Text style={styles.sectionTitle}>5. Seus direitos</Text>
        <Text style={styles.paragraph}>
          Você tem o direito de:
        </Text>
        <Text style={styles.bulletPoint}>• Acessar as informações que temos sobre você</Text>
        <Text style={styles.bulletPoint}>• Corrigir informações imprecisas</Text>
        <Text style={styles.bulletPoint}>• Solicitar a exclusão de suas informações</Text>
        <Text style={styles.bulletPoint}>• Retirar seu consentimento a qualquer momento</Text>
        <Text style={styles.bulletPoint}>• Apresentar uma reclamação à autoridade de proteção de dados relevante</Text>
        
        <Text style={styles.sectionTitle}>6. Alterações nesta política</Text>
        <Text style={styles.paragraph}>
          Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre quaisquer alterações publicando a nova Política de Privacidade nesta página e atualizando a data da "última atualização".
        </Text>
        
        <Text style={styles.sectionTitle}>7. Entre em contato</Text>
        <Text style={styles.paragraph}>
          Se você tiver dúvidas sobre esta Política de Privacidade, entre em contato conosco em:
        </Text>
        <Text style={styles.contact}>contato@seuaplicativo.com.br</Text>
        <Text style={styles.contact}>+55 (11) 1234-5678</Text>
        
        <View style={styles.footer}>
          <TouchableOpacity style={styles.acceptButton}>
            <Text style={styles.acceptButtonText}>Aceitar e Continuar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginRight: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#2196F3',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginRight: 32,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333333',
  },
  lastUpdated: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 24,
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 8,
    color: '#333333',
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333333',
    marginBottom: 16,
  },
  bulletPoint: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333333',
    marginBottom: 8,
    paddingLeft: 8,
  },
  contact: {
    fontSize: 16,
    color: '#2196F3',
    marginBottom: 8,
  },
  footer: {
    marginTop: 32,
    marginBottom: 24,
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  acceptButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PrivacyPolicyScreen;