import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Alert,
  TextInput
} from 'react-native';
import { getAuth, deleteUser } from 'firebase/auth';
import { getFirestore, doc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { router } from 'expo-router';

const DeleteAccountScreen = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  
  const auth = getAuth();
  const db = getFirestore();
  const currentUser = auth.currentUser;

  const showModal = () => {
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
  };

  const handleDeleteAccount = async () => {
    if (!currentUser) {
      Alert.alert("Erro", "Usuário não está autenticado.");
      return;
    }

    setIsLoading(true);

    try {
      // First, find the user document in t_usuario collection
      const userQuery = query(
        collection(db, "t_usuario"),
        where("email", "==", currentUser.email)
      );
      
      const userQuerySnapshot = await getDocs(userQuery);
      
      if (userQuerySnapshot.empty) {
        throw new Error("Usuário não encontrado na base de dados.");
      }
      
      // Update the user status to "desativado" in t_usuario
      const userDoc = userQuerySnapshot.docs[0];
      await updateDoc(doc(db, "t_usuario", userDoc.id), {
        status: "desativado",
        dataAtualizacao: new Date().toISOString()
      });
      
      // Find the user in t_seguranca_usuario collection
      const securityQuery = query(
        collection(db, "t_seguranca_usuario"),
        where("email", "==", currentUser.email)
      );
      
      const securityQuerySnapshot = await getDocs(securityQuery);
      
      if (!securityQuerySnapshot.empty) {
        // Update the user status to "desativado" in t_seguranca_usuario
        const securityDoc = securityQuerySnapshot.docs[0];
        await updateDoc(doc(db, "t_seguranca_usuario", securityDoc.id), {
          status: "desativado"
        });
      }
      
      // Delete the user authentication
      await deleteUser(currentUser);
      
      // Sign out and navigate to login
      await auth.signOut();
      
      Alert.alert(
        "Conta desativada",
        "Sua conta foi desativada com sucesso.",
        [{ text: "OK", onPress: () => router.navigate("/") }]
      );
    } catch (error) {
      console.error("Erro ao desativar conta:", error);
      Alert.alert(
        "Erro",
        "Ocorreu um erro ao desativar sua conta. Por favor, tente novamente mais tarde."
      );
    } finally {
      setIsLoading(false);
      hideModal();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Excluir sua conta</Text>
        
        <View style={styles.warningContainer}>
          <Text style={styles.warningIcon}>⚠️</Text>
          <Text style={styles.warningText}>
            Atenção! Esta ação não pode ser desfeita.
          </Text>
        </View>
        
        <Text style={styles.description}>
          Ao excluir sua conta, todos os seus dados serão desativados em nossos sistemas.
          Você perderá acesso a:
        </Text>
        
        <View style={styles.bulletPoints}>
          <Text style={styles.bulletPoint}>• Seu histórico e dados de perfil</Text>
          <Text style={styles.bulletPoint}>• Seus pontos acumulados: {7}</Text>
          <Text style={styles.bulletPoint}>• Preferências salvas</Text>
        </View>
        
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={showModal}
        >
          <Text style={styles.deleteButtonText}>Excluir minha conta</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.back()}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={hideModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirmar exclusão</Text>
            
            <Text style={styles.modalDescription}>
              Esta ação é irreversível. Para confirmar que você deseja excluir sua conta,
              digite "EXCLUIR" abaixo.
            </Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Digite "EXCLUIR" para confirmar:</Text>
              <TextInput
                style={styles.input}
                value={confirmationText}
                onChangeText={setConfirmationText}
                placeholder="EXCLUIR"
                autoCapitalize="characters"
              />
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={hideModal}
                disabled={isLoading}
              >
                <Text style={styles.modalCancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.modalConfirmButton,
                  confirmationText !== "EXCLUIR" && styles.modalConfirmButtonDisabled
                ]}
                onPress={handleDeleteAccount}
                disabled={confirmationText !== "EXCLUIR" || isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.modalConfirmButtonText}>Confirmar exclusão</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#343a40',
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3cd',
    borderColor: '#ffeeba',
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    width: '100%',
  },
  warningIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  warningText: {
    fontSize: 16,
    color: '#856404',
    flex: 1,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#495057',
    lineHeight: 24,
  },
  bulletPoints: {
    width: '100%',
    marginBottom: 30,
  },
  bulletPoint: {
    fontSize: 16,
    marginBottom: 10,
    color: '#495057',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 15,
    width: '80%',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#6c757d',
  },
  cancelButtonText: {
    color: '#6c757d',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#dc3545',
  },
  modalDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#495057',
    lineHeight: 24,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 5,
    color: '#495057',
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 4,
    padding: 10,
    width: '100%',
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalCancelButton: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#6c757d',
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  modalCancelButtonText: {
    color: '#6c757d',
    fontSize: 16,
    fontWeight: '500',
  },
  modalConfirmButton: {
    backgroundColor: '#dc3545',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  modalConfirmButtonDisabled: {
    backgroundColor: '#e9a2a8',
  },
  modalConfirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default DeleteAccountScreen;