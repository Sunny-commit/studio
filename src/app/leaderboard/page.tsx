import { mockUsers } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Crown } from 'lucide-react';

export default function LeaderboardPage() {
  const sortedUsers = [...mockUsers].sort((a, b) => b.reputation - a.reputation);

  const getRankBadge = (rank: number) => {
    if (rank === 1) return "text-yellow-500 text-2xl";
    if (rank === 2) return "text-gray-400 text-xl";
    if (rank === 3) return "text-yellow-700 text-lg";
    return "";
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      <section className="mb-12 space-y-4 text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl flex items-center justify-center gap-3">
            <Crown className="h-10 w-10 text-yellow-500" />
            Leaderboard
        </h1>
        <p className="mx-auto max-w-[700px] text-lg text-muted-foreground">
          See who's on top! Users with the highest reputation from contributing solutions.
        </p>
      </section>

      <Card className="max-w-4xl mx-auto shadow-lg">
        <CardHeader>
            <CardTitle>Top Contributors</CardTitle>
            <CardDescription>Our community's most helpful members.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px] text-center">Rank</TableHead>
                <TableHead>User</TableHead>
                <TableHead className="text-right">Reputation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedUsers.map((user, index) => (
                <TableRow key={user.id}>
                  <TableCell className={`text-center font-bold ${getRankBadge(index + 1)}`}>{index + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.avatarUrl} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-semibold text-primary">{user.reputation}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
