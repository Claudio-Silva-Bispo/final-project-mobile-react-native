import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Image } from "react-native";
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../../../firebaseConfig";
import CustomButton from "../../../components/CustomButton";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const ClientDetails: React.FC<{ navigation: any }> = () => {
  const user = auth.currentUser;
  if (!user) {
    Alert.alert("Erro", "Nenhum usuário autenticado!");
    router.push('/');
    return null;
  }

  const [step, setStep] = useState(1);
  const [dados, setDados] = useState<any>({});
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(true);
  const [idCliente, setIdCliente] = useState<string | null>(null);
  const [enderecoResidencia, setEnderecoResidencia] = useState<any>({});
  const [enderecoConsulta, setEnderecoConsulta] = useState<any>({});

  const [diaPreferenciaCliente, setDiaPreferenciaCliente] = useState<string[]>([]);
  // Lista com os dias disponíveis neste momento
  const listaDiasSemana = [
    "Segunda",
    "Terca",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
  ];

  const [turnoPreferenciaCliente, setTurnoPreferenciaCliente] = useState<string[]>([]);
  // Lista com os turnos disponíveis neste momento
  const listaTurnos = [
    "Manhã",
    "Tarde",
    "Noite",
  ];

  const handleSelectDiaPreferenciaCliente = (diaPreferenciaCliente: string) => {
    setDiaPreferenciaCliente(prevState => {
      if (prevState.includes(diaPreferenciaCliente)) {
        return prevState.filter(item => item !== diaPreferenciaCliente);
      } else {
        return [...prevState, diaPreferenciaCliente];
      }
    });
  };

  const handleSelectTurnoPreferenciaCliente = (turnoPreferenciaCliente: string) => {
    setTurnoPreferenciaCliente(prevState => {
      if (prevState.includes(turnoPreferenciaCliente)) {
        return prevState.filter(item => item !== turnoPreferenciaCliente);
      } else {
        return [...prevState, turnoPreferenciaCliente];
      }
    });
  };

  // Função para buscar idCliente pelo idAutenticacao
  const buscarIdCliente = async () => {
    try {
      console.log("Buscando idCliente pelo idAutenticacao: ", user.uid);
      
      // Buscar na coleção t_seguranca_usuario o documento onde idAutenticacao é igual ao user.uid
      const seguracaQuery = query(
        collection(db, "t_seguranca_usuario"), 
        where("idAutenticacao", "==", user.uid)
      );
      
      const querySnapshot = await getDocs(seguracaQuery);
      
      if (querySnapshot.empty) {
        console.error("Nenhum documento encontrado na t_seguranca_usuario com idAutenticacao:", user.uid);
        Alert.alert("Erro", "Informações do usuário não encontradas.");
        return null;
      }
      
      // Obter o idCliente do primeiro documento encontrado
      const clienteId = querySnapshot.docs[0].data().idCliente;
      console.log("idCliente encontrado:", clienteId);
      
      if (!clienteId) {
        console.error("idCliente não encontrado no documento.");
        return null;
      }
      
      return clienteId;
    } catch (error) {
      console.error("Erro ao buscar idCliente:", error);
      Alert.alert("Erro", "Não foi possível encontrar suas informações.");
      return null;
    }
  };

  useEffect(() => {
    const inicializarDados = async () => {
      try {
        // Primeiro buscar o idCliente
        const clienteId = await buscarIdCliente();
        
        if (!clienteId) {
          setLoading(false);
          return;
        }
        
        setIdCliente(clienteId);
        
        // Agora podemos buscar os dados usando o idCliente
        const dadosCadastraisRef = doc(db, "t_usuario", clienteId);
        const enderecoResidenciaRef = doc(db, "t_endereco_residencia_usuario", clienteId);
        const enderecoConsultaRef = doc(db, "t_endereco_preferencia_usuario", clienteId);
        const diasPreferenciaRef = doc(db, "t_dia_preferencia_usuario", clienteId);
        const turnoPreferenciaRef = doc(db, "t_turno_preferencia__usuario", clienteId);
  
        const dadosCadastraisSnap = await getDoc(dadosCadastraisRef);
        const enderecoResidenciaSnap = await getDoc(enderecoResidenciaRef);
        const enderecoConsultaSnap = await getDoc(enderecoConsultaRef);
        const diasPreferenciaSnap = await getDoc(diasPreferenciaRef);
        const turnoPreferenciaSnap = await getDoc(turnoPreferenciaRef);
  
        setDados((prevDados: any) => ({
          ...prevDados, // Mantém os dados existentes
          ...(dadosCadastraisSnap.exists() ? dadosCadastraisSnap.data() : {}),
          ...(enderecoResidenciaSnap.exists() ? enderecoResidenciaSnap.data() : {}),
          ...(enderecoConsultaSnap.exists() ? enderecoConsultaSnap.data() : {}),
          ...(diasPreferenciaSnap.exists() ? diasPreferenciaSnap.data() : {}),
          ...(turnoPreferenciaSnap.exists() ? turnoPreferenciaSnap.data() : {}),
          idCliente: clienteId,
        }));

        // Carregar dias da semana
        if (diasPreferenciaSnap.exists()) {
          setDiaPreferenciaCliente(diasPreferenciaSnap.data().diaPreferenciaCliente || []);
        }

        // Carregar todas as especialidades disponíveis
        const diaSemanaDisponiveisRef = doc(db, "t_dia_preferencia_cliente", "todos");
        const diaSemanaDisponiveisSnap = await getDoc(diaSemanaDisponiveisRef);

        // Carregar turnos
        if (turnoPreferenciaSnap.exists()) {
          setTurnoPreferenciaCliente(turnoPreferenciaSnap.data().turnoPreferenciaCliente || []);
        }
        
        // Carregar todos os turnos
        const turnoDisponiveisRef = doc(db, "t_turno_preferencia_cliente", "todos");
        const turnoDisponiveisSnap = await getDoc(turnoDisponiveisRef);
  
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        Alert.alert("Erro", "Não foi possível buscar os dados.");
      } finally {
        setLoading(false);
      }
    };
  
    inicializarDados();
  }, []);
  
  const atualizarDados = async (colecao: string, novosDados: object) => {
    try {
      if (!idCliente) {
        Alert.alert("Erro", "ID do cliente não encontrado.");
        return;
      }
      
      const dadosComIdCliente = { ...novosDados, idCliente: idCliente };
      const docRef = doc(db, colecao, idCliente);
      
      await updateDoc(docRef, dadosComIdCliente);
      setMensagem("✅ Dados atualizados com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar dados:", error);
      setMensagem("❌ Erro ao atualizar os dados.");
    }
  };

  return (
    <View style={styles.container}>

      {/* Voltar */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={32} color="#fff" />
      </TouchableOpacity>

      {/* Logo */}
      <Image
        source={require('@/assets/images/logo/logo-branco.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      
      <Text style={styles.title}>Meus Dados</Text>
      {/*{idCliente && <Text style={styles.subtitle}>ID: {idCliente}</Text>}*/}
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0057FF" />
          <Text style={styles.loadingText}>Carregando seus dados...</Text>
        </View>
      ) : !idCliente ? (
        <Text style={styles.errorText}>Não foi possível carregar seus dados. Por favor, tente novamente mais tarde.</Text>
      ) : (
        <>
          {step === 1 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Dados pessoais</Text>
              <TextInput style={styles.input} placeholder="Nome" value={dados.nome || ""} onChangeText={(text) => setDados({ ...dados, nome: text })} />
              <TextInput style={styles.input} placeholder="CPF" value={dados.cpf || ""} onChangeText={(text) => setDados({ ...dados, cpf: text })}/>
              <TextInput style={styles.input} placeholder="Data de Nascimento" value={dados.dataNascimento || ""} onChangeText={(text) => setDados({ ...dados, dataNascimento: text })} />
              <TextInput style={styles.input} placeholder="Telefone" keyboardType="numeric" value={dados.telefone || ""} onChangeText={(text) => setDados({ ...dados, telefone: text })} />
              <TextInput style={styles.input} placeholder="Genero"  value={dados.genero || ""} onChangeText={(text) => setDados({ ...dados, genero: text })} />

              <CustomButton title="Atualizar" textColor="#fff" onPress={() => atualizarDados("t_usuario", dados)} width={'100%'}/>
              
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

              <CustomButton title="Atualizar" textColor="#fff" onPress={() => atualizarDados("t_endereco_residencia_usuario", dados)} width={'100%'}/>
              
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
              
              <TextInput style={styles.input} placeholder="CEP" placeholderTextColor={'#999'} value={dados.cep || ""} onChangeText={(text) => setDados({ ...dados, cep: text })} />
              
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
              
              <CustomButton title="Atualizar" textColor="#fff" onPress={() => atualizarDados("t_endereco_preferencia_usuario", dados)} width={'100%'}/>
              
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
                title="Atualizar" 
                textColor="#fff" 
                onPress={() => atualizarDados("t_dia_preferencia_usuario", { 
                  ...dados, 
                  diaPreferenciaCliente: diaPreferenciaCliente 
                })} 
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
                title="Atualizar" 
                textColor="#fff" 
                onPress={() => atualizarDados("t_turno_preferencia__usuario", {
                  ...dados,
                  turnoPreferenciaCliente: turnoPreferenciaCliente
                })} 
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
  logo: {
    width: 300,
    height: 150,
    alignSelf: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#fff",
    paddingBottom: 20
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#666",
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
  button: {
    width: "100%",
    backgroundColor: "#08c8f8",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
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