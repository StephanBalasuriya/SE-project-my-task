


// const { announcements } = require('../models/announcementModel');
const { publishNotification } = require('../utils/rabbitMQ');
const supabase = require('../config/supabase');

exports.getAnnouncements = async (req, res, next) => {
  const { userId, course, batch } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    let query = supabase
      .from('announcement')
      .select(`
        title,
        body,
        created_at,
        created_by,
        All,
        Course,
        batch
      `);

    // Add filters
    if (course && batch) {
      query = query.or(`All.eq.true,Course.eq.${course},batch.eq.${batch}`);
    } else if (course) {
      query = query.or(`All.eq.true,Course.eq.${course}`);
    } else if (batch) {
      query = query.or(`All.eq.true,batch.eq.${batch}`);
    } else {
      query = query.eq('All', true);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching announcements:", error);
      return next(error);
    }

    res.json(data);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: err.message });
  }
};


exports.createAnnouncement = async (req, res, next) => {
  console.log('REQ BODY:', req.body);
  const { userId, title, summary, targetType, all, batch, course } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  const newAnnouncement = {
    title: title,
    body: summary,
    created_at: new Date().toISOString(),
    created_by: userId,
    All: all,
    batch: batch ? parseInt(batch) : null,
    Course: course ? parseInt(course) : null,
  };

  console.log('payload:', newAnnouncement);

  try {
    // Insert the announcement into the database
    const insertResponse = await supabase
      .from('Announcement')
      .insert([newAnnouncement]);

    // Log the response to check if data is returned
    console.log("Insert Response:", insertResponse);

    // Check for errors in the response
    const { data, error: insertAnnouncementError } = insertResponse;

    if (insertAnnouncementError) {
      console.error("Error inserting Announcement:", insertAnnouncementError);
      return res.status(400).json({ error: insertAnnouncementError.message });
    }

    // Ensure that 'data' is not null or empty
    if (!data || data.length === 0) {
      console.error("No data returned from insertion.");
      return res.status(500).json({ error: "Announcement insertion returned no data" });
    }

    // Proceed with sending notification and returning response
    await publishNotification(data[0]);
    res.status(201).json(data[0]);

  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: err.message });
  }
};

