import JobCard from "@/components/jobCard";
import { Company, Job, Openings } from "../../../../generated/prisma";
export default async function JobsPage({ searchParams }: {
    searchParams: Promise<{
        q: string,
        jt: string,
        et: string,
        ms: string,
        page: string,
    }>
}) {
    const params = await searchParams;
    const q = params.q;
    const jt = params.jt;
    const et = params.et;
    const ms = params.ms;
    const page = params.page || 1;
    const queryparams = new URLSearchParams();
    if(q) queryparams.append('q',q);
    if(jt) queryparams.append('jt',jt);
    if(et) queryparams.append('et',et);
    if(ms) queryparams.append('ms',ms.toString());
    if(page!==1) queryparams.append('page', page.toString());
    const res = await fetch(`http://localhost:3000/api/search?${queryparams.toString()}`)
    const data = await res.json();
    let jobs:(Openings&{company: Company})[] =[];
    if(data.success){
        jobs=data.data
    }
    // console.log(jobs)
    return (
        <main className="p-5">
            <section className="w-full grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {
                    jobs.map(job => {
                        return <div key={job.id}>
                            <JobCard job={job} />
                        </div>
                    })
                }
            </section>
            {/* <NextButton /> */}
        </main>
    )
}