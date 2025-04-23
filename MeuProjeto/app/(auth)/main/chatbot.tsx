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
    : [styles.messageBubble, styles.botBubble, { backgroundColor: '#003EA6' }];

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
  const colorScheme = useColorScheme();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Olá! Como posso ajudar você hoje?', time: '10:00', isUser: false },
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
        text: 'Esta é uma resposta automática. Aqui você integraria com a API do ChatGPT e seu banco de dados.',
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
    <SafeAreaView style={[
      styles.container,
      { backgroundColor: '#FFFFFF' } // Fundo branco fixo
    ]}>
      <StatusBar barStyle="dark-content" />
      
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={[
          styles.headerTitle,
          { color: '#000000' }
        ]}>Delfos - Assistente Virtual</Text>
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
      />
      
      {/* Input de mensagem com padding inferior para evitar sobreposição com a tab bar */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
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
              { backgroundColor: '#003EA6' }
            ]} 
            onPress={sendMessage}
            disabled={message.trim() === ''}
          >
            <IconSymbol size={24} name="paperplane.fill" color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
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
    marginBottom: 10,
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
    paddingBottom: Platform.OS === 'ios' ? 150 : 15,
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
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