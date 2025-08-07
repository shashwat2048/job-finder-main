'use client'
import { useEffect, useState } from "react";
import JobCard from "@/components/jobCard";
import { Loading } from "@/components/ui/loading";

type AppliedJob = {
    id: string;
    user_id: string;
    job_id: string;
    job: {
        id: string;
        title: string;
        description: string;
        location: string;
        salary: number;
        employment_type: string;
        job_type: string;
        company_id: string;
        company: {
            id: string;
            title: string;
            description: string;
            ownerId: string;
        };
    };
};

export default function AppliedJobs() {
    const [appliedJobs, setAppliedJobs] = useState<AppliedJob[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchAppliedJobs() {
            try {
                const res = await fetch("/api/appliedjobs");
                const data = await res.json();
                if (data.success) {
                    setAppliedJobs(data.data);
                }
            } catch (err) {
                console.error("Error fetching applied jobs:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchAppliedJobs();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loading />
            </div>
        );
    }

    if (appliedJobs.length === 0) {
        return (
            <div className="flex justify-center items-center h-screen">
                <h1>No applied jobs.</h1>    
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-2xl font-bold p-5">Applied Jobs</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
                {appliedJobs.map((application) => (
                    <JobCard key={application.id} job={application.job} />
                ))}
            </div>
        </div>
    );
}