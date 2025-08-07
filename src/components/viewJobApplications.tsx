'use client'
import { useContext, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { LoaderPinwheelIcon } from "lucide-react";
import { Application, Company, Openings, User } from "../../generated/prisma";
import { UserContext } from "@/app/(protected)/layout";
import DeleteApplicationBtn from "./deleteApplicationBtn";

export default function ViewJobApplications({ job, refreshTrigger }:{
    job: Openings& {company: Company}
    refreshTrigger?: number
}) {
    const {user} = useContext(UserContext);
    const [applicants, setApplicants] = useState<(Application & {user: User})[]>([]);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        async function getApplications() {
            setLoading(true);
            try {
                const res = await fetch("/api/applicants/" + job.id);
                const data = await res.json();
                if (data.success) {
                    setApplicants(data?.data);
                }
            } catch (error) {
                console.error("Error fetching applications:", error);
            } finally {
                setLoading(false);
            }
        }
        getApplications();
    }, [job.id, refreshTrigger]);

    const handleDeleteSuccess = (deletedApplicationId: string) => {
        setApplicants(prev => prev.filter(app => app.id !== deletedApplicationId));
    };

    if(user?.company.id!=job.company_id)return null;
    
    return (
        <Dialog>
            <DialogTrigger>view job applicants</DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Job Applicants</DialogTitle>
                    <DialogDescription>
                        {loading && <LoaderPinwheelIcon className="animate-spin"/>}
                        {applicants.length === 0 && !loading && (
                            <span className="text-muted-foreground">No applicants yet</span>
                        )}
                    </DialogDescription>
                </DialogHeader>
                <div className="mt-4 space-y-3">
                    {applicants.map(application => {
                        return (
                            <Card key={application.id} className="p-4">
                                <div className="flex justify-between items-center">
                                    <div className="flex-1">
                                        <Badge className="mb-2">{application.user.email}</Badge>
                                        <p className="text-sm text-muted-foreground">
                                            Applied on {new Date(application.id).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <DeleteApplicationBtn 
                                        applicationId={application.id}
                                        onDeleteSuccess={() => handleDeleteSuccess(application.id)}
                                        variant="outline"
                                        size="sm"
                                        className="text-destructive hover:text-destructive"
                                    />
                                </div>
                            </Card>
                        );
                    })}
                </div>
            </DialogContent>
        </Dialog>
    )
}