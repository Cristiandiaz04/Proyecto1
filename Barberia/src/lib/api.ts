import { supabase } from "./supabase";

export async function registerUser({ name, email, phone, password }) {
  // 1. Crear usuario en auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    return { error: authError.message };
  }

  const auth_id = authData.user.id;

  // 2. Crear perfil en tabla users
  const { error: insertError } = await supabase
    .from("users")
    .insert([{ name, email, phone, auth_id }]);

  if (insertError) {
    return { error: insertError.message };
  }

  return { success: true };
}

export async function loginUser(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return { error: error.message };

  return { user: data.user };
}

export async function getUserProfile() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "No authenticated user" };

  const { data: profile, error } = await supabase
    .from("users")
    .select("*")
    .eq("auth_id", user.id)
    .single();

  if (error) return { error: error.message };

  return profile;
}
