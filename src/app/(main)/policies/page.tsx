
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
import { Car, Home, UserCheck, ArrowRight, Heart } from "lucide-react";
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
    icon: Heart,
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
                    <policy.icon className="h-8 w-8 text-primary" />
                </div>
                <div>
                    <CardTitle>{policy.name}</CardTitle>
                    <CardDescription className="mt-1">{policy.description}</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="flex-grow"></CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href={`/policies/${policy.type}`}>
                  Get a Quote
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
