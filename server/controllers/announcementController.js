const { announcements } = require('../models/announcementModel');
const { publishNotification } = require('../utils/rabbitMQ');

exports.getAnnouncements = (req, res) => {
  const { sort, course, date } = req.query;
  let filtered = [...announcements];

  if (course && course !== 'All') {
    filtered = filtered.filter((a) => a.course.includes(course));
  }

  if (date) {
    filtered = filtered.filter((a) => a.date.startsWith(date));
  }

  filtered.sort((a, b) => {
    return sort === 'ASC'
      ? new Date(a.date) - new Date(b.date)
      : new Date(b.date) - new Date(a.date);
  });

  res.json(filtered);
};

exports.postAnnouncement = async (req, res) => {
  const { title, course } = req.body;
  const date = new Date().toISOString();
  const announcement = { title, course, date };

  announcements.push(announcement);
  await publishNotification(announcement);
  res.status(201).json({ success: true });
};