import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("Devwings");

    const submissions = await db
      .collection("estimateSubmissions")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    const formatted = submissions.map((item) => ({
      ...item,
      _id: item._id.toString(),
    }));

    return NextResponse.json({
      success: true,
      data: formatted,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
