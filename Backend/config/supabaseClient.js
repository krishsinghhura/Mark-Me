const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");

dotenv.config();
const supabaseUrl = "https://bemuwkmjydllrijcgtde.supabase.co"; // Replace with your Supabase URL
const supabaseKey = process.env.SUPABASEKEY;

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
