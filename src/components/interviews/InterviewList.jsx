import InterviewCard from './InterviewCard';

export default function InterviewList({ interviews = [], isStaff = false, onStatusChange }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {interviews.map((i) => <InterviewCard key={i.id} interview={i} isStaff={isStaff} onStatusChange={onStatusChange} />)}
      {interviews.length === 0 && <p className="col-span-full text-center text-gray-400 py-16 text-sm">No interviews found</p>}
    </div>
  );
}
