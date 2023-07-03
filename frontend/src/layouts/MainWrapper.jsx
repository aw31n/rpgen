import { useEffect, useState } from 'react';
import { setUser } from '../utils/auth';
import React from "react";
import NavBar from '../components/navbar';
import { useAuthStore } from '../store/auth';

const MainWrapper = ({ children }) => {
    const [loading, setLoading] = useState(true);

    const userData = useAuthStore((state) => state.allUserData?.user_id)

    useEffect(() => {
        
        const handler = async () => {
            setLoading(true);
            await setUser();
            setLoading(false);
        };
        handler();
    }, [userData]);

    return <>  {loading ? null : <div className="h-full w-full"> <NavBar /> {children} </div>}</>;
};

export default MainWrapper;