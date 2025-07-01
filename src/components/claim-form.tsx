
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";

import { Button } from "@/components/ui/button";
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
import { CalendarIcon, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { createClaim } from "@/services/claimService";
import { createActivity } from "@/services/activityService";
import type { Policy } from "@/services/policyService";

const claimSchema = z.object({
  policyId: z.string({ required_error: "Please select a policy." }),
  claimType: z.string({ required_error: "Please select a claim type." }),
  incidentDate: z.date({ required_error: "Date of incident is required." }),
  description: z.string().min(20, "Please provide a detailed description of at least 20 characters."),
});

type ClaimFormValues = z.infer<typeof claimSchema>;

interface ClaimFormProps {
    policies: Policy[];
}

export function ClaimForm({ policies }: ClaimFormProps) {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const form = useForm<ClaimFormValues>({
        resolver: zodResolver(claimSchema),
    });

  async function onSubmit(data: ClaimFormValues) {
    setIsSubmitting(true);
    try {
        const newClaim = await createClaim({
            policyId: data.policyId,
            type: data.claimType,
            incidentDate: format(data.incidentDate, "yyyy-MM-dd"),
            description: data.description,
        });

        await createActivity({
            description: `New claim submitted: ${newClaim.claimNumber}`,
            iconName: "FilePlus",
        });

        toast({
            title: "Claim Submitted Successfully!",
            description: `Your claim for policy ${data.policyId} has been received.`,
        });
        form.reset();
    } catch (error) {
        console.error("Failed to submit claim", error);
        toast({
            title: "Submission Failed",
            description: "There was a problem submitting your claim. Please try again.",
            variant: "destructive",
        });
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField
                control={form.control}
                name="policyId"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Policy</FormLabel>
                    <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={policies.length === 0}
                    >
                    <FormControl>
                        <SelectTrigger>
                        <SelectValue placeholder={policies.length > 0 ? "Select an active policy" : "No active policies found"} />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {policies.map(policy => (
                        <SelectItem key={policy.id} value={policy.id}>
                            {`${policy.type} Insurance - ${policy.id}`}
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
                    <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    >
                    <FormControl>
                        <SelectTrigger>
                        <SelectValue placeholder="Select a claim type" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="auto-accident">
                        Auto Accident
                        </SelectItem>
                        <SelectItem value="property-damage">
                        Property Damage
                        </SelectItem>
                        <SelectItem value="medical-expense">
                        Medical Expense
                        </SelectItem>
                        <SelectItem value="life-benefit">
                        Life Benefit
                        </SelectItem>
                        <SelectItem value="other">
                        Other
                        </SelectItem>
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
            <Button type="submit" disabled={isSubmitting || policies.length === 0}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Claim
            </Button>
        </form>
    </Form>
  );
}
