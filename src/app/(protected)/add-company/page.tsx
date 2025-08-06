'use client'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { FormEvent, useState, useContext } from "react";
import { toast } from "sonner";
import { Loading } from "@/components/ui/loading";
import { UserContext } from "../layout";

export default function Page() {
    const [name, setName]= useState("");
    const [description, setDescription]= useState("");
    const [loading, setLoading]=useState(false);
    const router = useRouter();
    const { setUser } = useContext(UserContext);

    async function handleSubmit(e:FormEvent){
        e.preventDefault();
        setLoading(true);

        try {
            const company = {
                name, 
                description
            }
            const res = await fetch("http://localhost:3000/api/company",{
                method:"POST",
                body: JSON.stringify(company)
            })
            const data = await res.json();
            
            if(data.success){
                toast.success("Company added successfully!");
                
                // Refresh user context to include the new company
                const userRes = await fetch("http://localhost:3000/api/current-user");
                const userData = await userRes.json();
                if(userData.success && setUser) {
                    setUser(userData.data);
                }
                
                // Redirect to jobs page
                router.push("/jobs");
            }else{
                toast.error(data.message || "Failed to add company");
            }
        } catch (error) {
            toast.error("Something went wrong!");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="h-full w-full flex justify-center items-center mt-10">
            <form onSubmit={handleSubmit} className="w-3xl bg-muted p-5 rounded-md flex flex-col gap-5">
                <h2>Company Details</h2>
                <Input
                    type="text"
                    placeholder="enter company title..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <Textarea
                    placeholder="enter company description..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <Button disabled={loading} type="submit" variant="default">
                    {loading ? <Loading size="sm" text="Adding..." /> : "Add"}
                </Button>
            </form>
        </main>
    )
}