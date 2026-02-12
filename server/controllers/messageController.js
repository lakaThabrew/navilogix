import Message from '../models/Message.js';

export const createMessage = async (req, res) => {
    try {
        const { content, receiverRole, parcelData } = req.body;
        const message = await Message.create({
            senderId: req.user._id,
            content,
            receiverRole,
            parcelData
        });
        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getMessages = async (req, res) => {
    try {
        // Get messages for the user's role
        const { role } = req.user;
        let messages;

        if (role === 'main_admin') {
            // Main admin sees messages addressed to main_admin
            messages = await Message.find({ receiverRole: 'main_admin' })
                .populate('senderId', 'name email branchId')
                .sort({ createdAt: -1 });
        } else {
            // Others see messages addressed to their role (optional, for future)
            messages = await Message.find({ receiverRole: role })
                .populate('senderId', 'name email')
                .sort({ createdAt: -1 });
        }
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const message = await Message.findById(id);
        if (message) {
            message.isRead = true;
            await message.save();
            res.json(message);
        } else {
            res.status(404).json({ message: 'Message not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
