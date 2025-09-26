import { Calendar } from "@/components/calendar/calendar";

export default function CalendarPage() {
  return (
    <div className="min-h-screen pt-24" style={{ backgroundColor: 'rgb(68 64 60)' }}>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 font-serif">
            Church Calendar
          </h1>
          <p className="text-lg text-white">
            Stay up to date with all our events and activities
          </p>
        </div>
        <Calendar />
      </div>
    </div>
  );
}