"use client";

import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { useRouter } from "next/navigation";
import { useDebounce } from "use-debounce";

const SearchInput = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [query] = useDebounce(search, 300);

  useEffect(() => {
    if (!query) {
      router.push(`/posts`);
    } else {
      router.push(`/posts?search=${query}`);
    }
  }, [query, router]);
  return (
    <Input
      className="max-w-[400px] ml-4"
      placeholder="Search"
      onChange={(e) => setSearch(e.target.value)}
    />
  );
};

export default SearchInput;
