import React, { createContext } from "react";
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import Pool from "./UserPool";

const AccountContext = createContext();

const Account = (props) => {
    const getSession = async () => {
        return await new Promise((resolve, reject) => {
            const user = Pool.getCurrentUser();
            if (user) {
                user.getSession((err, session) => {
                    const user = Pool.getCurrentUser();
                    if (err) {
                        reject();
                    } else {
                        resolve(session);
                    }
                });
            } else {
                reject();
            }
        })
    }

    const authenticate = async (Username, Password) => {
        return await new Promise((resolve, reject) => {
            const user = new CognitoUser({ Username, Pool });

            const authDetails = new AuthenticationDetails({ Username, Password });
    
            user.authenticateUser(authDetails, {
                onSuccess: (data) => {
                    console.log("onSuccess:", data);
                    resolve(data);
                },
                onFailure: (err) => {
                    console.error("onFailure:", err);
                    reject(new Error(err.message || "Invalid login credentials"));
                },
                newPasswordRequired: (data) => {
                    console.error("newPasswordRequired:", data);
                    reject(new Error("New password required"));
                },
            });
        });
    };

    return (
        <AccountContext.Provider value={{ authenticate, getSession }}>
            {props.children}
        </AccountContext.Provider>
    );
};

// Export both Account component and Context
export { Account, AccountContext };