// app/dashboard/page.tsx
import MentorDashboard from '././components/MentorDashboard';
import { mentorsData } from '././data/mentors';

export default function DashboardPage() {
  return (
    <main className="min-h-screen">
      <MentorDashboard mentors={mentorsData} />
    </main>
  );
}