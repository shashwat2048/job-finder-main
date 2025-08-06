'use client'
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FormEvent, useContext, useState } from "react";
import { Job } from "../../../../generated/prisma";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { UserContext } from "../layout";
import { Loading } from "@/components/ui/loading";
import { useRouter } from "next/navigation";

export default function Page() {
    const [jobTitle, setJobTitle] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [jobLocation, setJobLocation] = useState("");
    const [jobSalary, setJobSalary] = useState("");
    const [jobType, setJobType] = useState("part-time");
    const [employmentType, setEmploymentType] = useState("on-site");
    const [loading, setLoading] = useState(false);
    const { user } = useContext(UserContext)
    const router = useRouter();
    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setLoading(true);
        if (!user) {
            toast.error("User not found. Please log in.");
            setLoading(false);
            return;
        }
        const jSalary = parseInt(jobSalary);
        const data = {
            title: jobTitle,
            description: jobDescription,
            location: jobLocation,
            salary: jSalary,
            job_type: jobType,
            employment_type: employmentType,
            company_id: user.company.id
        }

        const resp = await fetch("http://localhost:3000/api/job", {
            method: "POST",
            body: JSON.stringify(data)
        });

        const respData = await resp.json();
        if (respData.success) {
            toast.success("Job added!");
            router.push("/jobs");
        } else {
            toast.error("Can't add job!");
        }
        setLoading(false);
    }

    return (
        <main className="h-full w-full flex justify-center items-center mt-10">
            <form onSubmit={handleSubmit} className="w-3xl bg-muted p-5 rounded-md flex flex-col gap-5">
                <h2>Job Details</h2>
                <Input
                    type="text"
                    placeholder="enter job title..."
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                />
                <Textarea
                    placeholder="enter job description..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                />
                <Input
                    type="text"
                    placeholder="enter job location..."
                    value={jobLocation}
                    onChange={(e) => setJobLocation(e.target.value)}
                />
                <Input
                    type="number"
                    placeholder="enter job salary..."
                    value={jobSalary}
                    onChange={(e) => setJobSalary(e.target.value)}
                />
                <Select value={employmentType} onValueChange={setEmploymentType}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Employment Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="full-time">Full Time</SelectItem>
                        <SelectItem value="part-time">Part Time</SelectItem>
                        <SelectItem value="contractor">Contractor</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={jobType} onValueChange={setJobType}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Job Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="on-site">On Site</SelectItem>
                        <SelectItem value="remote">Remote</SelectItem>
                    </SelectContent>
                </Select>
                <Button disabled={loading} type="submit" variant="default">
                    {loading ? <Loading size="sm" text="Adding..." /> : "Add"}
                </Button>
            </form>
        </main>
    )
}