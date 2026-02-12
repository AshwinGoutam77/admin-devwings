"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Trash2 } from "lucide-react";

export default function EstimatesPage() {
  const [submissions, setSubmissions] = useState([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(false);

  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // ✅ Default last 30 days
  useEffect(() => {
    const today = new Date();
    const lastMonth = new Date();
    lastMonth.setDate(today.getDate() - 30);

    const defaultFrom = lastMonth.toISOString().split("T")[0];
    const defaultTo = today.toISOString().split("T")[0];

    setFrom(defaultFrom);
    setTo(defaultTo);

    fetchData(defaultFrom, defaultTo);
  }, []);

  const fetchData = async (fromDate, toDate) => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (fromDate) params.append("from", fromDate);
      if (toDate) params.append("to", toDate);

      const res = await fetch(`/api/estimate?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setSubmissions(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    fetchData(from, to);
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);

      const res = await fetch(`/api/estimate?id=${deleteId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        fetchData(from, to);
        setDeleteId(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="grid rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <h2 className="mb-6 text-xl font-semibold text-dark">
        Estimate Submissions
      </h2>

      {/* 🔥 Date Filter */}
      <div className="flex gap-4 mb-6">
        <input
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <input
          type="date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <button
          onClick={handleFilter}
          className="bg-primary text-white px-8 py-2 rounded"
        >
          Filter
        </button>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="uppercase">
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Budget</TableHead>
            <TableHead>Timeline</TableHead>
            {/* <TableHead>Help With</TableHead> */}
            <TableHead>Created</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-6">
                Loading...
              </TableCell>
            </TableRow>
          ) : submissions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-6">
                No submissions found
              </TableCell>
            </TableRow>
          ) : (
            submissions.map((item) => (
              <TableRow key={item._id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>{item.phone}</TableCell>
                <TableCell>{item.projectBudget}</TableCell>
                <TableCell>{item.projectTimeline}</TableCell>
                {/* <TableCell className="max-w-[200px] truncate">
                  {item.helpWith?.join(", ") || "—"}
                </TableCell> */}
                <TableCell>
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString()
                    : item.timestamp}
                </TableCell>

                <TableCell>
                  <div className="flex gap-3 items-center">
                    <button
                      onClick={() => setSelectedItem(item)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Eye size={18} />
                    </button>

                    <button
                      onClick={() => setDeleteId(item._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* 👁 View Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedItem(null)}
          />
          <div className="relative bg-white w-[640px] p-8 rounded-2xl shadow-2xl">
            <div className="flex justify-between mb-6">
              <h3 className="text-xl font-semibold">
                Estimate Details
              </h3>
              <button onClick={() => setSelectedItem(null)}>✕</button>
            </div>

            <div className="space-y-4 text-sm">
              <p><strong>Name:</strong> {selectedItem.name}</p>
              <p><strong>Email:</strong> {selectedItem.email}</p>
              <p><strong>Phone:</strong> {selectedItem.phone}</p>
              <p><strong>Budget:</strong> {selectedItem.projectBudget}</p>
              <p><strong>Timeline:</strong> {selectedItem.projectTimeline}</p>
              <p><strong>Help With:</strong>  <div className="mt-2 flex flex-wrap gap-2">
    {selectedItem.helpWith && selectedItem.helpWith.length > 0 ? (
      selectedItem.helpWith.map((tag, index) => (
        <span
          key={index}
          className="px-2.5 py-1 text-xs font-medium rounded-full 
                     bg-blue-100 text-blue-700 
                     dark:bg-blue-900/30 dark:text-blue-400"
        >
          {tag}
        </span>
      ))
    ) : (
      "—"
    )}
  </div></p>
              <p><strong>Brief:</strong> {selectedItem.brief}</p>
            </div>
          </div>
        </div>
      )}

      {/* 🗑 Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setDeleteId(null)}
          />
          <div className="relative bg-white w-[400px] p-6 rounded-2xl shadow-2xl">
            <h3 className="text-lg font-semibold mb-4">
              Confirm Delete
            </h3>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
