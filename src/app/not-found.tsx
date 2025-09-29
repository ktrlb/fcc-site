import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-stone-700 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-stone-600 mb-4">Page Not Found</h2>
        <p className="text-stone-500 mb-8 max-w-md">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <Button asChild>
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    </div>
  );
}
