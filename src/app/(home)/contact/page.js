import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

async function getContacts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/contact`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch contacts");
  }

  return res.json();
}

export default async function ContactPage() {
  const response = await getContacts();
  const contacts = response.data || [];

  return (
    <div className="grid rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
    <h2 className="mb-6 text-xl font-semibold text-dark">Contacts</h2>
      <Table>
        <TableHeader>
          <TableRow className="uppercase">
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Message</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {contacts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6">
                No contacts found
              </TableCell>
            </TableRow>
          ) : (
            contacts.map((contact) => (
              <TableRow
                key={contact._id}
                className="text-base font-medium text-md text-dark dark:text-white"
              >
                <TableCell className="!text-left">
                  {contact.fullName}
                </TableCell>

                <TableCell>{contact.email}</TableCell>

                <TableCell>{contact.company || "—"}</TableCell>

                <TableCell>{contact.phone}</TableCell>

                <TableCell className="max-w-[200px] truncate">
                  {contact.message}
                </TableCell>

                <TableCell>
                  {new Date(contact.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
