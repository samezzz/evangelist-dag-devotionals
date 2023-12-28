import { getCurrentUser } from '@/lib/session';
import { notFound } from 'next/navigation';
import React from 'react'

const CollectionsPage = async () => {
  const user = await getCurrentUser();

  if (!user) {
		notFound();
		return; // Stop further execution if user doesn't exist
  }

  return (
		<div>
			<div>
				<h1>LIKED POSTS</h1>
				<div>
					{user.likedPosts.map((post: any) => (
						<div key={post.postId}>
							<p>{post.postId}</p>
						</div>
					))}
				</div>
			</div>
			<div>
				<h1>SAVED POSTS</h1>
				<div>
					{user.savedPosts.map((post: any) => (
						<div key={post.postId}>
							<p>{post.postId}</p>
						</div>
					))}
				</div>
			</div>
		</div>
  );
}

export default CollectionsPage