import { render, screen } from '@testing-library/react';
import { FormContainer } from '../FormContainer';

describe('Tests for FormContainer', () => {
  it('Renders children correctly', () => {
    render(
      <FormContainer>
        <div>Test Child</div>
      </FormContainer>
    );
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });

  it('Applies the correct styling', () => {
    const { container } = render(
      <FormContainer>
        <div>Test Child</div>
      </FormContainer>
    );
    expect(container.firstChild).toHaveClass('p-4 rounded-lg shadow-lg relative mb-4 max-w-screen-md mx-auto bg-white');
  });
});
