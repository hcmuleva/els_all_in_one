import React from 'react';
import TopNav from './TopNav';
import BottomNav from './BottomNav';
import './Layout.css';

const Layout = ({ children }) => {
    return (
        <div className="app-layout">
            <TopNav />
            <main className="main-content">
                {children}
            </main>
            <BottomNav />
        </div>
    );
};

export default Layout;
