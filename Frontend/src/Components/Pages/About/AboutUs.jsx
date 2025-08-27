import React, { useState, useEffect } from 'react';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import EditableSection from '../../Common/EditableSection';
import useAuth from '../../../hooks/useAuth';
import InfoIcon from '@mui/icons-material/Info';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const AboutUs = () => {
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAddingSection, setIsAddingSection] = useState(false);
    const [notification, setNotification] = useState({ show: false, message: "", type: "" });
    const axiosPrivate = useAxiosPrivate();
    const { auth } = useAuth();

    // Show notification helper
    const showNotification = (message, type = "success") => {
        setNotification({ show: true, message, type });
        setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000);
    };

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const response = await axiosPrivate.get('/content/get/about');
                setContent(response.data);
            } catch (error) {
                console.error('Error fetching content:', error);
                showNotification("Failed to load content", "error");
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
    }, []);

    const handleContentUpdate = (newContent) => {
        setContent(newContent);
        showNotification("Section updated successfully", "success");
    };

    const handleAddSection = async () => {
        try {
            setIsAddingSection(true);
            const newSection = {
                contentTitle: "New Section",
                contentInfo: "Add your content here"
            };
            
            const updatedContent = {
                ...content,
                content: [...content.content, newSection]
            };

            const response = await axiosPrivate.put(`/content/update/about`, updatedContent);
            if (response.status === 200) {
                setContent(response.data);
                showNotification("New section added successfully", "success");
            }
        } catch (error) {
            console.error('Error adding section:', error);
            showNotification("Failed to add section", "error");
        } finally {
            setIsAddingSection(false);
        }
    };

    const handleDeleteSection = async (index) => {
        try {
            const updatedContent = {
                ...content,
                content: content.content.filter((_, i) => i !== index)
            };

            const response = await axiosPrivate.put(`/content/update/about`, updatedContent);
            if (response.status === 200) {
                setContent(response.data);
                showNotification("Section deleted successfully", "success");
            }
        } catch (error) {
            console.error('Error deleting section:', error);
            showNotification("Failed to delete section", "error");
        }
    };

    // Premium loading component
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#F8F5F2] to-[#EADBC8] pt-28 px-4 sm:px-8 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative mb-8">
                        <div className="w-20 h-20 border-4 border-[#D4A373]/30 border-t-[#3A2E2E] rounded-full animate-spin mx-auto"></div>
                        <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-b-[#D4A373] rounded-full animate-spin mx-auto" 
                            style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
                    </div>
                    <div className="space-y-4">
                        <div className="h-8 bg-[#3A2E2E]/20 rounded-lg w-80 max-w-full mx-auto animate-pulse"></div>
                        <div className="h-6 bg-[#3A2E2E]/15 rounded-lg w-64 max-w-full mx-auto animate-pulse"></div>
                        <div className="h-6 bg-[#3A2E2E]/10 rounded-lg w-48 max-w-full mx-auto animate-pulse"></div>
                    </div>
                    <p className="text-[#3A2E2E] font-medium mt-6 text-lg">
                        Loading our story...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F8F5F2] to-[#EADBC8] pt-28 px-4 sm:px-8 font-texts relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-20 left-10 w-40 h-40 bg-[#D4A373]/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-32 h-32 bg-[#3A2E2E]/5 rounded-full blur-3xl animate-pulse" 
                style={{animationDelay: '2s'}}></div>

            {/* Notification Toast */}
            {notification.show && (
                <div className={`fixed top-24 right-6 z-50 flex items-center p-4 rounded-xl shadow-2xl backdrop-blur-sm border transition-all duration-500 transform ${
                    notification.show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
                } ${
                    notification.type === 'success' 
                        ? 'bg-green-50/90 border-green-200 text-green-800' 
                        : 'bg-red-50/90 border-red-200 text-red-800'
                }`}>
                    {notification.type === 'success' ? (
                        <CheckCircleIcon className="mr-3 text-green-600" />
                    ) : (
                        <ErrorOutlineIcon className="mr-3 text-red-600" />
                    )}
                    <span className="font-medium">{notification.message}</span>
                </div>
            )}

            <div className="container mx-auto max-w-5xl">
                {/* Page Header */}
                <div className="text-center mb-16">
                    <div className="flex items-center justify-center mb-6">
                        <div className="w-16 h-0.5 bg-[#D4A373]"></div>
                        <AutoStoriesIcon className="mx-4 text-4xl text-[#D4A373]" />
                        <div className="w-16 h-0.5 bg-[#D4A373]"></div>
                    </div>
                    
                    <h1 className="font-headings text-[#3A2E2E] text-4xl sm:text-5xl lg:text-6xl font-light mb-6 leading-tight">
                        Our
                        <span className="block text-[#D4A373] font-normal">Story</span>
                    </h1>
                    
                    <p className="text-lg text-[#3A2E2E]/70 max-w-2xl mx-auto leading-relaxed">
                        Discover the passion, craftsmanship, and vision behind KURA Fashion's 
                        premium collection
                    </p>
                </div>

                {/* Main Content Container */}
                <div className="bg-white/60 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
                    
                    {/* Page Title Section */}
                    <div className="p-8 sm:p-10 border-b border-[#D4A373]/20 bg-gradient-to-r from-white/30 to-[#D4A373]/5">
                        <div className="flex items-center">
                            <InfoIcon className="text-[#D4A373] mr-4 text-2xl" />
                            <h2 className="font-headings text-[#3A2E2E] text-2xl sm:text-3xl font-semibold">
                                {content?.title || 'About KURA Fashion'}
                            </h2>
                        </div>
                    </div>

                    {/* Content Sections */}
                    <div className="p-8 sm:p-10 space-y-8">
                        {content?.content?.map((section, index) => (
                            <div 
                                key={index}
                                className="group bg-white/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 
                                    border border-[#D4A373]/20 hover:border-[#D4A373]/40
                                    transition-all duration-500 hover:shadow-lg transform hover:-translate-y-1"
                                style={{
                                    animationDelay: `${index * 150}ms`,
                                    animation: 'fadeInUp 0.8s ease-out forwards'
                                }}
                            >
                                <EditableSection
                                    type="about"
                                    index={index}
                                    contentTitle={section.contentTitle}
                                    contentInfo={section.contentInfo}
                                    onUpdate={handleContentUpdate}
                                    onDelete={() => handleDeleteSection(index)}
                                />
                            </div>
                        ))}

                        {/* Add New Section Button - Admin Only */}
                        {auth?.roles?.includes(5150) && (
                            <div className="text-center pt-8">
                                <div className="relative inline-block">
                                    <div className="absolute -inset-4 bg-gradient-to-r from-[#D4A373]/20 to-[#3A2E2E]/10 
                                        rounded-2xl blur-xl transition-all duration-500"></div>
                                    
                                    <button
                                        onClick={handleAddSection}
                                        disabled={isAddingSection}
                                        className="group relative px-8 py-4 bg-[#3A2E2E] text-[#EADBC8] 
                                            font-headings font-semibold rounded-xl 
                                            transition-all duration-300 hover:bg-[#2C2C2C] hover:shadow-xl 
                                            hover:shadow-[#3A2E2E]/30 transform hover:scale-105
                                            disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                                            flex items-center space-x-3"
                                    >
                                        {isAddingSection ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-[#EADBC8]/30 border-t-[#EADBC8] rounded-full animate-spin"></div>
                                                <span>Adding Section...</span>
                                            </>
                                        ) : (
                                            <>
                                                <AddCircleOutlineIcon className="transition-transform duration-300 group-hover:rotate-90" />
                                                <span>Add New Section</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                                
                                {/* Admin Helper Text */}
                                <p className="text-[#3A2E2E]/60 text-sm mt-4 italic">
                                    Admin Mode: Click to add new content sections
                                </p>
                            </div>
                        )}

                        {/* Empty State */}
                        {(!content?.content || content.content.length === 0) && (
                            <div className="text-center py-16">
                                <div className="w-24 h-24 bg-[#D4A373]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <AutoStoriesIcon className="text-4xl text-[#D4A373]/50" />
                                </div>
                                <h3 className="text-xl font-headings text-[#3A2E2E] mb-2">No Content Available</h3>
                                <p className="text-[#3A2E2E]/60">
                                    {auth?.roles?.includes(5150) 
                                        ? "Start building your story by adding the first section" 
                                        : "Content is being updated. Please check back soon."
                                    }
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Brand Story Quote Section */}
                <div className="mt-12 text-center">
                    <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-8 sm:p-10 
                        border border-white/30 shadow-lg">
                        <blockquote className="text-xl sm:text-2xl font-light text-[#3A2E2E] 
                            italic leading-relaxed max-w-3xl mx-auto">
                            "Fashion is not just about clothing—it's about expressing your 
                            <span className="text-[#D4A373] font-normal"> unique story </span>
                            through timeless elegance and premium craftsmanship."
                        </blockquote>
                        <cite className="block mt-6 text-[#3A2E2E]/70 font-medium">
                            — KURA Fashion Philosophy
                        </cite>
                    </div>
                </div>

                {/* Values Grid */}
                <div className="mt-12 grid md:grid-cols-3 gap-6">
                    {[
                        {
                            title: "Premium Quality",
                            description: "Every piece is carefully selected and crafted to meet the highest standards of fashion excellence.",
                            icon: "✨"
                        },
                        {
                            title: "Timeless Elegance",
                            description: "Our designs transcend seasonal trends, offering enduring style that remains relevant year after year.",
                            icon: "🌟"
                        },
                        {
                            title: "Customer First",
                            description: "Your satisfaction and style journey are at the heart of everything we create and curate.",
                            icon: "💎"
                        }
                    ].map((value, index) => (
                        <div 
                            key={index}
                            className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-[#D4A373]/20 
                                hover:border-[#D4A373]/40 transition-all duration-300 hover:shadow-lg 
                                transform hover:-translate-y-1 text-center"
                            style={{
                                animationDelay: `${(index + 1) * 200}ms`,
                                animation: 'fadeInUp 0.8s ease-out forwards'
                            }}
                        >
                            <div className="text-4xl mb-4">{value.icon}</div>
                            <h3 className="font-headings text-[#3A2E2E] text-xl font-semibold mb-3">
                                {value.title}
                            </h3>
                            <p className="text-[#3A2E2E]/70 leading-relaxed">
                                {value.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Call to Action */}
                <div className="mt-16 text-center">
                    <div className="bg-gradient-to-r from-[#3A2E2E] to-[#2C2C2C] rounded-2xl p-8 sm:p-10 text-white">
                        <h3 className="font-headings text-2xl sm:text-3xl font-light mb-4">
                            Ready to Experience
                            <span className="block text-[#D4A373] font-normal">KURA Fashion?</span>
                        </h3>
                        <p className="text-[#EADBC8]/80 mb-8 max-w-2xl mx-auto leading-relaxed">
                            Explore our curated collection of premium fashion pieces designed to elevate your style
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a 
                                href="/shop"
                                className="group inline-flex items-center px-8 py-4 bg-[#D4A373] text-[#3A2E2E] 
                                    font-semibold rounded-xl transition-all duration-300 
                                    hover:bg-[#EADBC8] hover:shadow-xl transform hover:scale-105"
                            >
                                <span className="mr-3">Shop Collection</span>
                                <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" 
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                        d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </a>
                            {/* <a 
                                href="/contact"
                                className="inline-flex items-center px-8 py-4 border-2 border-[#D4A373] text-[#D4A373] 
                                    font-semibold rounded-xl transition-all duration-300 
                                    hover:bg-[#D4A373] hover:text-[#3A2E2E] transform hover:scale-105"
                            >
                                Get in Touch
                            </a> */}
                        </div>
                    </div>
                </div>
            </div>

            {/* CSS Animation for fade-in effect */}
            <style jsx>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
};

export default AboutUs;