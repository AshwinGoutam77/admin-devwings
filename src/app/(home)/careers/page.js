import clientPromise from "@/lib/mongodb";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

async function getContacts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/careers`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch contacts");
  }

  return res.json();
}

export default async function CareersPage() {
 const response = await getContacts();
  const applications = response.data || [];

  return (
    <div className="grid rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <h2 className="mb-6 text-xl font-semibold text-dark">Career Applications</h2>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Profile</TableHead>
            <TableHead>Message</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {applications.map((app) => (
             <TableRow key={app._id.toString()} className="text-base font-medium text-md text-dark dark:text-white">
              <TableCell>{app.fullName}</TableCell>
              <TableCell>{app.email}</TableCell>
              <TableCell>{app.phone}</TableCell>
              <TableCell>
                <a
                  href={app.profileLink}
                  target="_blank"
                  className="text-blue-600 underline"
                >
                  View Profile
                </a>
              </TableCell>
              <TableCell>{app.message}</TableCell>
              <TableCell>
                {new Date(app.createdAt).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
