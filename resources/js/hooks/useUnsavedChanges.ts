import { useCallback, useEffect, useRef } from 'react';

/**
 * Hook untuk track unsaved changes dan prevent accidental refresh
 * Menampilkan warning dialog ketika user mencoba refresh dengan unsaved changes
 */
export const useUnsavedChanges = (hasUnsavedChanges: boolean = false) => {
  const unsavedChangesRef = useRef<boolean>(hasUnsavedChanges);

  // Update ref ketika prop berubah
  useEffect(() => {
    unsavedChangesRef.current = hasUnsavedChanges;
  }, [hasUnsavedChanges]);

  // Handle beforeunload event
  const handleBeforeUnload = useCallback(
    (e: BeforeUnloadEvent) => {
      if (unsavedChangesRef.current) {
        // Mencegah page reload
        e.preventDefault();
        // Set return value untuk trigger warning dialog
        e.returnValue = '';
        return '';
      }
    },
    []
  );

  // Add event listener saat component mount
  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [handleBeforeUnload]);

  return {
    setUnsavedChanges: (value: boolean) => {
      unsavedChangesRef.current = value;
    },
    hasUnsavedChanges: () => unsavedChangesRef.current,
  };
};
