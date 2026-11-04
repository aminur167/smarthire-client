import ApplicationStatusCards from '../components/dashboard/ApplicationStatusCards';
import JobsOverview from '../components/dashboard/JobsOverview';
import RequestsSidebar from '../components/dashboard/RequestsSidebar';
import UpcomingInterviews from '../components/dashboard/UpcomingInterviews';
import DashboardStats from '../components/dashboard/DashboardStats';

export default function DashboardPage() {
  return (
    <div>
      <DashboardStats />
      <div className="grid grid-cols-12 gap-5">
        {/* Left: Requests */}
        <div className="col-span-12 lg:col-span-2">
          <RequestsSidebar />
        </div>

        {/* Center: Status + Jobs */}
        <div className="col-span-12 lg:col-span-7">
          <ApplicationStatusCards />
          <JobsOverview />
        </div>

        {/* Right: Interviews */}
        <div className="col-span-12 lg:col-span-3">
          <UpcomingInterviews />
        </div>
      </div>
    </div>
  );
}
