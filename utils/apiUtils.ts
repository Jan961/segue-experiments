import { isNullOrUndefined, isUndefined } from 'utils';

export type FieldMapping = {
  key: string;
  updateKey: string;
  isDate?: boolean;
  isSetArray?: boolean;
  arrayKey?: string;
  isForeignKey?: boolean;
  foreignKeyId?: string;
};

type UpdateData = Record<string, any>;

export const prepareQuery = <T>(details: T, fieldMappings: FieldMapping[], isCreate = false): UpdateData => {
  const updateData: UpdateData = {};

  fieldMappings.forEach(({ key, updateKey, isDate, isSetArray, arrayKey, isForeignKey, foreignKeyId }) => {
    const value = details[key];
    const hasValue = isCreate ? !isNullOrUndefined(value) : !isUndefined(value);
    if (hasValue) {
      if (isDate) {
        updateData[updateKey] = value ? new Date(value as string) : null;
      } else if (isSetArray && arrayKey) {
        updateData[updateKey] = {
          set: (value as any[]).map((item) => ({
            [arrayKey]: item,
          })),
        };
      } else if (isForeignKey && foreignKeyId) {
        updateData[updateKey] = value === null ? { disconnect: true } : { connect: { [foreignKeyId]: value } };
      } else {
        updateData[updateKey] = value;
      }
    }
  });

  return updateData;
};
