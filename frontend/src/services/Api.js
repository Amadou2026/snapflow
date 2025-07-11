// src/api.js
export async function fetchWithToken(url, options = {}) {
  let token = localStorage.getItem('access_token');
  if (!options.headers) options.headers = {};
  options.headers['Authorization'] = `Bearer ${token}`;

  let response = await fetch(url, options);

  if (response.status === 401) {
    // Token expired, essaie de rafraîchir
    const refreshToken = localStorage.getItem('refresh_token');
    const refreshResponse = await fetch('http://localhost:8000/api/token/refresh/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (refreshResponse.ok) {
      const refreshData = await refreshResponse.json();
      localStorage.setItem('access_token', refreshData.access);

      // Réessaye la requête initiale avec nouveau token
      options.headers['Authorization'] = `Bearer ${refreshData.access}`;
      response = await fetch(url, options);
      return response;
    } else {
      // Refresh token invalide ou expiré, déconnexion
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';  // redirection vers login
      return null;
    }
  }

  return response;
}
