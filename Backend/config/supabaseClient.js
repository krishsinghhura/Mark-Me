const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://bemuwkmjydllrijcgtde.supabase.co"; // Replace with your Supabase URL
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJlbXV3a21qeWRsbHJpamNndGRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc0NTQ4MjEsImV4cCI6MjA1MzAzMDgyMX0.0VDj1RJlYkfw8D33ci61dCqp5lV78xuYNYGkp72QTlo"; // Replace with your Supabase Key

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
