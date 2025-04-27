import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveAuthData = async (userName: string) => {
  try {
    await AsyncStorage.multiSet([
      ['userName', userName],
      ['isSignedIn', 'true']
    ]);
  } catch (error) {
    console.error('Error saving auth data:', error);
    throw error;
  }
};

export const clearAuthData = async () => {
  try {
    await AsyncStorage.multiRemove(['userName', 'isSignedIn']);
  } catch (error) {
    console.error('Error clearing auth data:', error);
    throw error;
  }
};

export const loadAuthData = async () => {
  try {
    const [userName, isSignedIn] = await AsyncStorage.multiGet(['userName', 'isSignedIn']);
    return {
      userName: userName[1] || '',
      isSignedIn: isSignedIn[1] === 'true'
    };
  } catch (error) {
    console.error('Error loading auth data:', error);
    throw error;
  }
};

export const saveUserData = async (user: { name: string; email: string; password: string }) => {
  try {
    const existingUsers = await AsyncStorage.getItem('users');
    const users = existingUsers ? JSON.parse(existingUsers) : [];
    users.push(user);
    await AsyncStorage.setItem('users', JSON.stringify(users));
  } catch (error) {
    console.error('Error saving user data:', error);
    throw error;
  }
};