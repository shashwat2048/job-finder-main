"use client"
import { toast } from "sonner";
import { Button } from "./ui/button";

export default function DeleteCompanyButton({ id }: {id: string}) {
    async function handleDelete() {
        const res = await fetch("http://localhost:3000/api/company/" + id, {
            method: "DELETE"
        }
        );

        const data = await res.json();

        if (data.success) {
            toast.success(data.message);
            window.location.href="/";
        } else {
            toast.error(data.message)
        }
    }
    return (
        <Button variant="destructive" className="w-fit" onClick={handleDelete}>delete company</Button>
    )
}