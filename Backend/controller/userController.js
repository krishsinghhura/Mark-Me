const express = require("express");
const supabase = require("../config/supabaseClient");

const signup = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data, error } = await supabase.auth.signUp(
      { email, password },
      { data: { email_confirm: true } }
    );
    if (error) throw error;

    res.status(201).json({ message: "User signed up successfully", data });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;

    res.status(200).json({
      message: "Login successful",
      token: data.session.access_token, // JWT Token
      user: data.user,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  signup,
  signin,
};
