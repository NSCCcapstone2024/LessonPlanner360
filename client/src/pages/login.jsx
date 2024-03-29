import { signIn, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState('');
    const [theme, setTheme] = useState('light'); // State for theme

    // Toggle theme function
    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        // Update theme class on the body
        document.body.classList.toggle('dark', newTheme === 'dark');
        document.body.classList.toggle('light', newTheme === 'light');
    };

    // if the session is in effect and the user is signed in, redirect to the courses page
    useEffect(() => {
        if (session) {
            router.push('/courses');
        }
    }, [session, router]);

    async function handleLogin(e) {
        // Prevent the default form submission
        e.preventDefault();

        // get the username and password from the form
        const username = e.target.username.value;
        const password = e.target.password.value;

        // Prevent NextAuth from redirecting automatically
        const result = await signIn('credentials', {
            redirect: false,
            username,
            password,
        });

        // if there's a problem with the sign-in , display the error message to the user
        if (result.error) {
            setErrorMessage("Username or Password incorrect. Please try again.");
        } else {
            // Redirect the user after successful login
            router.push('/courses');
        }
    }

    return (
        <>
            <style jsx global>{`
                body {
                    background-color: ${theme === 'dark' ? '#222222' : '#ffffff'};
                    color: ${theme === 'dark' ? '#ffffff' : '#000000'};
                }
            `}</style>
            <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'dark' : ''}`}>
                <form onSubmit={handleLogin} className={`p-8 shadow-md rounded-md w-96 ${theme === 'dark' ? 'dark:bg-gray-800' : 'bg-white'}`}>
                    <h2 className="text-2xl font-semibold mb-6">Login</h2>

                    <div className="mb-4">
                        <label htmlFor="username" className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            Username:
                        </label>
                        <span className="text-black">
                            <input
                                type="text"
                                id="username"
                                name="username"
                                className="mt-1 p-2 w-full border rounded-md"
                                required maxLength={45}
                            />
                        </span>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="password" className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            Password:
                        </label>
                        <span className="text-black">
                            <input
                                type="password"
                                id="password"
                                name="password"
                                className="mt-1 p-2 w-full border rounded-md"
                                required maxLength={200}
                            />
                        </span>
                    </div>

                    <button
                        type="submit"
                        className={`w-full bg-blue-400 text-white p-2 rounded-md hover:bg-blue-500 focus:outline-none focus:ring focus:border-blue-300 ${theme === 'dark' ? 'dark:bg-blue-700 dark:hover:bg-blue-800' : ''}`}
                    >
                        Login
                    </button>
                    {errorMessage && <div className={`text-red-500 my-4 ${theme === 'dark' ? 'dark:text-red-400' : ''}`}>{errorMessage}</div>}
                </form>
                {/* Theme toggle button */}
                <div className="absolute top-4 right-4">
                    <button onClick={toggleTheme} className="px-3 py-1 bg-gray-300 dark:bg-gray-700 rounded-md text-gray-800 dark:text-gray-200 mt-3" style={{ backgroundColor: theme === 'dark' ? '#374151' : '#d1d5db', color: theme === 'dark' ? '#ffffff' : '#000000' }}>
                        {theme === 'light' ? 'Dark' : 'Light'} Theme
                    </button>
                </div>
            </div>
        </>
    );

};
