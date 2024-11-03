// src/pages/EmailVerification.jsx
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CircularProgress } from '@mui/material';

// api useHook
import { useApi } from 'hooks/useApi';

function EmailVerification() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', or 'error'
  const { loading, error, post } = useApi();
  
  useEffect(async() => {
    const token = searchParams.get('token');
    
    if (token) {
      // Send token to the backend for verification
      const userData = await post('verify-email', token);

    } else {
      setStatus('error');
    }
  }, [searchParams]);

  return (
    <div>
      {status === 'verifying' && <p>Verifying your email...</p>}
      {status === 'success' && <p>Email verified successfully! Your account has been created</p>}
      {status === 'error' && <p>Verification failed. The link may be expired or invalid.</p>}
    </div>
  );
}

export default EmailVerification;