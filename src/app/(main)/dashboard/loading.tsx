import { PageHeader } from "@/components/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function DashboardLoading() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <PageHeader
        title="Welcome Back!"
        description="Loading your insurance portfolio..."
      >
        <Skeleton className="h-10 w-36" />
        <Skeleton className="h-10 w-32" />
      </PageHeader>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-96" />
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead><Skeleton className="h-5 w-24" /></TableHead>
                  <TableHead><Skeleton className="h-5 w-20" /></TableHead>
                  <TableHead><Skeleton className="h-5 w-20" /></TableHead>
                  <TableHead className="text-right"><Skeleton className="h-5 w-32 ml-auto" /></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(3)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-5 w-40 ml-auto" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton className="h-7 w-40" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-start gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-3 w-24" />
                  </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

       <Card>
        <CardHeader>
            <Skeleton className="h-7 w-56" />
            <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
             {[...Array(4)].map((_, i) => (
                <Card key={i}>
                    <CardContent className="p-4 flex flex-col items-center text-center">
                        <Skeleton className="h-10 w-10 mb-4 rounded-full"/>
                        <Skeleton className="h-6 w-32 mb-2"/>
                        <Skeleton className="h-4 w-48"/>
                    </CardContent>
                </Card>
            ))}
        </CardContent>
       </Card>
    </div>
  );
}
