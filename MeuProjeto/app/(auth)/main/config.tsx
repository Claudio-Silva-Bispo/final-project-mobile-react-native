import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';

// Componente para item de menu de configurações
type ConfigMenuItemProps = {
  icon: React.ReactNode;
  title: string;
  onPress: () => void;
};

const ConfigMenuItem: React.FC<ConfigMenuItemProps> = ({ icon, title, onPress }) => {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemContent}>
        <View style={styles.iconContainer}>
          {icon}
        </View>
        <Text style={styles.menuItemText}>{title}</Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
};

// Ícones simples em SVG-like components
const UserIcon = () => (
  <View style={styles.iconSvg}>
    <View style={styles.userIconHead} />
    <View style={styles.userIconBody} />
  </View>
);

const FamilyIcon = () => (
  <View style={styles.iconSvg}>
    <View style={[styles.familyIconPerson, { left: 2 }]} />
    <View style={[styles.familyIconPerson, { left: 10 }]} />
    <View style={[styles.familyIconChild, { left: 18 }]} />
  </View>
);

const CardIcon = () => (
  <View style={styles.iconSvg}>
    <View style={styles.cardIconBox} />
    <View style={styles.cardIconLine} />
  </View>
);

const LockIcon = () => (
  <View style={styles.iconSvg}>
    <View style={styles.lockIconBody} />
    <View style={styles.lockIconShackle} />
  </View>
);

const PreferenceIcon = () => (
  <View style={styles.iconSvg}>
    <View style={styles.preferenceIconClipboard} />
    <View style={styles.preferenceIconLine1} />
    <View style={styles.preferenceIconLine2} />
  </View>
);

const PaymentIcon = () => (
  <View style={styles.iconSvg}>
    <View style={styles.paymentIconCard} />
    <View style={styles.paymentIconStripe} />
  </View>
);

const SettingsIcon = () => (
  <View style={styles.iconSvg}>
    <View style={styles.settingsIconGear} />
    <View style={styles.settingsIconDot} />
  </View>
);

const PrivacyIcon = () => (
  <View style={styles.iconSvg}>
    <View style={styles.privacyIconShield} />
    <View style={styles.privacyIconCheck} />
  </View>
);

const DentalIcon = () => (
  <View style={styles.iconSvg}>
    <View style={styles.dentalIconTooth} />
  </View>
);

const FeedbackIcon = () => (
  <View style={styles.iconSvg}>
    <View style={styles.feedbackIconBubble} />
    <View style={styles.feedbackIconDot1} />
    <View style={styles.feedbackIconDot2} />
  </View>
);

const SuggestionIcon = () => (
  <View style={styles.iconSvg}>
    <View style={styles.suggestionIconBulb} />
    <View style={styles.suggestionIconRay1} />
    <View style={styles.suggestionIconRay2} />
  </View>
);

const ConsultaIcon = () => (
  <View style={styles.iconSvg}>
    <View style={styles.consultaIconCalendar} />
    <View style={styles.consultaIconLine1} />
    <View style={styles.consultaIconLine2} />
  </View>
);

const PartnersIcon = () => (
  <View style={styles.iconSvg}>
    <View style={styles.partnersIconBuilding1} />
    <View style={styles.partnersIconBuilding2} />
  </View>
);

const BenefitsIcon = () => (
  <View style={styles.iconSvg}>
    <View style={styles.benefitsIconStar} />
    <View style={styles.benefitsIconRibbon} />
  </View>
);

const VideosIcon = () => (
  <View style={styles.iconSvg}>
    <View style={styles.preferenceIconClipboard} />
    <View style={styles.preferenceIconLine1} />
    <View style={styles.preferenceIconLine2} />
  </View>
);

const LogoutIcon = () => (
  <View style={styles.iconSvg}>
    <View style={styles.logoutIconBox} />
    <View style={styles.logoutIconArrow} />
  </View>
);

export default function ConfigScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={router.back}>
          <View style={styles.backButtonCircle}>
            <Text style={styles.backButtonIcon}>←</Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Configurações</Text>
        <TouchableOpacity style={styles.profileButton}>
          <View style={styles.profileIconCircle}>
            <Text style={styles.profileIcon}>👤</Text>
          </View>
        </TouchableOpacity>
      </View>
      
      {/* Divider */}
      <View style={styles.divider} />
      
      {/* Menu Items */}
      <ScrollView style={styles.menuContainer}>
        <ConfigMenuItem 
          icon={<UserIcon />} 
          title="Seus dados"
          onPress={() => router.push('/(auth)/config/clienteDetails')}
        />
        
        <ConfigMenuItem 
          icon={<FamilyIcon />} 
          title="Notificações"
          onPress={() => router.push('/(auth)/config/notification')}
        />
        
        <ConfigMenuItem 
          icon={<CardIcon />} 
          title="Carteirinha"
          onPress={() => router.push('/(auth)/config/carteirinha')}
        />
        
        <ConfigMenuItem 
          icon={<LockIcon />} 
          title="Senha e Acesso"
          onPress={() => router.push('/(auth)/login/redefinir-senha')}
        />
        
        <ConfigMenuItem 
          icon={<PreferenceIcon />} 
          title="Preferência de Atendimento"
          onPress={() => console.log('Preferência de Atendimento')}
        />
        
        <ConfigMenuItem 
          icon={<PaymentIcon />} 
          title="Formas de Pagamento"
          onPress={() => router.push('/(auth)/config/formaPagamento')}
        />
        
        <ConfigMenuItem 
          icon={<SettingsIcon />} 
          title="Preferências"
          onPress={() => router.push('/(auth)/config/preference')}
        />
        
        <ConfigMenuItem 
          icon={<PrivacyIcon />} 
          title="Política de Privacidade"
          onPress={() => router.push('/(auth)/config/privacyPolicy')}
        />
        
        <ConfigMenuItem 
          icon={<DentalIcon />} 
          title="Rotina de Cuidados"
          onPress={() => console.log('Rotina de Cuidados')}
        />

        <ConfigMenuItem 
          icon={<SuggestionIcon />} 
          title="Sugestão de Consultas"
          onPress={() => router.push('/(auth)/main/sugestion')}
        />

        <ConfigMenuItem 
          icon={<ConsultaIcon />} 
          title="Consultas"
          onPress={() => router.push('/(auth)/main/appointments')}
        />

        <ConfigMenuItem 
          icon={<FeedbackIcon />} 
          title="Feedback"
          onPress={() => router.push('/(auth)/config/feedback')}
        />
        
        <ConfigMenuItem 
          icon={<PartnersIcon />} 
          title="Lista de Parceiros"
          onPress={() => router.push('/(auth)/config/partners')}
        />
        
        <ConfigMenuItem 
          icon={<BenefitsIcon />} 
          title="Programa de Benefícios"
          onPress={() => router.push('/(auth)/config/benefictsProgram')}
        />

      <ConfigMenuItem 
          icon={<SettingsIcon />} 
          title="Vídeos"
          onPress={() => router.push('/(auth)/config/videoDoctorFake')}
        />
        
        <ConfigMenuItem 
          icon={<LogoutIcon />} 
          title="Sair"
          onPress={() => console.log('Sair')}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 5,
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
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  profileButton: {
    padding: 5,
  },
  profileIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#007BFF',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  profileIcon: {
    fontSize: 18,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    width: '100%',
  },
  menuContainer: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 24,
    height: 24,
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
  },
  chevron: {
    fontSize: 24,
    color: '#C0C0C0',
  },
  iconSvg: {
    width: 24,
    height: 24,
    position: 'relative',
  },
  
  // User icon
  userIconHead: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#007BFF',
    position: 'absolute',
    top: 0,
    left: 6,
  },
  userIconBody: {
    width: 18,
    height: 10,
    borderTopLeftRadius: 9,
    borderTopRightRadius: 9,
    backgroundColor: '#007BFF',
    position: 'absolute',
    bottom: 0,
    left: 3,
  },
  
  // Family icon
  familyIconPerson: {
    width: 6,
    height: 16,
    borderRadius: 3,
    backgroundColor: '#007BFF',
    position: 'absolute',
    bottom: 0,
  },
  familyIconChild: {
    width: 4,
    height: 12,
    borderRadius: 2,
    backgroundColor: '#007BFF',
    position: 'absolute',
    bottom: 0,
  },
  
  // Card icon
  cardIconBox: {
    width: 18,
    height: 12,
    borderRadius: 2,
    borderWidth: 2,
    borderColor: '#007BFF',
    position: 'absolute',
    top: 6,
    left: 3,
  },
  cardIconLine: {
    width: 12,
    height: 2,
    backgroundColor: '#007BFF',
    position: 'absolute',
    top: 12,
    left: 6,
  },
  
  // Lock icon
  lockIconBody: {
    width: 16,
    height: 10,
    borderRadius: 2,
    backgroundColor: '#007BFF',
    position: 'absolute',
    bottom: 2,
    left: 4,
  },
  lockIconShackle: {
    width: 10,
    height: 10,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderWidth: 2,
    borderColor: '#007BFF',
    borderBottomWidth: 0,
    position: 'absolute',
    top: 2,
    left: 7,
  },
  
  // Preference icon
  preferenceIconClipboard: {
    width: 16,
    height: 20,
    borderRadius: 2,
    borderWidth: 2,
    borderColor: '#007BFF',
    position: 'absolute',
    top: 2,
    left: 4,
  },
  preferenceIconLine1: {
    width: 10,
    height: 1,
    backgroundColor: '#007BFF',
    position: 'absolute',
    top: 8,
    left: 7,
  },
  preferenceIconLine2: {
    width: 10,
    height: 1,
    backgroundColor: '#007BFF',
    position: 'absolute',
    top: 12,
    left: 7,
  },
  
  // Payment icon
  paymentIconCard: {
    width: 20,
    height: 14,
    borderRadius: 2,
    backgroundColor: '#007BFF',
    position: 'absolute',
    top: 5,
    left: 2,
  },
  paymentIconStripe: {
    width: 16,
    height: 3,
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    top: 10,
    left: 4,
  },
  
  // Settings icon
  settingsIconGear: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#007BFF',
    position: 'absolute',
    top: 4,
    left: 4,
  },
  settingsIconDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#007BFF',
    position: 'absolute',
    top: 9,
    left: 9,
  },
  
  // Privacy icon
  privacyIconShield: {
    width: 16,
    height: 20,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#007BFF',
    position: 'absolute',
    top: 2,
    left: 4,
  },
  privacyIconCheck: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#007BFF',
    position: 'absolute',
    top: 8,
    left: 8,
  },
  
  // Dental icon
  dentalIconTooth: {
    width: 16,
    height: 18,
    borderRadius: 5,
    backgroundColor: '#007BFF',
    position: 'absolute',
    top: 3,
    left: 4,
  },

  // Feedback icon
  feedbackIconBubble: {
    width: 18,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#007BFF',
    position: 'absolute',
    top: 3,
    left: 3,
  },
  feedbackIconDot1: {
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: '#007BFF',
    position: 'absolute',
    top: 8,
    left: 8,
  },
  feedbackIconDot2: {
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: '#007BFF',
    position: 'absolute',
    top: 12,
    left: 12,
  },

  // Suggestion icon
  suggestionIconBulb: {
    width: 14,
    height: 18,
    borderRadius: 7,
    backgroundColor: '#007BFF',
    position: 'absolute',
    top: 2,
    left: 5,
  },
  suggestionIconRay1: {
    width: 6,
    height: 2,
    backgroundColor: '#007BFF',
    position: 'absolute',
    top: 7,
    right: 2,
    transform: [{ rotate: '45deg' }],
  },
  suggestionIconRay2: {
    width: 6,
    height: 2,
    backgroundColor: '#007BFF',
    position: 'absolute',
    top: 7,
    left: 2,
    transform: [{ rotate: '-45deg' }],
  },

  // Consulta icon
  consultaIconCalendar: {
    width: 18,
    height: 18,
    borderRadius: 2,
    borderWidth: 2,
    borderColor: '#007BFF',
    position: 'absolute',
    top: 3,
    left: 3,
  },
  consultaIconLine1: {
    width: 10,
    height: 1,
    backgroundColor: '#007BFF',
    position: 'absolute',
    top: 9,
    left: 7,
  },
  consultaIconLine2: {
    width: 10,
    height: 1,
    backgroundColor: '#007BFF',
    position: 'absolute',
    top: 13,
    left: 7,
  },

  // Partners icon
  partnersIconBuilding1: {
    width: 8,
    height: 16,
    backgroundColor: '#007BFF',
    position: 'absolute',
    top: 4,
    left: 4,
  },
  partnersIconBuilding2: {
    width: 8,
    height: 12,
    backgroundColor: '#007BFF',
    position: 'absolute',
    top: 8,
    right: 4,
  },

  // Benefits icon
  benefitsIconStar: {
    width: 14,
    height: 14,
    backgroundColor: '#007BFF',
    position: 'absolute',
    top: 3,
    left: 5,
    borderRadius: 7,
  },
  benefitsIconRibbon: {
    width: 10,
    height: 8,
    backgroundColor: '#007BFF',
    position: 'absolute',
    bottom: 2,
    left: 7,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  
  
  // Logout icon
  logoutIconBox: {
    width: 14,
    height: 14,
    borderWidth: 2,
    borderColor: '#007BFF',
    position: 'absolute',
    top: 5,
    left: 2,
  },
  logoutIconArrow: {
    width: 12,
    height: 2,
    backgroundColor: '#007BFF',
    position: 'absolute',
    top: 11,
    right: 3,
  },
});