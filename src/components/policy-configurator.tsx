"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { recommendAddOns, RecommendAddOnsInput } from "@/ai/flows/smart-add-on-suggestions";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Loader2, Sparkles, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

const profileSchema = z.object({
  age: z.coerce.number().min(18, "Must be at least 18").max(100),
  location: z.string().min(2, "Location is required"),
  familySize: z.coerce.number().min(1, "Family size must be at least 1"),
  occupation: z.string().min(2, "Occupation is required"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface PolicyConfiguratorProps {
  policyType: string;
}

const basePremiums: { [key: string]: number } = {
  auto: 50,
  home: 120,
  life: 30,
  health: 150,
};

export function PolicyConfigurator({ policyType }: PolicyConfiguratorProps) {
  const { toast } = useToast();
  const [coverageAmount, setCoverageAmount] = useState(100000);
  const [deductible, setDeductible] = useState(500);
  const [monthlyPremium, setMonthlyPremium] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      age: 35,
      location: "New York, NY",
      familySize: 2,
      occupation: "Software Engineer",
    },
  });

  useEffect(() => {
    const base = basePremiums[policyType] || 75;
    const calculatedPremium = base + (coverageAmount / 10000) * 2 + (500 - deductible) / 10;
    setMonthlyPremium(Math.max(20, calculatedPremium));
  }, [coverageAmount, deductible, policyType]);

  const onSubmit = async (data: ProfileFormValues) => {
    setIsLoading(true);
    setSuggestions([]);
    
    const input: RecommendAddOnsInput = {
        userProfile: {
            age: data.age,
            location: data.location,
            familySize: data.familySize,
            occupation: data.occupation,
        },
        selectedCoverage: {
            policyType: policyType,
            coverageAmount: coverageAmount,
            deductible: deductible,
        }
    };

    try {
        const result = await recommendAddOns(input);
        if (result.recommendedAddOns && result.recommendedAddOns.length > 0) {
            setSuggestions(result.recommendedAddOns);
        } else {
            toast({
                title: "No suggestions available",
                description: "We couldn't find specific add-ons for your profile.",
            });
        }
    } catch (error) {
        console.error("Error getting suggestions:", error);
        toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to get AI suggestions. Please try again.",
        });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <Card>
                    <CardHeader>
                    <CardTitle>Your Profile</CardTitle>
                    <CardDescription>
                        This information helps us tailor suggestions for you.
                    </CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField control={form.control} name="age" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Age</FormLabel>
                                <FormControl><Input type="number" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="location" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Location (City, State)</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="familySize" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Family Size</FormLabel>
                                <FormControl><Input type="number" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="occupation" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Occupation</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                    </CardContent>
                </Card>
                
                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle>Smart Add-On Suggestions</CardTitle>
                        <CardDescription>Let our AI find the best add-ons to enhance your coverage.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {suggestions.length > 0 ? (
                            <Alert className="bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
                                <Sparkles className="h-4 w-4 text-green-600" />
                                <AlertTitle className="text-green-800 dark:text-green-400">Recommended For You!</AlertTitle>
                                <AlertDescription>
                                    <ul className="mt-2 space-y-2">
                                        {suggestions.map((item, index) => (
                                            <li key={index} className="flex items-center gap-2">
                                                <CheckCircle2 className="h-4 w-4 text-green-600"/>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </AlertDescription>
                            </Alert>
                        ) : (
                             <div className="text-center text-muted-foreground p-8 border-2 border-dashed rounded-lg">
                                <Sparkles className="mx-auto h-8 w-8 mb-2"/>
                                <p>Your personalized add-on suggestions will appear here.</p>
                             </div>
                        )}
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait</>
                            ) : (
                                <><Sparkles className="mr-2 h-4 w-4" /> Get Suggestions</>
                            )}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
            </Form>
        </div>

        <div className="lg:col-span-1">
            <Card className="sticky top-20">
            <CardHeader>
                <CardTitle>Coverage Options</CardTitle>
                <CardDescription>Adjust to see your new premium.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <Label>Coverage Amount</Label>
                        <span className="font-semibold text-primary">${coverageAmount.toLocaleString()}</span>
                    </div>
                    <Slider
                        value={[coverageAmount]}
                        onValueChange={(value) => setCoverageAmount(value[0])}
                        min={10000}
                        max={1000000}
                        step={10000}
                    />
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <Label>Deductible</Label>
                        <span className="font-semibold text-primary">${deductible.toLocaleString()}</span>
                    </div>
                     <Slider
                        value={[deductible]}
                        onValueChange={(value) => setDeductible(value[0])}
                        min={250}
                        max={2500}
                        step={250}
                    />
                </div>
                <Separator />
                <div className="text-center">
                    <p className="text-sm text-muted-foreground">Your Estimated Premium</p>
                    <p className="text-4xl font-bold tracking-tight">${monthlyPremium.toFixed(2)}<span className="text-lg font-normal text-muted-foreground">/mo</span></p>
                </div>
            </CardContent>
            <CardFooter>
                <Button className="w-full">Purchase Policy</Button>
            </CardFooter>
            </Card>
        </div>
    </div>
  );
}
