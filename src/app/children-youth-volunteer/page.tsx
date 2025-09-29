import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, Play, FileText, Shield, Users, Heart } from 'lucide-react';
import Link from 'next/link';

export default function ChildrenYouthVolunteerPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative text-white overflow-hidden" style={{ height: '450px' }}>
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/images/childrens-header-background.jpeg')",
            backgroundSize: "cover",
            backgroundPosition: "center calc(50% + 100px)",
            backgroundRepeat: "no-repeat"
          }}
        />
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(68 64 60, 0.7)' }}></div>
        <div className="relative flex items-center justify-center h-full">
          <div className="text-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Users className="h-16 w-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-serif">
              Volunteer with Children & Youth
            </h1>
            <p className="text-xl text-white max-w-3xl mx-auto">
              Join our mission to nurture and guide the next generation in their faith journey
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16" style={{ backgroundColor: 'rgb(68 64 60)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white font-serif mb-4">
              How to Become a Volunteer
            </h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              The process to become a volunteer in these ministries is 3 steps:
            </p>
          </div>

          <div className="space-y-8">
            {/* Step 1 */}
            <div className="p-8 rounded-lg" style={{ backgroundColor: 'rgb(220 38 38)' }}>
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-white text-red-600 rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl">
                  1
                </div>
                <h3 className="text-2xl font-bold text-white">Watch Training Video</h3>
              </div>
              <p className="text-lg text-white/90 mb-6">
                We have regular in-person trainings, but if you are unable to attend you can substitute the in-person time by watching this video:
              </p>
              <div className="bg-white/10 p-6 rounded-lg mb-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Play className="h-6 w-6 text-white" />
                  <span className="font-semibold text-white">FCC Boundaries Training Video</span>
                </div>
                <p className="text-sm text-white/80 mb-4">
                  This comprehensive training covers important policies and procedures for working with children and youth at FCC Granbury.
                </p>
                <a 
                  href="https://youtu.be/y9-9cmzwLTM" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block bg-white text-red-600 hover:bg-white/10 hover:text-white font-semibold py-3 px-6 rounded-lg transition-colors border border-white"
                >
                  Watch Training Video
                </a>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-8 rounded-lg" style={{ backgroundColor: 'rgb(17 94 89)' }}>
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-white text-teal-800 rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl">
                  2
                </div>
                <h3 className="text-2xl font-bold text-white">Submit Confirmation Form</h3>
              </div>
              <p className="text-lg text-white/90 mb-6">
                We ask that you fill out this form to let us know you watched the video in full.
              </p>
              <div className="bg-white/10 p-6 rounded-lg mb-6">
                <div className="flex items-center space-x-3 mb-4">
                  <FileText className="h-6 w-6 text-white" />
                  <span className="font-semibold text-white">Training Confirmation Form</span>
                </div>
                <p className="text-sm text-white/80 mb-4">
                  This form confirms that you have completed the training and understand our policies and procedures.
                </p>
                <a 
                  href="https://fccgranbury.breezechms.com/form/142f67" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block bg-white text-teal-800 hover:bg-white/10 hover:text-white font-semibold py-3 px-6 rounded-lg transition-colors border border-white"
                >
                  Complete Confirmation Form
                </a>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-8 rounded-lg" style={{ backgroundColor: 'rgb(49 46 129)' }}>
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-white text-indigo-900 rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl">
                  3
                </div>
                <h3 className="text-2xl font-bold text-white">Consent to a Background Check</h3>
              </div>
              <p className="text-lg text-white/90 mb-6">
                Please fill out the necessary consent and information so that a background check can be run.
              </p>
              <div className="bg-white/10 p-6 rounded-lg mb-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Shield className="h-6 w-6 text-white" />
                  <span className="font-semibold text-white">Background Check Form</span>
                </div>
                <p className="text-sm text-white/80 mb-4">
                  This comprehensive form includes personal information and authorization for background screening to ensure the safety of our children and youth.
                </p>
                <a 
                  href="https://fccgranbury.breezechms.com/form/d1ddc6" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block bg-white text-indigo-900 hover:bg-white/10 hover:text-white font-semibold py-3 px-6 rounded-lg transition-colors border border-white"
                >
                  Complete Background Check Form
                </a>
              </div>
            </div>
          </div>

          {/* Completion Message */}
          <div className="mt-12 p-8 rounded-lg text-center" style={{ backgroundColor: 'rgb(77 124 15)' }}>
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              You're Almost There!
            </h3>
            <p className="text-lg text-white/90 mb-6">
              Once these steps are complete, you will receive confirmation from our staff that you are approved as a Children & Youth volunteer! Thank you so much for being willing to serve this important ministry of the church!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/children"
                className="inline-block bg-white text-lime-700 hover:bg-white/10 hover:text-white font-semibold py-3 px-6 rounded-lg transition-colors border border-white"
              >
                Learn More About Children's Ministry
              </a>
              <a 
                href="/youth"
                className="inline-block bg-white text-lime-700 hover:bg-white/10 hover:text-white font-semibold py-3 px-6 rounded-lg transition-colors border border-white"
              >
                Learn More About Youth Ministry
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
