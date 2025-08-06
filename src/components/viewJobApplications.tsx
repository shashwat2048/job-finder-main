'use client'
import { useContext, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { LoaderPinwheelIcon } from "lucide-react";
import { Application, Company, Openings, User } from "../../generated/prisma";
import { UserContext } from "@/app/(protected)/layout";

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

    if(user?.company.id!=job.company_id)return null;
    
    return (
        <Dialog>
            <DialogTrigger>view job applicants</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Job Applicants</DialogTitle>
                    <DialogDescription>
                        {loading && <LoaderPinwheelIcon className="animate-spin"/>}
                        {applicants.length === 0 && !loading && (
                            <span className="text-muted-foreground">No applicants yet</span>
                        )}
                    </DialogDescription>
                </DialogHeader>
                <div className="mt-4">
                    {applicants.map(application => {
                        return <Card key={application.id} className="p-3 mb-2">
                            <Badge className="ml-3">{application.user.email}</Badge>
                        </Card>
                    })}
                </div>
            </DialogContent>
        </Dialog>
    )
}