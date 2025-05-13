import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-dark text-white p-4 text-center">
            <p>© {new Date().getFullYear()} My Website. All rights reserved.</p>
        </footer>
    );
};

export default Footer;