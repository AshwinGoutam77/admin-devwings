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
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/estimate`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch contacts");
  }

  return res.json();
}

export default async function EstimatesPage() {
  const response = await getContacts();
  const submissions = response.data || [];

  return (
     <div className="grid rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <h2 className="mb-6 text-xl font-semibold text-dark">Estimate Submissions</h2>

      <Table>
        <TableHeader>
          <TableRow className="uppercase">
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Budget</TableHead>
            <TableHead>Timeline</TableHead>
            <TableHead>Help With</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {submissions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6">
                No submissions found
              </TableCell>
            </TableRow>
          ) : (
            submissions.map((item) => (
              <TableRow key={item._id.toString()} className="text-base font-medium text-md text-dark dark:text-white">
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>{item.phone}</TableCell>
                <TableCell>{item.projectBudget}</TableCell>
                <TableCell>{item.projectTimeline}</TableCell>
                <TableCell>
                  {item.helpWith?.join(", ") || "—"}
                </TableCell>
                <TableCell>
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString()
                    : item.timestamp}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
