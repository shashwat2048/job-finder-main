
"use client"

import CompanyReviewsAndJobContainer from "@/components/company-reviews-job-container";
import DeleteCompanyButton from "@/components/deleteCompanyBtn";
import { LoadingPage } from "@/components/ui/loading";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function Page() {
    const params = useParams();
    const id = params.id as string;
    const [company, setCompany] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchCompany() {
            try {
                const res = await fetch("/api/company/" + id);
                const data = await res.json();

                if (!data.success) {
                    toast.error(data.message);
                    setError("No data found!");
                    return;
                }
                setCompany(data.data);
            } catch (error) {
                toast.error("Failed to load company data");
                setError("Failed to load company data");
            } finally {
                setLoading(false);
            }
        }

        if (id) {
            fetchCompany();
        }
    }, [id]);

    if (loading) {
        return <LoadingPage />;
    }

    if (error || !company) {
        return <p className="p-5">{error || "No data found!"}</p>;
    }

    const owner = company.owner;

    return (
        <main className="flex flex-col gap-5 p-5">
            <section className="bg-muted p-5 rounded-md flex flex-col gap-2">
                <h2 className="text-xl font-medium">{company.title}</h2>
                <p className="font-medium text-muted-foreground">{company.description}</p>

                <hr />

                <h2 className="text-muted-foreground">Owner : <span className="text-foreground">{owner.email}</span></h2>
                <DeleteCompanyButton id={owner.id} />
            </section>
            <CompanyReviewsAndJobContainer user_id={owner.id} company_id={company.id} />
        </main>
    )
}