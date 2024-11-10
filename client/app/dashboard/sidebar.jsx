"use client";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Menu, PieChart, Users, Send, MessageSquareText, User, Bell } from 'lucide-react';

export default function Sidebar(user) {
    const [isOpen, setIsOpen] = useState(false);
    const sidebarRef = useRef(null);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);

    const menuButtonRef = useRef();

    // Toggle modals
    const toggleProfileModal = () => setIsProfileModalOpen(!isProfileModalOpen);
    const toggleNotificationsModal = () => setIsNotificationsModalOpen(!isNotificationsModalOpen);

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
            <div className="w-full p-4 bg-green-500 fixed border-b-2 z-20">
                <div className='flex justify-between items-center'>
                    <div className='flex'>
                        <button ref={menuButtonRef} onClick={toggleSidebar} className="text-white hover:text-cyan-600 focus:outline-none rounded-md border-2 hover:border-cyan-600">
                            <Menu size={32} />
                        </button>
                        <span className='text-white ml-4 text-2xl uppercase font-bold'>Greenit.</span>
                    </div>

                    <div className="flex items-center space-x-6">
                        {/* Notifications Icon */}
                        <button onClick={toggleNotificationsModal} className="text-white hover:text-cyan-600 relative">
                            <Bell size={24} />
                            {/* Notification badge */}
                            <span className="absolute top-0 right-0 block w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                        </button>

                        {/* Profile Icon */}
                        <button onClick={toggleProfileModal} className="text-white hover:text-cyan-600">
                            <User size={24} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Profile Modal */}
            {isProfileModalOpen && (
                <div className="absolute top-16 right-0 bg-white p-6 rounded-lg shadow-lg w-80 z-30">
                    <div className="flex items-center mb-4">
                        <img src={user.profilePicture} alt="Profile" className="w-16 h-16 rounded-full mr-4" />
                        <div>
                            <h3 className="text-xl font-bold">{user.name}</h3>
                            
                        </div>
                    </div>
                    <div className="text-gray-800">
                    <img
                            src="/ecocoin.png" // Replace with the actual path to your image
                            alt="Centered icon"
                            className="w-8 h-8 "
                        />{user.ecoCoins}
                    </div>
                    <button onClick={toggleProfileModal} className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-md">Close</button>
                </div>
            )}

            {/* Notifications Modal */}
            {isNotificationsModalOpen && (
                <div className="absolute top-16 right-16 bg-white p-6 rounded-lg shadow-lg w-80 z-30">
                    <h3 className="text-gray-800 text-xl font-bold mb-4">Notifications</h3>
                    {/* Example notifications */}
                    <ul className="text-gray-800 space-y-3">
                        <li>New message from Admin</li>
                        
                        <li>Your profile was updated</li>
                        <li>New eco coins awarded</li>
                    </ul>
                    <button onClick={toggleNotificationsModal} className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-md">Close</button>
                </div>
            )}

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
