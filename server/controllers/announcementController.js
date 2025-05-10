


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
        id,
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
  const { title, summary, targetType, all, batch, course } = req.body;
  const { userId } = req.query; // Ensure 'userId' is passed in the query string

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const dataToInsert = {
      title,
      body: summary,
      created_by: userId,
      created_at: new Date(),
      all_participants: targetType === 'all' || all, // Check if it's all or specified in the body
      batch_id: (targetType === "batch" || (targetType === "course" && batch)) ? batch : null,
      course_id: targetType === 'course' ? course : null,
    };

    const { data, error } = await supabase.from('announcement').insert([dataToInsert]).select();

    if (error) {
      console.error("Error inserting announcement:", error); // Log error for debugging
      return next(error); // Pass error to the error handling middleware
    }

    // If notification publishing is required
    await publishNotification(data[0]);

    res.status(201).json(data[0]); // Send back the inserted data
  } catch (err) {
    console.error("Server error:", err); // Log the error for debugging
    res.status(500).json({ error: err.message });
  }
};


