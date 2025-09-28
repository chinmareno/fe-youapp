import { getAge } from "@/lib/getAge";
import { getChineseZodiac } from "@/lib/getChineseZodiac";
import { getWesternZodiac } from "@/lib/getWesternZodiac";
import { Badge } from "../ui/badge";

interface ProfilePictureProps {
  imageUrl?: string;
  username?: string;
  birthDate?: Date;
  gender?: "Male" | "Female";
}

const ProfilePicture = ({
  imageUrl,
  username,
  birthDate,
  gender,
}: ProfilePictureProps) => {
  const age = birthDate && getAge(birthDate);
  const chineseZodiac = birthDate && getChineseZodiac(birthDate);
  const westernZodiac = birthDate && getWesternZodiac(birthDate);

  return (
    <div className="rounded-xl h-44 relative overflow-hidden bg-[#162329]">
      {imageUrl && (
        <img
          src={imageUrl}
          alt={`${username}'s profile`}
          className="object-cover w-full h-full"
        />
      )}
      <div className="absolute bottom-2 left-3 text-white">
        <p className="font-semibold">
          @{username || "user"},{age || null}
        </p>
        <p>{gender}</p>
        {westernZodiac && chineseZodiac && (
          <div className="flex gap-3.5 mt-2.5">
            <Badge className="px-4 py-2">{westernZodiac}</Badge>
            <Badge className="px-4 py-2">{chineseZodiac}</Badge>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePicture;
