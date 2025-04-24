import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme';
import { router } from 'expo-router';

// Coletar o nome do usuario de forma dinâmica
import { useUserData } from '../../../hooks/useUserData';
import { useIdCliente } from '@/hooks/useIdCliente';

// Verificar progresso de preenchimento das bases de dados
import { verificarProgressoCliente } from '@/hooks/useVerificarProgressoCliente';
import { verificarCamposPendentes } from '@/utils/verificarCamposPendentes';

// Componente para as mensagens individuais
interface Message {
  id: string;
  text: string;
  time: string;
  isUser: boolean;
}

const MessageBubble = ({ message, isUser }: { message: Message; isUser: boolean }) => {
  // Novas cores: azul para bot e cinza para usuário
  const bubbleStyle = isUser
    ? [styles.messageBubble, styles.userBubble, { backgroundColor: '#E5E5E5' }]
    : [styles.messageBubble, styles.botBubble, { backgroundColor: '#007BFF' }];

  const textStyle = isUser
    ? [styles.messageText, styles.userMessageText]
    : [styles.messageText, styles.botMessageText];

  return (
    <View style={isUser ? styles.userMessageContainer : styles.botMessageContainer}>
      <View style={bubbleStyle}>
        <Text style={textStyle}>{message.text}</Text>
        <Text style={[
          styles.messageTime,
          { color: isUser ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.7)' }
        ]}>
          {message.time}
        </Text>
      </View>
    </View>
  );
};

export default function ChatbotScreen() {

  const [chatLiberado, setChatLiberado] = useState(false);

  // Coletar o nome do usuario
  const { idCliente, loading: loadingId } = useIdCliente();
  const { userName, loading: loadingUser } = useUserData(idCliente);

  useEffect(() => {
    if (userName && !loadingUser) {
      const firstMessage = {
        id: Date.now().toString(),
        text: `Olá ${userName}! Sou o Delfos, como posso ajudar você hoje?`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isUser: false,
      };
      setMessages([firstMessage]); 

      // Enviar a mensagem de boas-vindas
      setMessages([firstMessage]); 

      // Aqui podemos enviar a lista de tabelas a serem preenchidas
      const tabelas = [
        't_usuario',
        't_endereco_residencia_usuario',
        't_endereco_preferencia_usuario',
        't_dia_preferencia_usuario',
        't_horario_preferencia_usuario',
        't_turno_preferencia_usuario',
      ];

      const tabelaMessage = {
        id: (Date.now() + 1).toString(),
        text: `As seguintes tabelas precisam ser preenchidas: ${tabelas.join(', ')}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isUser: false,
      };

      setMessages(prevMessages => [...prevMessages, tabelaMessage]);

      /*
      // Verificar progresso do cliente
      if (idCliente) {
        verificarProgressoCliente(idCliente, userName, setMessages);
      } else {
        console.error("ID do cliente não encontrado");
      }
      */

      // Verificar progresso do cliente
    if (idCliente) {
      verificarCamposPendentes(idCliente)
        .then((tabelasPendentes) => {
          if (tabelasPendentes.length > 0) {
            const camposPendentesMessage = {
              id: (Date.now() + 2).toString(),
              text: `Os seguintes campos ainda precisam ser preenchidos: ${tabelasPendentes.join(', ')}`,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              isUser: false,
            };
            setMessages(prevMessages => [...prevMessages, camposPendentesMessage]);
          } else {
            const todosCamposPreenchidosMessage = {
              id: (Date.now() + 3).toString(),
              text: `Todos os campos necessários foram preenchidos. Você está pronto para continuar! ${idCliente}`,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              isUser: false,
            };
            setMessages(prevMessages => [...prevMessages, todosCamposPreenchidosMessage]);
          }
        })
        .catch((error) => {
          console.error('Erro ao verificar campos pendentes:', error);
        });
    } else {
      console.error("ID do cliente não encontrado");
    }

      
    }
  }, [userName, loadingUser, idCliente]);

  // Removed duplicate declaration of verificarProgressoCliente

  const colorScheme = useColorScheme();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Olá! Sou o Delfos, como posso te ajudar?', time: '10:00', isUser: false },
  ]);
  const flatListRef = useRef<FlatList<Message>>(null);

  // Função para enviar mensagem
  const sendMessage = () => {
    if (message.trim() === '') return;

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Adicionar mensagem do usuário
    const userMessage = {
      id: Date.now().toString(),
      text: message,
      time: currentTime,
      isUser: true,
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setMessage('');
    
    // Simular resposta do chatbot (aqui é onde você integraria com API, ChatGPT, etc.)
    
    setTimeout(() => {
      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: `Oi ${userName}, esta é uma resposta automática. Como posso te ajudar mais?`, 
        time: currentTime,
        isUser: false,
      };
      setMessages(prevMessages => [...prevMessages, botMessage]);
    }, 1000);
    

  };

  // Scroll para a última mensagem quando uma nova é adicionada
  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  return (

    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 70} // ajuste conforme sua tab bar
    >

        <SafeAreaView style={[
          styles.container,
          { backgroundColor: '#FFFFFF' } // Fundo branco fixo
        ]}>
          <StatusBar barStyle="dark-content" />
          
          {/* Cabeçalho */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={router.back}>
                <View style={styles.backButtonCircle}>
                <Text style={styles.backButtonIcon}>←</Text>
                </View>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Delfos - Assistente Virtual</Text>
          </View>
          
          {/* Lista de mensagens */}
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <MessageBubble message={item} isUser={item.isUser} />
            )}
            contentContainerStyle={styles.messagesList}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          />
          
          {/* Input de mensagem com padding inferior para evitar sobreposição com a tab bar */}
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 70}
          >
            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.input,
                  { 
                    backgroundColor: '#F0F0F0',
                    color: '#000000'
                  }
                ]}
                value={message}
                onChangeText={setMessage}
                placeholder="Digite sua mensagem..."
                placeholderTextColor="#777777"
                multiline
              />
              <TouchableOpacity 
                style={[
                  styles.sendButton,
                  { backgroundColor: '#007BFF' }
                ]} 
                onPress={sendMessage}
                disabled={message.trim() === ''}
              >
                <IconSymbol size={24} name="paperplane.fill" color="#fff" />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
    
    </KeyboardAvoidingView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    padding: 5,
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
  header: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#007BFF',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
    color: '#007BFF',
  },
  messagesList: {
    paddingHorizontal: 15,
    paddingTop: 10,
    // Adicionando padding maior no bottom para evitar que as mensagens fiquem atrás da barra de tabs
    paddingBottom: 60,
  },
  userMessageContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  botMessageContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 25,
  },
  messageBubble: {
    maxWidth: '80%',
    borderRadius: 20,
    padding: 12,
  },
  userBubble: {
    borderBottomRightRadius: 5,
  },
  botBubble: {
    borderBottomLeftRadius: 5,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#000000', 
  },
  botMessageText: {
    color: '#FFFFFF',
  },
  messageTime: {
    fontSize: 12,
    alignSelf: 'flex-end',
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    alignItems: 'flex-end',
    // Adicionando padding inferior para evitar sobreposição com a tab bar
    paddingBottom: Platform.OS === 'ios' ? 30 : 0,
    backgroundColor: '#FFFFFF',

  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 15,
    maxHeight: 120,
    marginRight: 10,
  },
  sendButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});


