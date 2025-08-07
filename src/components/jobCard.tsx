'use client'
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Building2, Clock } from "lucide-react";
import Link from "next/link";
import { Openings, Company } from "../../generated/prisma";
import SaveJobBtn from "./saveJobBtn";
import { useState, useEffect } from "react";

type OpeningWithCompany = Openings & { company: Company };

export default function JobCard({ job }: { job: OpeningWithCompany }) {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    async function checkIfSaved() {
      try {
        const res = await fetch(`/api/job/save/${job.id}`, {
          method: 'GET'
        });
        const data = await res.json();
        if (data.success) {
          setIsSaved(data.isSaved || false);
        }
      } catch (error) {
        console.error("Error checking saved status:", error);
      }
    }
    checkIfSaved();
  }, [job.id]);

  const handleSaveSuccess = () => {
    setIsSaved(!isSaved);
  };

  return (
    <Card className="card-shadow w-full h-full flex flex-col group hover:scale-[1.02] transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold line-clamp-2 mb-2 group-hover:text-primary transition-colors">
              {job.title}
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <Building2 className="h-4 w-4" />
              <span className="truncate font-medium">{job.company.title}</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 items-end">
            <Badge variant="outline" className="shrink-0 border-primary/20 text-primary">
              {job.job_type}
            </Badge>
            <div onClick={(e) => e.stopPropagation()}>
              <SaveJobBtn 
                job={job}
                isSaved={isSaved}
                onSaveSuccess={handleSaveSuccess}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
              />
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 pb-4">
        <CardDescription className="line-clamp-3 mb-4 text-muted-foreground">
          {job.description}
        </CardDescription>
        
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-primary/60" />
            <span className="text-muted-foreground">{job.location}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold text-primary">₹{job.salary.toLocaleString()}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-primary/60" />
            <span className="text-muted-foreground capitalize">{job.employment_type}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0">
        <div className="flex items-center gap-2 w-full">
          <Button asChild className="flex-1 bg-primary hover:bg-primary/90">
            <Link href={`/jobs/${job.id}`}>
              View Details
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}