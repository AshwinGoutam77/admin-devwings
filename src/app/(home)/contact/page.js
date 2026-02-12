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

export default function ContactPage() {
  const [contacts, setContacts] = useState([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // ✅ Set Default Last 30 Days
  useEffect(() => {
    const today = new Date();
    const lastMonth = new Date();
    lastMonth.setDate(today.getDate() - 30);

    const defaultFrom = lastMonth.toISOString().split("T")[0];
    const defaultTo = today.toISOString().split("T")[0];

    setFrom(defaultFrom);
    setTo(defaultTo);

    fetchContacts(defaultFrom, defaultTo);
  }, []);

  const fetchContacts = async (fromDate, toDate) => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (fromDate) params.append("from", fromDate);
      if (toDate) params.append("to", toDate);

      const res = await fetch(`/api/contact?${params.toString()}`);

      const data = await res.json();

      if (data.success) {
        setContacts(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    fetchContacts(from, to);
  };

  const handleDelete = async (id) => {
    const confirmDelete = confirm("Are you sure?");
    if (!confirmDelete) return;

    const res = await fetch(`/api/contact?id=${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (data.success) {
      fetchContacts(from, to); // refresh data
    }
  };

  return (
    <div className="grid rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <h2 className="mb-6 text-xl font-semibold text-dark">Contacts</h2>

      {/* 🔥 Date Filter (No Reload) */}
      <div className="mb-6 flex gap-4">
        <input
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="rounded border px-3 py-2"
        />

        <input
          type="date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="rounded border px-3 py-2"
        />

        <button
          onClick={handleFilter}
          className="rounded bg-primary px-10 py-2 text-white"
        >
          Filter
        </button>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="uppercase">
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Message</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={7} className="py-6 text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : contacts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="py-6 text-center">
                No contacts found
              </TableCell>
            </TableRow>
          ) : (
            contacts.map((contact) => (
              <TableRow
                key={contact._id}
                className="text-md"
              >
                <TableCell>{contact.fullName}</TableCell>
                <TableCell>{contact.email}</TableCell>
                <TableCell>{contact.company || "—"}</TableCell>
                <TableCell>{contact.phone}</TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {contact.message}
                </TableCell>
                <TableCell>
                  {new Date(contact.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {/* 👁 View Icon */}
                    <button
                      onClick={() => setSelectedContact(contact)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Eye size={18} />
                    </button>

                    <button
                      onClick={() => setDeleteId(contact._id)}
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

      {selectedContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          {/* <div className="fixed inset-0 z-[9999] flex items-center justify-center"> */}
          <div className="max-h-[85vh] w-[600px] overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
            <h3 className="mb-6 text-xl font-semibold">Contact Details</h3>

            <div className="space-y-4 text-sm">
              <div>
                <span className="font-semibold">Full Name:</span>
                <p>{selectedContact.fullName}</p>
              </div>

              <div>
                <span className="font-semibold">Email:</span>
                <p>{selectedContact.email}</p>
              </div>

              <div>
                <span className="font-semibold">Company:</span>
                <p>{selectedContact.company || "—"}</p>
              </div>

              <div>
                <span className="font-semibold">Phone:</span>
                <p>{selectedContact.phone}</p>
              </div>

              <div>
                <span className="font-semibold">Message:</span>
                <p className="whitespace-pre-wrap">{selectedContact.message}</p>
              </div>

              <div>
                <span className="font-semibold">Created At:</span>
                <p>{new Date(selectedContact.createdAt).toLocaleString()}</p>
              </div>
            </div>

            <div className="mt-8 text-right">
              <button
                onClick={() => setSelectedContact(null)}
                className="rounded-lg bg-primary px-5 py-2 text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setDeleteId(null)}
          />

          {/* Modal */}
          <div className="relative w-[400px] rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Confirm Delete
            </h3>

            <p className="mb-6 text-sm text-gray-600">
              Are you sure you want to delete this contact? This action cannot
              be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="rounded-lg border px-4 py-2 text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  try {
                    setDeleting(true);

                    const res = await fetch(`/api/contact?id=${deleteId}`, {
                      method: "DELETE",
                    });

                    const data = await res.json();

                    if (data.success) {
                      fetchContacts(from, to);
                      setDeleteId(null);
                    }
                  } catch (err) {
                    console.error(err);
                  } finally {
                    setDeleting(false);
                  }
                }}
                disabled={deleting}
                className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
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
