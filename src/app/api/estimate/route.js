import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const client = await clientPromise;
    const db = client.db("Devwings");

    let filter = {};

    // ✅ Apply date filter only if both exist
    if (from && to) {
      const startDate = new Date(from);
      const endDate = new Date(to);
      endDate.setHours(23, 59, 59, 999);

      filter.createdAt = {
        $gte: startDate,
        $lte: endDate,
      };
    }

    const submissions = await db
      .collection("estimateSubmissions")
      .find(filter)
      .sort({ createdAt: -1 }) // works only if createdAt exists
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

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Submission ID is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("Devwings");

    const result = await db
      .collection("estimateSubmissions")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Submission not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Submission deleted successfully",
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}