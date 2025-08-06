"use client"
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
import { useContext } from "react";
import { UserContext } from "@/app/(protected)/layout";

export default function DeleteReviewButton({ reviewId, reviewUserId }: {
    reviewId: string;
    reviewUserId: string;
}) {
    const { user } = useContext(UserContext);
    if (user?.id !== reviewUserId) {
        return null;
    }

    async function handleDelete() {
        try {
            const res = await fetch(`/api/company/review?id=${reviewId}`, {
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
            toast.error("Failed to delete review");
        }
    }

    return (
        <Button 
            variant="destructive" 
            size="sm"
            onClick={handleDelete}
            className="flex items-center gap-1"
        >
            <Trash2 className="h-4 w-4" />
            Delete
        </Button>
    );
} 