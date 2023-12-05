"use client";

import React, { useEffect, useRef, useState } from "react";
import { Input } from "./ui/input";
import { useRouter } from "next/navigation";
import { useDebounce } from "use-debounce";
import { Icons } from "./Icons";

const SearchInput = ({ search }: { search?: string }) => {
  const router = useRouter();
  const [text, setText] = useState(search);
  const [query] = useDebounce(text, 100);
  const initialRender = useRef(true);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }

    if (!query) {
      router.push(`/posts`);
    } else {
      router.push(`/posts?search=${query}`);
    }
  }, [query, router]);
  return (
    <div className="flex">
      <Icons.refresh className={`ml-4 mr-2 mt-2 cursor-pointer hover:rotate-90 transition-all duration-500`} onClick={() => {router.refresh()}} />
      <Input
        className="max-w-[430px]"
        placeholder="search"
        onChange={(e) => setText(e.target.value)}
      />
    </div>
  );
};

export default SearchInput;
