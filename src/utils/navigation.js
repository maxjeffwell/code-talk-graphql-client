// Navigation utility for programmatic navigation from anywhere in the app
let navigationInstance = null;

export const setNavigationInstance = (navigate) => {
  navigationInstance = navigate;
};

export const getNavigationInstance = () => {
  return navigationInstance;
};

export const navigateToSignIn = () => {
  if (navigationInstance) {
    navigationInstance('/signin', { replace: true });
  } else {
    // Fallback to window.location for immediate redirect
    window.location.href = '/signin';
  }
};