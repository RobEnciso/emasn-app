import { supabase } from './supabaseClient';

/**
 * Fetches all users.
 * NOTE: In a production environment, you should restrict this
 * to only return users with a 'client' role. This requires
 * a more complex setup, possibly with a dedicated function or view in Supabase.
 * For this project, we fetch all users for simplicity.
 */
export const getUsers = async () => {
  // Supabase doesn't allow querying auth.users directly from the client by default.
  // A common practice is to create a 'profiles' table that is publicly readable
  // and syncs with auth.users.
  // For this exercise, we will assume a 'profiles' table exists.
  // Let's create a placeholder structure for it.
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email');

  if (error) {
    console.error('Error fetching users:', error);
    // If the profiles table doesn't exist, return a mock user for demonstration
    if (error.code === '42P01') {
      console.warn("Falling back to mock user data because 'profiles' table not found.");
      return [{ id: 'mock-user-id', email: 'client@example.com' }];
    }
    throw error;
  }

  return data;
};
