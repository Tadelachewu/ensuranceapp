"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";

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
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { createClaim, getActivePoliciesForClaims } from "@/services/claimService";
import type { Policy } from "@/services/policyService";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

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
    const [isLoading, setIsLoading] = useState(true);
    const [policies, setPolicies] = useState<Policy[]>([]);
    const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success'>('idle');

    const form = useForm<ClaimFormValues>({
        resolver: zodResolver(claimSchema),
        defaultValues: {
            description: "",
        }
    });

    useEffect(() => {
        async function fetchPolicies() {
            try {
                setIsLoading(true);
                const activePolicies = await getActivePoliciesForClaims();
                setPolicies(activePolicies);
            } catch (error) {
                toast({
                    title: "Failed to load policies",
                    description: "Could not retrieve your active policies. Please try again later.",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        }
        fetchPolicies();
    }, [toast]);

    async function onSubmit(data: ClaimFormValues) {
        setIsSubmitting(true);
        setSubmissionStatus('idle');
        try {
            await createClaim({
                policyId: data.policyId,
                type: data.claimType,
                incidentDate: format(data.incidentDate, "yyyy-MM-dd"),
                description: data.description,
            });

            setSubmissionStatus('success');
            form.reset({ description: "", claimType: undefined, incidentDate: undefined, policyId: undefined });
        } catch (error) {
            console.error("Failed to submit claim", error);
            toast({
                title: "Submission Failed",
                description: (error as Error).message,
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    if (isLoading) {
        return (
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <PageHeader
                    title="File a New Claim"
                    description="Please provide the details of your claim below."
                />
                <Card>
                    <CardHeader>
                        <CardTitle>Claim Details</CardTitle>
                        <CardDescription>Fill out the form to start the claims process.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-10 w-32" />
                    </CardContent>
                </Card>
            </div>
        );
    }
    
    if (submissionStatus === 'success') {
        return (
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <PageHeader title="File a New Claim" />
                <Alert variant="default" className="bg-green-50 border-green-200">
                    <AlertTitle className="text-lg font-semibold text-green-800">Claim Submitted Successfully!</AlertTitle>
                    <AlertDescription className="text-green-700">
                        Your claim has been received and is now being processed. You will be notified of any updates.
                    </AlertDescription>
                    <div className="mt-4 flex gap-4">
                        <Button onClick={() => setSubmissionStatus('idle')}>File Another Claim</Button>
                        <Button variant="outline" asChild><Link href="/dashboard">Return to Dashboard</Link></Button>
                    </div>
                </Alert>
            </div>
        )
    }

    if (policies.length === 0) {
        return (
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <PageHeader
                    title="File a New Claim"
                    description="You currently have no active policies to file a claim against."
                />
                <Alert variant="default">
                    <AlertTitle>No Active Policies</AlertTitle>
                    <AlertDescription>
                        You must have an active policy before you can file a claim.
                        <div className="mt-4">
                            <Button asChild><Link href="/policies">Get a New Policy</Link></Button>
                        </div>
                    </AlertDescription>
                </Alert>
            </div>
        )
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
                    <CardDescription>Fill out the form to start the claims process.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <FormField
                                    control={form.control}
                                    name="policyId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Policy Number</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select your active policy" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {policies.map(policy => (
                                                        <SelectItem key={policy.id} value={policy.id}>
                                                            {policy.id} ({policy.type} Insurance)
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
                </CardContent>
            </Card>
        </div>
    );
}
