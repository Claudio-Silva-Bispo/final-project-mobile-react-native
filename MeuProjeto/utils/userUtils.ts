import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveUserData = async (user: { name: string; email: string; password: string }) => {
  try {
    await AsyncStorage.setItem("users", JSON.stringify([user])); 
    console.log("Dados do usuário salvos:", user);
  } catch (error) {
    console.error("Erro ao salvar os dados do usuário:", error);
  }
};

export const loadUserData = async () => {
  try {
    const userData = await AsyncStorage.getItem("users");
    if (userData) {
      const users = JSON.parse(userData);
      return users;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Erro ao carregar dados do usuário:", error);
    return null;
  }
};
