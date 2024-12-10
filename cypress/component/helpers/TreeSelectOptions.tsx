import { TreeItemOption } from '../../../components/global/TreeSelect/types';

const options: TreeItemOption[] = [
  {
    id: '1',
    label: 'Option 1',
    checked: false,
    value: 'Option 1',
    options: [
      {
        id: '1-1',
        label: 'Option 1-1',
        value: 'Option 1-1',
        checked: false,
        options: [
          {
            id: '1-1-1',
            label: 'Option 1-1-1',
            value: 'Option 1-1-1',
            checked: false,
          },
          {
            id: '1-1-2',
            label: 'Option 1-1-2',
            value: 'Option 1-1-2',
            checked: false,
          },
        ],
      },
      {
        id: '1-2',
        label: 'Option 1-2',
        value: 'Option 1-2',
        checked: false,
      },
    ],
  },
  {
    id: '2',
    label: 'Option 2',
    value: 'Option 2',
    checked: false,
    options: [
      {
        id: '2-1',
        label: 'Option 2-1',
        value: 'Option 2-1',
        checked: false,
        options: [
          {
            id: '2-1-1',
            label: 'Option 2-1-1',
            value: 'Option 2-1-1',
            checked: false,
          },
          {
            id: '2-1-2',
            label: 'Option 2-1-2',
            value: 'Option 2-1-2',
          },
        ],
      },
      {
        id: '2-2',
        label: 'Option 2-2',
        value: 'Option 2-2',
        checked: false,
      },
    ],
  },
];

export default options;
