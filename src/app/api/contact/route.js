import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("Devwings");

    const contacts = await db
      .collection("contacts")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    const formatted = contacts.map((contact) => ({
      ...contact,
      _id: contact._id.toString(),
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

