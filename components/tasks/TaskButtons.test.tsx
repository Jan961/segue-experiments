import { render } from '@testing-library/react';
import TaskButtons from './TaskButtons';
import { RecoilRoot } from 'recoil';

describe('TaskButtons Component', () => {
  it('renders', () => {
    render(
      <RecoilRoot>
        <TaskButtons
          openBulkModal={(key) => {
            console.log(key);
          }}
        />
      </RecoilRoot>,
    );
  });
});
