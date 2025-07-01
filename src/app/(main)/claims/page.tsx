import { PageHeader } from "@/components/page-header";
import { getPoliciesByUserId } from "@/services/policyService";
import { ClaimForm } from "@/components/claim-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FilePlus } from "lucide-react";
import Link from "next/link";

export default async function ClaimsPage() {
  const policies = await getPoliciesByUserId();
  const activePolicies = policies.filter(p => p.status === 'Active');

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <PageHeader
        title="File a New Claim"
        description="Please provide the details of your claim below."
      />
       <Card>
        <CardHeader>
          <CardTitle>Claim Details</CardTitle>
          <CardDescription>
            Fill out the form to start the claims process.
          </CardDescription>
        </CardHeader>
        <CardContent>
            {activePolicies.length > 0 ? (
                <ClaimForm policies={activePolicies} />
            ) : (
                <Alert>
                    <FilePlus className="h-4 w-4" />
                    <AlertTitle>No Active Policies Found</AlertTitle>
                    <AlertDescription>
                        You must have an active policy to file a claim. You can <Link href="/policies" className="font-medium text-primary hover:underline">purchase a new policy</Link> first.
                    </AlertDescription>
                </Alert>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
