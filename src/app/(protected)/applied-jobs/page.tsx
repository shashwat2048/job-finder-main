'use client'
import { useEffect, useState } from "react";
import JobCard from "@/components/jobCard";
import { Loading } from "@/components/ui/loading";
import DeleteApplicationBtn from "@/components/deleteApplicationBtn";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Building } from "lucide-react";

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

    const handleDeleteSuccess = (deletedApplicationId: string) => {
        setAppliedJobs(prev => prev.filter(job => job.id !== deletedApplicationId));
    };

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
                    <Card key={application.id} className="h-full">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="font-semibold text-xl">
                                        {application.job.title}
                                    </CardTitle>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Building className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground">
                                            {application.job.company.title}
                                        </span>
                                    </div>
                                </div>
                                <DeleteApplicationBtn 
                                    applicationId={application.id}
                                    onDeleteSuccess={() => handleDeleteSuccess(application.id)}
                                    variant="outline"
                                    size="sm"
                                    className="text-destructive hover:text-destructive"
                                />
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{application.job.location}</span>
                            </div>
                            <div className="flex gap-2 mt-2">
                                <Badge variant="secondary">{application.job.job_type}</Badge>
                                <Badge variant="outline">{application.job.employment_type}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground line-clamp-3">
                                {application.job.description}
                            </p>
                            <p className="font-semibold mt-2">₹{application.job.salary.toLocaleString()}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}