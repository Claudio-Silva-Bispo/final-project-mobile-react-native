import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar,
  Switch,
  Alert 
} from 'react-native';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import firebase from '../../../firebaseConfig';
import { router } from 'expo-router';

export default function PreferenciasAtendimentoScreen() {
  const auth = getAuth(firebase);
  const firestore = getFirestore(firebase);
  const userId = auth.currentUser?.uid;

  // Estados para cada preferência
  const [diaSelecionado, setDiaSelecionado] = useState<string | null>(null);
  const [turnoSelecionado, setTurnoSelecionado] = useState<string | null>(null);
  const [tipoAtendimentoSelecionado, setTipoAtendimentoSelecionado] = useState<string | null>(null);
  const [acessibilidadeSelecionada, setAcessibilidadeSelecionada] = useState<string | null>(null);
  const [receberNotificacoes, setReceberNotificacoes] = useState(false);
  const [canaisNotificacao, setCanaisNotificacao] = useState({
    whatsapp: false,
    email: false,
    sms: false,
    push: false
  });

  // Opções disponíveis
  const diasSemana = [
    { id: 'segunda', nome: 'Segunda-feira' },
    { id: 'terca', nome: 'Terça-feira' },
    { id: 'quarta', nome: 'Quarta-feira' },
    { id: 'quinta', nome: 'Quinta-feira' },
    { id: 'sexta', nome: 'Sexta-feira' },
    { id: 'sabado', nome: 'Sábado' },
    { id: 'qualquer', nome: 'Qualquer dia' }
  ];

  const turnos: { id: string; nome: string; horario: string; icone: "weather-sunny" | "weather-partly-cloudy" | "weather-night" }[] = [
    { id: 'manha', nome: 'Manhã', horario: '08:00 - 12:00', icone: 'weather-sunny' },
    { id: 'tarde', nome: 'Tarde', horario: '13:00 - 17:00', icone: 'weather-partly-cloudy' },
    { id: 'noite', nome: 'Noite', horario: '18:00 - 21:00', icone: 'weather-night' }
  ];

  const tiposAtendimento: { id: string; nome: string; descricao: string; icone: "email" | "sms" | "store" | "videocam" | undefined }[] = [
      { id: 'presencial', nome: 'Presencial', descricao: 'Atendimento na clínica', icone: 'store' },
      { id: 'remoto', nome: 'Remoto', descricao: 'Teleconsulta online', icone: 'videocam' }
  ];

  const tiposAcessibilidade = [
    { id: 'cadeirante', nome: 'Cadeirante', icone: 'wheelchair-accessibility' },
    { id: 'visual', nome: 'Deficiência Visual', icone: 'eye-off' },
    { id: 'auditiva', nome: 'Deficiência Auditiva', icone: 'hearing-disabled' },
    { id: 'mobilidade', nome: 'Mobilidade Reduzida', icone: 'accessible' },
    { id: 'nenhuma', nome: 'Nenhuma', icone: 'check-circle' }
  ];

  // Carregar preferências existentes
  useEffect(() => {
    if (!userId) return;

    const carregarPreferencias = async () => {
      try {
        // Carregar dia
        const diaDoc = await getDoc(doc(firestore, 't_preferencia_dia', userId));
        if (diaDoc.exists()) {
          setDiaSelecionado(diaDoc.data().preferencia);
        }

        // Carregar turno
        const turnoDoc = await getDoc(doc(firestore, 't_preferencia_turno', userId));
        if (turnoDoc.exists()) {
          setTurnoSelecionado(turnoDoc.data().preferencia);
        }

        // Carregar tipo de atendimento
        const tipoDoc = await getDoc(doc(firestore, 't_preferencia_tipo_atendimento', userId));
        if (tipoDoc.exists()) {
          setTipoAtendimentoSelecionado(tipoDoc.data().preferencia);
        }

        // Carregar acessibilidade
        const acessibilidadeDoc = await getDoc(doc(firestore, 't_preferencia_acessibilidade', userId));
        if (acessibilidadeDoc.exists()) {
          setAcessibilidadeSelecionada(acessibilidadeDoc.data().preferencia);
        }

        // Carregar notificações
        const notifDoc = await getDoc(doc(firestore, 't_preferencia_notificacao', userId));
        if (notifDoc.exists()) {
          setReceberNotificacoes(notifDoc.data().ativo);
          setCanaisNotificacao(notifDoc.data().canais || {
            whatsapp: false,
            email: false,
            sms: false,
            push: false
          });
        }
      } catch (error) {
        console.error("Erro ao carregar preferências:", error);
        Alert.alert("Erro", "Não foi possível carregar suas preferências.");
      }
    };

    carregarPreferencias();
  }, [userId]);

  // Funções para salvar no Firebase
  const salvarPreferenciaDia = async () => {
    if (!userId || !diaSelecionado) return;
    
    try {
      await setDoc(doc(firestore, 't_preferencia_dia', userId), {
        preferencia: diaSelecionado,
        dataAtualizacao: new Date().toISOString()
      });
      Alert.alert("Sucesso", "Preferência de dia salva com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar preferência de dia:", error);
      Alert.alert("Erro", "Não foi possível salvar sua preferência de dia.");
    }
  };

  const salvarPreferenciaTurno = async () => {
    if (!userId || !turnoSelecionado) return;
    
    try {
      await setDoc(doc(firestore, 't_preferencia_turno', userId), {
        preferencia: turnoSelecionado,
        dataAtualizacao: new Date().toISOString()
      });
      Alert.alert("Sucesso", "Preferência de turno salva com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar preferência de turno:", error);
      Alert.alert("Erro", "Não foi possível salvar sua preferência de turno.");
    }
  };

  const salvarPreferenciaTipoAtendimento = async () => {
    if (!userId || !tipoAtendimentoSelecionado) return;
    
    try {
      await setDoc(doc(firestore, 't_preferencia_tipo_atendimento', userId), {
        preferencia: tipoAtendimentoSelecionado,
        dataAtualizacao: new Date().toISOString()
      });
      Alert.alert("Sucesso", "Preferência de tipo de atendimento salva com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar preferência de tipo de atendimento:", error);
      Alert.alert("Erro", "Não foi possível salvar sua preferência de tipo de atendimento.");
    }
  };

  const salvarPreferenciaAcessibilidade = async () => {
    if (!userId || !acessibilidadeSelecionada) return;
    
    try {
      await setDoc(doc(firestore, 't_preferencia_acessibilidade', userId), {
        preferencia: acessibilidadeSelecionada,
        dataAtualizacao: new Date().toISOString()
      });
      Alert.alert("Sucesso", "Preferência de acessibilidade salva com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar preferência de acessibilidade:", error);
      Alert.alert("Erro", "Não foi possível salvar sua preferência de acessibilidade.");
    }
  };

  const salvarPreferenciaNotificacao = async () => {
    if (!userId) return;
    
    try {
      await setDoc(doc(firestore, 't_preferencia_notificacao', userId), {
        ativo: receberNotificacoes,
        canais: canaisNotificacao,
        dataAtualizacao: new Date().toISOString()
      });
      Alert.alert("Sucesso", "Preferências de notificação salvas com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar preferências de notificação:", error);
      Alert.alert("Erro", "Não foi possível salvar suas preferências de notificação.");
    }
  };

  // Alternar canal de notificação
  const toggleCanalNotificacao = (canal: keyof typeof canaisNotificacao) => {
    setCanaisNotificacao(prev => ({
      ...prev,
      [canal]: !prev[canal]
    }));
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
        <Text style={styles.headerTitle}>Preferências de Atendimento</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Dias da Semana */}
        <View style={styles.secao}>
          <Text style={styles.secaoTitulo}>Dia de Preferência</Text>
          <Text style={styles.secaoDescricao}>Escolha o melhor dia da semana para seu atendimento</Text>
          
          <View style={styles.opcoesContainer}>
            {diasSemana.map((dia) => (
              <TouchableOpacity 
                key={dia.id}
                style={[
                  styles.opcaoDia, 
                  diaSelecionado === dia.id && styles.opcaoSelecionada
                ]}
                onPress={() => setDiaSelecionado(dia.id)}
              >
                <Text style={[
                  styles.opcaoDiaTexto,
                  diaSelecionado === dia.id && styles.opcaoTextoSelecionado
                ]}>
                  {dia.nome}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <TouchableOpacity 
            style={[styles.botaoSalvar, !diaSelecionado && styles.botaoDesabilitado]}
            onPress={salvarPreferenciaDia}
            disabled={!diaSelecionado}
          >
            <Text style={styles.botaoSalvarTexto}>Salvar Preferência de Dia</Text>
          </TouchableOpacity>
        </View>

        {/* Turnos */}
        <View style={styles.secao}>
          <Text style={styles.secaoTitulo}>Turno de Preferência</Text>
          <Text style={styles.secaoDescricao}>Escolha o melhor período para seu atendimento</Text>
          
          <View style={styles.turnosContainer}>
            {turnos.map((turno) => (
              <TouchableOpacity 
                key={turno.id}
                style={[
                  styles.turnoItem,
                  turnoSelecionado === turno.id && styles.turnoSelecionado
                ]}
                onPress={() => setTurnoSelecionado(turno.id)}
              >
                <View style={styles.turnoIconeContainer}>
                  <MaterialCommunityIcons 
                    name={turno.icone} 
                    size={28} 
                    color={turnoSelecionado === turno.id ? "#0D6EFD" : "#555555"} 
                  />
                </View>
                <View style={styles.turnoInfo}>
                  <Text style={[
                    styles.turnoNome,
                    turnoSelecionado === turno.id && styles.turnoTextoSelecionado
                  ]}>
                    {turno.nome}
                  </Text>
                  <Text style={[
                    styles.turnoHorario,
                    turnoSelecionado === turno.id && styles.turnoHorarioSelecionado
                  ]}>
                    {turno.horario}
                  </Text>
                </View>
                {turnoSelecionado === turno.id && (
                  <Ionicons name="checkmark-circle" size={24} color="#0D6EFD" />
                )}
              </TouchableOpacity>
            ))}
          </View>
          
          <TouchableOpacity 
            style={[styles.botaoSalvar, !turnoSelecionado && styles.botaoDesabilitado]}
            onPress={salvarPreferenciaTurno}
            disabled={!turnoSelecionado}
          >
            <Text style={styles.botaoSalvarTexto}>Salvar Preferência de Turno</Text>
          </TouchableOpacity>
        </View>

        {/* Tipo de Atendimento */}
        <View style={styles.secao}>
          <Text style={styles.secaoTitulo}>Tipo de Atendimento</Text>
          <Text style={styles.secaoDescricao}>Você prefere atendimento presencial ou remoto?</Text>
          
          <View style={styles.tiposContainer}>
            {tiposAtendimento.map((tipo) => (
              <TouchableOpacity 
                key={tipo.id}
                style={[
                  styles.tipoItem,
                  tipoAtendimentoSelecionado === tipo.id && styles.tipoSelecionado
                ]}
                onPress={() => setTipoAtendimentoSelecionado(tipo.id)}
              >
                <View style={styles.tipoIconeContainer}>
                  <MaterialIcons 
                    name={tipo.icone} 
                    size={28} 
                    color={tipoAtendimentoSelecionado === tipo.id ? "#0D6EFD" : "#555555"} 
                  />
                </View>
                <View style={styles.tipoInfo}>
                  <Text style={[
                    styles.tipoNome,
                    tipoAtendimentoSelecionado === tipo.id && styles.tipoTextoSelecionado
                  ]}>
                    {tipo.nome}
                  </Text>
                  <Text style={styles.tipoDescricao}>
                    {tipo.descricao}
                  </Text>
                </View>
                {tipoAtendimentoSelecionado === tipo.id && (
                  <Ionicons name="checkmark-circle" size={24} color="#0D6EFD" />
                )}
              </TouchableOpacity>
            ))}
          </View>
          
          <TouchableOpacity 
            style={[styles.botaoSalvar, !tipoAtendimentoSelecionado && styles.botaoDesabilitado]}
            onPress={salvarPreferenciaTipoAtendimento}
            disabled={!tipoAtendimentoSelecionado}
          >
            <Text style={styles.botaoSalvarTexto}>Salvar Tipo de Atendimento</Text>
          </TouchableOpacity>
        </View>

        {/* Acessibilidade */}
        <View style={styles.secao}>
          <Text style={styles.secaoTitulo}>Acessibilidade</Text>
          <Text style={styles.secaoDescricao}>Você precisa de algum recurso de acessibilidade?</Text>
          
          <View style={styles.acessibilidadeContainer}>
            {tiposAcessibilidade.map((tipo) => (
              <TouchableOpacity 
                key={tipo.id}
                style={[
                  styles.acessibilidadeItem,
                  acessibilidadeSelecionada === tipo.id && styles.acessibilidadeSelecionada
                ]}
                onPress={() => setAcessibilidadeSelecionada(tipo.id)}
              >
                <View style={styles.acessibilidadeIconeContainer}>
                  <MaterialIcons 
                    /*name={tipo.icone} */
                    size={24} 
                    color={acessibilidadeSelecionada === tipo.id ? "#0D6EFD" : "#555555"} 
                  />
                </View>
                <Text style={[
                  styles.acessibilidadeNome,
                  acessibilidadeSelecionada === tipo.id && styles.acessibilidadeTextoSelecionado
                ]}>
                  {tipo.nome}
                </Text>
                {acessibilidadeSelecionada === tipo.id && (
                  <Ionicons name="checkmark-circle" size={20} color="#0D6EFD" />
                )}
              </TouchableOpacity>
            ))}
          </View>
          
          <TouchableOpacity 
            style={[styles.botaoSalvar, !acessibilidadeSelecionada && styles.botaoDesabilitado]}
            onPress={salvarPreferenciaAcessibilidade}
            disabled={!acessibilidadeSelecionada}
          >
            <Text style={styles.botaoSalvarTexto}>Salvar Preferência de Acessibilidade</Text>
          </TouchableOpacity>
        </View>

        {/* Notificações */}
        <View style={styles.secao}>
          <Text style={styles.secaoTitulo}>Notificações</Text>
          
          <View style={styles.notificacaoSwitch}>
            <Text style={styles.notificacaoTexto}>Deseja receber notificações?</Text>
            <Switch
              trackColor={{ false: "#dddddd", true: "#a0c4ff" }}
              thumbColor={receberNotificacoes ? "#0D6EFD" : "#f4f3f4"}
              onValueChange={() => setReceberNotificacoes(prev => !prev)}
              value={receberNotificacoes}
            />
          </View>
          
          {receberNotificacoes && (
            <View style={styles.canaisContainer}>
              <Text style={styles.canaisTexto}>Por quais canais?</Text>
              
              <TouchableOpacity 
                style={[
                  styles.canalItem,
                  canaisNotificacao.whatsapp && styles.canalSelecionado
                ]}
                onPress={() => toggleCanalNotificacao('whatsapp')}
              >
                <MaterialCommunityIcons 
                  name="whatsapp" 
                  size={24} 
                  color={canaisNotificacao.whatsapp ? "#0D6EFD" : "#555555"} 
                />
                <Text style={[
                  styles.canalTexto,
                  canaisNotificacao.whatsapp && styles.canalSelecionado
                ]}>
                  WhatsApp
                </Text>
                {canaisNotificacao.whatsapp && (
                  <Ionicons name="checkmark-circle" size={20} color="#0D6EFD" />
                )}
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.canalItem,
                  canaisNotificacao.email && styles.canalSelecionado
                ]}
                onPress={() => toggleCanalNotificacao('email')}
              >
                <MaterialIcons 
                  name="email" 
                  size={24} 
                  color={canaisNotificacao.email ? "#0D6EFD" : "#555555"} 
                />
                <Text style={[
                  styles.canalTexto,
                  canaisNotificacao.email && styles.canalSelecionado
                ]}>
                  E-mail
                </Text>
                {canaisNotificacao.email && (
                  <Ionicons name="checkmark-circle" size={20} color="#0D6EFD" />
                )}
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.canalItem,
                  canaisNotificacao.sms && styles.canalSelecionado
                ]}
                onPress={() => toggleCanalNotificacao('sms')}
              >
                <MaterialIcons 
                  name="sms" 
                  size={24} 
                  color={canaisNotificacao.sms ? "#0D6EFD" : "#555555"} 
                />
                <Text style={[
                  styles.canalTexto,
                  canaisNotificacao.sms && styles.canalSelecionado
                ]}>
                  SMS
                </Text>
                {canaisNotificacao.sms && (
                  <Ionicons name="checkmark-circle" size={20} color="#0D6EFD" />
                )}
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.canalItem,
                  canaisNotificacao.push && styles.canalSelecionado
                ]}
                onPress={() => toggleCanalNotificacao('push')}
              >
                <MaterialIcons 
                  name="notifications" 
                  size={24} 
                  color={canaisNotificacao.push ? "#0D6EFD" : "#555555"} 
                />
                <Text style={[
                  styles.canalTexto,
                  canaisNotificacao.push && styles.canalSelecionado
                ]}>
                  Push
                </Text>
                {canaisNotificacao.push && (
                  <Ionicons name="checkmark-circle" size={20} color="#0D6EFD" />
                )}
              </TouchableOpacity>
            </View>
          )}
          
          <TouchableOpacity 
            style={styles.botaoSalvar}
            onPress={salvarPreferenciaNotificacao}
          >
            <Text style={styles.botaoSalvarTexto}>Salvar Preferências de Notificação</Text>
          </TouchableOpacity>
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
  secao: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  secaoTitulo: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 6,
  },
  secaoDescricao: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 16,
  },
  opcoesContainer: {
    marginBottom: 20,
  },
  opcaoDia: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F5F7FA',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  opcaoSelecionada: {
    backgroundColor: '#E6F0FF',
    borderColor: '#0D6EFD',
  },
  opcaoDiaTexto: {
    fontSize: 16,
    color: '#333333',
  },
  opcaoTextoSelecionado: {
    color: '#0D6EFD',
    fontWeight: '600',
  },
  botaoSalvar: {
    backgroundColor: '#0D6EFD',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  botaoDesabilitado: {
    backgroundColor: '#CCCCCC',
  },
  botaoSalvarTexto: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  turnosContainer: {
    marginBottom: 20,
  },
  turnoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  turnoSelecionado: {
    backgroundColor: '#E6F0FF',
    borderColor: '#0D6EFD',
  },
  turnoIconeContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  turnoInfo: {
    flex: 1,
  },
  turnoNome: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  turnoTextoSelecionado: {
    color: '#0D6EFD',
  },
  turnoHorario: {
    fontSize: 14,
    color: '#666666',
  },
  turnoHorarioSelecionado: {
    color: '#3479E1',
  },
  tiposContainer: {
    marginBottom: 20,
  },
  tipoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  tipoSelecionado: {
    backgroundColor: '#E6F0FF',
    borderColor: '#0D6EFD',
  },
  tipoIconeContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  tipoInfo: {
    flex: 1,
  },
  tipoNome: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  tipoTextoSelecionado: {
    color: '#0D6EFD',
  },
  tipoDescricao: {
    fontSize: 14,
    color: '#666666',
  },
  acessibilidadeContainer: {
    marginBottom: 20,
  },
  acessibilidadeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  acessibilidadeSelecionada: {
    backgroundColor: '#E6F0FF',
    borderColor: '#0D6EFD',
  },
  acessibilidadeIconeContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  acessibilidadeNome: {
    fontSize: 16,
    color: '#333333',
    flex: 1,
  },
  acessibilidadeTextoSelecionado: {
    color: '#0D6EFD',
    fontWeight: '600',
  },
  notificacaoSwitch: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  notificacaoTexto: {
    fontSize: 16,
    color: '#333333',
  },
  canaisContainer: {
    marginBottom: 20,
  },
  canaisTexto: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 12,
  },
  canalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F5F7FA',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  canalSelecionado: {
    backgroundColor: '#E6F0FF',
    borderColor: '#0D6EFD',
  },
  canalTexto: {
    fontSize: 16,
    color: '#333333',
    marginLeft: 16,
    flex: 1,
  },
})