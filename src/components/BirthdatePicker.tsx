"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Control, Controller } from "react-hook-form";
import { AboutCardForm } from "./Card/AboutCard";
import { useState } from "react";

interface BirthdatePickerProps {
  defaultValue?: Date;
  control: Control<AboutCardForm>;
}

export function BirthdatePicker({
  defaultValue,
  control,
}: BirthdatePickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Controller
      name="newBirthdate"
      control={control}
      defaultValue={defaultValue}
      render={({ field }) => {
        const selectedDate = field.value || undefined;

        return (
          <div className="flex flex-col gap-3">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button id="date-picker" variant="ghost">
                  <Input
                    readOnly
                    value={
                      selectedDate ? format(selectedDate, "dd MM yyyy") : ""
                    }
                    placeholder="DD MM YYYY"
                    className="bg-transparent pr-0 placeholder:text-[#4C5559] text-right"
                  />
                  <span className="sr-only">Select date</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto overflow-hidden p-0 bg-[#1A252A] text-white"
                align="end"
                alignOffset={-8}
                sideOffset={10}
              >
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  captionLayout="dropdown"
                  defaultMonth={selectedDate}
                  onSelect={(date) => {
                    field.onChange(date ?? undefined);
                    setOpen(false);
                  }}
                  className="text-white bg-[#4C5559]"
                />
              </PopoverContent>
            </Popover>
          </div>
        );
      }}
    />
  );
}
