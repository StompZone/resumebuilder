import * as React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useResumeStore } from '@/persistence/resumeStore';
import { basicsSchema } from '@/domain/resume/schemas';
import { Resume } from '@/domain/resume/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash, Plus, Globe, User } from 'lucide-react';

/**
 * Form component for editing the basics (personal info, location, profiles).
 */
export function BasicsForm() {
  const { resume, updateBasics } = useResumeStore();
  const basics = resume.basics;

  const {
    register,
    control,
    watch,
    formState: { errors },
    reset,
  } = useForm<Resume['basics']>({
    resolver: zodResolver(basicsSchema),
    defaultValues: basics,
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'profiles',
  });

  // Sync form state when store loads fresh data (like sample data or imports)
  React.useEffect(() => {
    reset(basics);
  }, [basics, reset]);

  // Watch for form value changes and update Zustand store in real time
  React.useEffect(() => {
    const subscription = watch((value) => {
      if (value) {
        // Safe casting: form values match basics structure
        updateBasics(value as Resume['basics']);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, updateBasics]);

  return (
    <div className="space-y-6">
      <Card className="border shadow-xs">
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <User className="size-4 text-primary" />
            Contact & Identification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="name" className="text-xs">Full Name</Label>
              <Input
                id="name"
                placeholder="Sophia Vance"
                className="h-9"
                {...register('name')}
              />
              {errors.name && (
                <p className="text-[10px] text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="label" className="text-xs">Job Title / Headline</Label>
              <Input
                id="label"
                placeholder="Senior Full Stack Software Engineer"
                className="h-9"
                {...register('label')}
              />
              {errors.label && (
                <p className="text-[10px] text-destructive">{errors.label.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="email" className="text-xs">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="sophia.vance@example.com"
                className="h-9"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-[10px] text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="phone" className="text-xs">Phone Number</Label>
              <Input
                id="phone"
                placeholder="+1 (555) 019-2834"
                className="h-9"
                {...register('phone')}
              />
              {errors.phone && (
                <p className="text-[10px] text-destructive">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-1 md:col-span-2">
              <Label htmlFor="url" className="text-xs">Personal Portfolio / Website</Label>
              <Input
                id="url"
                placeholder="https://sophiavance.dev"
                className="h-9"
                {...register('url')}
              />
              {errors.url && (
                <p className="text-[10px] text-destructive">{errors.url.message}</p>
              )}
            </div>

            <div className="space-y-1 md:col-span-2">
              <Label htmlFor="summary" className="text-xs">Professional Summary</Label>
              <Textarea
                id="summary"
                placeholder="Write a brief summary of your skills and experience..."
                rows={4}
                {...register('summary')}
              />
              {errors.summary && (
                <p className="text-[10px] text-destructive">{errors.summary.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border shadow-xs">
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Globe className="size-4 text-primary" />
            Location
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1 md:col-span-2">
              <Label htmlFor="address" className="text-xs">Street Address</Label>
              <Input
                id="address"
                placeholder="100 Innovation Way"
                className="h-9"
                {...register('location.address')}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="postalCode" className="text-xs">Postal Code</Label>
              <Input
                id="postalCode"
                placeholder="94016"
                className="h-9"
                {...register('location.postalCode')}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="city" className="text-xs">City</Label>
              <Input
                id="city"
                placeholder="San Francisco"
                className="h-9"
                {...register('location.city')}
              />
              {errors.location?.city && (
                <p className="text-[10px] text-destructive">{errors.location.city.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="region" className="text-xs">State / Region</Label>
              <Input
                id="region"
                placeholder="California"
                className="h-9"
                {...register('location.region')}
              />
              {errors.location?.region && (
                <p className="text-[10px] text-destructive">{errors.location.region.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="countryCode" className="text-xs">Country Code</Label>
              <Input
                id="countryCode"
                placeholder="US"
                className="h-9"
                {...register('location.countryCode')}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border shadow-xs">
        <CardHeader className="pb-4 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Linkedin className="size-4 text-primary" />
            Social Profiles
          </CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ network: '', username: '', url: '' })}
            className="h-8 gap-1"
          >
            <Plus className="size-3.5" />
            Add Profile
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-4 items-end border p-3 rounded-lg bg-muted/10 relative group">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                <div className="space-y-1">
                  <Label className="text-xs">Network</Label>
                  <Input
                    placeholder="e.g. GitHub, LinkedIn"
                    className="h-9"
                    {...register(`profiles.${index}.network` as const)}
                  />
                  {errors.profiles?.[index]?.network && (
                    <p className="text-[10px] text-destructive">{errors.profiles[index].network.message}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Username</Label>
                  <Input
                    placeholder="e.g. sophiavance"
                    className="h-9"
                    {...register(`profiles.${index}.username` as const)}
                  />
                  {errors.profiles?.[index]?.username && (
                    <p className="text-[10px] text-destructive">{errors.profiles[index].username.message}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Profile URL</Label>
                  <Input
                    placeholder="e.g. https://github.com/..."
                    className="h-9"
                    {...register(`profiles.${index}.url` as const)}
                  />
                  {errors.profiles?.[index]?.url && (
                    <p className="text-[10px] text-destructive">{errors.profiles[index].url.message}</p>
                  )}
                </div>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => remove(index)}
                className="text-destructive hover:bg-destructive/10 shrink-0 h-9 w-9"
              >
                <Trash className="size-4" />
              </Button>
            </div>
          ))}

          {fields.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-2">
              No profiles added. Add profiles to show networks like LinkedIn, GitHub, etc.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
