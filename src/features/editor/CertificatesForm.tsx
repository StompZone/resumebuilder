import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useResumeStore } from '@/persistence/resumeStore';
import { certificateSchema } from '@/domain/resume/schemas';
import { Certificate } from '@/domain/resume/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MonthYearPicker } from '@/components/ui/month-year-picker';
import { Trash, Plus, ChevronUp, ChevronDown } from 'lucide-react';

/**
 * Props for CertificateItemEditor.
 */
interface CertificateItemEditorProps {
  cert: Certificate;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}

/**
 * Sub-editor for a single certificate entry.
 */
function CertificateItemEditor({
  cert,
  onRemove,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: CertificateItemEditorProps) {
  const { updateCertificate } = useResumeStore();

  const {
    register,
    control,
    watch,
    formState: { errors },
    reset,
  } = useForm<Certificate>({
    resolver: zodResolver(certificateSchema),
    defaultValues: cert,
    mode: 'onChange',
  });

  React.useEffect(() => {
    reset(cert);
  }, [cert, reset]);

  React.useEffect(() => {
    const subscription = watch((value) => {
      if (value) {
        updateCertificate(cert.id, value as Partial<Certificate>);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, cert.id, updateCertificate]);

  return (
    <Card className="border shadow-2xs bg-card">
      <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-start md:items-end">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1 w-full">
          <div className="space-y-1">
            <Label className="text-xs">Certification Name</Label>
            <Input
              placeholder="e.g. AWS Certified Architect"
              className="h-9"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-[10px] text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Issuing Authority / Company</Label>
            <Input
              placeholder="e.g. Amazon Web Services"
              className="h-9"
              {...register('issuer')}
            />
            {errors.issuer && (
              <p className="text-[10px] text-destructive">{errors.issuer.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Certification Link (URL)</Label>
            <Input
              placeholder="e.g. https://aws.amazon.com/..."
              className="h-9"
              {...register('url')}
            />
            {errors.url && (
              <p className="text-[10px] text-destructive">{errors.url.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Date Received</Label>
            <Controller
              control={control}
              name="date"
              render={({ field }) => (
                <MonthYearPicker
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.date && (
              <p className="text-[10px] text-destructive">{errors.date.message}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0 self-stretch md:self-auto justify-end">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onMoveUp}
            disabled={isFirst}
            className="h-9 w-9 text-muted-foreground"
          >
            <ChevronUp className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onMoveDown}
            disabled={isLast}
            className="h-9 w-9 text-muted-foreground"
          >
            <ChevronDown className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onRemove}
            className="h-9 w-9 text-destructive hover:bg-destructive/10"
          >
            <Trash className="size-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Main Certificates list editor.
 */
export function CertificatesForm() {
  const { resume, addCertificate, removeCertificate, updateResume } = useResumeStore();

  const handleAdd = () => {
    addCertificate({
      name: '',
      date: new Date().toISOString().slice(0, 7),
      issuer: '',
      url: '',
    });
  };

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      const nextCertificates = Array.from(resume.certificates);
      const [removed] = nextCertificates.splice(index, 1);
      nextCertificates.splice(index - 1, 0, removed);
      updateResume({ ...resume, certificates: nextCertificates });
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < resume.certificates.length - 1) {
      const nextCertificates = Array.from(resume.certificates);
      const [removed] = nextCertificates.splice(index, 1);
      nextCertificates.splice(index + 1, 0, removed);
      updateResume({ ...resume, certificates: nextCertificates });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b">
        <div>
          <h2 className="text-base font-semibold text-foreground">Certifications</h2>
          <p className="text-xs text-muted-foreground">List your licenses, cloud certifications, or other professional credentials.</p>
        </div>
        <Button
          type="button"
          onClick={handleAdd}
          className="gap-1.5 h-9"
        >
          <Plus className="size-4" />
          Add Certification
        </Button>
      </div>

      <div className="space-y-3">
        {resume.certificates.map((cert, index) => (
          <CertificateItemEditor
            key={cert.id}
            cert={cert}
            onRemove={() => removeCertificate(cert.id)}
            onMoveUp={() => handleMoveUp(index)}
            onMoveDown={() => handleMoveDown(index)}
            isFirst={index === 0}
            isLast={index === resume.certificates.length - 1}
          />
        ))}

        {resume.certificates.length === 0 && (
          <div className="text-center py-8 border border-dashed rounded-xl bg-card">
            <p className="text-sm text-muted-foreground">No certifications added yet.</p>
            <Button
              type="button"
              variant="outline"
              onClick={handleAdd}
              className="mt-3 gap-1 h-8"
            >
              <Plus className="size-3.5" />
              Add Certification
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
