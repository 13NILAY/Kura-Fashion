import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import EditableSection from '../../Common/EditableSection';
import useAuth from '../../../hooks/useAuth';

const ShippingPolicy = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const axiosPrivate = useAxiosPrivate();
  const {auth}=useAuth();
  const type = 'shipping';
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axiosPrivate.get('/content/get/shipping');
        setContent(response.data);
      } catch (error) {
        console.error('Error fetching shipping policy content:', error);
      }finally{
        setLoading(false);
      }
    };

    fetchContent();
  }, [axiosPrivate]);

  
    const handleContentUpdate = (newContent) => {
      setContent(newContent);
  };
  
  const handleAddSection = async () => {
      try {
          const newSection = {
              contentTitle: "New Section",
              contentInfo: "Add your content here"
          };
          
          const updatedContent = {
              ...content,
              content: [...content.content, newSection]
          };
  
          const response = await axiosPrivate.put(`/content/update/${type}`, updatedContent);
          if (response.status === 200) {
              setContent(response.data);
          }
      } catch (error) {
          console.error('Error adding section:', error);
      }
  };
  
  const handleDeleteSection = async (index) => {
      try {
          const updatedContent = {
              ...content,
              content: content.content.filter((_, i) => i !== index)
          };
  
          const response = await axiosPrivate.put(`/content/update/${type}`, updatedContent);
          if (response.status === 200) {
              setContent(response.data);
          }
      } catch (error) {
          console.error('Error deleting section:', error);
      }
  };
if (loading) return <div>Loading...</div>;

return (
    <div className="mt-20 px-8 max-md:px-4 py-16 bg-[#F4D3C4] text-typography mx-auto max-w-5xl rounded-lg shadow-lg">
        <div className="max-w-4xl mx-auto">
            <h1 className="font-headings text-3xl font-bold text-[#8A5D3B] mb-6">
                {content?.title || 'Refund Policy'}
            </h1>
            {content?.content.map((section, index) => (
                <EditableSection
                    key={index}
                    type="shipping"
                    index={index}
                    contentTitle={section.contentTitle}
                    contentInfo={section.contentInfo}
                    onUpdate={handleContentUpdate}
                    onDelete={() => handleDeleteSection(index)}
                />
            ))}
            {auth?.roles?.includes(5150) && (
                <button
                    onClick={handleAddSection}
                    className="mt-4 bg-[#5c4033] hover:bg-[#5c4033]/90 text-white px-4 py-2 rounded transition-colors duration-200 flex items-center gap-2"
                >
                    <span>Add New Section</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                </button>
            )}
        </div>
    </div>
);
};


export default ShippingPolicy;
