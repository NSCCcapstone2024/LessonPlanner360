import { signIn, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function ResetPass() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <form onSubmit={handleLogin} className="bg-white p-8 shadow-md rounded-md w-96">
                <h2 className="text-2xl font-semibold mb-6">Reset Password</h2>

                <div className="mb-4">
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-600">
                        New Password:
                    </label>
                    <input
                        type="text"
                        id="newPassword"
                        name="newPassword"
                        className="mt-1 p-2 w-full border rounded-md"
                        required maxLength={200}
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="confirmPass" className="block text-sm font-medium text-gray-600">
                        Confirm new password:
                    </label>
                    <input
                        type="text"
                        id="confirmPass"
                        name="confirmPass"
                        className="mt-1 p-2 w-full border rounded-md"
                        required maxLength={200}
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
                >
                    Change Password
                </button>
                {errorMessage && <div className="text-red-500 my-4">{errorMessage}</div>}
            </form>
        </div>
    );
}