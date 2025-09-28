import { createSupabaseClient } from "./supabase";

export const getProfile = async (email: string) => {
  const supabase = createSupabaseClient();

  const { data: profile } = await supabase
    .from("profile")
    .select(
      "id, username, gender, email, birthdate, profile_picture_url, height, weight, interests"
    )
    .eq("email", email)
    .single();

  return {
    ...profile,
    birthdate: profile?.birthdate ? new Date(profile.birthdate) : null,
    interests: profile?.interests || [],
  } as {
    id: string;
    username: string;
    email: string;
    birthdate: Date;
    profile_picture_url: string;
    height: number;
    weight: number;
    gender: "Male" | "Female";
    interests: string[];
  };
};
