"use client"
import EditDelete from "@/components/edit-delete-company";
import JobApplyButton from "@/components/jobApplyBtn";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import ViewJobApplications from "@/components/viewJobApplications";
import { MapPin, Save, Send } from "lucide-react";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { LoadingPage } from "@/components/ui/loading";

export default function Page() {
    const params = useParams();
    const id = params.id as string;
    const [job, setJob] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        async function fetchJob() {
            try {
                const res = await fetch("/api/job/" + id);
                const data = await res.json();
                if (data.success) {
                    setJob(data.data);
                }
            } catch (error) {
                console.error("Error fetching job:", error);
            } finally {
                setLoading(false);
            }
        }

        if (id) {
            fetchJob();
        }
    }, [id]);

    const handleApplicationSuccess = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    if (loading) {
        return <LoadingPage />;
    }

    if (!job) {
        return <p className="p-5">No data found!</p>;
    }

    return (
        <main className="p-5">
            <Card className="h-full w-full shadow-md">
                <CardHeader>
                    <div className="flex gap-5">
                        <CardTitle className="font-semibold text-2xl">{job.title}</CardTitle>

                        <div className="ml-auto flex gap-3 items-center">
                            <Button variant="secondary" className="flex"><Save />Save</Button>
                            <JobApplyButton job={job} onApplicationSuccess={handleApplicationSuccess}/>
                            <ViewJobApplications job={job} refreshTrigger={refreshTrigger}/>

                        </div>
                    </div>
                    <p className="flex gap-2 text-sm"><span><MapPin size={20} /></span>{job.location}</p>
                    <p>Salary <span>₹{job.salary}</span></p>
                    <Badge variant="default" className="h-fit w-fit mt-2">{job.job_type}</Badge>
                </CardHeader>
                <CardContent>
                    <CardDescription className=" text-sm tracking-wide">{job.description}</CardDescription>
                </CardContent>
                <CardFooter>
                    <p>{job.company.title}</p>
                </CardFooter>
                <EditDelete job={job}/>
            </Card>
        </main>
    )
}