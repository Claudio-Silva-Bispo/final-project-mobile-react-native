import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useAuthContext } from './AuthProvider';

export default function InitialNavigation() {
  const { isSignedIn, isAuthReady } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthReady) return;

    if (isSignedIn) {
      router.replace('/(auth)/main/inicio');
    } else {
      router.replace('/');
    }
  }, [isSignedIn, isAuthReady]);

  return null;
}