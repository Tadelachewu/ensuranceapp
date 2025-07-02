import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Car, FilePlus, Home, ShieldCheck, UserCheck, HelpCircle, HeartPulse, type LucideProps } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getPoliciesByUserId } from "@/services/policyService";
import { getRecentActivitiesByUserId } from "@/services/activityService";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

const iconMap: { [key: string]: React.FC<LucideProps> } = {
  FilePlus,
  ShieldCheck,
  UserCheck,
  HeartPulse,
};

export default async function DashboardPage() {
  const policies = await getPoliciesByUserId();
  const recentActivities = await getRecentActivitiesByUserId();

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <PageHeader
        title="Welcome Back, Alex!"
        description="Here’s a summary of your insurance portfolio."
      >
        <Button asChild>
          <Link href="/policies">Get a New Policy</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/claims">File a Claim</Link>
        </Button>
      </PageHeader>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Your Policies</CardTitle>
            <CardDescription>
              An overview of your active and pending insurance policies.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Policy ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Next Payment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {policies.length > 0 ? policies.map((policy) => (
                  <TableRow key={policy.id}>
                    <TableCell className="font-medium">{policy.id}</TableCell>
                    <TableCell>{policy.type} Insurance</TableCell>
                    <TableCell>
                      <Badge variant={policy.status === "Active" ? "default" : "secondary"} className={policy.status === "Active" ? "bg-green-100 text-green-800" : ""}>
                        {policy.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                        {policy.premium > 0 && policy.nextDueDate ? 
                            `$${policy.premium.toFixed(2)} on ${format(new Date(policy.nextDueDate), "LLL dd, y")}` :
                            'N/A'
                        }
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center h-24">No policies found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest updates on your account and policies.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
                {recentActivities.length > 0 ? recentActivities.map((activity) => {
                    const IconComponent = iconMap[activity.iconName] || HelpCircle;
                    return (
                        <div key={activity.id} className="flex items-start gap-4">
                            <div className="bg-muted rounded-full p-2">
                                <IconComponent className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">{activity.description}</p>
                                <p className="text-xs text-muted-foreground">{format(new Date(activity.activityDate), "LLL dd, y")}</p>
                            </div>
                        </div>
                    )
                }) : (
                    <div className="text-center text-muted-foreground p-8 border-2 border-dashed rounded-lg">
                        <p>No recent activity.</p>
                    </div>
                )}
            </div>
          </CardContent>
        </Card>
      </div>

       <Card>
        <CardHeader>
            <CardTitle>Explore Our Products</CardTitle>
            <CardDescription>Find the perfect coverage for your needs.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Link href="/policies/auto" className="group">
                <Card className="hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-4 flex flex-col items-center text-center">
                        <Car className="h-10 w-10 mb-4 text-primary"/>
                        <h3 className="font-semibold mb-1">Auto Insurance</h3>
                        <p className="text-sm text-muted-foreground">Protection for you and your vehicle on the road.</p>
                    </CardContent>
                </Card>
            </Link>
            <Link href="/policies/home" className="group">
                <Card className="hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-4 flex flex-col items-center text-center">
                        <Home className="h-10 w-10 mb-4 text-primary"/>
                        <h3 className="font-semibold mb-1">Home Insurance</h3>
                        <p className="text-sm text-muted-foreground">Secure your home and belongings from the unexpected.</p>
                    </CardContent>
                </Card>
            </Link>
             <Link href="/policies/life" className="group">
                <Card className="hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-4 flex flex-col items-center text-center">
                        <UserCheck className="h-10 w-10 mb-4 text-primary"/>
                        <h3 className="font-semibold mb-1">Life Insurance</h3>
                        <p className="text-sm text-muted-foreground">Ensure your loved ones are financially secure.</p>
                    </CardContent>
                </Card>
            </Link>
             <Link href="/policies/health" className="group">
                <Card className="hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-4 flex flex-col items-center text-center">
                        <HeartPulse className="h-10 w-10 mb-4 text-primary" />
                        <h3 className="font-semibold mb-1">Health Insurance</h3>
                        <p className="text-sm text-muted-foreground">Comprehensive medical coverage for peace of mind.</p>
                    </CardContent>
                </Card>
            </Link>
        </CardContent>
       </Card>
    </div>
  );
}
