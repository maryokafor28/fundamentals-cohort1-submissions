import Message from '../models/Message.js';
import User from '../models/User.js';
import Doctor from '../models/Doctor.js';

// Send message
export const sendMessage = async (req, res) => {
  try {
    const { recipientId, recipientModel, subject, message, type, relatedAppointment, relatedActivity } = req.body;
    
    const newMessage = new Message({
      sender: req.user.profile._id,
      senderModel: req.user.role === 'patient' ? 'User' : 'Doctor',
      recipient: recipientId,
      recipientModel,
      subject,
      message,
      type,
      relatedAppointment,
      relatedActivity
    });

    await newMessage.save();

    // Add message to recipient's messages array
    if (recipientModel === 'User') {
      await User.findByIdAndUpdate(recipientId, { $push: { messages: newMessage._id } });
    } else {
      await Doctor.findByIdAndUpdate(recipientId, { $push: { messages: newMessage._id } });
    }

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get messages for current user
export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      recipient: req.user.profile._id
    }).populate({
      path: 'sender',
      select: 'name email profilePicture'
    }).sort({ createdAt: -1 });

    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: error.message });
  }
};

// Mark message as read
export const markAsRead = async (req, res) => {
  try {
    await Message.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ message: 'Message marked as read' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Send appointment notification
export const sendAppointmentNotification = async (userId, doctorId, appointmentId, type) => {
  try {
    let subject, message;
    
    if (type === 'scheduled') {
      subject = 'Appointment Scheduled';
      message = 'Your appointment has been scheduled successfully.';
    } else if (type === 'confirmed') {
      subject = 'Appointment Confirmed';
      message = 'Your appointment has been confirmed by the doctor.';
    } else if (type === 'cancelled') {
      subject = 'Appointment Cancelled';
      message = 'Your appointment has been cancelled.';
    }

    const notification = new Message({
      sender: doctorId,
      senderModel: 'Doctor',
      recipient: userId,
      recipientModel: 'User',
      subject,
      message,
      type: 'appointment',
      relatedAppointment: appointmentId
    });

    await notification.save();
    await User.findByIdAndUpdate(userId, { $push: { messages: notification._id } });
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};