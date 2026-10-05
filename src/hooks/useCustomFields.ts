import { useEffect, useMemo } from 'react';
import { CustomField, CustomFieldContext } from '../types/customField';
import { useCustomFieldStore } from '../stores/customFieldStore';

export function useCustomFields(context: CustomFieldContext) {
  const fields = useCustomFieldStore((state) => state.fields);
  const loading = useCustomFieldStore((state) => state.loading);
  const load = useCustomFieldStore((state) => state.load);

  useEffect(() => {
    // If store hasn't been loaded yet, load it
    if (fields.length === 0 && loading) {
      load();
    }
  }, [fields.length, loading, load]);

  const activeFields = useMemo(() => {
    return fields
      .filter((f) => f.context === context && f.activeStatus === 'Active')
      .sort((a, b) => a.order - b.order);
  }, [fields, context]);

  const allFieldsForContext = useMemo(() => {
    return fields
      .filter((f) => f.context === context)
      .sort((a, b) => a.order - b.order);
  }, [fields, context]);

  return {
    fields: activeFields,
    allFields: allFieldsForContext,
    loading,
  };
}
