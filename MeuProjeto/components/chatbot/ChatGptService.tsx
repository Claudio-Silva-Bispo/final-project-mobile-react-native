import axios from 'axios';

// Interface para a resposta da API
interface ChatGPTResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

// Interface para as configurações do serviço
interface ChatGPTServiceConfig {
  apiKey: string;
  model?: string;
}

class ChatGPTService {
  private apiKey: string;
  private model: string;
  private baseURL: string = 'https://api.openai.com/v1/chat/completions';
  private messages: any[] = [];

  constructor(config: ChatGPTServiceConfig) {
    this.apiKey = config.apiKey;
    this.model = config.model || 'gpt-3.5-turbo';
    
    // Iniciar com uma mensagem do sistema para contextualizar o assistente
    this.messages = [
      {
        role: 'system',
        content: 'Você é um assistente médico virtual útil e amigável. Forneça informações precisas sobre saúde, mas sempre lembre o usuário para consultar um profissional de saúde para diagnósticos e tratamentos.'
      }
    ];
  }

  // Método para enviar uma mensagem e obter resposta
  async sendMessage(userMessage: string): Promise<string> {
    try {
      // Adicionar a mensagem do usuário ao histórico
      this.messages.push({
        role: 'user',
        content: userMessage
      });

      // Fazer a requisição para a API
      const response = await axios.post(
        this.baseURL,
        {
          model: this.model,
          messages: this.messages,
          temperature: 0.7,
          max_tokens: 500
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      );

      // Extrair a resposta
      const botResponse = response.data.choices[0].message.content;
      
      // Adicionar a resposta ao histórico de mensagens
      this.messages.push({
        role: 'assistant',
        content: botResponse
      });

      return botResponse;
    } catch (error) {
      console.error('Erro ao chamar a API do ChatGPT:', error);
      return 'Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente mais tarde.';
    }
  }

  // Método para limpar o histórico de conversa
  clearConversation() {
    // Mantém apenas a mensagem do sistema
    this.messages = this.messages.slice(0, 1);
  }
}

export default ChatGPTService;