import React, { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import MainContent from './MainContent';
import RightNav from './RightNav';
import Sidebar from './Sidebar';

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="d-flex flex-column min-vh-100">
            <Header />

            <div className="flex-grow-1">
                <div className="container-fluid mh-100">
                    <div className="row row-layout">
                        <div className="col-12 col-md-3 col-sidebar">
                            <Sidebar />
                        </div>

                        <div className="col-12 col-md-6 col-main">
                            {children}
                        </div>

                        <div className="col-12 col-md-3 col-rightnav">
                            <RightNav />
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Layout;