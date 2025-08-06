'use client'

import { FormEvent, useState } from "react"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import { toast } from "sonner";
import { Loading } from "./ui/loading";

export default function AddReviewForm({ user_id, company_id }:
    { user_id: string, company_id: string }) {
    const [review, setReview] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setLoading(true);
        
        try {
            const newReview = {
                content: review,
                user_id,
                company_id
            }
            const res = await fetch(`http://localhost:3000/api/company/review/${company_id}`, {
                method: "POST",
                body: JSON.stringify(newReview)
            });
            const data = await res.json();
            
            if (!data.success) {
                toast.error(data.message);
            } else {
                setReview("");
                toast.success("Review added!");
                window.location.reload();
            }
        } catch (error) {
            toast.error("Failed to add review");
        } finally {
            setLoading(false);
        }
    }
    return (
        <form onSubmit={handleSubmit} className="w-3xl bg-muted p-5 rounded-md flex flex-col gap-5">
            <h2>Give Review</h2>
            <Textarea
                placeholder="enter company review..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
            />
            <Button disabled={loading} type="submit" variant="default">
                {loading ? <Loading size="sm" text="Adding..." /> : "Add"}
            </Button>
        </form>
    )
}