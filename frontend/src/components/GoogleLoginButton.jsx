import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';

/**
 * Reusable "Continue with Google" button.
 * Uses VITE_GOOGLE_CLIENT_ID. Renders nothing if client ID is not configured.
 */
const GoogleLoginButton = ({ onSuccess, onError, disabled = false, className = '' }) => {
  const { loginWithGoogle } = useAuth();
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  if (!clientId) {
    return null;
  }

  const handleSuccess = async (credentialResponse) => {
    const credential = credentialResponse?.credential;
    if (!credential) {
      (onError || (() => {}))('No credential received from Google');
      return;
    }
    const result = await loginWithGoogle(credential);
    if (result.success) {
      (onSuccess || (() => {}))();
    } else {
      (onError || (() => {}))(result.message);
    }
  };

  const handleError = () => {
    (onError || (() => {}))('Google sign-in was cancelled or failed');
  };

  return (
    <div className={className}>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        theme="outline"
        size="large"
        text="continue_with"
        shape="rectangular"
        width="100%"
        disabled={disabled}
      />
    </div>
  );
};

export default GoogleLoginButton;
