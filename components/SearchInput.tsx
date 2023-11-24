"use client";

import React, { useEffect, useRef, useState } from "react";
import { Input } from "./ui/input";
import { useRouter } from "next/navigation";
import { useDebounce } from "use-debounce";

const SearchInput = ({search}: {search?: string}) => {
  const router = useRouter();
  const [text, setText] = useState(search);
  const [query] = useDebounce(text, 100);

  const initialRender = useRef(true)

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false
      return
    }
    
    if (!query) {
      router.push(`/posts`);
    } else {
      router.push(`/posts?search=${query}`);
    }
  }, [query, router]);
  return (
    <Input
      className="max-w-[400px] ml-4"
      placeholder="search"
      onChange={(e) => setText(e.target.value)}
    />
  );
};

export default SearchInput;
