import React, { useEffect } from 'react'
import { useAuthStore } from '../store/auth';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';

export default function NavBar(props) {

    const navigate = useNavigate()

    const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
    const user = useAuthStore((state) => state.user)
    const state = useAuthStore((state) => state)


    return (
        <nav className="bg-[#111111] border-gray-200 px-2 sm:px-4 py-2.5 rounded dark:bg-navbar h-min w-full fixed z-10">
            <div className="container flex flex-wrap items-center justify-between mx-auto">
                <a href="{{ .Site.Params.homepage }}/" className="flex items-center">
                    <img className="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo" />
                    <span className="self-center text-xl font-semibold whitespace-nowrap text-navbar">RPGen.ai</span>
                </a>
                <button data-collapse-toggle="mobile-menu" type="button" className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="mobile-menu" aria-expanded="false">
                    <span className="sr-only">Open main menu</span>
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
                    <svg className="hidden w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                </button>
                <div className="hidden w-full md:block md:w-auto" id="mobile-menu">
                    <ul className="flex flex-col mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium">

                        <li>
                            <a onClick={() => navigate("/")} className="cursor-pointer block py-2 pl-3 pr-4 text-navbar rounded md:bg-transparent hover:text-navbar-hover md:p-0 dark:text-navbar" aria-current="page">Home</a>
                        </li>

                        {isLoggedIn() &&
                            <li>
                                <a onClick={() => navigate("/app")} className="cursor-pointer block py-2 pl-3 pr-4 text-navbar border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-navbar-hover md:p-0 dark:text-gray-400 md:dark:hover:text-navbar dark:hover:bg-gray-700 dark:hover:text-navbar md:dark:hover:bg-transparent dark:border-gray-700">App</a>
                            </li>
                        }
                        <li>
                            <a onClick={() => navigate("/mnist")} className="cursor-pointer block py-2 pl-3 pr-4 text-navbar border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-navbar-hover md:p-0 dark:text-gray-400 md:dark:hover:text-navbar dark:hover:bg-gray-700 dark:hover:text-navbar md:dark:hover:bg-transparent dark:border-gray-700">MNIST</a>
                        </li>

                        {isLoggedIn() &&
                            <li className="justify-center items-center text-red-600">
                                {user()?.email}
                            </li>
                        }

                        {isLoggedIn() &&
                            <li className="justify-center items-center">
                                <a onClick={() => navigate("/logout")} className="cursor-pointer block py-2 pl-3 pr-4 text-navbar hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-navbar-hover md:p-0">
                                    <LogoutIcon fontSize="small" titleAccess='Logout' alt="Logout" />
                                </a>
                            </li>
                        }

                        {!isLoggedIn() &&
                            <li>
                                <a onClick={() => navigate("/login")} className="cursor-pointer block py-2 pl-3 pr-4 text-navbar hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-navbar-hover md:p-0">Login</a>
                            </li>
                        }
                        {!isLoggedIn() &&
                            <li>
                                <a onClick={() => navigate("/register")} className="cursor-pointer block py-2 pl-3 pr-4 text-navbar hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-navbar-hover md:p-0">Register</a>
                            </li>
                        }

                    </ul>
                </div>
            </div>
        </nav>
    )
}