import axios from './axios';

const contentService = {
    getContent: async (type) => {
        const response = await axios.get(`/content/get/${type}`);
        return response.data;
    },

    updateContentItem: async (type, index, data) => {
        const response = await axios.put(`/content/update/${type}/item/${index}`, data);
        return response.data;
    },

    updateEntireContent: async (type, data) => {
        const response = await axios.put(`/content/update/${type}`, data);
        return response.data;
    }
};

export default contentService;
