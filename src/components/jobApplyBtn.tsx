'use client'
import { Send, Check } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Openings } from "../../generated/prisma";
import { useState, useEffect } from "react";
import { useContext } from "react";
import { UserContext } from "@/app/(protected)/layout";
import { Loading } from "./ui/loading";

export default function JobApplyButton({ 
    job, 
    hasApplied: initialHasApplied = false,
    onApplicationSuccess 
}: {
    job: Openings
    hasApplied?: boolean
    onApplicationSuccess?: () => void
}) {
    const [loading, setLoading] = useState(false);
    const [hasApplied, setHasApplied] = useState(initialHasApplied);
    const { user } = useContext(UserContext);

    async function handleSubmit() {
        setLoading(true);
        try {
            const res = await fetch(`/api/job/apply/${job.id}`, {
                method: 'POST',
                body: JSON.stringify({ jobId: job.id }),
            });

            const data = await res.json();

            if (data.success) {
                toast.success(data.message || "Applied successfully");
                setHasApplied(true);
                onApplicationSuccess?.();
            } else {
                toast.error(data.message || "Can't apply for the Job");
            }
        } catch (error) {
            console.error(error);
            toast.error("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    }   

    if (hasApplied) {
        return (
            <Button variant="outline" className="flex" disabled>
                <Check className="h-4 w-4" />
                Applied
            </Button>
        );
    }

    return (
        <Button 
            variant="secondary" 
            className="flex"
            onClick={handleSubmit}
            disabled={loading}
        >
            {loading ? <Loading size="sm" text="Applying..." /> : (
                <>
                    <Send />
                    Apply
                </>
            )}
        </Button>
    )
}