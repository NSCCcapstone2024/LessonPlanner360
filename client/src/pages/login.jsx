// import React from 'react';

// export default function Login() {
//     return (
//         <div className="min-h-screen flex items-center justify-center">
//             <form className="bg-white p-8 shadow-md rounded-md w-96">
//                 <h2 className="text-2xl font-semibold mb-6">Login</h2>

//                 <div className="mb-4">
//                     <label htmlFor="username" className="block text-sm font-medium text-gray-600">
//                         Username:
//                     </label>
//                     <input
//                         type="text"
//                         id="username"
//                         name="username"
//                         className="mt-1 p-2 w-full border rounded-md"
//                         required
//                     />
//                 </div>

//                 <div className="mb-4">
//                     <label htmlFor="password" className="block text-sm font-medium text-gray-600">
//                         Password:
//                     </label>
//                     <input
//                         type="password"
//                         id="password"
//                         name="password"
//                         className="mt-1 p-2 w-full border rounded-md"
//                         required
//                     />
//                 </div>

//                 <button
//                     type="submit"
//                     className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
//                 >
//                     Login
//                 </button>
//             </form>
//         </div>
//     );
// }

import React from 'react';
import { useRouter } from 'next/router';

export default function Login() {
    const router = useRouter();

    const handleLogin = (e) => {
        e.preventDefault();

        // Simulating a successful login
        const isLoggedIn = true;

        if (isLoggedIn) {
            // Navigate to the Home page (replace '/' with your desired route)
            router.push('./index');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <form className="bg-white p-8 shadow-md rounded-md w-96">
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
                    onClick={handleLogin}
                    className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
                >
                    Login
                </button>
            </form>
        </div>
    );
};
