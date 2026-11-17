/**
 * Google Identity Services & OAuth2 Architecture
 * Triggers Google's official browser account chooser with all signed-in Google accounts on the user's laptop.
 */

export const triggerGoogleAuth = ({ clientId, onSuccess, onError }) => {
  const activeClientId =
    clientId ||
    localStorage.getItem('google_client_id') ||
    import.meta.env.VITE_GOOGLE_CLIENT_ID;

  if (!activeClientId) {
    onError?.('MISSING_CLIENT_ID');
    return;
  }

  // 1. Google Identity Services (GSI) TokenClient — Official Google Account Selector Dialog
  if (typeof window !== 'undefined' && window.google?.accounts?.oauth2) {
    try {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: activeClientId,
        scope: 'email profile openid',
        prompt: 'select_account',
        callback: async (tokenResponse) => {
          if (tokenResponse.error) {
            onError?.(tokenResponse.error_description || tokenResponse.error);
            return;
          }

          try {
            const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
            });
            const profile = await res.json();
            onSuccess?.(profile);
          } catch (err) {
            onError?.('Failed to fetch user profile details from Google API.');
          }
        },
      });

      // Forces Google to show all accounts logged in on the device
      client.requestAccessToken({ prompt: 'select_account' });
      return;
    } catch (err) {
      console.warn('GSI TokenClient initialization warning, using popup fallback', err);
    }
  }

  // 2. Direct browser OAuth2 Popup Fallback to accounts.google.com
  const redirectUri = window.location.origin;
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(
    activeClientId
  )}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&response_type=token&scope=email%20profile%20openid&prompt=select_account`;

  const width = 500;
  const height = 620;
  const left = window.screenX + (window.outerWidth - width) / 2;
  const top = window.screenY + (window.outerHeight - height) / 2.5;

  const popup = window.open(
    authUrl,
    'GoogleSignIn',
    `width=${width},height=${height},left=${left},top=${top},status=no,toolbar=no,menubar=no`
  );

  if (!popup) {
    onError?.('Google popup window was blocked by your browser. Please allow popups.');
  }
};
