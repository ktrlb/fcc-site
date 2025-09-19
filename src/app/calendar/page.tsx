import { Calendar } from "@/components/calendar/calendar";

export default function CalendarPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Church Calendar
          </h1>
          <p className="text-lg text-gray-600">
            Stay up to date with all our events and activities
          </p>
        </div>
        <Calendar />
      </div>
    </div>
  );
}