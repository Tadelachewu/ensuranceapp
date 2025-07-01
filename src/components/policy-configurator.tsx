"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { recommendAddOns, RecommendAddOnsInput } from "@/ai/flows/smart-add-on-suggestions";
import { createPolicy } from "@/services/policyService";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Loader2, Sparkles, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

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
  const router = useRouter();
  const { toast } = useToast();
  const [coverageAmount, setCoverageAmount] = useState(100000);
  const [deductible, setDeductible] = useState(500);
  const [monthlyPremium, setMonthlyPremium] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  useEffect(() => {
    const base = basePremiums[policyType] || 75;
    const calculatedPremium = base + (coverageAmount / 10000) * 2 + (500 - deductible) / 10;
    setMonthlyPremium(Math.max(20, calculatedPremium));
  }, [coverageAmount, deductible, policyType]);

  const getAiSuggestions = async () => {
    setIsLoading(true);
    setSuggestions([]);
    
    const input: RecommendAddOnsInput = {
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

  const handlePurchase = async () => {
    setIsPurchasing(true);
    try {
        const policyTypeCapitalized = policyType.charAt(0).toUpperCase() + policyType.slice(1);
        await createPolicy({
            type: policyTypeCapitalized as any, // Cast to any to satisfy the strict type
            premium: monthlyPremium,
            coverageAmount: coverageAmount,
            deductible: deductible,
        });
        toast({
            title: "Policy Purchased!",
            description: `Your new ${policyType} insurance is now active.`,
            className: "bg-green-100 border-green-200 text-green-800 dark:bg-green-950 dark:border-green-800 dark:text-green-200"
        });
        // Redirect to dashboard to see the new policy
        router.push('/dashboard');
        router.refresh(); // ensures server components refetch data
    } catch (error) {
        console.error("Error purchasing policy:", error);
        toast({
            variant: "destructive",
            title: "Purchase Failed",
            description: error instanceof Error ? error.message : "Failed to purchase policy. Please try again.",
        });
    } finally {
        setIsPurchasing(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Smart Add-On Suggestions</CardTitle>
                    <CardDescription>Let our AI find the best add-ons to enhance your coverage based on your saved profile. Make sure your profile is up-to-date!</CardDescription>
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
                    <Button onClick={getAiSuggestions} disabled={isLoading || isPurchasing}>
                        {isLoading ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait</>
                        ) : (
                            <><Sparkles className="mr-2 h-4 w-4" /> Get Suggestions</>
                        )}
                    </Button>
                </CardFooter>
            </Card>
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
                <Button className="w-full" onClick={handlePurchase} disabled={isPurchasing}>
                    {isPurchasing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Purchase Policy
                </Button>
            </CardFooter>
            </Card>
        </div>
    </div>
  );
}
