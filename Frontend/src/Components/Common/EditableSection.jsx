import React, { useState } from 'react';
import { useSelector } from 'react-redux';
// import axios from '../api/axios';
import useAuth from '../../hooks/useAuth';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

const EditableSection = ({ type, contentTitle, contentInfo, index, onUpdate, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(contentTitle);
    const {auth}=useAuth();
    const [info, setInfo] = useState(contentInfo);
    
    const axiosPrivate = useAxiosPrivate();
    const isAdmin = auth?.roles?.includes(5150);
    console.log(isAdmin);   

    const handleSave = async () => {
        try {
            const response = await axiosPrivate.put(`/content/update/${type}/item/${index}`, {
                contentTitle: title,
                contentInfo: info
            });
            if (response.status === 200) {
                onUpdate(response.data);
                setIsEditing(false);
            }
        } catch (error) {
            console.error('Error updating content:', error);
        }
    };

    if (!isAdmin) {
        return (
            <section className="mb-6">
                <h2 className="text-lg font-semibold text-[#8A5D3B]">{contentTitle}</h2>
                <p>{contentInfo}</p>
            </section>
        );
    }

    return (
        <section className="mb-6 relative">
            {isEditing ? (
                <div className="space-y-4">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                    <textarea
                        value={info}
                        onChange={(e) => setInfo(e.target.value)}
                        className="w-full p-2 border rounded min-h-[100px]"
                    />
                    <div className="flex gap-2">
                        <button
                            onClick={handleSave}
                            className="bg-[#5c4033] hover:bg-[#5c4033]/90 text-white px-4 py-2 rounded transition-colors duration-200"
                        >
                            Save
                        </button>
                        <button
                            onClick={() => setIsEditing(false)}
                            className="border border-[#5c4033] text-[#5c4033] hover:bg-[#5c4033]/10 px-4 py-2 rounded transition-colors duration-200"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <div>
                    <h2 className="text-lg font-semibold text-[#5c4033]">{contentTitle}</h2>
                    <p>{contentInfo}</p>
                    {isAdmin && (
                        <div className="absolute top-0 right-0 flex gap-2">
                            <button
                                onClick={() => setIsEditing(true)}
                                className="bg-[#5c4033] hover:bg-[#5c4033]/90 text-white px-2 py-1 rounded text-sm transition-colors duration-200"
                            >
                                Edit
                            </button>
                            <button
                                onClick={onDelete}
                                className="border border-[#5c4033] text-[#5c4033] hover:bg-[#5c4033]/10 px-2 py-1 rounded text-sm transition-colors duration-200"
                            >
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
};

export default EditableSection;
