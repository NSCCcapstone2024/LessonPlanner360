import { signIn, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
    const { data: session } = useSession();
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState('');
    const [showResetPopup, setShowResetPopup] = useState(false);
    const [emailForReset, setEmailForReset] = useState('');

    useEffect(() => {
        if (session) {
            router.push('/courses');
        }
    }, [session, router]);

    async function handleLogin(e) {
        e.preventDefault();
        const username = e.target.username.value;
        const password = e.target.password.value;
        const email = e.target.email.value;

        const result = await signIn('credentials', {
            redirect: false,
            email,
            username,
            password,
        });

        if (result.error) {
            setErrorMessage("Username, Email or Password incorrect. Please try again.");
        } else {
            router.push('/courses');
        }
    }

    // ----------------------------Password Reset---------------------------
    // open popup to reset password
    const handleForgotPasswordClick = () => {
        setShowResetPopup(true);
    };

    // event handler to reset password
    const handleResetPassword = async (e) => {
        // prevent default submission
        e.preventDefault();
        // send a request to the server to reset the password
        let response = await fetch('/api/auth/forgotPassword', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: emailForReset }),
        });
        if (response.ok) {
            setErrorMessage("We've sent you an email to reset your password.");
        } else {
            setErrorMessage("Failed to reset password. Please try again later.");
        }
        setShowResetPopup(false);
    };

    // clear fields and close popup if cancel button is pressed
    const handleClosePopup = () => {
        setEmailForReset('');
        setShowResetPopup(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <form onSubmit={handleLogin} className="bg-white p-8 shadow-md rounded-md w-96">
                <h2 className="text-2xl font-semibold mb-6">Login</h2>

                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-600">
                        Email:
                    </label>
                    <input
                        type="text"
                        id="email"
                        name="email"
                        className="mt-1 p-2 w-full border rounded-md"
                        required maxLength={100}
                    />
                </div>
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

                <button type="button" onClick={handleForgotPasswordClick} className="w-full bg-yellow-500 text-white mt-2 p-2 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring focus:border-black">
                    Forgot Password?
                </button>
                {errorMessage && <div className="text-red-500 my-4">{errorMessage}</div>}
            </form>

            {showResetPopup && (
                <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-4 rounded-md">
                        <form onSubmit={handleResetPassword}>
                            <label htmlFor="emailForReset" className="block text-sm font-medium text-gray-600">
                                Enter your email to reset:
                            </label>
                            <input
                                type="email"
                                id="emailForReset"
                                name="emailForReset"
                                value={emailForReset}
                                onChange={(e) => setEmailForReset(e.target.value)}
                                className="mt-1 p-2 w-full border rounded-md"
                                required
                            />
                            <div className="mt-4 flex justify-between">
                                <button type="submit" className="bg-blue-500 px-4 text-white rounded-md hover:bg-blue-600 focus:outline-none">
                                    Ok
                                </button>
                                <button type="button" onClick={handleClosePopup} className="bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600 focus:outline-none">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
