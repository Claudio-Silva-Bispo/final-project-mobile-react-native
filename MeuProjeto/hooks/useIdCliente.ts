import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useIdCliente = () => {
  const [idCliente, setIdCliente] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchIdCliente = async () => {
      try {
        const storedId = await AsyncStorage.getItem('idCliente');
        setIdCliente(storedId);
      } catch (error) {
        console.log("Erro ao buscar idCliente do AsyncStorage:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIdCliente();
  }, []);

  return { idCliente, loading };
};
