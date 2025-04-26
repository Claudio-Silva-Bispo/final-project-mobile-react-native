import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import { doc, getDoc, updateDoc, collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { db, auth } from "../../../firebaseConfig";
import CustomButton from "../../../components/CustomButton";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useIdCliente } from '@/hooks/useIdCliente';

const ClientDetails: React.FC<{ navigation: any }> = () => {
  const user = auth.currentUser;
  if (!user) {
    Alert.alert("Erro", "Nenhum usuário autenticado!");
    router.push('/');
    return null;
  }

  const { idCliente, loading: loadingId } = useIdCliente();
  const [step, setStep] = useState(1);
  const [dados, setDados] = useState<any>({});
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(true);
  const [ClienteId, setClienteId] = useState<string | null>(null);

  // Estados para dias e turnos de preferência
  const [diaPreferenciaCliente, setDiaPreferenciaCliente] = useState<string[]>([]);
  const [turnoPreferenciaCliente, setTurnoPreferenciaCliente] = useState<string[]>([]);

  // Listas disponíveis
  const listaDiasSemana = ["Segunda", "Terca", "Quarta", "Quinta", "Sexta", "Sábado"];
  const listaTurnos = ["Manhã", "Tarde", "Noite"];

  // Funções para selecionar preferências
  const handleSelectDiaPreferenciaCliente = (dia: string) => {
    setDiaPreferenciaCliente(prev => 
      prev.includes(dia) ? prev.filter(d => d !== dia) : [...prev, dia]
    );
  };

  const handleSelectTurnoPreferenciaCliente = (turno: string) => {
    setTurnoPreferenciaCliente(prev => 
      prev.includes(turno) ? prev.filter(t => t !== turno) : [...prev, turno]
    );
  };

  // Buscar ID do cliente
  const buscarIdCliente = async () => {
    try {
      const seguracaQuery = query(
        collection(db, "t_seguranca_usuario"), 
        where("idAutenticacao", "==", user.uid)
      );
      
      const querySnapshot = await getDocs(seguracaQuery);
      
      if (querySnapshot.empty) {
        Alert.alert("Erro", "Informações do usuário não encontradas.");
        return null;
      }
      
      return querySnapshot.docs[0].data().idCliente;
    } catch (error) {
      console.error("Erro ao buscar idCliente:", error);
      Alert.alert("Erro", "Não foi possível encontrar suas informações.");
      return null;
    }
  };

  // Buscar o ID do documento em uma coleção pelo idCliente
  const buscarIdDocumento = async (colecao: string, idCliente: string) => {
    try {
      const q = query(collection(db, colecao), where("idCliente", "==", idCliente));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        console.log(`Nenhum documento encontrado na coleção ${colecao} para o idCliente ${idCliente}`);
        return null;
      }
      
      return querySnapshot.docs[0].id;
    } catch (error) {
      console.error(`Erro ao buscar documento em ${colecao}:`, error);
      return null;
    }
  };

  // Buscar dados de um documento por idCliente
  const buscarDadosPorClienteId = async (colecao: string) => {
    if (!ClienteId) return {};
    
    try {
      const docId = await buscarIdDocumento(colecao, ClienteId);
      if (!docId) return {};
      
      const docRef = doc(db, colecao, docId);
      const docSnap = await getDoc(docRef);
      
      return docSnap.exists() ? docSnap.data() : {};
    } catch (error) {
      console.error(`Erro ao buscar dados em ${colecao}:`, error);
      return {};
    }
  };

  // Buscar preferências do cliente
  const buscarPreferencias = async (clienteId: string) => {
    try {
      // Buscar dias de preferência
      const diaData = await buscarDadosPorClienteId("t_dia_preferencia_usuario");
      if (diaData.preferencia) {
        setDiaPreferenciaCliente(
          Array.isArray(diaData.preferencia) 
            ? diaData.preferencia 
            : [diaData.preferencia]
        );
      }

      // Buscar turnos de preferência
      const turnoData = await buscarDadosPorClienteId("t_turno_preferencia_usuario");
      if (turnoData.preferencia) {
        setTurnoPreferenciaCliente(
          Array.isArray(turnoData.preferencia)
            ? turnoData.preferencia
            : [turnoData.preferencia]
        );
      }
    } catch (error) {
      console.error("Erro ao buscar preferências:", error);
    }
  };

  // Carregar dados iniciais
  useEffect(() => {
    const inicializarDados = async () => {
      try {
        const clienteId = await buscarIdCliente();
        if (!clienteId) {
          setLoading(false);
          return;
        }

        setClienteId(clienteId);

        // Buscar dados cadastrais (t_usuario usa o idCliente como ID do documento)
        const dadosCadastraisRef = doc(db, "t_usuario", clienteId);
        const dadosCadastraisSnap = await getDoc(dadosCadastraisRef);
        const dadosCadastrais = dadosCadastraisSnap.exists() ? dadosCadastraisSnap.data() : {};

        // Buscar endereços
        const [enderecoResidencia, enderecoConsulta] = await Promise.all([
          buscarDadosPorClienteId("t_endereco_residencia_usuario"),
          buscarDadosPorClienteId("t_endereco_preferencia_usuario")
        ]);

        // Atualizar estado com todos os dados
        setDados({
          ...dadosCadastrais,
          ...enderecoResidencia,
          ...enderecoConsulta,
          idCliente: clienteId
        });

        // Buscar preferências
        await buscarPreferencias(clienteId);

      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        Alert.alert("Erro", "Não foi possível buscar os dados.");
      } finally {
        setLoading(false);
      }
    };

    inicializarDados();
  }, []);

  // Função genérica para atualizar dados
  const atualizarDados = async (colecao: string, novosDados: object, idDocumento?: string) => {
    try {
      if (!ClienteId) {
        Alert.alert("Erro", "ID do cliente não encontrado.");
        return;
      }

      // Se não foi fornecido um ID de documento, buscamos pelo idCliente
      const docId = idDocumento || await buscarIdDocumento(colecao, ClienteId);
      
      if (!docId) {
        // Se não existir, criar novo documento
        await addDoc(collection(db, colecao), {
          ...novosDados,
          idCliente: ClienteId,
          dataAtualizacao: new Date().toISOString()
        });
      } else {
        // Se existir, atualizar
        const docRef = doc(db, colecao, docId);
        await updateDoc(docRef, {
          ...novosDados,
          dataAtualizacao: new Date().toISOString()
        });
      }
      
      setMensagem("✅ Dados atualizados com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar dados:", error);
      setMensagem("❌ Erro ao atualizar os dados.");
    }
  };

  // Função específica para atualizar dados do usuário (t_usuario)
  const atualizarDadosUsuario = async (novosDados: object) => {
    if (!ClienteId) {
      Alert.alert("Erro", "ID do cliente não encontrado.");
      return;
    }

    // Para t_usuario, sabemos que o ID do documento é o próprio ClienteId
    await atualizarDados("t_usuario", novosDados, ClienteId);
  };

  // Função específica para atualizar endereços
  const atualizarEndereco = async (tipo: 'residencia' | 'preferencia', novosDados: object) => {
    const colecao = tipo === 'residencia' 
      ? "t_endereco_residencia_usuario" 
      : "t_endereco_preferencia_usuario";
    
    await atualizarDados(colecao, novosDados);
  };

  // Função específica para atualizar preferências
  const atualizarPreferencias = async (tipo: 'dia' | 'turno') => {
    const colecao = tipo === 'dia' 
      ? "t_dia_preferencia_usuario" 
      : "t_turno_preferencia_usuario";
    
    const preferencias = tipo === 'dia' 
      ? diaPreferenciaCliente 
      : turnoPreferenciaCliente;

    await atualizarDados(colecao, { preferencia: preferencias });
    setMensagem(`Preferências de ${tipo} atualizadas com sucesso!`);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={32} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.title}>Meus Dados</Text>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0057FF" />
          <Text style={styles.loadingText}>Carregando seus dados...</Text>
        </View>
      ) : !ClienteId ? (
        <Text style={styles.errorText}>Não foi possível carregar seus dados. Por favor, tente novamente mais tarde.</Text>
      ) : (
        <>
          {step === 1 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Dados pessoais</Text>
              <TextInput style={styles.input} placeholder="Nome" value={dados.nome || ""} 
                onChangeText={(text) => setDados({ ...dados, nome: text })} />
              <TextInput style={styles.input} placeholder="CPF" value={dados.cpf || ""} 
                onChangeText={(text) => setDados({ ...dados, cpf: text })}/>
              <TextInput style={styles.input} placeholder="Data de Nascimento" value={dados.dataNascimento || ""} 
                onChangeText={(text) => setDados({ ...dados, dataNascimento: text })} />
              <TextInput style={styles.input} placeholder="Telefone" keyboardType="numeric" value={dados.telefone || ""} 
                onChangeText={(text) => setDados({ ...dados, telefone: text })} />
              <TextInput style={styles.input} placeholder="Genero" value={dados.genero || ""} 
                onChangeText={(text) => setDados({ ...dados, genero: text })} />

              <CustomButton title="Atualizar" textColor="#fff" 
                onPress={() => atualizarDadosUsuario(dados)} width={'100%'}/>
              
              <TouchableOpacity onPress={() => setStep(2)} style={styles.nextButton}>
                <Text style={styles.buttonText}>→ Próximo</Text>
              </TouchableOpacity>
            </View>
          )}

          {step === 2 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Endereço de residência</Text>
              
              <TextInput style={styles.input} placeholder="CEP" placeholderTextColor={'#999'}
                value={dados.cep || ""} 
                onChangeText={(text) => setDados({ ...dados, cep: text })} />
              
              <TextInput style={styles.input} placeholder="Estado" placeholderTextColor={'#999'}
                value={dados.estado || ""} 
                onChangeText={(text) => setDados({ ...dados, estado: text })} />
              
              <TextInput style={styles.input} placeholder="Cidade" placeholderTextColor={'#999'}
                value={dados.cidade || ""} 
                onChangeText={(text) => setDados({ ...dados, cidade: text })} />
              
              <TextInput style={styles.input} placeholder="Rua" placeholderTextColor={'#999'}
                value={dados.rua || ""} 
                onChangeText={(text) => setDados({ ...dados, rua: text })} />
              
              <TextInput style={styles.input} placeholder="Número" placeholderTextColor={'#999'}
                value={dados.numero || ""} 
                onChangeText={(text) => setDados({ ...dados, numero: text })} />

              <CustomButton title="Atualizar" textColor="#fff" 
                onPress={() => atualizarEndereco('residencia', dados)} width={'100%'}/>
              
              <TouchableOpacity onPress={() => setStep(1)} style={styles.prevButton}>
                <Text style={styles.buttonText}>← Voltar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setStep(3)} style={styles.nextButton}>
                <Text style={styles.buttonText}>→ Próximo</Text>
              </TouchableOpacity>
            </View>
          )}

          {step === 3 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Endereço de preferência para consulta</Text>
              
              <TextInput style={styles.input} placeholder="CEP" placeholderTextColor={'#999'} 
                value={dados.cep || ""} onChangeText={(text) => setDados({ ...dados, cep: text })} />
              
              <TextInput style={styles.input} placeholder="Estado" placeholderTextColor={'#999'}
                value={dados.estado || ""} 
                onChangeText={(text) => setDados({ ...dados, estado: text })} />
              
              <TextInput style={styles.input} placeholder="Cidade" placeholderTextColor={'#999'}
                value={dados.cidade || ""} onChangeText={(text) => setDados({ ...dados, cidade: text })} />
              
              <TextInput style={styles.input} placeholder="Rua" placeholderTextColor={'#999'}
                value={dados.rua || ""} 
                onChangeText={(text) => setDados({ ...dados, rua: text })} />
              
              <TextInput style={styles.input} placeholder="Número" placeholderTextColor={'#999'}
                value={dados.numero || ""} 
                onChangeText={(text) => setDados({ ...dados, numero: text })} />
              
              <CustomButton title="Atualizar" textColor="#fff" 
                onPress={() => atualizarEndereco('preferencia', dados)} width={'100%'}/>
              
              <TouchableOpacity onPress={() => setStep(2)} style={styles.prevButton}>
                <Text style={styles.buttonText}>← Voltar</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setStep(4)} style={styles.nextButton}>
                <Text style={styles.buttonText}>→ Próximo</Text>
              </TouchableOpacity>
            </View>
          )}

          {step === 4 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Dia de preferência</Text>

              <FlatList
                data={listaDiasSemana}
                keyExtractor={(item) => item}
                contentContainerStyle={{ width: "100%" }}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.specialityItem,
                      diaPreferenciaCliente.includes(item) && styles.selectedSpeciality,
                    ]}
                    onPress={() => handleSelectDiaPreferenciaCliente(item)}
                  >
                    <Text style={styles.specialityText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
              
              <CustomButton 
                title="Salvar Dias Preferidos" 
                textColor="#fff" 
                onPress={() => atualizarPreferencias('dia')} 
                width={'100%'}
              />
              
              <TouchableOpacity onPress={() => setStep(3)} style={styles.prevButton}>
                <Text style={styles.buttonText}>← Voltar</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setStep(5)} style={styles.nextButton}>
                <Text style={styles.buttonText}>→ Próximo</Text>
              </TouchableOpacity>
            </View>
          )}

          {step === 5 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Turno de preferência</Text>

              <FlatList
                data={listaTurnos}
                keyExtractor={(item) => item}
                contentContainerStyle={{ width: "100%" }}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.specialityItem,
                      turnoPreferenciaCliente.includes(item) && styles.selectedSpeciality,
                    ]}
                    onPress={() => handleSelectTurnoPreferenciaCliente(item)}
                  >
                    <Text style={styles.specialityText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />

              <CustomButton 
                title="Salvar Turnos Preferidos" 
                textColor="#fff" 
                onPress={() => atualizarPreferencias('turno')} 
                width={'100%'}
              />
              
              <TouchableOpacity onPress={() => setStep(4)} style={styles.prevButton}>
                <Text style={styles.buttonText}>← Voltar</Text>
              </TouchableOpacity>
            </View>
          )}

          {mensagem ? <Text style={styles.mensagem}>{mensagem}</Text> : null}
        </>
      )}
    </View>
  );
};

// Estilos permanecem os mesmos do código anterior
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#003EA6",
    width:'100%',
  },
  backButton: {
    position: 'absolute',
    top: 80,
    left: 20,
    zIndex: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#fff",
    paddingBottom: 20
  },
  section: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    paddingTop: 20,
    paddingBottom: 30
  },
  input: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 10,
  },
  mensagem: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  prevButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#ff5d4b",
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  nextButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#2196F3",
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  specialityItem: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#08c8f8",
    borderRadius: 8,
    marginBottom: 10,
    width:'100%',
  },
  selectedSpeciality: {
    backgroundColor: "#08c8f8",
  },
  specialityText: {
    fontSize: 16,
    color: "#081828",
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    fontSize: 16,
    color: "#ff5d4b",
    textAlign: "center",
    marginTop: 20,
  },
});

export default ClientDetails;