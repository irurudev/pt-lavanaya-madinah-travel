import { Box, type BoxProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

/**
 * Native Select Component untuk Chakra UI
 * Wrapper untuk HTML select element dengan styling Chakra
 */

export interface NativeSelectRootProps extends BoxProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const NativeSelectRoot = forwardRef<HTMLDivElement, NativeSelectRootProps>(
  ({ children, ...props }, ref) => {
    return (
      <Box ref={ref} position="relative" {...props}>
        {children}
      </Box>
    );
  }
);

NativeSelectRoot.displayName = 'NativeSelectRoot';

export interface NativeSelectFieldProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

export const NativeSelectField = forwardRef<HTMLSelectElement, NativeSelectFieldProps>(
  ({ size = 'md', style, ...props }, ref) => {
    const sizeStyles = {
      xs: { height: '2rem', fontSize: '0.75rem', paddingLeft: '0.5rem', paddingRight: '0.5rem' },
      sm: { height: '2.5rem', fontSize: '0.875rem', paddingLeft: '0.75rem', paddingRight: '0.75rem' },
      md: { height: '2.75rem', fontSize: '1rem', paddingLeft: '1rem', paddingRight: '1rem' },
      lg: { height: '3rem', fontSize: '1.125rem', paddingLeft: '1rem', paddingRight: '1rem' },
    };

    const baseStyles = sizeStyles[size];

    return (
      <select
        ref={ref}
        style={{
          width: '100%',
          height: baseStyles.height,
          fontSize: baseStyles.fontSize,
          paddingLeft: baseStyles.paddingLeft,
          paddingRight: baseStyles.paddingRight,
          borderWidth: '1px',
          borderRadius: '0.375rem',
          borderColor: '#D1D5DB',
          backgroundColor: 'white',
          outline: 'none',
          ...style,
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = '#0D9488';
          e.currentTarget.style.boxShadow = '0 0 0 1px #0D9488';
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = '#D1D5DB';
          e.currentTarget.style.boxShadow = 'none';
        }}
        {...props}
      />
    );
  }
);

NativeSelectField.displayName = 'NativeSelectField';
