// services/authService.js

export const login = (token) => {
  localStorage.setItem('access_token', token);
};

export const logout = () => {
  localStorage.removeItem('access_token');
};

export const isAuthenticated = () => {
  const token = localStorage.getItem('access_token');
  // Optionnel : vérifie si le token n'est pas expiré ici (avec jwt-decode par ex)
  return !!token;
};
