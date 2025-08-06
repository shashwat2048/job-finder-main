'use client';
import { UserContext } from "@/app/(protected)/layout";
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useContext, useState, useEffect } from "react";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "sonner";
import { Loading } from "./ui/loading";
import { Openings, Company } from "../../generated/prisma";

type OpeningWithCompany = Openings & { company: Company };

interface EditJobDialogProps {
  job: OpeningWithCompany;
  onJobUpdated?: () => void;
}

export function EditJobDialog({ job, onJobUpdated }: EditJobDialogProps) {
    const [jobTitle, setJobTitle] = useState(job.title);
    const [jobDescription, setJobDescription] = useState(job.description);
    const [jobLocation, setJobLocation] = useState(job.location);
    const [jobSalary, setJobSalary] = useState(job.salary.toString());
    const [jobType, setJobType] = useState(job.job_type);
    const [employmentType, setEmploymentType] = useState(job.employment_type);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const { user } = useContext(UserContext);

    // Reset form when job changes
    useEffect(() => {
        setJobTitle(job.title);
        setJobDescription(job.description);
        setJobLocation(job.location);
        setJobSalary(job.salary.toString());
        setJobType(job.job_type);
        setEmploymentType(job.employment_type);
    }, [job]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`/api/job/${job.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: jobTitle,
                    description: jobDescription,
                    location: jobLocation,
                    salary: parseInt(jobSalary),
                    job_type: jobType,
                    employment_type: employmentType,
                }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success("Job updated successfully!");
                setOpen(false);
                onJobUpdated?.();
            } else {
                toast.error(data.message || "Failed to update job");
            }
        } catch (error) {
            console.error('Error updating job:', error);
            toast.error("An error occurred while updating the job");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="default" size="sm" className="ml-5">
                    Edit Job
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Edit Job Details</DialogTitle>
                    <DialogDescription>
                        Update the job information below
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Job Title</Label>
                        <Input
                            id="title"
                            type="text"
                            placeholder="Enter job title..."
                            value={jobTitle}
                            onChange={(e) => setJobTitle(e.target.value)}
                            required
                            className="focus:ring-2 focus:ring-primary/20"
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="description">Job Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Enter job description..."
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            required
                            className="focus:ring-2 focus:ring-primary/20"
                            rows={4}
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input
                                id="location"
                                type="text"
                                placeholder="Enter job location..."
                                value={jobLocation}
                                onChange={(e) => setJobLocation(e.target.value)}
                                required
                                className="focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="salary">Salary (₹)</Label>
                            <Input
                                id="salary"
                                type="number"
                                placeholder="Enter salary..."
                                value={jobSalary}
                                onChange={(e) => setJobSalary(e.target.value)}
                                required
                                className="focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="employmentType">Employment Type</Label>
                            <Select value={employmentType} onValueChange={setEmploymentType}>
                                <SelectTrigger className="focus:ring-2 focus:ring-primary/20">
                                    <SelectValue placeholder="Employment Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="full-time">Full Time</SelectItem>
                                    <SelectItem value="part-time">Part Time</SelectItem>
                                    <SelectItem value="contractor">Contractor</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="jobType">Job Type</Label>
                            <Select value={jobType} onValueChange={setJobType}>
                                <SelectTrigger className="focus:ring-2 focus:ring-primary/20">
                                    <SelectValue placeholder="Job Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="on-site">On Site</SelectItem>
                                    <SelectItem value="remote">Remote</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button 
                            type="submit" 
                            disabled={loading}
                            className="bg-primary hover:bg-primary/90"
                        >
                            {loading ? <Loading size="sm" text="Updating..." /> : "Update Job"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
