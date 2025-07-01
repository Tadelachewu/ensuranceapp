import { PageHeader } from "@/components/page-header";
import { PolicyConfigurator } from "@/components/policy-configurator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PolicyTypePageProps {
  params: {
    type: string;
  };
}

const policyDetails: { [key: string]: { name: string; description: string } } = {
  auto: { name: "Auto Insurance", description: "Customize your coverage for the open road." },
  home: { name: "Home Insurance", description: "Tailor your policy to protect your home." },
  life: { name: "Life Insurance", description: "Define the terms for your family's future." },
  health: { name: "Health Insurance", description: "Select the right health plan for your needs." },
};

export default function PolicyTypePage({ params }: PolicyTypePageProps) {
  const { type } = params;
  const details = policyDetails[type] || { name: "Insurance", description: "Customize your policy." };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <PageHeader
        title={`${details.name} Quote`}
        description={details.description}
      />
      <div className="grid grid-cols-1 gap-8">
        <PolicyConfigurator policyType={type} />
      </div>
    </div>
  );
}
