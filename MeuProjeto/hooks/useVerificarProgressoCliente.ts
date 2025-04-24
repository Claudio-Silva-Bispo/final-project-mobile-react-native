
import { db } from '@/firebaseConfig';
import { doc, getDoc, } from 'firebase/firestore';

export const verificarProgressoCliente = async (idCliente: string, userName: string, setMessages: (callback: (prevMessages: any[]) => any[]) => void) => {
  try {
    // Verifique se os dados estão preenchidos nas tabelas correspondentes
    const clientDocRef = doc(db, 't_usuario', idCliente);
    const clientDocSnap = await getDoc(clientDocRef);

    if (clientDocSnap.exists()) {
      const clientData = clientDocSnap.data();

      // Tabelas de progresso
      const progressData = [
        { name: 'Nome', filled: clientData.nome },
        { name: 'CPF', filled: clientData.cpf },
        { name: 'Data de Nascimento', filled: clientData.dataNascimento },
        { name: 'Email', filled: clientData.email },
        { name: 'Genero', filled: clientData.genero },
        { name: 'Telefone', filled: clientData.telefone },
      ];

      let messageText = `Olá ${userName}, aqui está seu progresso:\n`;

      progressData.forEach(item => {
        messageText += `${item.name}: ${item.filled ? 'Preenchido' : 'Não preenchido'}\n`;
      });

      // Enviar mensagem de progresso para o chatbot
      const botMessage = {
        id: Date.now().toString(),
        text: messageText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isUser: false,
      };

      setMessages(prevMessages => [...prevMessages, botMessage]);
    } else {
      console.log("Cliente não encontrado");
    }
  } catch (error) {
    console.error("Erro ao verificar progresso do cliente:", error);
  }
};
