import { Calendar } from "@/components/calendar/calendar";

export default function CalendarPage() {
  return (
    <div className="min-h-screen bg-stone-50 pt-24">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-900 mb-4 font-serif">
            Church Calendar
          </h1>
          <p className="text-lg text-indigo-900">
            Stay up to date with all our events and activities
          </p>
        </div>
        <Calendar />
      </div>
    </div>
  );
}