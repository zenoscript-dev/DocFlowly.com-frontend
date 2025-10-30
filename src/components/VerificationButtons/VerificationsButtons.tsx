import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/core/lib/cn';

interface VerificationButtonsProps {
  onVerified?: () => void;
  onVerifiedAndContinue?: () => void;
  verifiedText?: string;
  verifiedAndContinueText?: string;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  buttonClassName?: string;
  showOnlyVerified?: boolean;
}

const VerificationButtons: React.FC<VerificationButtonsProps> = ({
  onVerified,
  onVerifiedAndContinue,
  verifiedText = "Verified",
  verifiedAndContinueText = "Verified and Continue",
  disabled = false,
  loading = false,
  className,
  buttonClassName,
  showOnlyVerified = false
}) => {
  const handleVerified = () => {
    if (!disabled && !loading && onVerified) {
      onVerified();
    }
  };

  const handleVerifiedAndContinue = () => {
    if (!disabled && !loading && onVerifiedAndContinue) {
      onVerifiedAndContinue();
    }
  };

  return (
    <div className={cn("flex justify-center gap-4 pt-6", className)}>
      <Button 
        onClick={handleVerified}
        size="lg"
        variant="outline"
        disabled={disabled || loading}
        className={cn("px-8 py-3 text-base font-semibold", buttonClassName)}
      >
        {loading ? "Processing..." : verifiedText}
      </Button>
      {!showOnlyVerified && (
        <Button 
          onClick={handleVerifiedAndContinue}
          size="lg"
          disabled={disabled || loading}
          className={cn("px-8 py-3 text-base font-semibold", buttonClassName)}
        >
          {loading ? "Processing..." : verifiedAndContinueText}
        </Button>
      )}
    </div>
  );
};

export default VerificationButtons;
