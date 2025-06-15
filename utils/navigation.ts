import { router } from 'expo-router';

export const NavigationHelper = {
  // Navigate to signin screen
  goToSignIn: () => {
    router.push('/(auth)/signin');
  },

  // Navigate to main tabs
  goToHome: () => {
    router.push('/(tabs)');
  },

  // Navigate to explore tab
  goToExplore: () => {
    router.push('/(tabs)/explore');
  },

  // Navigate back
  goBack: () => {
    router.back();
  },

  // Replace current screen (no back button)
  replaceWithHome: () => {
    router.replace('/(tabs)');
  },

  replaceWithSignIn: () => {
    router.replace('/(auth)/signin');
  },

  // Reset navigation stack
  resetToHome: () => {
    router.dismissAll();
    router.replace('/(tabs)');
  },

  resetToSignIn: () => {
    router.dismissAll();
    router.replace('/(auth)/signin');
  }
};

