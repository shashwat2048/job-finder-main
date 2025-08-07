'use client'
import { Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useState, useContext } from "react";
import { UserContext } from "@/app/(protected)/layout";
import { Loading } from "./ui/loading";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";

interface DeleteApplicationBtnProps {
    applicationId: string;
    onDeleteSuccess?: () => void;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    size?: "default" | "sm" | "lg" | "icon";
    className?: string;
}

export default function DeleteApplicationBtn({ 
    applicationId, 
    onDeleteSuccess,
    variant = "destructive",
    size = "sm",
    className = ""
}: DeleteApplicationBtnProps) {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const { user } = useContext(UserContext);

    async function handleDelete() {
        setLoading(true);
        try {
            const res = await fetch(`/api/applicants/${applicationId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: applicationId }),
            });

            const data = await res.json();

            if (data.success) {
                toast.success(data.data || "Application deleted successfully");
                onDeleteSuccess?.();
                setOpen(false);
            } else {
                toast.error(data.data || "Failed to delete application");
            }
        } catch (error) {
            console.error(error);
            toast.error("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button 
                    variant={variant} 
                    size={size}
                    className={className}
                    disabled={loading}
                >
                    {loading ? (
                        <Loading size="sm" text="Deleting..." />
                    ) : (
                        <>
                            <Trash2 className="h-4 w-4" />
                            Delete
                        </>
                    )}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Application</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this application? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button 
                        variant="outline" 
                        onClick={() => setOpen(false)}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button 
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={loading}
                    >
                        {loading ? <Loading size="sm" text="Deleting..." /> : "Delete"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
