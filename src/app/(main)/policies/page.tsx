import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Car, Home, UserCheck, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const policyTypes = [
  {
    name: "Auto Insurance",
    type: "auto",
    description: "Get comprehensive coverage for your vehicle against accidents, theft, and damages. Drive with peace of mind.",
    icon: Car,
    image: "https://placehold.co/600x400.png",
    imageHint: "car road"
  },
  {
    name: "Home Insurance",
    type: "home",
    description: "Protect your biggest asset. Our policies cover your home's structure and personal belongings against unforeseen events.",
    icon: Home,
    image: "https://placehold.co/600x400.png",
    imageHint: "modern house"
  },
  {
    name: "Life Insurance",
    type: "life",
    description: "Secure your family's financial future. Our life insurance plans provide a safety net for your loved ones.",
    icon: UserCheck,
    image: "https://placehold.co/600x400.png",
    imageHint: "happy family"
  },
  {
    name: "Health Insurance",
    type: "health",
    description: "Prioritize your well-being with our health plans, covering medical expenses, hospital stays, and preventive care.",
    icon: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-primary"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>,
    image: "https://placehold.co/600x400.png",
    imageHint: "doctor patient"
  },
];

export default function PoliciesPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <PageHeader
        title="Find Your Perfect Policy"
        description="Select an insurance type below to get a personalized quote."
      />
      <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
        {policyTypes.map((policy) => (
          <Card key={policy.type} className="overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
            <div className="relative h-48 w-full">
              <Image
                src={policy.image}
                alt={policy.name}
                layout="fill"
                objectFit="cover"
                data-ai-hint={policy.imageHint}
              />
            </div>
            <CardHeader className="flex-row items-start gap-4 space-y-0">
                <div className="bg-muted p-3 rounded-lg flex items-center justify-center">
                    <policy.icon />
                </div>
                <div>
                    <CardTitle>{policy.name}</CardTitle>
                    <CardDescription className="mt-1">{policy.description}</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="flex-grow"></CardContent>
            <CardFooter>
              <Link href={`/policies/${policy.type}`} passHref legacyBehavior>
                <Button className="w-full">
                  Get a Quote
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
