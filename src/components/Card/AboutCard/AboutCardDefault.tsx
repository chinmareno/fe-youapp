import { getWesternZodiac } from "@/lib/getWesternZodiac";
import { getChineseZodiac } from "../../../lib/getChineseZodiac";
import { format } from "date-fns";
import { getAge } from "@/lib/getAge";

interface AboutCardDefaultProps {
  birthdate?: Date;
  height?: number;
  weight?: number;
}

const AboutCardDefault = ({
  birthdate,
  height,
  weight,
}: AboutCardDefaultProps) => {
  const isEmptyProfile = !birthdate && !height && !weight;

  const birthdateStr = birthdate && format(birthdate, "dd / MM / yyyy");
  const chineseZodiac = birthdate && getChineseZodiac(birthdate);
  const westernZodiac = birthdate && getWesternZodiac(birthdate);
  const age = birthdate && getAge(birthdate);

  return (
    <div>
      {isEmptyProfile ? (
        <p className="text-[##5D6569]">
          Add in your about to help others know you better
        </p>
      ) : (
        <div className="text-[#5D6569] gap-2 flex-col flex">
          {birthdate && (
            <>
              <p>
                Birthday:
                <span className="text-white ml-1">
                  {birthdateStr} (Age {age})
                </span>
              </p>
              <p>
                Horoscope:
                <span className="text-white ml-1">{westernZodiac}</span>
              </p>
              <p>
                Zodiac:
                <span className="text-white ml-1">{chineseZodiac}</span>
              </p>
            </>
          )}
          {height && (
            <p>
              Height:
              <span className="text-white ml-1">{height} cm</span>
            </p>
          )}
          {weight && (
            <p>
              Weight:
              <span className="text-white ml-1">{weight} kg</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default AboutCardDefault;
