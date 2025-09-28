import React from "react";
import { Badge } from "../ui/badge";
import { PencilLine } from "lucide-react";
import { useRouter } from "next/navigation";

interface InterestCardProps {
  interests: string[];
}

const InterestCard = ({ interests }: InterestCardProps) => {
  const router = useRouter();

  return (
    <div className="bg-[rgb(14,25,31)] rounded-xl relative pb-6 pt-4 pl-7 pr-8">
      <button
        onClick={() => router.push("/edit/interest")}
        className="absolute right-5 top-4"
      >
        <PencilLine size={"18"} />
      </button>
      <h2 className="font-medium">Interest</h2>
      {interests.length === 0 ? (
        <div className=" mt-4.5 text-[#7C8285] text-sm">
          Add in your interest to find a better match
        </div>
      ) : (
        <div className="-ml-2.5 mt-4.5 flex flex-wrap gap-2.5">
          {interests.map((interest, index) => (
            <Badge
              key={index}
              className="rounded-2xl text-sm py-1.5 px-4 bg-[#1C272C]"
            >
              {interest}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default InterestCard;
