import { Alert } from 'react-native';

export const askYesNo = (question: string): Promise<boolean> => {
  return new Promise((resolve) => {
    Alert.alert(
      'Confirmação',
      question,
      [
        { text: 'Não', onPress: () => resolve(false), style: 'cancel' },
        { text: 'Sim', onPress: () => resolve(true) },
      ],
      { cancelable: false }
    );
  });
};
