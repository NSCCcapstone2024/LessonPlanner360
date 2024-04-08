import React, { useState, useEffect } from 'react';

const ThemeContext = React.createContext();

const ThemeLayout = ({ children }) => {
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        // Check if theme preference is stored in local storage, otherwise default to 'light'
        const storedTheme = localStorage.getItem('theme') || 'light';
        setTheme(storedTheme);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', newTheme);
        setTheme(newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {/* Theme toggle button */}
            <div className="absolute top-4 right-4">
                <button onClick={toggleTheme} className="px-3 py-1 bg-gray-300 dark:bg-gray-700 rounded-md text-gray-800 dark:text-gray-200 mt-3" style={{ backgroundColor: theme === 'dark' ? '#374151' : '#d1d5db', color: theme === 'dark' ? '#ffffff' : '#000000' }}>
                    {theme === 'light' ? 'Light' : 'Dark'} Theme
                </button>
            </div>
            {/* Render children */}
            {children}
        </ThemeContext.Provider>
    );
};

export { ThemeLayout, ThemeContext };
