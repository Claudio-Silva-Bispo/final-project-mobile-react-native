import { IconSymbol } from '@/components/ui/IconSymbol';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, ScrollView, Alert } from 'react-native';
import { CheckBox } from 'react-native-elements';
import firebase from '../../../firebaseConfig';
import { useIdCliente } from '@/hooks/useIdCliente';
import { getFirestore, collection, query, where, getDocs, doc, updateDoc, addDoc } from 'firebase/firestore';
import { useLocalSearchParams } from 'expo-router';

export default function ReagendamentoConsultaScreen() {
  const { idCliente, loading: loadingId } = useIdCliente();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Recuperar os dados da consulta para atualizar ela.
  const { consultaId, data, horario, status } = useLocalSearchParams();
  console.log("O id da consulta recuperado:", consultaId)
  
  // Estados para armazenar os reagendamentos existentes
  const [pendingReagendas, setPendingReagendas] = useState<any[]>([]);
  const [historicReagendas, setHistoricReagendas] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  
  const [selectedDays, setSelectedDays] = useState({
    seg: false,
    ter: false,
    qua: false,
    qui: false,
    sex: false,
    sab: false,
  });
  const [selectedTime, setSelectedTime] = useState({
    manha: false,
    tarde: false,
    noite: false,
  });

  const renderCalendar = () => {
    const weekDays = ['dom.', 'seg.', 'ter.', 'qua.', 'qui.', 'sex.', 'sáb.'];

    const calendar = [
      { week: 5, days: [26, 27, 28, 29, 30, 31, 1] },
      { week: 6, days: [2, 3, 4, 5, 6, 7, 8] },
      { week: 7, days: [9, 10, 11, 12, 13, 14, 15] },
      { week: 8, days: [16, 17, 18, 19, 20, 21, 22] },
      { week: 9, days: [23, 24, 25, 26, 27, 28, 1] },
    ];

    return (
      <View style={styles.calendarContainer}>
        <Text style={styles.calendarMonth}>Fevereiro</Text>

        <View style={styles.weekDaysHeader}>
          {weekDays.map((day, index) => (
            <Text key={index} style={styles.weekDayText}>{day}</Text>
          ))}
        </View>

        {calendar.map((week, index) => (
          <View key={index} style={styles.weekRow}>
            <View style={styles.weekNumberContainer}>
              <Text style={styles.weekNumberText}>{week.week}</Text>
            </View>
            {week.days.map((day, idx) => {
              const key = `${week.week}-${day}`;
              const isSelected = selectedDate === key;
              return (
                <TouchableOpacity
                  key={idx}
                  style={[styles.dayContainer, isSelected && styles.selectedDay]}
                  onPress={() => setSelectedDate(key)}
                >
                  <Text style={[styles.dayText, isSelected && styles.selectedDayText]}>{day}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    );
  };

  const toggleDayPreference = (day: keyof typeof selectedDays) => {
    setSelectedDays(prev => ({ ...prev, [day]: !prev[day] }));
  };

  const toggleTimePreference = (time: keyof typeof selectedTime) => {
    setSelectedTime(prev => ({ ...prev, [time]: !prev[time] }));
  };

  // Função para enviar os dados do reagendamento
  const handleReagendar = async () => {
    if (!idCliente) {
      Alert.alert('Erro', 'Cliente não identificado.');
      return;
    }

    if (!selectedDate) {
      Alert.alert('Atenção', 'Selecione uma data para reagendamento.');
      return;
    }

    try {
      const db = getFirestore(firebase);
      const reagendamentoRef = collection(db, 't_reagendamento_consultas');

      // 1. Buscar registros pendentes para este cliente
      const qPendentes = query(
        reagendamentoRef, 
        where('idCliente', '==', idCliente), 
        where('status', '==', 'pendente')
      );
      const pendentesSnapshot = await getDocs(qPendentes);

      // Atualiza todos os reagendamentos pendentes para "encerrado"
      pendentesSnapshot.forEach(async (docSnap) => {
        const docRef = doc(db, 't_reagendamento_consultas', docSnap.id);
        await updateDoc(docRef, { status: 'encerrado' });
      });

      // 2. Criar novo registro de reagendamento com status "pendente"
      const novoReagendamento = {
        idSugestaoConsulta: consultaId,
        idCliente,
        dataSelecionada: selectedDate,
        diasPreferencia: selectedDays,
        horariosPreferencia: selectedTime,
        status: 'pendente',
        criadoEm: new Date(),
      };

      await addDoc(reagendamentoRef, novoReagendamento);

      Alert.alert('Sucesso', 'Reagendamento enviado com sucesso!');
      // Opcional: Redirecione ou limpe os estados
      // router.back();
    } catch (error) {
      console.error('Erro no reagendamento:', error);
      Alert.alert('Erro', 'Houve um problema ao enviar o reagendamento.');
    }
  };

  // Função para carregar os reagendamentos do cliente
  const loadReagendamentos = async () => {
    if (!idCliente) return;
    try {
      const db = getFirestore(firebase);
      const reagendamentoRef = collection(db, 't_reagendamento_consultas');
      const qTodos = query(reagendamentoRef, where('idCliente', '==', idCliente));
      const snapshot = await getDocs(qTodos);

      const pendentes: any[] = [];
      const historicos: any[] = [];
      
      snapshot.forEach(docSnap => {
        const data: { id: string; status: string } = { id: docSnap.id, ...docSnap.data() as { status: string } };
        if (data.status === 'pendente') {
          pendentes.push(data);
        } else if (data.status === 'encerrado') {
          historicos.push(data);
        }
      });

      setPendingReagendas(pendentes);
      setHistoricReagendas(historicos);
    } catch (error) {
      console.error('Erro ao carregar reagendamentos:', error);
    }
  };

  // useEffect para carregar os reagendamentos assim que o idCliente estiver disponível
  useEffect(() => {
    if (idCliente) {
      loadReagendamentos();
    }
  }, [idCliente]);

  // Função para formatar os dados do card
  const renderPendingCard = () => {
    // Mapeamento para exibir nomes completos
    const daysMapping: { [key: string]: string } = {
      seg: 'Segunda',
      ter: 'Terça',
      qua: 'Quarta',
      qui: 'Quinta',
      sex: 'Sexta',
      sab: 'Sábado',
    };
    const timeMapping: { [key: string]: string } = {
      manha: 'Manhã',
      tarde: 'Tarde',
      noite: 'Noite',
    };

    return pendingReagendas.map(item => {
      // Supondo que dataSelecionada está no formato "7-12" e o dia vem depois do hífen
      const parts = item.dataSelecionada.split('-');
      const diaSelecionado = parts[1] || item.dataSelecionada;

      // Obter os nomes dos dias selecionados
      const diasSelecionados = Object.entries(item.diasPreferencia)
        .filter(([key, value]) => value === true)
        .map(([key]) => daysMapping[key] || key)
        .join(', ');

      // Obter os horários selecionados
      const horariosSelecionados = Object.entries(item.horariosPreferencia)
        .filter(([key, value]) => value === true)
        .map(([key]) => timeMapping[key] || key)
        .join(', ');

      return (
        <View key={item.id} style={styles.cardContent}>
          <Text style={styles.cardLabel}>Data Selecionada:</Text>
          <Text style={styles.cardValue}>{diaSelecionado}</Text>

          <Text style={styles.cardLabel}>Dias de Preferência:</Text>
          <Text style={styles.cardValue}>{diasSelecionados || 'Nenhum'}</Text>

          <Text style={styles.cardLabel}>Horários de Atendimento:</Text>
          <Text style={styles.cardValue}>{horariosSelecionados || 'Nenhum'}</Text>

        </View>
      );
    });
  };

  const renderHistoricCard = () => {
    return historicReagendas.map(item => (
      <View key={item.id} style={styles.cardContent}>
        <Text style={styles.cardLabel}>Data:</Text>
        <Text style={styles.cardValue}>{item.dataSelecionada}</Text>
        <Text style={styles.cardLabel}>Status:</Text>
        <Text style={styles.cardValue}>{item.status}</Text>
      </View>
    ));
  };


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <View style={styles.backButtonCircle}>
              <Text style={styles.backButtonIcon}>←</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Minhas Consultas</Text>
          <TouchableOpacity style={styles.calendarButton}>
            <IconSymbol size={38} name="calendar" color={'#0066FF'} />
          </TouchableOpacity>
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.sectionTitle}>Reagendamento da Consulta</Text>

          <View style={styles.calendarWrapper}>{renderCalendar()}</View>

          <Text style={styles.preferenceTitle}>Dias de Preferência</Text>
          <View style={styles.daysPreferenceContainer}>
            {['seg', 'ter', 'qua', 'qui', 'sex', 'sab'].map(day => (
              <CheckBox
                key={day}
                title={day.charAt(0).toUpperCase() + day.slice(1)}
                checked={selectedDays[day as keyof typeof selectedDays]}
                onPress={() => toggleDayPreference(day as keyof typeof selectedDays)}
                containerStyle={styles.checkboxContainer}
                textStyle={styles.checkboxText}
              />
            ))}
          </View>

          <Text style={styles.preferenceTitle}>Horário de Atendimento</Text>
          <View style={styles.timePreferenceContainer}>
            {['manha', 'tarde', 'noite'].map(time => (
              <CheckBox
                key={time}
                title={time.charAt(0).toUpperCase() + time.slice(1)}
                checked={selectedTime[time as keyof typeof selectedTime]}
                onPress={() => toggleTimePreference(time as keyof typeof selectedTime)}
                containerStyle={styles.checkboxContainer}
                textStyle={styles.checkboxText}
              />
            ))}
          </View>
        </View>
        <TouchableOpacity style={styles.acceptButton} onPress={handleReagendar}>
                    <Text style={styles.acceptButtonText}>REAGENDAR</Text>
        </TouchableOpacity>

        {/* Card de Reagendamentos */}
        <View style={styles.cardContainer}>
          <Text style={styles.cardTitle}>Reagendamentos</Text>
          {/* Card com reagendamento pendente */}
          {pendingReagendas.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.cardSubtitle}>Pendente</Text>
              {renderPendingCard()}
            </View>
          )}

          {/* Botão para mostrar/ocultar histórico */}
          <TouchableOpacity onPress={() => setShowHistory(!showHistory)} style={styles.historyToggleButton}>
            <Text style={styles.historyToggleButtonText}>
              {showHistory ? 'Ocultar Histórico' : 'Mostrar Histórico'}
            </Text>
          </TouchableOpacity>

          {/* Card para reagendamentos históricos */}
          {showHistory && historicReagendas.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.cardSubtitle}>Atendimentos encerrados</Text>
              {renderHistoricCard()}
            </View>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: { padding: 5 },
  backButtonCircle: {
    backgroundColor: '#007BFF',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonIcon: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#007BFF' },
  calendarButton: { padding: 8 },
  calendarIcon: { fontSize: 24 },
  contentContainer: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 40 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#0A3D91', marginBottom: 20 },
  calendarWrapper: {
    backgroundColor: '#E8F7FC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  calendarContainer: { width: '100%' },
  calendarMonth: { textAlign: 'center', color: '#666', marginBottom: 10, fontSize: 16 },
  weekDaysHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
    paddingLeft: 24,
  },
  weekDayText: { color: '#666', fontSize: 14, flex: 1, textAlign: 'center' },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
    alignItems: 'center',
  },
  weekNumberContainer: {
    width: 24,
    height: 24,
    backgroundColor: '#333',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  weekNumberText: { color: 'white', fontSize: 14 },
  dayContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  dayText: { fontSize: 14, color: '#000' },
  selectedDay: { backgroundColor: '#007BFF' },
  selectedDayText: { color: '#FFF' },
  preferenceTitle: { fontSize: 16, fontWeight: '600', marginTop: 3, marginBottom: 0, color: '#333' },
  daysPreferenceContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  timePreferenceContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  checkboxContainer: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: 0,
    margin: 5,
    width: '30%',
  },
  checkboxText: { 
    fontWeight: '400', 
    fontSize: 14 
  },
  acceptButton: {
    backgroundColor: '#007BFF',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginBottom: 12,
    width: '90%',
    left: 20,
  },
  acceptButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cardContainer: { paddingHorizontal: 20, marginBottom: 20 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#0A3D91', marginBottom: 10 },
  card: {
    backgroundColor: '#E8F7FC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },
  cardSubtitle: { fontSize: 16, fontWeight: '600', color: '#007BFF', marginBottom: 8 },
  cardContent: { marginBottom: 8 },
  cardText: { fontSize: 14, color: '#333' },
  historyToggleButton: {
    backgroundColor: '#007BFF',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  cardLabel: { fontSize: 14, fontWeight: '600', color: '#333' },
  cardValue: { fontSize: 14, color: '#555', marginBottom: 6 },
  historyToggleButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
