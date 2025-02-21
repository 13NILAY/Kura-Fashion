const Content = require('../model/Content');

const getContent= async (req, res) => {
        try {
            const { type } = req.params;
            const content = await Content.findOne({ type });
            // console.log(content);
            if (!content) return res.status(404).json({ message: "Content not found" });
            res.json(content);
        } catch (error) {
            // console.log()
            res.status(500).json({ message: error.message });
        }
}

const updateContent= async (req, res) => {
        try {
            const { type } = req.params;
            const { title, content } = req.body;
            
            // Validate content array structure
            if (!Array.isArray(content)) {
                return res.status(400).json({ 
                    message: "Content must be an array of {contentTitle, contentInfo} objects" 
                });
            }

            // Validate each content item
            for (let item of content) {
                if (!item.contentTitle || !item.contentInfo) {
                    return res.status(400).json({ 
                        message: "Each content item must have contentTitle and contentInfo" 
                    });
                }
            }

            const updatedContent = await Content.findOneAndUpdate(
                { type },
                {
                    title,
                    content,
                    lastUpdated: Date.now(),
                    updatedBy: req.user?._id || null // Make updatedBy optional for now
                },
                { new: true, upsert: true }
            );

            res.json(updatedContent);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
}
    // Update single content item
const  updateContentItem= async (req, res) => {
        try {
            const { type, itemIndex } = req.params;
            const { contentTitle, contentInfo } = req.body;

            const content = await Content.findOne({ type });
            if (!content) return res.status(404).json({ message: "Content not found" });

            if (itemIndex >= content.content.length) {
                return res.status(400).json({ message: "Invalid content item index" });
            }

            content.content[itemIndex] = { contentTitle, contentInfo };
            content.lastUpdated = Date.now();
            // console.log(req.user);
            // content.updatedBy = req.user._id;

            await content.save();
            res.json(content);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
}


module.exports = { getContent, updateContent, updateContentItem };
