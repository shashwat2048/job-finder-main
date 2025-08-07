'use client'
import { Save, Bookmark } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Openings } from "../../generated/prisma";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "@/app/(protected)/layout";
import { Loading } from "./ui/loading";

interface SaveJobBtnProps {
    job: Openings;
    isSaved?: boolean;
    onSaveSuccess?: () => void;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    size?: "default" | "sm" | "lg" | "icon";
    className?: string;
}

export default function SaveJobButton({ 
    job, 
    isSaved: initialIsSaved = false,
    onSaveSuccess,
    variant = "default",
    size = "sm",
    className = ""
}: SaveJobBtnProps) {
    const [loading, setLoading] = useState(false);
    const [isSaved, setIsSaved] = useState(initialIsSaved);
    const { user } = useContext(UserContext);

    async function handleSave() {
        if (!user) {
            toast.error("Please log in to save jobs");
            return;
        }

        setLoading(true);
        try {
            const method = isSaved ? 'DELETE' : 'POST';
            const res = await fetch(`/api/job/save/${job.id}`, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const data = await res.json();

            if (data.success) {
                setIsSaved(!isSaved);
                toast.success(data.message || (isSaved ? "Job removed from saved jobs" : "Job saved successfully"));
                onSaveSuccess?.();
            } else {
                toast.error(data.message || "Failed to save job");
            }
        } catch (error) {
            console.error(error);
            toast.error("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Button 
            variant={variant}
            size={size}
            className={className}
            onClick={handleSave}
            disabled={loading}
        >
            {loading ? (
                <Loading size="sm" text={isSaved ? "Removing..." : "Saving..."} />
            ) : (
                <>
                    {isSaved ? <Bookmark className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                    {size !== "icon" && (isSaved ? "Saved" : "Save")}
                </>
            )}
        </Button>
    );
}
