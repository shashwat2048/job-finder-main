import db from "@/services/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, User } from "lucide-react";
import Link from "next/link";

export default async function CompaniesPage(){
    const companies = await db.company.findMany({
        include: {
            owner: true
        }
    });
    
    return (
        <div className="container-padding section-spacing">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">All Companies</h1>
                    <p className="text-muted-foreground">Discover companies and their job opportunities</p>
                </div>
                
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {companies.map(comp => (
                        <Card key={comp.id} className="card-shadow group hover:scale-[1.02] transition-all duration-300">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <CardTitle className="text-lg mb-2 group-hover:text-primary transition-colors">{comp.title}</CardTitle>
                                        <CardDescription className="line-clamp-2 text-muted-foreground">
                                            {comp.description}
                                        </CardDescription>
                                    </div>
                                    <Badge variant="outline" className="shrink-0 border-primary/20 text-primary">
                                        <Building2 className="h-3 w-3 mr-1" />
                                        Company
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <User className="h-4 w-4 text-primary/60" />
                                    <span>CEO: {comp.owner.email}</span>
                                </div>
                            </CardContent>
                            <CardContent className="pt-0">
                                <Link 
                                    href={`/company/${comp.id}`}
                                    className="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
                                >
                                    View Company →
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                
                {companies.length === 0 && (
                    <div className="text-center py-12">
                        <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No companies found</h3>
                        <p className="text-muted-foreground">Companies will appear here once they're added.</p>
                    </div>
                )}
            </div>
        </div>
    )
}