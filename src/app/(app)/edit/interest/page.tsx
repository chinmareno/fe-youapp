"use client";

import { Input } from "@/components/ui/input";
import { getProfile } from "@/lib/getProfile";
import { createSupabaseClient } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const EditInterest = () => {
  const [interest, setInterest] = useState("");
  const [interestList, setInterestList] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const supabase = createSupabaseClient();

  const { data: profile } = useQuery({
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

  useEffect(() => {
    setInterestList(profile?.interests || []);
  }, [profile?.interests]);

  const router = useRouter();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (interest.trim() === "") return;

      if (interestList.includes(interest)) {
        return toast.error("You have already added this interest.");
      }

      setInterestList((prev) => [...prev, interest]);
      setInterest("");
    }
  };

  const onSubmit = async () => {
    setIsSubmitting(true);
    const { data: userData } = await supabase.auth.getUser();
    const userEmail = userData.user?.email;
    await supabase
      .from("profile")
      .update({ interests: interestList.length > 0 ? interestList : null })
      .eq("email", userEmail)
      .single();
    setIsSubmitting(false);
    setInterest("");
    router.push("/");
  };

  return (
    <div className={`mx-4.5 mt-16 ${isSubmitting && "opacity-50"}`}>
      <button
        onKeyDown={(e) => e.preventDefault()}
        disabled={isSubmitting}
        onClick={onSubmit}
        className="absolute top-2.5 right-2 text-sm font-medium text-transparent bg-[linear-gradient(to_right,#ABFFFD,#AADAFF,#4599DB)] bg-clip-text"
      >
        Save
      </button>
      <div className="mx-2 ">
        <h2 className="text-sm font-bold text-transparent bg-[linear-gradient(to_right,#F3EDA6,#F8FAE5,#FFE2BE,#D5BE88,#F8FAE5,#D5BE88)] bg-clip-text">
          Tell everyone about yourself
        </h2>
        <h3 className="text-xl font-bold">What interest you?</h3>
      </div>
      <div className="bg-[#22373C] relative py-2 font-semibold px-4 mt-8 rounded-md items-center flex flex-wrap gap-1 text-xs">
        {interestList.map((interest, index) => (
          <div key={index} className="flex bg-[#334348] rounded-sm px-3 py-2">
            <p>{interest}</p>
            <button
              disabled={isSubmitting}
              onClick={() => {
                setInterestList((prev) =>
                  prev.filter((item) => item !== interest)
                );
              }}
            >
              <X className="size-4 text-white ml-2" />
            </button>
          </div>
        ))}
        <Input
          type="text"
          value={interest}
          onChange={(e) => setInterest(e.currentTarget.value)}
          maxLength={30}
          onKeyDown={handleKeyDown}
          enterKeyHint="done"
          inputMode="text"
          autoCapitalize="sentences"
          autoComplete="off"
          autoCorrect="off"
          className="text-sm py-1.5 px-2"
          placeholder={
            interestList.length >= 10
              ? ""
              : interestList.length === 0
              ? "Add your first interest..."
              : "Add another interest..."
          }
          disabled={interestList.length >= 10 || isSubmitting}
        />
        <div className="mx-2 mt-2 text-xs text-gray-400 flex justify-between absolute right-1 bottom-1">
          <span>{interestList.length}/10</span>
        </div>
      </div>
    </div>
  );
};

export default EditInterest;
