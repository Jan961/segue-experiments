import { render } from '@testing-library/react';
import TaskList from './TaskList';
import { RecoilRoot } from 'recoil';

describe('TaskList Component', () => {
  it('renders', () => {
    render(
      <RecoilRoot>
        <TaskList tasks={[]} />
      </RecoilRoot>,
    );
  });
});
