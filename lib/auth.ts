import { supabase } from './supabaseClient';

// Sign up new user
export const signUp = async (email: string, password: string) => {
  const { user, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error('Error during sign up:', error.message);
    return { error: error.message };
  }

  return { user };
};

// Log in user
export const logIn = async (email: string, password: string) => {
  const { user, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Error during login:', error.message);
    return { error: error.message };
  }

  return { user };
};

// Log out user
export const logOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Error during logout:', error.message);
  }
};

// Get currently logged-in user
export const getUser = () => {
  return supabase.auth.user();
};
