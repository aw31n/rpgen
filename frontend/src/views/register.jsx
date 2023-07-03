import React, { createRef, useEffect, useRef, useState } from 'react';
import { register } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { Snackbar } from '@mui/material';

function Register() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState({});
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [open, setOpen] = useState(false);
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
    const state = useAuthStore((state) => state);
    const navigate = useNavigate();
    const snackBar = createRef();

    const handleClick = () => {
        setOpen(true);
      };
    
      const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen(false);
      };


    useEffect(() => {
        if (isLoggedIn()) {
            navigate('/');
        }
    }, [state, error]);

    const resetForm = () => {
        setEmail('');
        setPassword('');
        setPassword2('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { error } = await register(email, password, password2);
        if (error) {
            setError(error)
            setOpen(true)

           console.log(snackBar)

        } else {
            navigate('/');
            resetForm();
        }
    };


    return (
        <div>
        <Snackbar
            id="snackbar"
            open={open}
            autoHideDuration={3000}
            onClose={handleClose}
            message="ERROR"
        />
            <div className="flex flex-col items-center justify-center h-screen">
                <section className="bg-gray-50 dark:bg-gray-900">
                    <div className="flex flex-col items-center justify-center lg:py-0">
                        <div className=" bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700 flex flex-col items-center justify-center ">
                            <div className="mt-10">
                                <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                                    <img className="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo" />
                                        RPGen.ai
                                        </a>
                            </div>
                            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                   Register your account
                                </h1>
                                <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                                    <div>
                                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                                        <input type="email" id="username" name="username" value={email} onChange={(e) => setEmail(e.target.value)} className={ (error.email ? "border-red-600" : "border-gray-300") + " bg-gray-50 border text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"} placeholder="" required="" />
                                        { error.email && <p className="text-red-600">{error.email[0]}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                        <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)}  placeholder="" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
                                        { error.password && <p className="text-red-600">{error.password[0]}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor="password2" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm Password</label>
                                        <input type="password" id="confirm-password" name="confirm-password" value={password2} onChange={(e) => setPassword2(e.target.value)}  placeholder="" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
                                        <p className="text-[#aa0000]">
                                            {password2?.length && password2 !== password ? 'Passwords do not match' : ''}
                                        </p>
                                        { error.password2 && <p className="text-red-600">{error.password2[0]}</p>}
                                    </div>
                                    
                                    <button type="submit" className="w-full text-black hover:text-black bg-slate-200 hover:bg-slate-300 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Register</button>
                                    <p className="text-sm font-light text-gray-500 dark:text-gray-400">&nbsp;
                                        Already have an account? <a href="/login" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign In</a>
                                    </p>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>

    );
};
/*
    return (
        <section>
            <form onSubmit={handleSubmit}>
                <h1>Register</h1>
                <hr />
                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        type="text"
                        id="email"
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="confirm-password">Confirm Password</label>
                    <input
                        type="password"
                        id="confirm-password"
                        onChange={(e) => setPassword2(e.target.value)}
                        placeholder="Confirm Password"
                        required
                    />
                    <p>
                        {password2 !== password ? 'Passwords do not match' : ''}
                    </p>
                </div>
                <button type="submit">Register</button>
            </form>
        </section>
    );
}
*/
export default Register;