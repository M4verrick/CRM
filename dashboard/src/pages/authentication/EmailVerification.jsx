import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate} from 'react-router-dom';
import api from 'services/api';
import { useApi } from 'hooks/useApi';

// MUI Components
import { Box, Typography, Container, CircularProgress, Paper, Alert } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const EmailVerification = () => {
    const [status, setStatus] = useState('verifying');
    const { loading, error, post } = useApi();
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const verifyEmail = async () => {
            try {
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

        verifyEmail();
    }, []);

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        p: 4,
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 2
                    }}
                >
                    {status === 'verifying' && (
                        <>
                            <CircularProgress size={60} />
                            <Typography variant="h5" component="h1">
                                Verifying your email...
                            </Typography>
                        </>
                    )}

                    {status === 'success' && (
                        <>
                            <CheckCircleOutlineIcon color="success" sx={{ fontSize: 60 }} />
                            <Typography variant="h5" component="h1">
                                Email Verified Successfully!
                            </Typography>
                            <Typography color="textSecondary">
                                Your account has been created
                            </Typography>
                        </>
                    )}

                    {status === 'error' && (
                        <>
                            <ErrorOutlineIcon color="error" sx={{ fontSize: 60 }} />
                            <Typography variant="h5" component="h1" color="error">
                                Verification Failed
                            </Typography>
                            <Alert severity="error" sx={{ width: '100%' }}>
                                {errorMessage || 'The verification link may be expired or invalid.'}
                            </Alert>
                        </>
                    )}
                </Paper>
            </Box>
        </Container>
    );
};

export default EmailVerification;