import { Input } from "@/components/ui/input";
import { AboutCardProps, AboutCardForm } from ".";
import {
  Control,
  Controller,
  UseFormRegister,
  UseFormWatch,
} from "react-hook-form";
import { getChineseZodiac } from "@/lib/getChineseZodiac";
import { getWesternZodiac } from "@/lib/getWesternZodiac";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BirthdatePicker } from "@/components/BirthdatePicker";
import { useEffect, useState } from "react";
import Image from "next/image";

interface AboutCardEditingProps extends AboutCardProps {
  register: UseFormRegister<AboutCardForm>;
  watch: UseFormWatch<AboutCardForm>;
  control: Control<AboutCardForm>;
}

const AboutCardEditing = ({
  birthdate,
  height,
  weight,
  username,
  gender,
  profilePictureUrl,
  register,
  watch,
  control,
}: AboutCardEditingProps) => {
  const newBirthdate = watch("newBirthdate");

  const [heightState, setHeightState] = useState(false);
  const [weightState, setWeightState] = useState(false);

  const newHeight = watch("newHeight");
  const newWeight = watch("newWeight");

  useEffect(() => {
    setWeightState(!!newWeight);
    setHeightState(!!newHeight);
  }, [newHeight, newWeight]);

  useEffect(() => {
    if (height) setHeightState(!!height);
    if (weight) setWeightState(!!weight);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [previewImageUrl, setPreviewImageUrl] = useState(profilePictureUrl);

  const chineseZodiac = newBirthdate && getChineseZodiac(newBirthdate);
  const westernZodiac = newBirthdate && getWesternZodiac(newBirthdate);
  const newProfilePicture = watch("newProfilePicture");
  useEffect(() => {
    if (newProfilePicture && newProfilePicture.length > 0) {
      const imageUrl = URL.createObjectURL(newProfilePicture[0]);
      setPreviewImageUrl(imageUrl);
    }
    return () => {
      if (previewImageUrl) URL.revokeObjectURL(previewImageUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newProfilePicture]);

  return (
    <div className="text-muted-foreground text-sm whitespace-nowrap gap-2.5 flex flex-col">
      <input
        id="newProfilePicture"
        hidden
        accept="image/*"
        type="file"
        {...register("newProfilePicture")}
      />
      <label
        htmlFor="newProfilePicture"
        className="flex items-center gap-4 w-fit"
      >
        <div className="w-[55.2] h-[58] relative bg-[#212B31] rounded-xl pb-2.5 px-3">
          {previewImageUrl ? (
            <Image
              fill
              src={previewImageUrl}
              alt="Profile Picture"
              className="object-cover rounded-xl"
            />
          ) : (
            <p className="text-5xl font-light bg-[linear-gradient(to_right,#F3EDA6,#F8FAE5,#FFE2BE,#D5BE88,#F8FAE5,#D5BE88)] bg-clip-text text-transparent">
              +
            </p>
          )}
        </div>
        <p className="text-white">Add image</p>
      </label>

      <div className="mb-1.5" />

      <div className="gap-2 flex items-center">
        <p className="w-1/3">Display Name:</p>
        <InputWrapper>
          <Input
            defaultValue={username}
            placeholder="Enter name"
            className="text-right h-9 placeholder:text-[#4C5559] pr-2"
            {...register("newUsername")}
          />
        </InputWrapper>
      </div>

      <div className="gap-2 flex items-center">
        <p className="w-1/3">Gender:</p>
        <InputWrapper>
          <Controller
            name="newGender"
            control={control}
            defaultValue={gender}
            render={({ field }) => {
              return (
                <Select
                  onValueChange={(val) => field.onChange(val || undefined)}
                  value={field.value || ""}
                >
                  <SelectTrigger className="w-full border-none text-right text-white pr-2">
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              );
            }}
          />
        </InputWrapper>
      </div>

      <div className="gap-2 flex items-center">
        <p className="w-1/3">Birthday:</p>
        <InputWrapper>
          <BirthdatePicker defaultValue={birthdate} control={control} />
        </InputWrapper>
      </div>

      <div className="gap-2 flex items-center">
        <p className="w-1/3">Horoscope:</p>
        <InputWrapper>
          <Input
            readOnly
            value={westernZodiac || "--"}
            className="text-right text-[#4C5559] pr-2 h-9"
          />
        </InputWrapper>
      </div>

      <div className="gap-2 flex items-center">
        <p className="w-1/3">Zodiac:</p>
        <InputWrapper>
          <Input
            readOnly
            value={chineseZodiac || "--"}
            className="text-right text-[#4C5559] pr-2 h-9"
          />
        </InputWrapper>
      </div>

      <div className="gap-2 flex items-center">
        <p className="w-1/3">Height:</p>
        <InputWrapper>
          <div className="flex items-center relative pr-2">
            <Input
              defaultValue={height}
              placeholder="Add height"
              className={`text-right h-9 ${
                heightState ? "pr-9" : ""
              } placeholder:text-[#4C5559]`}
              inputMode="numeric"
              pattern="[0-9]*"
              onInput={(e) => {
                e.currentTarget.value = e.currentTarget.value.replace(
                  /[^0-9]/g,
                  ""
                );
              }}
              {...register("newHeight")}
            />
            {heightState && (
              <p className="absolute right-3 top-1/2 -translate-y-1/2">cm</p>
            )}
          </div>
        </InputWrapper>
      </div>

      <div className="gap-2 flex items-center">
        <p className="w-1/3">Weight:</p>
        <InputWrapper>
          <div className="flex items-center relative pr-2">
            <Input
              defaultValue={weight}
              placeholder="Add weight"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              onInput={(e) => {
                e.currentTarget.value = e.currentTarget.value.replace(
                  /[^0-9]/g,
                  ""
                );
              }}
              className={`text-right h-9 ${
                weightState ? "pr-9" : ""
              } placeholder:text-[#4C5559]`}
              {...register("newWeight")}
            />

            {weightState && (
              <p className="absolute right-3 top-1/2 -translate-y-1/2">kg</p>
            )}
          </div>
        </InputWrapper>
      </div>
    </div>
  );
};

const InputWrapper = ({ children }: React.PropsWithChildren) => {
  return (
    <div className="border pb-1 rounded-lg border-[#4C5559] bg-[#1A252A] text-white w-2/3">
      {children}
    </div>
  );
};

export default AboutCardEditing;
