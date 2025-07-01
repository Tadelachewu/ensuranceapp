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
import { Car, FilePlus, Home, ShieldCheck, UserCheck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const policies = [
  { id: "POL456789", type: "Auto Insurance", status: "Active", premium: 120.50, nextDue: "2024-08-01" },
  { id: "POL123456", type: "Home Insurance", status: "Active", premium: 250.00, nextDue: "2024-07-25" },
  { id: "POL789123", type: "Life Insurance", status: "Pending", premium: 75.00, nextDue: "2024-08-10" },
];

const recentActivities = [
    { description: "Claim #C-9876 submitted for Auto Policy.", date: "2 days ago", icon: FilePlus },
    { description: "Home Insurance policy renewed.", date: "1 week ago", icon: ShieldCheck },
    { description: "Profile information updated.", date: "3 weeks ago", icon: UserCheck },
];

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <PageHeader
        title="Welcome Back, Alex!"
        description="Here’s a summary of your insurance portfolio."
      >
        <Link href="/policies" passHref>
          <Button>Get a New Policy</Button>
        </Link>
        <Link href="/claims" passHref>
          <Button variant="outline">File a Claim</Button>
        </Link>
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
                {policies.map((policy) => (
                  <TableRow key={policy.id}>
                    <TableCell className="font-medium">{policy.id}</TableCell>
                    <TableCell>{policy.type}</TableCell>
                    <TableCell>
                      <Badge variant={policy.status === "Active" ? "default" : "secondary"} className={policy.status === "Active" ? "bg-green-100 text-green-800" : ""}>
                        {policy.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">${policy.premium.toFixed(2)} on {policy.nextDue}</TableCell>
                  </TableRow>
                ))}
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
                {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start gap-4">
                        <div className="bg-muted rounded-full p-2">
                            <activity.icon className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="text-sm font-medium">{activity.description}</p>
                            <p className="text-xs text-muted-foreground">{activity.date}</p>
                        </div>
                    </div>
                ))}
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
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10 mb-4 text-primary"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
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
