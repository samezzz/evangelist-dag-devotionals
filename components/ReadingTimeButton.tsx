'use client';

import React from 'react'
import { Icons } from './Icons';
import { Button } from './ui/button';

interface ReadingTimeButtonProps {
    timeToRead: number
    postId: string
}

function ReadingTimeButton({timeToRead, postId}: ReadingTimeButtonProps) {
  return (
    <Button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      className="flex items-center text-center gap-x-2 text-xs p-0 border border-none hover:bg-transparent shadow-none"
      variant="outline"
    >
      <Icons.clock
        className={`h-3 w-3 text-muted-foreground group-hover:text-gray-900 dark:group-hover:text-gray-100`}
      />
      <div className='text-xs text-muted-foreground group-hover:text-gray-900 dark:group-hover:text-gray-100'>{timeToRead} mins read</div>
    </Button>
  )
}

export default ReadingTimeButton