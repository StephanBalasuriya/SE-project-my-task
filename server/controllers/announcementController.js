// const { announcements } = require('../models/announcementModel');
// const { publishNotification } = require('../utils/rabbitMQ');

// exports.getAnnouncements = (req, res) => {
//   const { sort, course, date } = req.query;
//   let filtered = [...announcements];

//   if (course && course !== 'All') {
//     filtered = filtered.filter((a) => a.course.includes(course));
//   }

//   if (date) {
//     filtered = filtered.filter((a) => a.date.startsWith(date));
//   }

//   filtered.sort((a, b) => {
//     return sort === 'ASC'
//       ? new Date(a.date) - new Date(b.date)
//       : new Date(b.date) - new Date(a.date);
//   });

//   res.json(filtered);
// };

// exports.postAnnouncement = async (req, res) => {
//   const { title, course } = req.body;
//   const date = new Date().toISOString();
//   const announcement = { title, course, date };

//   announcements.push(announcement);
//   await publishNotification(announcement);
//   res.status(201).json({ success: true });
// };


// const supabase = require('../config/supabase');

// exports.createAnnouncement = async (req, res, next) => {
//   const { title, summary, targetTypeall,all, batch, course } = req.body;
//   const { userId } = req.query; // You were referencing `userId`, so make sure it's retrieved correctly

//   let dataToInsert = {
//     title,
//     body: summary,
//     created_by: userId,
//     created_at: new Date(),
//     all_participants: targetType === 'all',
//     batch_id: (targetType === "batch" || (targetType === "course" && batch)) ? batch : null,
//     course_id: targetType === 'course' ? course : null,
//   };

//   const { data, error } = await supabase.from('announcement').insert([dataToInsert]).select();

//   if (error) {
//     console.error("Supabase error:", error); // Log the error for better debugging
//     return next(error); // Return the error if it occurs
// };
// // / import supabase from '../config/supabaseClient.js';

// // export const createAnnouncement = async (req, res) => {
// //   const { title, summary, targetType, all, course, batch } = req.body;
// //   const userId = req.query.user; // Pass userId as query param

// //   try {
// //     const payload = {
// //       title,
// //       body: summary,
// //       created_by: userId,
// //       created_at: new Date().toISOString(),
// //       all_participants: all || false,
// //       course_id: targetType === "course" ? course : null,
// //       batch_id: (targetType === "batch" || (targetType === "course" && batch)) ? batch : null,
// //     };

// //     const { data, error } = await supabase
// //       .from('announcement')
// //       .insert([payload])
// //       .select();

// //     if (error) throw error;

// //     res.status(201).json(data[0]);
// //   } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // };


// exports.getAnnouncements = async (req, res, next) => {
//   const { sort = 'DESC', course, date } = req.query;
//   let query = supabase
//     .from('announcement')
//     .select(`
//       id,
//       title,
//       body,
//       created_at,
//       created_by,
//       course_id,
//       batch_id,
//       all_participants
//     `)
//     .order('created_at', { ascending: sort === 'ASC' });

//   if (course && course !== 'All') query = query.eq('course_id', course);
//   if (date) query = query.gte('created_at', `${date}T00:00:00`);

//   const { data, error } = await query;

//   if (error) return next(error);
//   res.json(data);
// };




const { announcements } = require('../models/announcementModel');
const { publishNotification } = require('../utils/rabbitMQ');
const supabase = require('../config/supabase');

exports.getAnnouncements = async (req, res, next) => {
  const { sort = 'DESC', course, date } = req.query;
  try {
    let query = supabase
      .from('announcement')
      .select(`
        id,
        title,
        body,
        created_at,
        created_by,
        course_id,
        batch_id,
        all_participants
      `)
      .order('created_at', { ascending: sort === 'ASC' });

    if (course && course !== 'All') query = query.eq('course_id', course);
    if (date) query = query.gte('created_at', `${date}T00:00:00`);

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching announcements:", error); // Log error for debugging
      return next(error); // Pass error to the error handling middleware
    }

    res.json(data);
  } catch (err) {
    console.error("Server error:", err); // Log the error for debugging
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


