import { ArrowLeft } from "lucide-react";
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

// In a real app, this data would come from a database or a more detailed API call.
const getCareerDetails = (slug: string) => {
  const MOCK_DATA: Record<string, any> = {
    'software-engineer': {
      title: 'Software Engineer',
      jobDuties: ['Designing and developing software applications.', 'Writing clean, efficient, and testable code.', 'Collaborating with cross-functional teams.', 'Debugging and resolving software defects.'],
      requiredSkills: ['Java/Python/C++', 'Data Structures & Algorithms', 'Problem Solving', 'Version Control (Git)'],
      potentialSalary: '$90,000 - $160,000 per year'
    },
    'graphic-designer': {
      title: 'Graphic Designer',
      jobDuties: ['Creating visual concepts for websites, ads, and logos.', 'Developing overall layout and production design.', 'Using software like Adobe Creative Suite.', 'Working with clients to meet their design needs.'],
      requiredSkills: ['Creativity', 'Adobe Photoshop/Illustrator', 'Typography', 'Communication'],
      potentialSalary: '$50,000 - $95,000 per year'
    },
    'data-scientist': {
        title: 'Data Scientist',
        jobDuties: ['Collecting, cleaning, and analyzing large datasets.', 'Building predictive models and machine-learning algorithms.', 'Presenting findings to stakeholders.', 'Identifying trends and patterns in data.'],
        requiredSkills: ['Python/R', 'Machine Learning', 'Statistics', 'SQL', 'Data Visualization'],
        potentialSalary: '$100,000 - $180,000 per year'
    }
  };

  const defaultData = {
      title: slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      jobDuties: ['Core responsibilities and day-to-day tasks for this role.', 'Managing projects and collaborating with team members.', 'Communicating with stakeholders.'],
      requiredSkills: ['Relevant technical skills.', 'Soft skills like communication and teamwork.', 'Problem-solving abilities.'],
      potentialSalary: 'Varies based on experience and location.'
  }

  return MOCK_DATA[slug] || defaultData;
};

export default function CareerDetailPage({ params }: { params: { slug: string } }) {
  const career = getCareerDetails(params.slug);

  return (
    <div className="container mx-auto max-w-3xl py-12">
      <Button asChild variant="ghost" className="mb-8">
        <Link href="/results">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Results
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-4xl font-headline">{career.title}</CardTitle>
          <CardDescription>
            An in-depth look at a career as a {career.title}.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-3">Key Job Duties</h2>
            <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
              {career.jobDuties.map((duty, index) => (
                <li key={index}>{duty}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Required Skills</h2>
            <div className="flex flex-wrap gap-2">
              {career.requiredSkills.map((skill) => (
                <Badge key={skill} variant="outline">{skill}</Badge>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Potential Salary</h2>
            <p className="text-lg font-medium">{career.potentialSalary}</p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
