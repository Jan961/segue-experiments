import { IconProps } from '../Icon/Icon';

export interface ExportType {
  key: string;
  iconName?: string;
  variant?: string;
  iconProps?: Partial<IconProps>;
}

export interface PdfStyles {
  headerHeight?: number;
  rowHeight?: number;
  headerRowColor?: string;
  evenRowColor?: string;
  oddRowColor?: string;
  widths?: string[]; // array of widths in percentages and should also match with number of cols Ex: ['20%','80%']
  outerLineBorderColor?: string;
  innerLineBorderColor?: string;
}

export interface ExportModalProps {
  visible: boolean;
  ExportList: ExportType[];
  onClose: () => void;
  tableRef: any;
  pdfStyles?: PdfStyles;
}
