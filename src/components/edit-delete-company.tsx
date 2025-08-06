'use client'
import { UserContext } from "@/app/(protected)/layout";
import { useContext } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Openings, Company } from "../../generated/prisma";
import { EditJobDialog } from "./editJobButton";

type OpeningWithCompany = Openings & { company: Company };

export default function EditDelete({ job }:{
    job: OpeningWithCompany
}) {
    const { user } = useContext(UserContext);

    async function handleDelete() {
        try {
            const res = await fetch("/api/job/" + job.id, {
                method: "DELETE"
            });
            const data = await res.json();
            if (data.success) {
                toast.success(data.message);
                window.location.reload();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Error occurred!");
        }
    }

    if (user?.company?.id == job?.company?.id) {
        return (
            <div className="flex gap-2">
                <EditJobDialog job={job} onJobUpdated={() => window.location.reload()} />
                <Button variant="destructive" size="sm" onClick={handleDelete}>
                    Delete
                </Button>
            </div>
        )
    } else return null;
}