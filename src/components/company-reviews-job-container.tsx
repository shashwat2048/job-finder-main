'use client'
import { Heart, MessageCircle, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import AddReviewForm from "./addReviewForm";
import JobCard from "./jobCard";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Company, Job, Review, User, Openings } from "../../generated/prisma";
import DeleteReviewButton from "./deleteReviewBtn";
import { Loading } from "./ui/loading";

type OpeningWithCompany = Openings & { company: Company };

export default function CompanyReviewsAndJobContainer({ user_id, company_id }:
    { user_id: string, company_id: string }
) {
    const [listedJobs, setListedJobs] = useState<OpeningWithCompany[]>([]);
    const [reviews, setReviews] = useState<(Review&{user: User})[]>([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        async function getListedJobs() {
            try{
                setLoading(true);
                const jobsRes = await fetch("http://localhost:3000/api/company/openings/" + company_id);
                const data = await jobsRes.json();
                setListedJobs(data.data);
            }catch(err){
                console.error("Error Occured!");
            }finally{
                setLoading(false);
            }
        }
        async function getReviews() {
            try{
                setLoading(true);
            const reviewsRes = await fetch("http://localhost:3000/api/company/review/" + company_id);
            const data = await reviewsRes.json();
            setReviews(data.data);
                        }catch(err){
                console.error("Error Occured!");
            }finally{
                setLoading(false);
            }
        }
        getReviews();
        getListedJobs();
    }, [])
    return (
        <Tabs defaultValue="account" className="w-full">
            <TabsList>
                <TabsTrigger value="account">Listed Jobs</TabsTrigger>
                <TabsTrigger value="password">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="account" className="w-full grid sm:grid-cols-2 gap-5">
                {
                    listedJobs.map(job => {
                        return <JobCard key={job.id} job={job} />
                    })
                }
            </TabsContent>
            {loading && <div className="h-full w-full flex justify-center items-center mt-10"><Loading size="lg" text="Loading..." /></div>}
            <TabsContent value="password" className="w-full flex flex-col gap-5">
                <AddReviewForm user_id={user_id} company_id={company_id} />
                <h2>All Reviews</h2>
                <section className="flex flex-col gap-3">
                    {
                        reviews.map(rev => {
                            return (
                                <Card key={rev.id}>
                                    <CardHeader>
                                        <CardTitle >
                                            <Badge>{rev.user.email}</Badge>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-lg">
                                    {rev.content}
                                    </CardContent>
                                    <CardFooter className="flex gap-2 justify-between items-center">
                                        <div className="flex gap-2">
                                        <DeleteReviewButton 
                                            reviewId={rev.id} 
                                            reviewUserId={rev.user_id} 
                                        />
                                        </div>
                                    </CardFooter>
                                </Card>
                            )
                        })
                    }
                </section>
            </TabsContent>
        </Tabs>
    )
}