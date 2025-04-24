import { db } from '@/firebaseConfig';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';

export const verificarCamposPendentes = async (idCliente: string) => {
  try {
    const tabelas = [
      { collection: 't_usuario', fields: ['nome', 'cpf', 'dataNascimento', 'email', 'genero', 'telefone'], isDocId: true },
      { collection: 't_endereco_residencia_usuario', fields: ['cep', 'estado', 'cidade', 'rua', 'numero'], isDocId: false },
      { collection: 't_endereco_preferencia_usuario', fields: ['cep', 'estado', 'cidade', 'rua', 'numero'], isDocId: false },
      { collection: 't_dias_preferencia_usuario', fields: ['dias'], isDocId: false },
      { collection: 't_turno_preferencia_usuario', fields: ['turno'], isDocId: false },
      { collection: 't_horario_preferencia_usuario', fields: ['turno'], isDocId: false },
    ];

    let camposPendentes: string[] = [];
    let camposPreenchidos: string[] = [];

    for (let tabela of tabelas) {
      console.log(`Verificando a coleção: ${tabela.collection}`);
      
      if (tabela.isDocId) {
        // Caso a coleção use o ID como documento (ex: t_usuario)
        const docRef = doc(db, tabela.collection, idCliente);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          tabela.fields.forEach(field => {
            console.log(`Verificando campo: ${field}, valor: ${data[field]}`);
            
            // Verificar se o valor é nulo, vazio ou apenas espaços em branco
            if (!data[field] || data[field].trim() === '') {
              camposPendentes.push(`${tabela.collection} - ${field}`);
            } else {
              camposPreenchidos.push(`${tabela.collection} - ${field}: ${data[field]}`);
            }
          });
        } else {
          // Se o documento não existir, adicionar todos os campos como pendentes
          tabela.fields.forEach(field => camposPendentes.push(`${tabela.collection} - ${field}`));
        }
      } else {
        // Caso a coleção tenha o campo idCliente (ex: t_endereco_residencia_usuario)
        const q = query(collection(db, tabela.collection), where("idCliente", "==", idCliente));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          querySnapshot.forEach(docSnap => {
            const data = docSnap.data();
            tabela.fields.forEach(field => {
              console.log(`Verificando campo: ${field}, valor: ${data[field]}`);
              
              // Verificar se o valor é nulo, vazio ou apenas espaços em branco
              if (!data[field] || data[field].trim() === '') {
                camposPendentes.push(`${tabela.collection} - ${field}`);
              } else {
                camposPreenchidos.push(`${tabela.collection} - ${field}: ${data[field]}`);
              }
            });
          });
        } else {
          // Se não encontrar documento na coleção, adicionar todos os campos como pendentes
          tabela.fields.forEach(field => camposPendentes.push(`${tabela.collection} - ${field}`));
        }
      }
    }

    // Exibir ou retornar somente os campos pendentes
    console.log('Campos pendentes:', camposPendentes);

    // Se você precisar retornar esses dados para exibição em um frontend ou outro lugar, pode retornar o que você deseja:
    return camposPendentes;

  } catch (error) {
    console.error("Erro ao verificar campos pendentes:", error);
    return [];
  }
};
