export interface TemplateFormStructure {
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
