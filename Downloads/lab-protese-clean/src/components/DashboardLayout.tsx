"use client";

import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function DashboardLayout({ children, title, activeItem }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar activeItem={activeItem} />
      
      <div className="ml-64">
        <Header />
        
        <main className="p-6 pt-24">
          {children}
        </main>
      </div>
    </div>
  );
}
