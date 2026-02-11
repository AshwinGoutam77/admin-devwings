import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();

    const applications = await db
      .collection("careerApplications")
      .find({})
      .sort({ createdAt: -1 })
      .project({ resumeData: 0 }) // 🔥 exclude binary file
      .toArray();

    return NextResponse.json({
      success: true,
      data: applications.map((item) => ({
        ...item,
        _id: item._id.toString(),
      })),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
