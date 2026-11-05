/* Connect the site to your Supabase project (see backend/SETUP.md).
   Leave supabaseUrl and supabaseKey empty to run in DEMO MODE: sign-in works only inside this browser
   with fake sample data, so you can try every screen before the real database is connected.

   The anon key is MEANT to be public (it is safe in the browser). NEVER put the "service_role" key here. */
window.PP_CONFIG = {
  supabaseUrl: 'https://ygjcrmgwasqvwtxnrtyi.supabase.co',
  supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlnamNybWd3YXNxdnd0eG5ydHlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM4NTMzNDIsImV4cCI6MjEwOTQyOTM0Mn0.CbElAOVjzTJkPiNFnbpjirhaOsDgwl0ZfkP3pt1hUh0',
  school: 'Beacon Light Academy',

  // true  = sign-up asks for a 6-digit code e-mailed through Brevo (see backend/SETUP.md, step 3), and students can
  //          reset their own password by e-mail. Needs Supabase "Confirm email" ON + Brevo SMTP + the code e-mail templates.
  // false = no e-mail at all: people are signed in straight away and the super admin sets forgotten passwords.
  //         Needs Supabase "Confirm email" OFF.
  // The setting here MUST match the "Confirm email" switch in Supabase
  emailCodes: true,
};
