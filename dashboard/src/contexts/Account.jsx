import React, { createContext, useState, useEffect, useCallback } from "react";
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import Pool from "./UserPool";

const AccountContext = createContext();

const Account = (props) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [userAttributes, setUserAttributes] = useState(null);

    // Get user attributes from Cognito
    const getUserAttributes = useCallback(async (cognitoUser) => {
        return new Promise((resolve, reject) => {
            cognitoUser.getUserAttributes((err, attributes) => {
                if (err) {
                    reject(err);
                    return;
                }
                
                // Convert array of attributes to an object
                const userAttr = {};
                attributes?.forEach(attribute => {
                    userAttr[attribute.getName()] = attribute.getValue();
                });
                resolve(userAttr);
            });
        });
    }, []);

    // Initialize auth state
    const initializeAuth = useCallback(async () => {
        try {
            setIsLoading(true);
            const session = await getSession();
            const cognitoUser = Pool.getCurrentUser();
            
            if (session && cognitoUser) {
                const attributes = await getUserAttributes(cognitoUser);
                setUserAttributes(attributes);
                setUser(cognitoUser);
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error("Auth initialization error:", error);
            setIsAuthenticated(false);
            setUser(null);
            setUserAttributes(null);
        } finally {
            setIsLoading(false);
        }
    }, [getUserAttributes]);

    // Check auth status on mount
    useEffect(() => {
        initializeAuth();
    }, [initializeAuth]);

    const getSession = async () => {
        return await new Promise((resolve, reject) => {
            const user = Pool.getCurrentUser();
            if (user) {
                user.getSession((err, session) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(session);
                    }
                });
            } else {
                reject(new Error("No user found"));
            }
        });
    };

    const authenticate = async (Username, Password) => {
        try {
            setIsLoading(true);
            const authResult = await new Promise((resolve, reject) => {
                const user = new CognitoUser({ Username, Pool });
                const authDetails = new AuthenticationDetails({ Username, Password });
        
                user.authenticateUser(authDetails, {
                    onSuccess: (data) => {
                        resolve(data);
                    },
                    onFailure: (err) => {
                        reject(new Error(err.message || "Invalid login credentials"));
                    },
                    newPasswordRequired: (data) => {
                        reject(new Error("New password required"));
                    },
                });
            });

            // Update auth state after successful login
            await initializeAuth();
            return authResult;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            setIsLoading(true);
            const user = Pool.getCurrentUser();
            if (user) {
                user.signOut();
                setIsAuthenticated(false);
                setUser(null);
                setUserAttributes(null);
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Get current user's Cognito groups/roles
    const getUserGroups = useCallback(async () => {
        try {
            const session = await getSession();
            if (!session) return [];
            
            // Get groups from the JWT payload
            const payload = session.getIdToken().decodePayload();
            return payload['cognito:groups'] || [];
        } catch (error) {
            console.error("Error getting user groups:", error);
            return [];
        }
    }, []);

    // Check if user has specific group/role
    const hasGroup = useCallback(async (group) => {
        const groups = await getUserGroups();
        return groups.includes(group);
    }, [getUserGroups]);

    // Refresh session
    const refreshSession = async () => {
        try {
            setIsLoading(true);
            await initializeAuth();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AccountContext.Provider 
            value={{
                isAuthenticated,
                isLoading,
                user,
                userAttributes,
                authenticate,
                getSession,
                logout,
                getUserGroups,
                hasGroup,
                refreshSession
            }}
        >
            {props.children}
        </AccountContext.Provider>
    );
};

// Custom hook for easier context usage
const useAccount = () => {
    const context = React.useContext(AccountContext);
    if (!context) {
        throw new Error('useAccount must be used within an AccountProvider');
    }
    return context;
};

// Export both Account component, Context, and hook
export { Account, AccountContext, useAccount };