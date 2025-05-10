const sendEmail = require('../utils/sendEmail');
const supabase = require('../config/supabase');

exports.googleCallback = async (req, res) => {
  const email = req.user?.emails?.[0]?.value || req.body.email;
  // const email = req.user?.emails?.[0]?.value;
    const provider = 'google';
    const now = new Date().toISOString();

    console.log("Google Callback Email:", email);
  if (!email) {
    return res.status(400).send('Email not found in Google profile');
  }

  if (!(email.endsWith('@gmail.com') || email.endsWith('@cse.mrt.ac.lk'))) {
    return res.status(403).json({ message: 'Only Gmail or CSE mail allowed', email });

  }
  const namePart = email.split('@')[0];
  let provider_type;

  if(email.endsWith('@gmail.com')) provider_type = 'Gmail' 
  else if(email.endsWith('@cse.mrt.ac.lk')) provider_type = 'CSE'  
  else provider_type = 'other';

// Check if user exists in user table
const { data: existingUser, error: fetchError } = await supabase
.from('User')
.select('ID')
.eq('Email', email)
.single();



if (fetchError && fetchError.code !== 'PGRST116') {
throw fetchError;
}
let userId;
if(!existingUser) {
  // If user doesn't exist, create a new user
  const { data: newUser, error: insertError } = await supabase
    .from('User')
    .insert([
      {
        Email:email,
        First_Name:namePart,
          RoleId: 1,
          Created_Date: now,
      },
    ])
    .select('ID')
    .single();


    if (insertError) {
      console.error('Error inserting new user:', insertError);
      throw insertError;
    }
    
    userId = newUser.ID;

      // Insert into auth_user table

      const { error: insertAuthError } = await supabase
        .from('Auth.user')
        .insert([{
          id: userId,
          Display_name: namePart,
          Provider:provider,
          'Provider Type': provider_type,
          'Created at': now,
          'Last Sign in': now,
          role: 1
        }]);
        if (insertAuthError) {
          console.error('Error inserting into Auth.user:', insertAuthError);
          throw insertAuthError;
        }
  }else {
    userId = existingUser.ID;
    // If user exists, update last sign-in time
    // Update last sign-in in auth_user
    const { error: updateError } = await supabase
    .from('Auth.user')
    .update({ 'Last Sign in': now })
    .eq('id', userId);

  if (updateError) throw updateError;
  }


  try {
    await sendEmail(email, 'Google Login', `Google login detected at ${new Date().toLocaleString()}`);
  } catch (e) {
    console.error('Email send failed:', e);
  }

  res.redirect(`http://localhost:3000/success?userId=${userId}`);
};
