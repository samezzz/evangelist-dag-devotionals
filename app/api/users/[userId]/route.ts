import { getServerSession } from "next-auth/next"
import { z } from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { userNameSchema } from "@/lib/validations/user"

const routeContextSchema = z.object({
  params: z.object({
    userId: z.string(),
  }),
})

export async function PATCH(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    // Validate the route context.
    const { params } = routeContextSchema.parse(context);

    // Ensure user is authenticated and has access to this user.
    const session = await getServerSession(authOptions);
    if (!session?.user || params.userId !== session?.user.id) {
      return new Response(null, { status: 403 });
    }

    // Get the request body and validate it.
    const body = await req.json();
    const payload = userNameSchema.safeParse(body);

    if (!payload.success) {
      return new Response(JSON.stringify(payload.error), { status: 422 });
    }

    // Update the user's name.
    await db.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        name: payload.data.name,
      },
    });

    return new Response(null, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    console.error("Error: ", error);
    return new Response(null, { status: 500 });
  }
}