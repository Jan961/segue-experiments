import { render, screen, fireEvent } from '@testing-library/react';
import TextBoxConfirmation from './TextBoxConfirmation'; // Adjust the import path as necessary

describe('TextBoxConfirmation Component', () => {
  it('should render the required message correctly', () => {
    const setValidMock = jest.fn();
    const requiredMessage = 'UPLOAD';

    render(<TextBoxConfirmation requiredMessage={requiredMessage} setValid={setValidMock} />);

    expect(screen.getByText(`Type ${requiredMessage} to confirm`)).toBeInTheDocument();
  });

  it('should call setValid with false when input does not match the required message', () => {
    const setValidMock = jest.fn();
    const requiredMessage = 'UPLOAD';

    render(<TextBoxConfirmation requiredMessage={requiredMessage} setValid={setValidMock} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'WRONG' } });

    expect(setValidMock).toHaveBeenCalledWith(false);
  });

  it('should call setValid with true when input matches the required message', () => {
    const setValidMock = jest.fn();
    const requiredMessage = 'UPLOAD';

    render(<TextBoxConfirmation requiredMessage={requiredMessage} setValid={setValidMock} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: requiredMessage } });

    expect(setValidMock).toHaveBeenCalledWith(true);
  });

  it('should update the input field value when typing', () => {
    const setValidMock = jest.fn();
    const requiredMessage = 'UPLOAD';

    render(<TextBoxConfirmation requiredMessage={requiredMessage} setValid={setValidMock} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Testing' } });

    expect(input).toHaveValue('Testing');
  });
});
