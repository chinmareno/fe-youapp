import { PencilLine } from "lucide-react";
import { useEffect, useState } from "react";
import AboutCardDefault from "./AboutCardDefault";
import AboutCardEditing from "./AboutCardEditing";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { createSupabaseClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

export interface AboutCardProps {
  birthdate?: Date;
  height?: number;
  weight?: number;
  username?: string;
  gender?: "Male" | "Female";
  profilePictureUrl?: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
const formSchema = z.object({
  newProfilePicture: z
    .instanceof(FileList)
    .refine((file) => file.length <= 1, "Cannot upload more than one image")
    .refine(
      (file) => !file[0] || file[0].size <= MAX_FILE_SIZE,
      "Image size must be less than 5MB"
    )
    .refine(
      (file) => !file[0] || ACCEPTED_IMAGE_TYPES.includes(file[0].type),
      "Only .jpg, .jpeg, .png and .webp formats are supported"
    )
    .optional(),
  newUsername: z.string().trim(),
  newGender: z.enum(["Male", "Female"]).optional(),
  newBirthdate: z.date().nullable(),
  newHeight: z.string(),
  newWeight: z.string(),
});

export type AboutCardForm = z.infer<typeof formSchema>;

const AboutCard = ({
  birthdate,
  height,
  weight,
  username,
  gender,
  profilePictureUrl,
}: AboutCardProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);

  const queryClient = useQueryClient();
  const supabase = createSupabaseClient();

  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm<AboutCardForm>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async ({
    newGender,
    newWeight,
    newHeight,
    newProfilePicture,
    newUsername,
    newBirthdate,
  }: AboutCardForm) => {
    setIsLoading(true);

    try {
      const { data: userData } = await supabase.auth.getUser();
      const userEmail = userData.user?.email;

      if (!userEmail) {
        setIsLoading(false);
        return router.push("/login");
      }

      const { data: profileData } = await supabase
        .from("profile")
        .select("id, username, profile_picture_url")
        .eq("email", userEmail)
        .single();

      const oldUsername = profileData?.username as string;

      if (newUsername && newUsername !== oldUsername) {
        const { data } = await supabase
          .from("profile")
          .select("id")
          .eq("username", newUsername)
          .single();

        if (data) {
          setIsLoading(false);
          return toast.error("Username has been taken");
        }

        await supabase
          .from("profile")
          .update({ username: newUsername })
          .eq("email", userEmail);
      }

      const newProfilePictureFile = newProfilePicture?.[0];

      if (newProfilePictureFile) {
        await supabase.storage
          .from("profile-picture")
          .remove([profileData?.profile_picture_url]);
        const { data, error } = await supabase.storage
          .from("profile-picture")
          .upload(
            userEmail +
              newProfilePictureFile.lastModified +
              newProfilePictureFile.name,
            newProfilePictureFile
          );

        if (!data) {
          console.log(error);
          setIsLoading(false);
          return toast.error("Image Upload failed. Please try again");
        }

        const formattedData = {
          gender: newGender || undefined,
          height: newHeight ? Number(newHeight) : undefined,
          weight: newWeight ? Number(newWeight) : undefined,
          username: newUsername,
          birthdate: newBirthdate,
          profile_picture_url: data.path,
        };

        await supabase
          .from("profile")
          .update({ ...formattedData })
          .eq("email", userEmail);
      } else {
        const formattedData = {
          gender: newGender || null,
          height: newHeight ? Number(newHeight) : null,
          weight: newWeight ? Number(newWeight) : null,
          username: newUsername,
          birthdate: newBirthdate,
        };

        await supabase
          .from("profile")
          .update({ ...formattedData })
          .eq("email", userEmail);
      }

      toast.success("Profile updated successfully");
      await queryClient.invalidateQueries({ queryKey: ["profile"] });
      reset();
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (errors.newProfilePicture) {
      toast.info(errors.newProfilePicture.message);
    }
    if (errors.newBirthdate) {
      toast.info(errors.newBirthdate.message);
    }
    if (errors.newGender) {
      toast.info(errors.newGender.message);
    }
    if (errors.newHeight) {
      toast.info(errors.newHeight.message);
    }
    if (errors.newUsername) {
      toast.info(errors.newUsername.message);
    }
    if (errors.newWeight) {
      toast.info(errors.newWeight.message);
    }
  }, [errors]);

  return (
    <div
      className={`bg-[rgb(14,25,31)] rounded-xl relative pb-6 pt-3 pl-7 ${
        isLoading && "opacity-50"
      }`}
    >
      <h2 className="mb-4.5 font-medium">About</h2>
      {isEditing ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <button
            disabled={isLoading}
            type="submit"
            className="absolute text-sm right-3 top-2 text-transparent bg-[linear-gradient(to_right,#F3EDA6,#F8FAE5,#FFE2BE,#D5BE88,#F8FAE5,#D5BE88)] bg-clip-text"
          >
            Save & Update
          </button>
          <AboutCardEditing
            profilePictureUrl={profilePictureUrl}
            birthdate={birthdate}
            height={height}
            weight={weight}
            username={username}
            register={register}
            watch={watch}
            control={control}
            gender={gender}
          />
        </form>
      ) : (
        <>
          <button
            onClick={() => setIsEditing(true)}
            className="absolute right-3 top-2"
          >
            <PencilLine size={"18"} />
          </button>
          <AboutCardDefault
            birthdate={birthdate}
            height={height}
            weight={weight}
          />
        </>
      )}
    </div>
  );
};

export default AboutCard;
