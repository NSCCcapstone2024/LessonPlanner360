import { signIn, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState('');

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
                        required maxLength={45}
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
                        required maxLength={200}
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

