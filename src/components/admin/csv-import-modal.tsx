'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, FileText, CheckCircle, AlertCircle, Download } from 'lucide-react';

interface ImportResults {
  total: number;
  created: number;
  familiesCreated: number;
  errors: string[];
}

interface CSVImportModalProps {
  onImportComplete?: () => void;
}

export function CSVImportModal({ onImportComplete }: CSVImportModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importResults, setImportResults] = useState<ImportResults | null>(null);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setProgress(0);
    setImportResults(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const response = await fetch('/api/admin/members/import', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(100);

      const data = await response.json();

      if (response.ok) {
        setImportResults(data.results);
        onImportComplete?.();
      } else {
        throw new Error(data.error || 'Import failed');
      }
    } catch (error) {
      console.error('Import error:', error);
      setImportResults({
        total: 0,
        created: 0,
        familiesCreated: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      });
    } finally {
      setIsImporting(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent = `firstName,lastName,preferredName,email,phone,address,city,state,zipCode,dateOfBirth,anniversaryDate,memberSince,membershipStatus,baptismDate,spouseName,childrenNames,emergencyContact,emergencyPhone,allowDirectoryListing,allowLayLeadership,notes,familyName,familyAddress,familyCity,familyState,familyZipCode,familyPhone,familyEmail,familyNotes,firstVisitDate,firstVisitService,howDidYouHear,previousChurch,welcomeTeamNotes
John,Doe,John,john.doe@email.com,555-1234,123 Main St,Anytown,TX,12345,1990-01-01,2015-06-15,2020-01-01,Member (Active),2010-05-15,Jane Doe,"Child1, Child2",Emergency Contact,555-5678,true,false,Notes about John,The Doe Family,123 Main St,Anytown,TX,12345,555-1234,john.doe@email.com,Family notes,2020-01-01,9:00 AM Service,Website,Previous Church,Welcome team notes
Jane,Smith,Jane,jane.smith@email.com,555-2345,456 Oak Ave,Anytown,TX,12345,1985-03-15,2015-06-15,2020-02-01,Member (Active),2011-08-20,Bob Smith,"Child3, Child4",Emergency Contact 2,555-6789,true,true,Notes about Jane,The Smith Family,456 Oak Ave,Anytown,TX,12345,555-2345,jane.smith@email.com,Family notes,2020-02-01,11:00 AM Service,Friend,Another Church,Welcome team notes`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'member-import-template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const resetModal = () => {
    setImportResults(null);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      resetModal();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Upload className="h-4 w-4 mr-2" />
          Import CSV
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Import Members from CSV
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {!importResults && (
            <>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Step 1: Download Template</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Download our CSV template to see the expected format and column names.
                  </p>
                  <Button variant="outline" onClick={downloadTemplate}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Template
                  </Button>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Step 2: Upload Your CSV</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Select your CSV file with member data. The system will automatically map columns based on their names.
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelect}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    disabled={isImporting}
                  />
                </div>
              </div>

              {isImporting && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Importing members...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                </div>
              )}
            </>
          )}

          {importResults && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                {importResults.errors.length === 0 ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                )}
                <h3 className="text-lg font-medium">
                  Import Complete
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 p-3 rounded">
                  <div className="font-medium">Total Processed</div>
                  <div className="text-2xl font-bold text-gray-900">{importResults.total}</div>
                </div>
                <div className="bg-green-50 p-3 rounded">
                  <div className="font-medium">Members Created</div>
                  <div className="text-2xl font-bold text-green-600">{importResults.created}</div>
                </div>
                <div className="bg-blue-50 p-3 rounded">
                  <div className="font-medium">Families Created</div>
                  <div className="text-2xl font-bold text-blue-600">{importResults.familiesCreated}</div>
                </div>
                <div className="bg-red-50 p-3 rounded">
                  <div className="font-medium">Errors</div>
                  <div className="text-2xl font-bold text-red-600">{importResults.errors.length}</div>
                </div>
              </div>

              {importResults.errors.length > 0 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="font-medium mb-2">Import Errors:</div>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {importResults.errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={resetModal}>
                  Import Another File
                </Button>
                <Button onClick={() => setIsOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
