import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

/* =========================
   GET - With Date Filter
========================= */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const client = await clientPromise;
    const db = client.db("Devwings");

    let filter = {};

    // ✅ Apply date filter if provided
    if (from && to) {
      const startDate = new Date(from);
      const endDate = new Date(to);
      endDate.setHours(23, 59, 59, 999);

      filter.createdAt = {
        $gte: startDate,
        $lte: endDate,
      };
    }

    const applications = await db
      .collection("careerApplications")
      .find(filter)
      .sort({ createdAt: -1 })
      .project({ resumeData: 0 }) // exclude binary resume
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

/* =========================
   DELETE
========================= */
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Application ID is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("Devwings");

    const result = await db
      .collection("careerApplications")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Application deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
