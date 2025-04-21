import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, Image, TextInput } from 'react-native';
import { Ionicons, FontAwesome, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function FormasPagamentoScreen() {
  const [metodoPagamentoSelecionado, setMetodoPagamentoSelecionado] = useState('cartao1');
  const [novoCartao, setNovoCartao] = useState(false);
  
  const cartoes = [
    {
      id: 'cartao1',
      tipo: 'visa',
      nome: 'Maria Silva',
      numero: '•••• •••• •••• 4567',
      validade: '10/27',
      cor: '#3359DF',
    },
    {
      id: 'cartao2',
      tipo: 'mastercard',
      nome: 'Maria S Santos',
      numero: '•••• •••• •••• 2345',
      validade: '05/26',
      cor: '#C4007A',
    }
  ];

  const metodosAdicionais = [
    {
      id: 'pix',
      nome: 'PIX',
      icone: 'qrcode',
      iconLib: FontAwesome,
    },
    {
      id: 'boleto',
      nome: 'Boleto',
      icone: 'barcode',
      iconLib: FontAwesome,
    }
  ];

  const renderTipoCartao = (tipo:any) => {
    switch (tipo) {
      case 'visa':
        return <FontAwesome5 name="cc-visa" size={28} color="#FFFFFF" />;
      case 'mastercard':
        return <FontAwesome5 name="cc-mastercard" size={28} color="#FFFFFF" />;
      default:
        return <FontAwesome5 name="credit-card" size={28} color="#FFFFFF" />;
    }
  };

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
        <Text style={styles.headerTitle}>Formas de Pagamento</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Seus Cartões</Text>
        
        {/* Cartões Salvos */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.cartoesContainer}
        >
          {cartoes.map((cartao) => (
            <TouchableOpacity 
              key={cartao.id}
              style={[
                styles.cartaoItem, 
                { backgroundColor: cartao.cor },
                metodoPagamentoSelecionado === cartao.id && styles.cartaoSelecionado
              ]}
              onPress={() => {
                setMetodoPagamentoSelecionado(cartao.id);
                setNovoCartao(false);
              }}
            >
              <View style={styles.cartaoHeader}>
                <View style={styles.cartaoTipo}>
                  {renderTipoCartao(cartao.tipo)}
                </View>
                {metodoPagamentoSelecionado === cartao.id && (
                  <View style={styles.cartaoCheck}>
                    <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
                  </View>
                )}
              </View>
              
              <Text style={styles.cartaoNumero}>{cartao.numero}</Text>
              
              <View style={styles.cartaoFooter}>
                <Text style={styles.cartaoNome}>{cartao.nome}</Text>
                <Text style={styles.cartaoValidade}>{cartao.validade}</Text>
              </View>
            </TouchableOpacity>
          ))}
          
          {/* Adicionar novo cartão */}
          <TouchableOpacity 
            style={styles.novoCartaoItem}
            onPress={() => {
              setNovoCartao(true);
              setMetodoPagamentoSelecionado('novo');
            }}
          >
            <View style={styles.novoCartaoConteudo}>
              <View style={styles.novoCartaoIcone}>
                <Ionicons name="add-circle" size={28} color="#0D6EFD" />
              </View>
              <Text style={styles.novoCartaoTexto}>Adicionar cartão</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
        
        {/* Outros Métodos de Pagamento */}
        <Text style={styles.sectionTitle}>Outros Métodos</Text>
        
        <View style={styles.metodosContainer}>
          {metodosAdicionais.map((metodo) => (
            <TouchableOpacity
              key={metodo.id}
              style={[
                styles.metodoItem,
                metodoPagamentoSelecionado === metodo.id && styles.metodoSelecionado
              ]}
              onPress={() => {
                setMetodoPagamentoSelecionado(metodo.id);
                setNovoCartao(false);
              }}
            >
              <View style={styles.metodoIconeContainer}>
                <metodo.iconLib name={metodo.icone as any} size={20} color={metodoPagamentoSelecionado === metodo.id ? "#0D6EFD" : "#555555"} />
              </View>
              <Text style={[
                styles.metodoNome,
                metodoPagamentoSelecionado === metodo.id && styles.metodoNomeSelecionado
              ]}>
                {metodo.nome}
              </Text>
              {metodoPagamentoSelecionado === metodo.id && (
                <Ionicons name="checkmark-circle" size={22} color="#0D6EFD" />
              )}
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Formulário Novo Cartão */}
        {novoCartao && (
          <View style={styles.formularioContainer}>
            <Text style={styles.formularioTitulo}>Adicionar Novo Cartão</Text>
            
            <View style={styles.campoFormulario}>
              <Text style={styles.campoLabel}>Nome no cartão</Text>
              <TextInput
                style={styles.campoInput}
                placeholder="Nome como está no cartão"
                placeholderTextColor="#999999"
              />
            </View>
            
            <View style={styles.campoFormulario}>
              <Text style={styles.campoLabel}>Número do cartão</Text>
              <View style={styles.numeroCartaoContainer}>
                <TextInput
                  style={styles.campoInput}
                  placeholder="1234 5678 9012 3456"
                  placeholderTextColor="#999999"
                  keyboardType="numeric"
                  maxLength={19}
                />
                <View style={styles.bandeiraCartaoContainer}>
                  <FontAwesome5 name="cc-visa" size={24} color="#999999" style={styles.bandeiraCartaoIcone} />
                  <FontAwesome5 name="cc-mastercard" size={24} color="#999999" />
                </View>
              </View>
            </View>
            
            <View style={styles.camposRow}>
              <View style={[styles.campoFormulario, { width: '48%' }]}>
                <Text style={styles.campoLabel}>Validade</Text>
                <TextInput
                  style={styles.campoInput}
                  placeholder="MM/AA"
                  placeholderTextColor="#999999"
                  keyboardType="numeric"
                  maxLength={5}
                />
              </View>
              
              <View style={[styles.campoFormulario, { width: '48%' }]}>
                <Text style={styles.campoLabel}>CVV</Text>
                <TextInput
                  style={styles.campoInput}
                  placeholder="123"
                  placeholderTextColor="#999999"
                  keyboardType="numeric"
                  maxLength={3}
                  secureTextEntry
                />
              </View>
            </View>
          </View>
        )}
        
        {/* Informação Segurança */}
        <View style={styles.segurancaContainer}>
          <View style={styles.segurancaIcone}>
            <MaterialCommunityIcons name="shield-check" size={24} color="#0D6EFD" />
          </View>
          <Text style={styles.segurancaTexto}>
            Seus dados de pagamento são criptografados com segurança. Nós não armazenamos os dados do seu cartão.
          </Text>
        </View>
      </ScrollView>
      
      {/* Botão Salvar */}
      <View style={styles.botaoContainer}>
        <TouchableOpacity style={styles.botaoContinuar}>
          <Text style={styles.botaoTexto}>
            {novoCartao ? 'Salvar Cartão' : 'Confirmar'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FA',
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
  headerRight: {
    width: 40,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 16,
    marginTop: 8,
  },
  cartoesContainer: {
    paddingRight: 16,
    paddingBottom: 8,
  },
  cartaoItem: {
    width: 300,
    height: 180,
    borderRadius: 16,
    marginRight: 16,
    padding: 20,
    justifyContent: 'space-between',
  },
  cartaoSelecionado: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cartaoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cartaoTipo: {},
  cartaoCheck: {},
  cartaoNumero: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  cartaoFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cartaoNome: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  cartaoValidade: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  novoCartaoItem: {
    width: 130,
    height: 180,
    borderRadius: 16,
    marginRight: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#0D6EFD',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  novoCartaoConteudo: {
    alignItems: 'center',
  },
  novoCartaoIcone: {
    marginBottom: 12,
  },
  novoCartaoTexto: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0D6EFD',
    textAlign: 'center',
  },
  metodosContainer: {
    marginBottom: 24,
  },
  metodoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  metodoSelecionado: {
    borderColor: '#0D6EFD',
    borderWidth: 2,
  },
  metodoIconeContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F7FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  metodoNome: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    flex: 1,
  },
  metodoNomeSelecionado: {
    color: '#0D6EFD',
    fontWeight: '600',
  },
  formularioContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  formularioTitulo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 16,
  },
  campoFormulario: {
    marginBottom: 16,
  },
  campoLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  campoInput: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#333333',
  },
  numeroCartaoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  bandeiraCartaoContainer: {
    flexDirection: 'row',
    position: 'absolute',
    right: 16,
  },
  bandeiraCartaoIcone: {
    marginRight: 8,
  },
  camposRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  segurancaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F0FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  segurancaIcone: {
    marginRight: 12,
  },
  segurancaTexto: {
    fontSize: 13,
    color: '#555555',
    flex: 1,
    lineHeight: 18,
  },
  botaoContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  botaoContinuar: {
    backgroundColor: '#0D6EFD',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  botaoTexto: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});