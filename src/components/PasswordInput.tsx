import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, Lock } from 'lucide-react';

interface PasswordInputProps {
  id?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  showIcon?: boolean;
}

export const PasswordInput = ({
  id = 'password',
  value,
  onChange,
  placeholder = '••••••••',
  required = false,
  className = '',
  showIcon = true
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      {showIcon && (
        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
      )}
      <Input
        id={id}
        type={showPassword ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`${showIcon ? 'pl-10' : ''} pr-10 ${className}`}
        required={required}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
        aria-label={showPassword ? 'Hide password' : 'Show password'}
        tabIndex={-1}
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </button>
    </div>
  );
};
