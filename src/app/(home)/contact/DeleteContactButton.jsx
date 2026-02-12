"use client";

import { useRouter } from "next/navigation";

export default function DeleteContactButton({ id }) {
  const router = useRouter();

  const handleDelete = async () => {
    const confirmDelete = confirm("Are you sure you want to delete?");
    if (!confirmDelete) return;

    const res = await fetch(`/api/contact?id=${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (data.success) {
      router.refresh(); // refresh server component
    } else {
      alert(data.message);
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="bg-red-500 text-white px-3 py-1 rounded text-sm"
    >
      Delete
    </button>
  );
}
