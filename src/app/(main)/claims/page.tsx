
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useState } from "react";
import Link from "next/link";

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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2, CheckCircle2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { createClaim } from "@/services/claimService";
import { getPoliciesByUserId, Policy } from "@/services/policyService";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const claimSchema = z.object({
  policyId: z.string({ required_error: "Please select a policy." }),
  claimType: z.string({ required_error: "Please select a claim type." }),
  incidentDate: z.date({ required_error: "Date of incident is required." }),
  description: z.string().min(20, "Please provide a detailed description of at least 20 characters."),
});

type ClaimFormValues = z.infer<typeof claimSchema>;

export default function ClaimsPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success'>('idle');
  const [policies, setPolicies] = useState<Policy[]>([]);
  
  useEffect(() => {
    async function fetchPolicies() {
      const userPolicies = await getPoliciesByUserId();
      const activePolicies = userPolicies.filter(p => p.status === 'Active');
      setPolicies(activePolicies);
    }
    fetchPolicies();
  }, []);

  const form = useForm<ClaimFormValues>({
    resolver: zodResolver(claimSchema),
  });

  async function onSubmit(data: ClaimFormValues) {
    setIsSubmitting(true);
    try {
      await createClaim({
        policyId: data.policyId,
        type: data.claimType,
        incidentDate: format(data.incidentDate, "yyyy-MM-dd"),
        description: data.description,
      });

      setSubmissionStatus('success');
      form.reset();
    } catch (error) {
      console.error("Failed to submit claim", error);
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleNewClaim() {
    setSubmissionStatus('idle');
    form.reset();
  }
  
  if (submissionStatus === 'success') {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <PageHeader
          title="Claim Submitted"
          description="Your claim has been received and is being processed."
        />
        <Card>
            <CardContent className="pt-6">
                 <Alert className="bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <AlertTitle className="text-green-800 dark:text-green-400">Successfully Submitted!</AlertTitle>
                    <AlertDescription>
                        <p className="mb-4">
                            We have received your claim and our team will begin reviewing it shortly. You can track its status on your dashboard.
                        </p>
                        <Button onClick={handleNewClaim}>File Another Claim</Button>
                    </AlertDescription>
                </Alert>
            </CardContent>
        </Card>
      </div>
    );
  }

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
          {policies.length > 0 ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <FormField
                    control={form.control}
                    name="policyId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Active Policy</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select an active policy" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {policies.map(policy => (
                              <SelectItem key={policy.id} value={policy.id}>
                                {policy.type} Insurance - {policy.id}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="claimType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Claim Type</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a claim type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="auto-accident">Auto Accident</SelectItem>
                            <SelectItem value="property-damage">Property Damage</SelectItem>
                            <SelectItem value="medical-expense">Medical Expense</SelectItem>
                            <SelectItem value="life-benefit">Life Benefit</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="incidentDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date of Incident</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() || date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description of Incident</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Please describe what happened in detail..."
                          className="resize-y min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Submit Claim
                </Button>
              </form>
            </Form>
          ) : (
            <div className="text-center text-muted-foreground p-8 border-2 border-dashed rounded-lg">
                <h3 className="font-semibold text-lg mb-1">No Active Policies Found</h3>
                <p className="mb-4">You must have an active policy to file a claim.</p>
                <Button asChild>
                    <Link href="/policies">Purchase a Policy</Link>
                </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
