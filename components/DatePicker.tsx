"use client";

import * as React from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useDebounce } from "use-debounce";
import { useRouter } from "next/navigation";

export function DatePicker() {
  const router = useRouter();
  const [date, setDate] = React.useState<Date>();
  const [debouncedDate] = useDebounce(date, 50);

  React.useEffect(() => {
    if (!debouncedDate) {
      router.push(`/posts`);
    } else {
      router.push(`/posts?date=${debouncedDate}`);
    }
  }, [debouncedDate, router]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Filter by date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import { Input } from "./ui/input";
// import { useRouter } from "next/navigation";
// import { useDebounce } from "use-debounce";
// import { Icons } from "./Icons";

// const SearchInput = ({ search }: { search?: string }) => {
//   const router = useRouter();
//   const [text, setText] = useState(search);
//   const [query] = useDebounce(text, 100);
//   const initialRender = useRef(true);

//   useEffect(() => {
//     if (initialRender.current) {
//       initialRender.current = false;
//       return;
//     }

//     if (!query) {
//       router.push(`/posts`);
//     } else {
//       router.push(`/posts?search=${query}`);
//     }
//   }, [query, router]);
//   return (
//     <div className="flex">
//       <Icons.refresh className={`ml-4 mr-2 mt-2 cursor-pointer hover:rotate-90 transition-all duration-500`} onClick={() => {router.refresh()}} />
//       <Input
//         className="min-w-[250px] md:min-w-[330px] lg:min-w-[450px]"
//         placeholder="search"
//         onChange={(e) => setText(e.target.value)}
//       />
//     </div>
//   );
// };

// export default SearchInput;
