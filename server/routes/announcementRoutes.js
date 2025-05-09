const express = require('express');
const router = express.Router();
const {
  createAnnouncement,
  getAnnouncements,
  postAnnouncement,
} = require('../controllers/announcementController');

router.get('/', getAnnouncements);
router.post('/addAnnouncement', createAnnouncement);

module.exports = router;

