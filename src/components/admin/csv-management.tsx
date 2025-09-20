"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Download, Upload, FileText, AlertCircle, CheckCircle, XCircle } from "lucide-react";

interface ImportResult {
  success: boolean;
  created: number;
  updated: number;
  errors: string[];
  details: {
    row: number;
    action: 'created' | 'updated' | 'error';
    message: string;
    ministryName?: string;
  }[];
}

export function CSVManagement({ onDataUpdated }: { onDataUpdated: () => void }) {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const response = await fetch('/api/admin/ministries/export');
      
      if (!response.ok) {
        throw new Error('Failed to export ministries');
      }

      // Create blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      
      // Get filename from Content-Disposition header or use default
      const contentDisposition = response.headers.get('Content-Disposition');
      const filename = contentDisposition 
        ? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
        : `ministries-export-${new Date().toISOString().split('T')[0]}.csv`;
      
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export ministries. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.endsWith('.csv')) {
        alert('Please select a CSV file.');
        return;
      }
      setSelectedFile(file);
      setImportResult(null);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) {
      alert('Please select a CSV file to import.');
      return;
    }

    setIsImporting(true);
    setImportResult(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('/api/admin/ministries/import', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to import ministries');
      }

      setImportResult(result);
      
      // Refresh the ministry data if import was successful
      if (result.success && (result.created > 0 || result.updated > 0)) {
        onDataUpdated();
      }

    } catch (error) {
      console.error('Import error:', error);
      setImportResult({
        success: false,
        created: 0,
        updated: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        details: []
      });
    } finally {
      setIsImporting(false);
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'created':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'updated':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'created':
        return 'text-green-600 bg-green-50';
      case 'updated':
        return 'text-blue-600 bg-blue-50';
      case 'error':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            CSV Data Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Export Section */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Export Ministry Data</h3>
            <p className="text-sm text-gray-600 mb-3">
              Download all ministry data as a CSV file for editing in Excel or Google Sheets.
              The file includes all fields including primary keys for re-importing.
            </p>
            <Button 
              onClick={handleExport} 
              disabled={isExporting}
              className="w-full sm:w-auto"
            >
              <Download className="h-4 w-4 mr-2" />
              {isExporting ? 'Exporting...' : 'Export CSV'}
            </Button>
          </div>

          {/* Import Section */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Import Ministry Data</h3>
            <p className="text-sm text-gray-600 mb-3">
              Upload a CSV file to create new ministries or update existing ones.
              Existing ministries will be updated if they have a matching ID.
            </p>
            
            <div className="space-y-3">
              <Input
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              
              {selectedFile && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FileText className="h-4 w-4" />
                  {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                </div>
              )}
              
              <Button 
                onClick={handleImport} 
                disabled={isImporting || !selectedFile}
                className="w-full sm:w-auto"
              >
                <Upload className="h-4 w-4 mr-2" />
                {isImporting ? 'Importing...' : 'Import CSV'}
              </Button>
            </div>
          </div>

          {/* CSV Format Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">CSV Format Guidelines</h4>
            <div className="text-sm text-blue-800 space-y-1">
              <p><strong>Required fields:</strong> id, name, contactPerson, description</p>
              <p><strong>Contact fields:</strong> contactHeading (e.g., &quot;Outreach Chair&quot;), contactPerson, contactEmail, contactPhone</p>
              <p><strong>Array fields:</strong> Use pipe (|) to separate multiple values (e.g., &quot;Category1|Category2&quot;)</p>
              <p><strong>Boolean fields:</strong> Use &quot;true&quot; or &quot;false&quot; for isActive</p>
              <p><strong>Updates:</strong> Include the ministry ID to update existing records</p>
              <p><strong>New records:</strong> Leave ID empty or omit it to create new ministries</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Import Results */}
      {importResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {importResult.success ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-500" />
              )}
              Import Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{importResult.created}</div>
                <div className="text-sm text-gray-600">Created</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{importResult.updated}</div>
                <div className="text-sm text-gray-600">Updated</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{importResult.errors.length}</div>
                <div className="text-sm text-gray-600">Errors</div>
              </div>
            </div>

            {importResult.errors.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold text-red-900 mb-2">Errors:</h4>
                <div className="bg-red-50 border border-red-200 rounded p-3">
                  {importResult.errors.map((error, index) => (
                    <div key={index} className="text-sm text-red-800">{error}</div>
                  ))}
                </div>
              </div>
            )}

            {importResult.details.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Details:</h4>
                <div className="max-h-60 overflow-y-auto space-y-1">
                  {importResult.details.map((detail, index) => (
                    <div 
                      key={index} 
                      className={`flex items-center gap-2 p-2 rounded text-sm ${getActionColor(detail.action)}`}
                    >
                      {getActionIcon(detail.action)}
                      <span className="font-mono">Row {detail.row}:</span>
                      <span>{detail.message}</span>
                      {detail.ministryName && (
                        <span className="font-semibold">({detail.ministryName})</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
