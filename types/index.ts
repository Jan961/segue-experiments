export interface WithTestId {
  testId?: string;
}

export type EmailTemplateType = {
  templateId: string;
  templateName: string;
  templateDescription?: string;
  templateFields?: string[];
  emailFrom: string;
};
