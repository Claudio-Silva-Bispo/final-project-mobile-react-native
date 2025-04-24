import { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, documentId, getDocs } from 'firebase/firestore';

export const useUserData = (idCliente: string | null) => {
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserName = async () => {
      if (!idCliente) {
        setLoading(false);
        return;
      }

      const db = getFirestore();

      try {
        const usuarioQuery = query(
          collection(db, 't_usuario'),
          where(documentId(), '==', idCliente)
        );

        const usuarioSnapshot = await getDocs(usuarioQuery);
        if (!usuarioSnapshot.empty) {
          usuarioSnapshot.forEach((doc) => {
            const usuarioData = doc.data();
            const nome = usuarioData?.nome;
            setUserName(nome);
          });
        }
      } catch (error) {
        console.log("Erro ao buscar dados do usuário:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserName();
  }, [idCliente]);

  return { userName, loading };
};
