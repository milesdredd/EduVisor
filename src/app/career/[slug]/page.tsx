import { ArrowLeft, BookOpen, Briefcase, DollarSign, PlusCircle, Search, Sparkles, TrendingUp } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// In a real app, this data would come from a database or a more detailed API call.
const getCareerDetails = (slug: string) => {
  const MOCK_DATA: Record<string, any> = {
    'software-engineer': {
      title: 'Software Engineer',
      jobDuties: ['Designing and developing software applications.', 'Writing clean, efficient, and testable code.', 'Collaborating with cross-functional teams.', 'Debugging and resolving software defects.'],
      requiredSkills: ['Java/Python/C++', 'Data Structures & Algorithms', 'Problem Solving', 'Version Control (Git)'],
      potentialSalary: '$90,000 - $160,000 per year',
      jobGrowth: '22% (Much faster than average)',
      entrepreneurialOptions: ['Freelance development', 'Start a software consulting firm', 'Build and sell a SaaS product'],
      scholarships: ['Google Scholarship Program', 'Women Techmakers Scholarship', 'Microsoft Scholarship Program'],
      academicPathway: 'Bachelor\'s in Computer Science -> Master\'s in a specialized field (optional) -> Certifications (e.g., AWS Certified Developer).',
      studyMaterials: [
        { title: 'Data Structures in Java', url: '#' },
        { title: 'Cracking the Coding Interview', url: '#' },
      ]
    },
    // ... other careers
  };

  const defaultData = {
      title: slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      jobDuties: ['Core responsibilities and day-to-day tasks will be displayed here.', 'Details on project management and team collaboration will be shown.', 'Information on stakeholder communication will be available.'],
      requiredSkills: ['Key technical skills will be listed.', 'Important soft skills like communication will be detailed.', 'Problem-solving abilities required for the role will be outlined.'],
      potentialSalary: 'Varies by experience and location.',
      jobGrowth: 'Projected growth rate will be shown here.',
      entrepreneurialOptions: ['Opportunities for starting your own business will be listed.', 'Information on freelance and consulting work will be provided.'],
      scholarships: ['Relevant scholarships for this field will be displayed here.', 'Links and information about application processes will be available.'],
      academicPathway: 'A typical academic path from school to this career will be summarized here.',
      studyMaterials: [
        { title: 'Example Study Material 1', url: '#' },
        { title: 'Example Study Material 2', url: '#' },
      ]
  }

  return MOCK_DATA[slug] || defaultData;
};

export default function CareerDetailPage({ params }: { params: { slug: string } }) {
  const career = getCareerDetails(params.slug);

  return (
    <div className="container mx-auto max-w-4xl py-12">
      <Button asChild variant="ghost" className="mb-8">
        <Link href="/results">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Results
        </Link>
      </Button>

      <div className="space-y-10">
        <Card>
            <CardHeader>
            <CardTitle className="text-4xl font-headline">{career.title}</CardTitle>
            <CardDescription>
                A comprehensive look at the career path of a {career.title}.
            </CardDescription>
            </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Briefcase /> Job Opportunities</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h3 className="font-semibold mb-2">Key Job Duties</h3>
                        <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
                        {career.jobDuties.map((duty, index) => (
                            <li key={index}>{duty}</li>
                        ))}
                        </ul>
                    </div>
                     <div>
                        <h3 className="font-semibold mb-2">Required Skills</h3>
                        <div className="flex flex-wrap gap-2">
                        {career.requiredSkills.map((skill) => (
                            <Badge key={skill} variant="outline">{skill}</Badge>
                        ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><TrendingUp /> Career Outlook</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h3 className="font-semibold flex items-center gap-2 mb-2"><DollarSign className="w-5 h-5" /> Potential Salary</h3>
                        <p className="text-lg font-medium">{career.potentialSalary}</p>
                    </div>
                     <div>
                        <h3 className="font-semibold flex items-center gap-2 mb-2"><TrendingUp className="w-5 h-5" /> Job Growth</h3>
                        <p className="text-lg font-medium">{career.jobGrowth}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold flex items-center gap-2 mb-2"><Sparkles className="w-5 h-5" /> Entrepreneurial Options</h3>
                        <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
                        {career.entrepreneurialOptions.map((opt, index) => (
                            <li key={index}>{opt}</li>
                        ))}
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><BookOpen /> Academic Pathway & Scholarships</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="mb-6">
                    <h3 className="font-semibold mb-2">Summarized Academic Pathway</h3>
                    <p className="text-muted-foreground">{career.academicPathway}</p>
                </div>
                 <div className="mb-6">
                    <h3 className="font-semibold mb-2">Relevant Scholarships</h3>
                     <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
                        {career.scholarships.map((scholarship, index) => (
                            <li key={index}>{scholarship}</li>
                        ))}
                    </ul>
                </div>
                 <Button>
                    <Search className="mr-2 h-4 w-4" /> Explore Colleges for this Path
                </Button>
            </CardContent>
        </Card>

        <Card className="bg-primary/10 border-primary/30">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">Get Prepared</CardTitle>
                <CardDescription>Freely accessible study materials to get ready for entrance tests.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
               {career.studyMaterials.map((material, index) => (
                    <a key={index} href={material.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 bg-background rounded-md hover:bg-muted transition-colors">
                        <span>{material.title}</span>
                        <PlusCircle className="w-5 h-5 text-primary" />
                    </a>
                ))}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
