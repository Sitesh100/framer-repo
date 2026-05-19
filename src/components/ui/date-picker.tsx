'use client';

import * as React from 'react';
import { format, parse, isValid } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const ISO = 'yyyy-MM-dd';

const toDate = (iso?: string): Date | undefined => {
  if (!iso) return undefined;
  const d = parse(iso, ISO, new Date());
  return isValid(d) ? d : undefined;
};

interface DatePickerProps {
  value?: string;                       // ISO yyyy-MM-dd
  onChange: (iso: string) => void;
  placeholder?: string;
  minDate?: Date;
  formatStr?: string;                   // display format
  className?: string;
  triggerClassName?: string;
  variant?: 'plain' | 'field' | 'dark'; // visual style
  disabled?: boolean;
  align?: 'start' | 'center' | 'end';
}

export function DatePicker({
  value,
  onChange,
  placeholder = 'Pick a date',
  minDate,
  formatStr = 'dd MMM yyyy',
  className,
  triggerClassName,
  variant = 'plain',
  disabled,
  align = 'start',
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const selected = toDate(value);

  const triggerStyles: Record<NonNullable<DatePickerProps['variant']>, string> = {
    plain:
      'flex items-center gap-2 text-[15px] font-semibold text-slate-900 bg-transparent outline-none w-full text-left disabled:opacity-50',
    field:
      'flex items-center gap-2 px-4 py-3 h-[64px] w-full bg-white rounded-xl hover:shadow-md transition-shadow text-left disabled:opacity-50',
    dark:
      'flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors w-full text-left',
  };

  return (
    <div className={cn('relative', className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button type="button" disabled={disabled} className={cn(triggerStyles[variant], triggerClassName)}>
            <CalendarIcon className={cn('w-4 h-4 shrink-0', variant === 'dark' ? 'text-white/70' : 'text-slate-400')} />
            <span className={cn(!selected && 'text-slate-400')}>
              {selected ? format(selected, formatStr) : placeholder}
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent align={align} className="w-auto p-0">
          <Calendar
            mode="single"
            selected={selected}
            onSelect={(d) => {
              if (d) {
                onChange(format(d, ISO));
                setOpen(false);
              }
            }}
            disabled={minDate ? { before: minDate } : undefined}
            autoFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
