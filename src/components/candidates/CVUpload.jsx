import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, CheckCircle2 } from 'lucide-react';
import { uploadResume } from '../../api/candidates';
import toast from 'react-hot-toast';
import Button from '../common/Button';

export default function CVUpload({ onSuccess }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);

  const onDrop = useCallback((accepted) => { if (accepted.length) setFile(accepted[0]); }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'application/pdf': ['.pdf'] }, maxFiles: 1, maxSize: 10 * 1024 * 1024,
  });

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('resume', file);
      const { data } = await uploadResume(formData);
      setResult(data.parsed_data);
      toast.success('Resume uploaded and parsed!');
      onSuccess?.(data);
    } catch (err) { toast.error(err.response?.data?.error || 'Upload failed'); }
    setUploading(false);
  };

  return (
    <div className="space-y-4">
      <div {...getRootProps()} className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all
        ${isDragActive ? 'border-primary-400 bg-primary-50' : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'}`}>
        <input {...getInputProps()} />
        {file ? (
          <div className="flex flex-col items-center gap-2">
            <FileText className="w-10 h-10 text-primary-500" />
            <p className="font-medium text-gray-700">{file.name}</p>
            <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="w-10 h-10 text-gray-400" />
            <p className="font-medium text-gray-600">Drop your resume here or click to browse</p>
            <p className="text-xs text-gray-400">PDF only, max 10 MB</p>
          </div>
        )}
      </div>

      {file && <Button onClick={handleUpload} loading={uploading} className="w-full">Upload & Parse Resume</Button>}

      {result && (
        <div className="card bg-green-50 border-green-200">
          <div className="flex items-center gap-2 mb-3"><CheckCircle2 className="w-5 h-5 text-green-600" /><h3 className="font-semibold text-green-800">Resume Parsed Successfully</h3></div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {result.email && <p><span className="text-gray-500">Email:</span> {result.email}</p>}
            {result.phone && <p><span className="text-gray-500">Phone:</span> {result.phone}</p>}
            {result.experience_years > 0 && <p><span className="text-gray-500">Experience:</span> {result.experience_years} years</p>}
          </div>
          {result.skills?.length > 0 && (
            <div className="mt-3">
              <p className="text-xs text-gray-500 mb-1">Skills found:</p>
              <div className="flex flex-wrap gap-1.5">
                {result.skills.map((s) => <span key={s} className="px-2 py-0.5 bg-green-200 text-green-800 rounded-md text-[10px] font-medium">{s}</span>)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
