'use client'
import { useEffect, useState } from "react";
import { Loading } from "@/components/ui/loading";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Building, Bookmark } from "lucide-react";
import SaveJobBtn from "@/components/saveJobBtn";
import { useRouter } from "next/navigation";

type SavedJob = {
    id: string;
    created_at: string;
    job: {
        id: string;
        title: string;
        description: string;
        location: string;
        salary: number;
        employment_type: string;
        job_type: string;
        company: {
            id: string;
            title: string;
            description: string;
        };
    };
};

export default function SavedJobs() {
    const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        async function fetchSavedJobs() {
            try {
                const res = await fetch("/api/savedjobs");
                const data = await res.json();
                if (data.success) {
                    setSavedJobs(data.data);
                }
            } catch (err) {
                console.error("Error fetching saved jobs:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchSavedJobs();
    }, []);

    const handleSaveSuccess = (jobId: string) => {
        setSavedJobs(prev => prev.filter(savedJob => savedJob.job.id !== jobId));
    };

    const handleJobClick = (jobId: string) => {
        router.push(`/jobs/${jobId}`);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loading />
            </div>
        );
    }

    if (savedJobs.length === 0) {
        return (
            <div className="flex flex-col justify-center items-center h-screen gap-4">
                <Bookmark className="h-16 w-16 text-muted-foreground" />
                <h1 className="text-2xl font-bold">No saved jobs</h1>
                <p className="text-muted-foreground">Jobs you save will appear here</p>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-2xl font-bold p-5">Saved Jobs</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
                {savedJobs.map((savedJob) => (
                    <Card 
                        key={savedJob.id} 
                        className="h-full cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => handleJobClick(savedJob.job.id)}
                    >
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <CardTitle className="font-semibold text-xl">
                                        {savedJob.job.title}
                                    </CardTitle>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Building className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground">
                                            {savedJob.job.company.title}
                                        </span>
                                    </div>
                                </div>
                                <div onClick={(e) => e.stopPropagation()}>
                                    <SaveJobBtn 
                                        job={savedJob.job}
                                        isSaved={true}
                                        onSaveSuccess={() => handleSaveSuccess(savedJob.job.id)}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{savedJob.job.location}</span>
                            </div>
                            <div className="flex gap-2 mt-2">
                                <Badge variant="secondary">{savedJob.job.job_type}</Badge>
                                <Badge variant="outline">{savedJob.job.employment_type}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground line-clamp-3">
                                {savedJob.job.description}
                            </p>
                            <p className="font-semibold mt-2">₹{savedJob.job.salary.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground mt-2">
                                Saved on {new Date(savedJob.created_at).toLocaleDateString()}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
