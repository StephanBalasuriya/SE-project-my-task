const express = require('express');
const router = express.Router();
const {
  getAnnouncements,
  postAnnouncement,
} = require('../controllers/announcementController');

router.get('/', getAnnouncements);
router.post('/', postAnnouncement);

module.exports = router;

