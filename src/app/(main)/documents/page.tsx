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
import { Download, FolderOpen } from "lucide-react";
import { getDocumentsByUserId } from "@/services/documentService";

export default async function DocumentsPage() {
  const documents = await getDocumentsByUserId();

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
              {documents.length > 0 ? (
                documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">{doc.name}</TableCell>
                    <TableCell>{doc.type}</TableCell>
                    <TableCell>{doc.uploadDate}</TableCell>
                    <TableCell>{doc.fileSizeKb} KB</TableCell>
                    <TableCell className="text-right">
                       <Button variant="ghost" size="icon" asChild>
                        {/* In a real app, storageUrl would point to a downloadable link */}
                        <a href="#" onClick={(e) => e.preventDefault()} title="Download not implemented">
                          <Download className="h-4 w-4" />
                          <span className="sr-only">Download</span>
                        </a>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                 <TableRow>
                    <TableCell colSpan={5} className="h-48 text-center">
                        <FolderOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="font-semibold text-lg">Your Document Center is Empty</h3>
                        <p className="text-muted-foreground">Policy documents and claim forms will appear here once generated.</p>
                    </TableCell>
                  </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
