'use client';

import React from 'react'
import { Icons } from './Icons';
import { Button } from './ui/button';

interface ViewsButtonProps {
    viewsCount: number
    postId: string
}

function ViewsButton({viewsCount, postId}: ViewsButtonProps) {
  return (
    <Button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      className="flex items-center text-center gap-x-2 text-xs p-0 border border-none hover:bg-transparent shadow-none"
      variant="outline"
    >
      <Icons.views
        className={`h-4 w-4 text-muted-foreground group-hover:text-gray-900 dark:group-hover:text-gray-100`}
      />
      <div className='text-xs text-muted-foreground group-hover:text-gray-900 dark:group-hover:text-gray-100'>{viewsCount}</div>
    </Button>
  )
}

export default ViewsButton