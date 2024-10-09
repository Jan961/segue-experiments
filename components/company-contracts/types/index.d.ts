export interface ContractData {
  compID: number;
  index: number;
  value: any;
}

export interface TemplateFormRow {
  rowID: number;
  rowNum: number;
  rowLabel: string;
  isAList: boolean;
  listName: string | null;
  components: {
    id: number;
    label: string;
    orderInRow: number;
    tag: string;
    type: string;
  }[];
}

export interface TemplateFormRowPopulated {
  rowID: number;
  rowNum: number;
  rowLabel: string;
  isAList: boolean;
  listName: string | null;
  values: {
    index: number;
    components: {
      id: number;
      label: string;
      orderInRow: number;
      tag: string;
      type: string;
      value: any;
    }[];
  }[];
}
