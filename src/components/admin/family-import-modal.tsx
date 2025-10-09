'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Upload, FileText, Download, XCircle, CheckCircle } from 'lucide-react';

interface FamilyImportModalProps {
  onImportComplete: () => void;
}

export function FamilyImportModal({ onImportComplete }: FamilyImportModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [importResult, setImportResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
      setImportResult(null);
      setError(null);
      setProgress(0);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    setUploading(true);
    setProgress(0);
    setImportResult(null);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/admin/families/import', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to import families');
      }

      const result = await response.json();
      setImportResult(result);
      onImportComplete(); // Refresh data
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
      setProgress(100);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setFile(null);
    setImportResult(null);
    setError(null);
    setUploading(false);
    setProgress(0);
  };

  const downloadTemplate = () => {
    const headers = ["First Name", "Last Name"];
    const sampleData = [
      '"John, Jane, Bobby",Smith',
      '"Mary, Tom",Johnson',
      'Single,Person'
    ];
    
    const csvContent = [headers.join(','), ...sampleData].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'family_import_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Upload className="mr-2 h-4 w-4" /> Import Families
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import Families from CSV</DialogTitle>
          <DialogDescription>
            Upload a CSV file to import family groupings. First column should contain member names (comma-separated for multiple members), second column should contain the family last name.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={downloadTemplate}>
              <Download className="mr-2 h-4 w-4" /> Download Template
            </Button>
            <span className="text-sm text-gray-500">Use this template for correct format.</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="familyFile" className="text-right">
              CSV File
            </Label>
            <Input id="familyFile" type="file" accept=".csv" onChange={handleFileChange} className="col-span-3" />
          </div>
          {file && <p className="text-sm text-gray-600 text-center">Selected file: {file.name}</p>}
          {uploading && (
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-gray-600 text-center">Importing families...</p>
            </div>
          )}
          {error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Import Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {importResult && (
            <div className="space-y-4">
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Import Complete!</AlertTitle>
                <AlertDescription>
                  Successfully processed {importResult.totalRows} rows.
                </AlertDescription>
              </Alert>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-green-50 p-3 rounded">
                  <div className="font-semibold text-green-800">Families Created</div>
                  <div className="text-2xl font-bold text-green-600">{importResult.familiesCreated}</div>
                </div>
                <div className="bg-blue-50 p-3 rounded">
                  <div className="font-semibold text-blue-800">Members Linked</div>
                  <div className="text-2xl font-bold text-blue-600">{importResult.membersLinked}</div>
                </div>
              </div>

              {importResult.successfulFamilies.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-green-800">Successfully Created Families:</h4>
                  <div className="max-h-32 overflow-y-auto bg-green-50 p-2 rounded text-sm">
                    {importResult.successfulFamilies.map((family: string, index: number) => (
                      <div key={index} className="text-green-700">• {family}</div>
                    ))}
                  </div>
                </div>
              )}

              {importResult.failedFamilies.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-red-800">Failed Families:</h4>
                  <div className="max-h-32 overflow-y-auto bg-red-50 p-2 rounded text-sm">
                    {importResult.failedFamilies.map((family: string, index: number) => (
                      <div key={index} className="text-red-700">• {family}</div>
                    ))}
                  </div>
                </div>
              )}

              {importResult.errors.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-orange-800">Errors:</h4>
                  <div className="max-h-32 overflow-y-auto bg-orange-50 p-2 rounded text-sm">
                    {importResult.errors.map((error: string, index: number) => (
                      <div key={index} className="text-orange-700">• {error}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>
          {!importResult && (
            <Button onClick={handleUpload} disabled={!file || uploading}>
              {uploading ? 'Importing...' : 'Import Families'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
