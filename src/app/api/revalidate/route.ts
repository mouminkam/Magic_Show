import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

/**
 * On-demand revalidation API.
 * Called by Laravel Backend when Admin updates content to invalidate Next.js cache immediately.
 *
 * POST body: { secret: string, tags?: string[], path?: string }
 */

interface RevalidateBody {
  secret?: string;
  tags?: string[];
  path?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RevalidateBody;
    const { secret, tags, path } = body;

    const expectedSecret = process.env.REVALIDATION_SECRET;
    if (!expectedSecret || secret !== expectedSecret) {
      return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
    }

    const hasTags = Array.isArray(tags) && tags.length > 0;
    const hasPath = typeof path === "string" && path.length > 0;
    if (!hasTags && !hasPath) {
      return NextResponse.json(
        { error: "Provide tags or path" },
        { status: 400 }
      );
    }

    if (hasTags) {
      for (const tag of tags) {
        revalidateTag(tag, "max");
      }
    }
    if (hasPath) {
      revalidatePath(path);
    }

    return NextResponse.json({ revalidated: true });
  } catch (error) {
    console.error("Revalidation error:", error);
    return NextResponse.json(
      { error: "Revalidation failed" },
      { status: 500 }
    );
  }
}
