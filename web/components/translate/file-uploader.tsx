/**
 * File Uploader Component
 * 文件上传组件 - 支持拖拽和点击上传
 */
'use client';

import { useCallback, useState } from 'react';
import { Upload, FileText, X, FileSpreadsheet, File } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FileWithPreview extends File {
  preview?: string;
  id: string;
}

interface FileUploaderProps {
  accept?: string;
  maxSize?: number; // in MB
  multiple?: boolean;
  onFilesChange?: (files: File[]) => void;
  className?: string;
}

const FILE_ICONS = {
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': FileText,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': FileText,
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': FileSpreadsheet,
  'application/pdf': File,
};

export function FileUploader({
  accept = '.pptx,.docx,.xlsx,.pdf',
  maxSize = 100,
  multiple = false,
  onFilesChange,
  className,
}: FileUploaderProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string>('');

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return `文件大小超过 ${maxSize}MB 限制`;
    }

    // Check file type
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/pdf',
    ];

    if (!validTypes.includes(file.type)) {
      return '不支持的文件格式';
    }

    return null;
  };

  const processFiles = (newFiles: FileList | File[]) => {
    setError('');

    const fileArray = Array.from(newFiles);

    if (!multiple && fileArray.length > 1) {
      setError('只能上传一个文件');
      return;
    }

    const validFiles: FileWithPreview[] = [];
    const errors: string[] = [];

    fileArray.forEach((file) => {
      const validationError = validateFile(file);
      if (validationError) {
        errors.push(`${file.name}: ${validationError}`);
      } else {
        validFiles.push({
          ...file,
          id: Math.random().toString(36).substring(7),
        });
      }
    });

    if (errors.length > 0) {
      setError(errors.join('\n'));
    }

    if (validFiles.length > 0) {
      const updatedFiles = multiple ? [...files, ...validFiles] : validFiles;
      setFiles(updatedFiles);
      onFilesChange?.(updatedFiles);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      processFiles(droppedFiles);
    }
  }, [files, multiple]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      processFiles(selectedFiles);
    }
  };

  const removeFile = (id: string) => {
    const updatedFiles = files.filter((f) => f.id !== id);
    setFiles(updatedFiles);
    onFilesChange?.(updatedFiles);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    const Icon = FILE_ICONS[type as keyof typeof FILE_ICONS] || File;
    return Icon;
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Upload Area */}
      <Card
        className={cn(
          'relative border-2 border-dashed transition-all duration-200',
          isDragging
            ? 'border-primary-500 bg-primary-50/50'
            : 'border-gray-300 hover:border-primary-300',
          files.length > 0 ? 'p-4' : 'p-12'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={!multiple && files.length >= 1}
        />

        {files.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center">
              <Upload className="w-8 h-8 text-primary-500" />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-900 mb-1">
                拖拽文件到此处，或点击上传
              </p>
              <p className="text-sm text-gray-500">
                支持 PPT、Word、Excel、PDF，最大 {maxSize}MB
              </p>
            </div>
            <Button type="button" size="lg" className="btn-primary">
              选择文件
            </Button>
          </div>
        ) : null}
      </Card>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-lg bg-error-light text-error text-sm">
          {error}
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file) => {
            const Icon = getFileIcon(file.type);
            return (
              <Card key={file.id} className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(file.id)}
                    className="flex-shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
