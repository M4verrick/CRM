import React, { useState, useContext } from 'react';
import { AccountContext } from './Account.jsx';  // Add .jsx extension

const Status = () => {
    const [status, setStatus] = useState(false);

    const { getSession } = useContext(AccountContext);

    useEffect(() => {
        getSession().then((session) => {
            console.log("Session: ", session);
            setStatus(true);
        });
    });
    return <div></div>
};
export default Status;