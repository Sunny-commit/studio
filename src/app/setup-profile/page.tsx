import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function SetupProfilePage() {
  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">One Last Step</CardTitle>
          <CardDescription>
            Tell us a bit about your academic background to personalize your experience.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="university">University</Label>
              <Input id="university" placeholder="e.g., JNTUK" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="college">College</Label>
              <Input id="college" placeholder="e.g., UCEV" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="branch">Branch</Label>
              <Input id="branch" placeholder="e.g., CSE" />
            </div>
            <Button asChild className="w-full font-bold">
              <Link href="/dashboard">Complete Profile</Link>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
