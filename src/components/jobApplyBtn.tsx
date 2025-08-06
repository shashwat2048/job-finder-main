'use client'
import { Send, Check } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Openings } from "../../generated/prisma";
import { useState, useEffect } from "react";
import { useContext } from "react";
import { UserContext } from "@/app/(protected)/layout";
import { Loading } from "./ui/loading";

export default function JobApplyButton({ job, onApplicationSuccess }:{
    job: Openings
    onApplicationSuccess?: () => void
}) {
    const [loading, setLoading] = useState(false);
    const [hasApplied, setHasApplied] = useState(false);
    const [checkingStatus, setCheckingStatus] = useState(true);
    const { user } = useContext(UserContext);
    
    useEffect(() => {
        async function checkApplicationStatus() {
            if (!user) {
                setCheckingStatus(false);
                return;
            }

            try {
                const res = await fetch(`/api/job/apply/${job.id}/status`);
                const data = await res.json();
                setHasApplied(data.hasApplied);
            } catch (error) {
                console.error("Error checking application status:", error);
            } finally {
                setCheckingStatus(false);
            }
        }

        checkApplicationStatus();
    }, [job.id, user]);

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
                // Call the success callback to refresh applications list
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

    if (checkingStatus) {
        return (
            <Button variant="secondary" className="flex" disabled>
                <Loading size="sm" text="Checking..." />
            </Button>
        );
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