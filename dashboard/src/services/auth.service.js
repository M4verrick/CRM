export const getAuthTokens = () => {
    try {
      const tokensStr = localStorage.getItem('auth_tokens');
      if (!tokensStr) return null;
      return JSON.parse(tokensStr);
    } catch (error) {
      console.error('Error parsing auth tokens:', error);
      return null;
    }
  };
  
  export const isTokenExpired = (token) => {
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expTimestamp = payload.exp * 1000; // Convert to milliseconds
      return Date.now() >= expTimestamp;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  };