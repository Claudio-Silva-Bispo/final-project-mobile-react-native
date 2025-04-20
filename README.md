# final-project-mobile-react-native
Projeto final para entrega da FIAP + OdontoPrev. Aplicação de consultas odontologicas preventivas.


## Etapas de criação do projeto

**Instalar o Expo CLI**

```bash
    npm install -g expo-cli
```

**Criar o projeto**

```bash
    npx create-expo-app MeuProjeto --template
```

**Instalar o NativeWind**

```bash
    npm install nativewind
```

**Instalar as dependências do Firebase**

```bash
    npm install @react-native-firebase/app @react-native-firebase/auth @react-native-firebase/firestore
```

**Instalar as bibliotecas de navegação e imagem do Expo**

```bash
    npm install expo-router expo-image
```

**Criar o arquivo babel**

```bash
    module.exports = function(api) {
        api.cache(true);
        return {
            presets: ['babel-preset-expo'],
            plugins: ['nativewind/babel'],
        };
    };
```

**Executar o projeto**

```bash
    npx expo start --tunnel
```

**Executar offline**

```bash
    npx expo start --offline
```

**Executar offline**
```bash
    npx expo start --dev-client --clear --offline
```
