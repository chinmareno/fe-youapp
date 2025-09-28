"use client";

import AboutCard from "@/components/Card/AboutCard";
import InterestCard from "@/components/Card/InterestCard";
import ProfilePictureCard from "@/components/Card/ProfilePictureCard";
import { getProfile } from "@/lib/getProfile";
import { createSupabaseClient } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const supabase = createSupabaseClient();
  const { data: profile, isPending } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser();
      const userEmail = data.user?.email;
      if (userEmail) {
        const profile = await getProfile(userEmail);
        const { profile_picture_url: path, ...rest } = profile;
        if (!path) return profile;
        const { data: profilePicture } = supabase.storage
          .from("profile-picture")
          .getPublicUrl(path);

        return { profile_picture_url: profilePicture.publicUrl, ...rest };
      }
    },
  });

  if (isPending) return <span>Loading...</span>;

  return (
    <div className="mx-3">
      <ProfilePictureCard
        birthDate={profile?.birthdate}
        username={profile?.username}
        gender={profile?.gender}
        imageUrl={profile?.profile_picture_url}
      />
      <div className="mt-5" />
      <AboutCard
        username={profile?.username}
        profilePictureUrl={profile?.profile_picture_url}
        gender={profile?.gender}
        birthdate={profile?.birthdate}
        weight={profile?.weight}
        height={profile?.height}
      />

      <div className="mt-5" />

      <InterestCard interests={profile?.interests ?? []} />
    </div>
  );
}
