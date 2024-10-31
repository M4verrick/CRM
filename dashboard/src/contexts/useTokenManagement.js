import { useState, useCallback, useEffect } from 'react';
import { useAccount } from './Account';
import { TokenManager } from './TokenManager';

export const useTokenManagement = () => {
    const { isAuthenticated, refreshSession } = useAccount();
    const [tokens, setTokens] = useState(null);
    
    const updateTokens = useCallback(async () => {
        if (!isAuthenticated) {
            setTokens(null);
            return;
        }
        
        try {
            const newTokens = await TokenManager.getTokens();
            setTokens(newTokens);
        } catch (error) {
            console.error('Error updating tokens:', error);
            setTokens(null);
        }
    }, [isAuthenticated]);

    const getValidToken = useCallback(async () => {
        try {
            const token = await TokenManager.getValidAccessToken();
            return token;
        } catch (error) {
            console.error('Error getting valid token:', error);
            // Attempt to refresh the session if token retrieval fails
            await refreshSession();
            throw error;
        }
    }, [refreshSession]);

    // Update tokens when auth state changes
    useEffect(() => {
        updateTokens();
    }, [isAuthenticated, updateTokens]);

    return {
        tokens,
        updateTokens,
        getValidToken,
    };
};