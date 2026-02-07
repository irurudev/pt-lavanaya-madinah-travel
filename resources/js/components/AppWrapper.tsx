import { useUnsavedChanges } from '@/hooks/useUnsavedChanges';
import type { ReactNode } from 'react';

interface AppWrapperProps {
  children: ReactNode;
}

/**
 * Root wrapper untuk mengaktifkan fitur anti-refresh global
 * Mencegah page reload ketika ada unsaved changes di aplikasi
 */
export function AppWrapper({ children }: AppWrapperProps) {
  // Inisialisasi hook untuk anti-refresh pada root level
  useUnsavedChanges(false);

  return <>{children}</>;
}
