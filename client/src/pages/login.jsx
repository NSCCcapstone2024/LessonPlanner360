import React from 'react';
import { useRouter } from 'next/router';
import crypto from 'crypto';
import { useState } from 'react';

export default function Login() {

    //------------For Testing purposes ONLY ----------------
    /* const password = 'secret'; // Example password
        const salt = 'KUgMBBIZbPDsMiGUOc1UvQ=='; // Example salt

        const hash = crypto.createHmac('sha256', salt)
         .update(password)
         .digest('hex');

     console.log('Generated Hash:', hash);*/
    //-------------------------------------------------------
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();
    //-------------------Handle Form Submission---------------------
    const handleLogin = async (e) => {
        // prevent auto page reload
        e.preventDefault();
        // clear any error messages
        setErrorMessage('');

        // get the username and password from the form and send it to the server
        let formData = new FormData(e.target);
        let username = formData.get('username');
        let password = formData.get('password');

        let response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });
        // if the credentials are correct, it'll redirect to the "courses" page.
        if (response.ok) {
            router.push('/courses');
            // if not, it'll show an error.
        } else {
            setErrorMessage('Failed to log in. Please check your credentials.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <form onSubmit={handleLogin} className="bg-white p-8 shadow-md rounded-md w-96">
                <h2 className="text-2xl font-semibold mb-6">Login</h2>

                <div className="mb-4">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-600">
                        Username:
                    </label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        className="mt-1 p-2 w-full border rounded-md"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-600">
                        Password:
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        className="mt-1 p-2 w-full border rounded-md"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
                >
                    Login
                </button>
                {errorMessage && <div className="text-red-500 my-4">{errorMessage}</div>}
            </form>
        </div>
    );
};

