import { TemplateFormRow, TemplateFormRowPopulated, ContractData } from 'components/company-contracts/types';

export const populateContractData = (
  templateFormRows: TemplateFormRow[],
  valueList: ContractData[],
): ContractData[] => {
  const allCompIDs = new Set(templateFormRows.flatMap((row) => row.components.map((c) => c.id)));
  console.log('allCompIDs:', allCompIDs);

  const populatedMap = new Map<number, ContractData[]>();

  valueList.forEach((valueItem) => {
    populatedMap.set(valueItem.compID, [...(populatedMap.get(valueItem.compID) || []), valueItem]);
  });

  allCompIDs.forEach((compID) => {
    if (!populatedMap.has(compID)) {
      populatedMap.set(compID, [{ compID, index: 1, value: null }]);
    }
  });

  console.log('POPULATED DATA FROM DB:', Array.from(populatedMap.values()).flat());

  return Array.from(populatedMap.values()).flat();
};

export const populateTemplateWithValues = (
  templateFormRows: TemplateFormRow[],
  populatedValueList: ContractData[],
): TemplateFormRowPopulated[] => {
  return templateFormRows.map((row) => {
    const valueMap: { [index: number]: { [compID: number]: any } } = {};

    populatedValueList.forEach((valueItem) => {
      const { compID, index, value } = valueItem;
      if (!valueMap[index]) {
        valueMap[index] = {};
      }
      valueMap[index][compID] = value;
    });

    const allIndexes = new Set<number>();
    row.components.forEach((component) => {
      Object.keys(valueMap).forEach((indexStr) => {
        const index = parseInt(indexStr, 10);
        if (valueMap[index] && valueMap[index][component.id] !== undefined) {
          allIndexes.add(index);
        }
      });
    });

    const values = Array.from(allIndexes).map((index) => {
      const componentsWithValues = row.components.map((component) => {
        return {
          id: component.id,
          label: component.label,
          orderInRow: component.orderInRow,
          tag: component.tag,
          type: component.type,
          value: valueMap[index] && valueMap[index][component.id] !== undefined ? valueMap[index][component.id] : null,
        };
      });

      return {
        index,
        components: componentsWithValues,
      };
    });

    return {
      rowID: row.rowID,
      rowNum: row.rowNum,
      rowLabel: row.rowLabel,
      isAList: row.isAList,
      listName: row.listName,
      values,
    };
  });
};
