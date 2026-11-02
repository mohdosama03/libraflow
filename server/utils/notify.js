const Notification = require('../models/Notification');

// Creates a notification for a user. Fire-and-forget helper used by
// other controllers so they don't need to repeat the boilerplate.
const notify = async ({ user, title, message, type = 'general', link = '' }) => {
  return Notification.create({ user, title, message, type, link });
};

module.exports = notify;
