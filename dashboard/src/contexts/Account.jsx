import React, { createContext, useState, useEffect, useCallback } from "react";
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import Pool from "./UserPool";

const AccountContext = createContext();

const Account = (props) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [userAttributes, setUserAttributes] = useState(null);

    // Fixed getUserAttributes function
    const getUserAttributes = useCallback((cognitoUser) => {
        return new Promise((resolve, reject) => {
            // First ensure we have a valid session
            cognitoUser.getSession((sessionErr, session) => {
                if (sessionErr) {
                    console.error("Session error in getUserAttributes:", sessionErr);
                    reject(sessionErr);
                    return;
                }

                if (!session.isValid()) {
                    console.error("Invalid session in getUserAttributes");
                    reject(new Error("Invalid session"));
                    return;
                }

                // Now get the attributes
                cognitoUser.getUserAttributes((err, attributes) => {
                    if (err) {
                        console.error("Error getting user attributes:", err);
                        reject(err);
                        return;
                    }
                    
                    if (!attributes) {
                        console.log("No attributes found");
                        resolve({});
                        return;
                    }

                    // Convert array of attributes to an object
                    const userAttr = {};
                    attributes.forEach(attribute => {
                        userAttr[attribute.getName()] = attribute.getValue();
                    });
                    
                    console.log("Successfully retrieved user attributes:", userAttr);
                    resolve(userAttr);
                });
            });
        });
    }, []);

    // Modified initializeAuth
    const initializeAuth = useCallback(async () => {
        try {
            setIsLoading(true);
            console.log("Starting auth initialization");

            const cognitoUser = Pool.getCurrentUser();
            if (!cognitoUser) {
                console.log("No current user found");
                throw new Error("No user found");
            }

            // Get session first
            const session = await new Promise((resolve, reject) => {
                cognitoUser.getSession((err, session) => {
                    if (err) {
                        console.error("Session error:", err);
                        reject(err);
                        return;
                    }
                    resolve(session);
                });
            });

            if (!session.isValid()) {
                console.log("Session is invalid");
                throw new Error("Invalid session");
            }

            console.log("Valid session found");

            try {
                const attributes = await getUserAttributes(cognitoUser);
                setUserAttributes(attributes);
                setUser(cognitoUser);
                setIsAuthenticated(true);
                console.log("Auth initialization complete with attributes");
            } catch (attrError) {
                console.error("Error getting user attributes:", attrError);
                // Continue with authentication even if attributes fail
                setUser(cognitoUser);
                setIsAuthenticated(true);
                console.log("Auth initialization complete without attributes");
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

    // Modified authenticate function
    const authenticate = async (Username, Password) => {
        try {
            setIsLoading(true);
            console.log("Starting authentication");

            const user = new CognitoUser({
                Username,
                Pool,
                Storage: window.localStorage
            });

            const authDetails = new AuthenticationDetails({
                Username,
                Password
            });

            const authResult = await new Promise((resolve, reject) => {
                user.authenticateUser(authDetails, {
                    onSuccess: async (result) => {
                        console.log("Authentication successful");
                        resolve(result);
                    },
                    onFailure: (err) => {
                        console.error("Authentication failed:", err);
                        reject(err);
                    },
                    newPasswordRequired: (userAttributes, requiredAttributes) => {
                        console.log("New password required");
                        reject(new Error("New password required"));
                    }
                });
            });

            // Wait for auth state to be initialized
            await initializeAuth();
            return authResult;

        } catch (error) {
            console.error("Authentication error:", error);
            throw error;
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

    // Modified getSession with better error handling
    const getSession = async () => {
        try {
            const user = Pool.getCurrentUser();
            console.log("Current user from pool:", user); // Debug log

            if (!user) {
                throw new Error("No user found");
            }

            return await new Promise((resolve, reject) => {
                // Get session and verify it's valid
                user.getSession((err, session) => {
                    if (err) {
                        console.error("Session error:", err); // Debug log
                        reject(err);
                        return;
                    }

                    if (!session.isValid()) {
                        console.error("Session is invalid"); // Debug log
                        reject(new Error("Invalid session"));
                        return;
                    }

                    console.log("Valid session obtained:", session); // Debug log
                    resolve(session);
                });
            });
        } catch (error) {
            console.error("GetSession error:", error); // Debug log
            throw error;
        }
    };

    // Refresh session
    const refreshSession = async () => {
        try {
            setIsLoading(true);
            await initializeAuth();
        } finally {
            setIsLoading(false);
        }
    };

    // Modified logout function
    const logout = async () => {
        try {
            setIsLoading(true);
            const user = Pool.getCurrentUser();
            if (user) {
                console.log("Logging out user"); // Debug log
                user.signOut();
                setIsAuthenticated(false);
                setUser(null);
                setUserAttributes(null);
                console.log("Logout complete"); // Debug log
            }
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Initialize auth state on mount
    useEffect(() => {
        console.log("Initializing auth state on mount"); // Debug log
        initializeAuth();
    }, [initializeAuth]);

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