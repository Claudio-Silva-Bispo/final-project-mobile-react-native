import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  StatusBar, 
  ScrollView,
  Alert
} from 'react-native';
import firebase from '../../../firebaseConfig'; // Importe sua configuração do Firebase aqui
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { router } from 'expo-router';

// Componente de checkbox customizado
const CustomCheckbox = ({ 
  checked, 
  onPress, 
  label 
}: { 
  checked: boolean; 
  onPress: () => void; 
  label: string;
}) => {
  return (
    <View style={styles.checkboxContainer}>
      <TouchableOpacity 
        style={[styles.customCheckbox, checked ? styles.customCheckboxChecked : {}]} 
        onPress={onPress}
      >
        {checked && <Text style={styles.checkmark}>✓</Text>}
      </TouchableOpacity>
      <Text style={styles.checkboxLabel}>{label}</Text>
    </View>
  );
};

const RotinaDeCuidados = () => {
  // Estados para armazenar as seleções do usuário
  const [escovacaoDiaria, setEscovacaoDiaria] = useState('');
  const [usoDeFioDental, setUsoDeFioDental] = useState('');
  const [enxaguante, setEnxaguante] = useState<string[]>([]);
  const [limpezaProfissional, setLimpezaProfissional] = useState('');

  // Função para manipular a seleção de checkbox único (radio-like behavior)
  const handleSingleSelection = (setValue: React.Dispatch<React.SetStateAction<string>>, value: string): void => {
    setValue(value);
  };

  // Função para manipular a seleção de múltiplos checkboxes
  const handleMultipleSelection = (
    setValue: React.Dispatch<React.SetStateAction<string[]>>, 
    currentValues: string[], 
    value: string
  ): void => {
    if (currentValues.includes(value)) {
      setValue(currentValues.filter((item: string) => item !== value));
    } else {
      setValue([...currentValues, value]);
    }
  };

  // Função para enviar dados para o Firebase
  const salvarDados = async () => {
    try {
      // Verificar se pelo menos um item foi selecionado em cada categoria
      if (!escovacaoDiaria) {
        Alert.alert('Erro', 'Por favor, selecione uma frequência de escovação diária.');
        return;
      }
      if (!usoDeFioDental) {
        Alert.alert('Erro', 'Por favor, selecione uma frequência de uso do fio dental.');
        return;
      }
      if (enxaguante.length === 0) {
        Alert.alert('Erro', 'Por favor, selecione pelo menos um período para enxaguante bucal.');
        return;
      }
      if (!limpezaProfissional) {
        Alert.alert('Erro', 'Por favor, selecione uma frequência de limpeza profissional.');
        return;
      }

      const db = getFirestore(firebase); // Initialize Firestore
      const rotinaDados = {
        escovacaoDiaria,
        usoDeFioDental,
        enxaguante,
        limpezaProfissional,
        criadoEm: serverTimestamp(),
      };

      // Enviar para o Firebase
      await addDoc(collection(db, 'rotinasDeCuidados'), rotinaDados);

      Alert.alert(
        'Sucesso',
        'Dados de rotina de cuidados salvos com sucesso!',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao salvar os dados. Tente novamente.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header com botão de voltar */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rotina de Cuidados</Text>
      </View>
      
      <ScrollView style={styles.scrollView}>
        {/* Frequência de Escovação */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequência de Escovação Diária</Text>
          <View style={styles.optionsContainer}>
            <CustomCheckbox
              checked={escovacaoDiaria === '1x'}
              onPress={() => handleSingleSelection(setEscovacaoDiaria, '1x')}
              label="1x"
            />
            
            <CustomCheckbox
              checked={escovacaoDiaria === '2x'}
              onPress={() => handleSingleSelection(setEscovacaoDiaria, '2x')}
              label="2x"
            />
            
            <CustomCheckbox
              checked={escovacaoDiaria === '3x ou mais'}
              onPress={() => handleSingleSelection(setEscovacaoDiaria, '3x ou mais')}
              label="3x ou mais"
            />
          </View>
        </View>
        
        {/* Separador */}
        <View style={styles.divider} />
        
        {/* Frequência de Uso do Fio Dental */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequência de Uso do Fio Dental</Text>
          <View style={styles.optionsContainer}>
            <CustomCheckbox
              checked={usoDeFioDental === '1x'}
              onPress={() => handleSingleSelection(setUsoDeFioDental, '1x')}
              label="1x"
            />
            
            <CustomCheckbox
              checked={usoDeFioDental === '2x'}
              onPress={() => handleSingleSelection(setUsoDeFioDental, '2x')}
              label="2x"
            />
            
            <CustomCheckbox
              checked={usoDeFioDental === '3x ou mais'}
              onPress={() => handleSingleSelection(setUsoDeFioDental, '3x ou mais')}
              label="3x ou mais"
            />
          </View>
        </View>
        
        {/* Separador */}
        <View style={styles.divider} />
        
        {/* Enxaguante Bucal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Enxaguante Bucal</Text>
          <View style={styles.optionsContainer}>
            <CustomCheckbox
              checked={enxaguante.includes('Manhã')}
              onPress={() => handleMultipleSelection(setEnxaguante, enxaguante, 'Manhã')}
              label="Manhã"
            />
            
            <CustomCheckbox
              checked={enxaguante.includes('Tarde')}
              onPress={() => handleMultipleSelection(setEnxaguante, enxaguante, 'Tarde')}
              label="Tarde"
            />
            
            <CustomCheckbox
              checked={enxaguante.includes('Noite')}
              onPress={() => handleMultipleSelection(setEnxaguante, enxaguante, 'Noite')}
              label="Noite"
            />
          </View>
        </View>
        
        {/* Separador */}
        <View style={styles.divider} />
        
        {/* Limpeza Profissional */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Limpeza Profissional</Text>
          <View style={styles.optionsContainer}>
            <CustomCheckbox
              checked={limpezaProfissional === 'A cada 3 meses'}
              onPress={() => handleSingleSelection(setLimpezaProfissional, 'A cada 3 meses')}
              label="A cada 3 meses"
            />
            
            <CustomCheckbox
              checked={limpezaProfissional === 'A cada 6 meses'}
              onPress={() => handleSingleSelection(setLimpezaProfissional, 'A cada 6 meses')}
              label="A cada 6 meses"
            />
            
            <CustomCheckbox
              checked={limpezaProfissional === 'Uma vez por ano'}
              onPress={() => handleSingleSelection(setLimpezaProfissional, 'Uma vez por ano')}
              label="Uma vez por ano"
            />
          </View>
        </View>
      </ScrollView>
      
      {/* Botão de salvar */}
      <TouchableOpacity 
        style={styles.saveButton}
        onPress={salvarDados}
      >
        <Text style={styles.saveButtonText}>SALVAR DADOS</Text>
      </TouchableOpacity>
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
    padding: 8,
  },
  backButtonIcon: {
    fontSize: 30,
    color: '#0066FF',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0066FF',
    marginLeft: 8,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  optionsContainer: {
    marginLeft: 8,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  // Estilos para o checkbox customizado
  customCheckbox: {
    width: 22,
    height: 22,
    borderWidth: 1,
    borderColor: '#9E9E9E',
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customCheckboxChecked: {
    backgroundColor: '#0066FF',
    borderColor: '#0066FF',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  saveButton: {
    backgroundColor: '#0066FF',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
    borderRadius: 4,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RotinaDeCuidados;