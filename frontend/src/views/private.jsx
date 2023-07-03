import { useEffect, useState } from 'react';
import useAxios from '../utils/useAxios';
import React from "react";

const Private = () => {
    const [res, setRes] = useState('');
    const [posRes, setPostRes] = useState('');
    const api = useAxios();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/test/');
                setRes(response.data.response);
            } catch (error) {
                setPostRes(error.response.data);
            }
        };
        fetchData();
    }, []);
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/test/', {
                text: e.target[0].value,
            });
            setPostRes(response.data.response);
        } catch (error) {
            setPostRes(error.response.data);
        }
    };
    return (
        <section>
            <div className='py-[80px] px-[40px] h-screen'>
                <div className="rounded-[20px] w-full h-full flex md:flex-row flex-col ">
                    <div className="bg-black min-w-[200px] min-h-[200px]">
                        <h1>NAV</h1>
                    </div>
                    <div className="bg-gray-600 flex-1 text-black flex items-center justify-center">
                        <h1>CONTENT</h1>
                    </div>
                </div>

            </div>
        </section>

    );
};

export default Private;