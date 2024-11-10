// src/pages/EmailVerification.jsx
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate} from 'react-router-dom';
import api from 'services/api';

// api useHook
import { useApi } from 'hooks/useApi';

const EmailVerification = () => {
    // const [searchParams] = useSearchParams();
    const [status, setStatus] = useState('verifying'); // 'verifying', 'success', or 'error'
    const { loading, error, post } = useApi();
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    

    useEffect(() => {
        const verifyEmail = async () => {
            // const token = searchParams.get('token');

            // if (!token) {
            //     setStatus('error');
            //     setErrorMessage('No verification token found');
            //     return;
            // }

            try {
                // Simulate API call - replace with your actual API call
                const response = await api.verifyEmail();

                if (!response.ok) {
                    throw new Error('Verification failed');
                }

                setStatus('success');
            } catch (err) {
                setStatus('error');
                setErrorMessage(err.message || 'Verification failed. An unexpected server error occurred.');
            }
        };

    }, [searchParams]);

    return (
    <div>
      {status === 'verifying' && <p>Verifying your email...</p>}
      {status === 'success' && <p>Email verified successfully! Your account has been created</p>}
      {status === 'error' && 
      <div><p>Verification failed.</p>
      <p>{errorMessage || 'The verification link may be expired or invalid.'}</p></div>}
    </div>
  );
};

export default EmailVerification;