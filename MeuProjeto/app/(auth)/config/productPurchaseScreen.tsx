// DentalPlanScreen.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  Alert,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { collection, getDocs, doc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../../firebaseConfig';

const DentalPlanScreen = () => {
  const [plans, setPlans] = useState<{ id: string; nome?: string; valor_mensal?: number; categoria?: string; beneficios?: string[]; restricoes?: string; carencia?: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  
  const categories = ['Todos', 'Individual', 'Familiar', 'Empresarial', 'Sênior'];

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "t_produto"));
      const plansData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPlans(plansData);
    } catch (error) {
      console.error("Erro ao buscar planos:", error);
      Alert.alert("Erro", "Não foi possível carregar os planos disponíveis");
    } finally {
      setLoading(false);
    }
  };

interface Plan {
    id: string;
    nome?: string;
    valor_mensal?: number;
    categoria?: string;
    beneficios?: string[];
    restricoes?: string;
    carencia?: number;
}

const selectPlan = (plan: Plan) => {
    setSelectedPlan(plan);
};

  const handlePurchase = async () => {
    if (!selectedPlan) {
      Alert.alert("Erro", "Por favor, selecione um plano");
      return;
    }

    try {
      setLoading(true);
      
      // Informações do usuário atual (assumindo que o usuário está autenticado)
      const userId = auth.currentUser?.uid;
      
      if (!userId) {
        Alert.alert("Erro", "Usuário não autenticado");
        setLoading(false);
        return;
      }
      
      // Registrar a contratação do plano
      await addDoc(collection(db, "t_produto_usuario"), {
        produto_id: selectedPlan.id,
        usuario_id: userId,
        data_contratacao: serverTimestamp(),
        valor_mensal: selectedPlan.valor_mensal,
        ativo: true,
        forma_pagamento: "Cartão de Crédito" // Você pode adicionar um seletor para isso
      });
      
      Alert.alert(
        "Contratação Concluída", 
        `Você contratou o plano ${selectedPlan.nome} com sucesso! Um de nossos consultores entrará em contato para os próximos passos.`,
        [{ text: "OK", onPress: () => setSelectedPlan(null) }]
      );
    } catch (error) {
      console.error("Erro na contratação:", error);
      Alert.alert("Erro", "Ocorreu um erro ao finalizar a contratação");
    } finally {
      setLoading(false);
    }
  };

  const filteredPlans = selectedCategory === 'Todos' 
    ? plans 
    : plans.filter(p => p.categoria === selectedCategory);

  const renderPlan = ({ item }: { item: Plan }) => (
    <TouchableOpacity 
      style={[
        styles.planCard,
        selectedPlan?.id === item.id && styles.selectedPlanCard
      ]}
      onPress={() => selectPlan(item)}
    >
      <View style={styles.planHeader}>
        <Text style={styles.planName}>{item.nome}</Text>
        {selectedPlan?.id === item.id && (
          <Ionicons name="checkmark-circle" size={24} color="#4caf50" />
        )}
      </View>
      
      <View style={styles.planPrice}>
        <Text style={styles.planPriceValue}>R$ {(item.valor_mensal ?? 0).toFixed(2)}</Text>
        <Text style={styles.planPriceFrequency}>/mês</Text>
      </View>
      
      <View style={styles.planDivider} />
      
      <Text style={styles.planCategoryTag}>{item.categoria}</Text>
      
      <Text style={styles.coverageTitle}>Cobertura:</Text>
      <View style={styles.benefitsList}>
        {(item.beneficios ?? []).map((beneficio, index) => (
          <View key={index} style={styles.benefitItem}>
            <Ionicons name="checkmark-circle" size={16} color="#4caf50" />
            <Text style={styles.benefitText}>{beneficio}</Text>
          </View>
        ))}
      </View>
      
      {item.restricoes && (
        <>
          <Text style={styles.restrictionsTitle}>Restrições:</Text>
          <Text style={styles.restrictionsText}>{item.restricoes}</Text>
        </>
      )}
      
      <View style={styles.carenciaInfo}>
        <Ionicons name="time-outline" size={16} color="#ff9800" />
        <Text style={styles.carenciaText}>
          Carência: {item.carencia} dias
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1e88e5" />
        <Text>Carregando planos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <View style={styles.backButtonCircle}>
            <Text style={styles.backButtonIcon}>←</Text>
          </View>
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.title}>Planos de Saúde Bucal</Text>
        <Text style={styles.subtitle}>Encontre o plano ideal para você e sua família</Text>
      </View>
      
      {/* Categorias */}
      <View style={styles.categoriesContainer}>
        <FlatList
          data={categories}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.categoryButton, selectedCategory === item && styles.selectedCategory]}
              onPress={() => setSelectedCategory(item)}
            >
              <Text style={[styles.categoryText, selectedCategory === item && styles.selectedCategoryText]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
      
      {/* Lista de Planos */}
      <View style={styles.plansContainer}>
        <FlatList
          data={filteredPlans}
          keyExtractor={(item) => item.id}
          renderItem={renderPlan}
          contentContainerStyle={styles.planList}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nenhum plano encontrado nesta categoria</Text>
          }
        />
      </View>
      
      {/* Resumo e Botão de Contratação */}
      {selectedPlan && (
        <View style={styles.summaryContainer}>
          <View style={styles.summaryContent}>
            <Text style={styles.summaryTitle}>Resumo da Contratação</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Plano:</Text>
              <Text style={styles.summaryValue}>{selectedPlan.nome}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Valor Mensal:</Text>
              <Text style={styles.summaryValue}>R$ {(selectedPlan.valor_mensal ?? 0).toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Carência:</Text>
              <Text style={styles.summaryValue}>{selectedPlan.carencia} dias</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.purchaseButton} onPress={handlePurchase}>
            <Text style={styles.purchaseButtonText}>Contratar Plano</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  backButton: {
    padding: 5,
    paddingTop: 50
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007BFF',
    paddingTop: 20
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
    marginRight: 10,
  },
  selectedCategory: {
    backgroundColor: '#1e88e5',
  },
  categoryText: {
    color: '#333',
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: '#fff',
  },
  plansContainer: {
    flex: 1,
  },
  planList: {
    paddingBottom: 16,
  },
  planCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedPlanCard: {
    borderColor: '#1e88e5',
    borderWidth: 2,
    backgroundColor: '#f5f9ff',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  planName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  planPrice: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  planPriceValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e88e5',
  },
  planPriceFrequency: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  planDivider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 12,
  },
  planCategoryTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
    color: '#1976d2',
    fontWeight: '500',
    fontSize: 12,
  },
  coverageTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  benefitsList: {
    marginBottom: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  benefitText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#444',
  },
  restrictionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  restrictionsText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  carenciaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff8e1',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  carenciaText: {
    marginLeft: 8,
    color: '#f57c00',
    fontWeight: '500',
  },
  summaryContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    elevation: 2,
  },
  summaryContent: {
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  purchaseButton: {
    backgroundColor: '#4caf50',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  purchaseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#666',
  }
});

export default DentalPlanScreen;