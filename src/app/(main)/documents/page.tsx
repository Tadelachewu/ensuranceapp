import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Download } from "lucide-react";

const documents = [
  { name: "Auto Policy Agreement - POL456789", type: "Policy Document", date: "2023-07-15", size: "1.2 MB" },
  { name: "Homeowners Insurance Certificate - POL123456", type: "Certificate of Insurance", date: "2023-06-20", size: "450 KB" },
  { name: "Life Insurance Beneficiary Form - POL789123", type: "Form", date: "2023-08-01", size: "300 KB" },
  { name: "Claim #C-9876 Submission Confirmation", type: "Claim Document", date: "2024-05-18", size: "150 KB" },
  { name: "Premium Payment Receipt - July 2024", type: "Receipt", date: "2024-07-01", size: "80 KB" },
  { name: "Policy Renewal Notice - Auto", type: "Notice", date: "2024-06-15", size: "220 KB" },
];

export default function DocumentsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <PageHeader
        title="Document Center"
        description="Access all your policy documents, claims, and receipts."
      />
      <Card>
        <CardHeader>
          <CardTitle>Your Documents</CardTitle>
          <CardDescription>
            Browse and download your important files.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Size</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.name}>
                  <TableCell className="font-medium">{doc.name}</TableCell>
                  <TableCell>{doc.type}</TableCell>
                  <TableCell>{doc.date}</TableCell>
                  <TableCell>{doc.size}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                      <span className="sr-only">Download</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
