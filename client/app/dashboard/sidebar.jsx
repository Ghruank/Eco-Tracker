"use client";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Menu, PieChart, Users, Send, MessageSquareText } from 'lucide-react';

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const sidebarRef = useRef(null);
    const menuButtonRef = useRef(null);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    // Close sidebar when clicking outside, excluding the menu button
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                sidebarRef.current && 
                !sidebarRef.current.contains(event.target) &&
                menuButtonRef.current &&
                !menuButtonRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div>
            <div className="w-full p-4 bg-gray-800 fixed border-b-2 z-20">
                <div className='flex rounded-md'>
                    <button ref={menuButtonRef} onClick={toggleSidebar} className="text-white hover:text-cyan-600 focus:outline-none rounded-md border-2 hover:border-cyan-600">
                        <Menu size={32} />
                    </button>
                    <span className='text-white bold ml-4 text-2xl uppercase font-bold'>Ecoquence</span>
                </div>
            </div>
            <aside ref={sidebarRef} className={`${isOpen ? 'w-64' : 'w-0'} mt-6 h-screen bg-gray-800 text-white fixed top-0 left-0 transition-width duration-300 z-10`}>
                {/* Navigation Links */}
                {isOpen && (
                    <nav className="mt-16">
                        <Link href="/dashboard">
                            <button className="flex items-center gap-4 py-2.5 px-4 text-white hover:bg-gray-700 w-full">
                                <PieChart size={24} />
                                <span>Dashboard</span>
                            </button>
                        </Link>
                        <Link href="/Family">
                            <button className="flex items-center gap-4 py-2.5 px-4 text-white hover:bg-gray-700 w-full">
                                <Users size={24} />
                                <span>Family</span>
                            </button>
                        </Link>
                        <Link href="/performance-history">
                            <button className="flex items-center gap-4 py-2.5 px-4 text-white hover:bg-gray-700 w-full">
                                <Send size={24} />
                                <span>Posts</span>
                            </button>
                        </Link>
                        <Link href="/insights">
                            <button className="flex items-center gap-4 py-2.5 px-4 text-white hover:bg-gray-700 w-full">
                                <MessageSquareText size={24} />
                                <span>Insights</span>
                            </button>
                        </Link>
                    </nav>
                )}
            </aside>
        </div>
    );
}
