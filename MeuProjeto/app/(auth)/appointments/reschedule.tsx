import { IconSymbol } from '@/components/ui/IconSymbol';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { CheckBox } from 'react-native-elements';

export default function ReagendamentoConsultaScreen() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
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
        <TouchableOpacity style={styles.acceptButton}>
                    <Text style={styles.acceptButtonText}>REAGENDAR</Text>
                  </TouchableOpacity>
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
  preferenceTitle: { fontSize: 16, fontWeight: '600', marginTop: 20, marginBottom: 10, color: '#333' },
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
    marginTop: 8,
    marginBottom: 12,
    width: '90%',
    left: 20,
  },
  acceptButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
