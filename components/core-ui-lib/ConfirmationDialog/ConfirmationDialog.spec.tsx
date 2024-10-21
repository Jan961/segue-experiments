import { render, screen, within, waitFor } from '@testing-library/react';
import ConfirmationDialog, { ConfirmationDialogProps, confOptions } from './ConfirmationDialog';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';

const ModalTestWrapper = (props: Partial<ConfirmationDialogProps>) => {
  const [showModal, setShowModal] = useState(true);

  const handleNoClick = () => {
    props.onNoClick();
    setShowModal(false);
  };

  return <ConfirmationDialog show={showModal} onNoClick={handleNoClick} {...props} />;
};

describe('ConfirmationDialog Component', () => {
  test('renders component correctly with default values: variant=cancel', async () => {
    const onYesClicked = jest.fn();
    const onNoClicked = jest.fn();

    render(<ModalTestWrapper show={true} onYesClick={onYesClicked} onNoClick={onNoClicked} variant="cancel" />);
    const dialog = await screen.findByTestId('confirmation-dialog');
    expect(within(dialog).getByText(confOptions.cancel.question)).toBeInTheDocument();
    expect(within(dialog).getByText(confOptions.cancel.warning)).toBeInTheDocument();
    expect(within(dialog).getByText('Yes')).toBeInTheDocument();
    expect(within(dialog).getByText('No')).toBeInTheDocument();
    await userEvent.click(within(dialog).getByText('No'));
    await waitFor(() => expect(onNoClicked).toHaveBeenCalled());
  });

  test('renders component : variant==close', async () => {
    render(<ConfirmationDialog show={true} variant="close" labelYes="Sure" labelNo="No Thanks" />);
    const dialog = await screen.findByTestId('confirmation-dialog');
    expect(within(dialog).getByText(confOptions.close.question)).toBeInTheDocument();
    expect(within(dialog).getByText(confOptions.close.warning)).toBeInTheDocument();
    expect(within(dialog).getByText('Sure')).toBeInTheDocument();
    expect(within(dialog).getByText('No Thanks')).toBeInTheDocument();
  });

  test('renders component : variant==delete', async () => {
    render(<ConfirmationDialog show={true} variant="delete" />);
    const dialog = await screen.findByTestId('confirmation-dialog');
    expect(within(dialog).getByText(confOptions.delete.question)).toBeInTheDocument();
    expect(within(dialog).getByText(confOptions.delete.warning)).toBeInTheDocument();
  });

  test('renders component : variant==logout', async () => {
    render(<ConfirmationDialog show={true} variant="logout" />);
    const dialog = await screen.findByTestId('confirmation-dialog');
    expect(within(dialog).getByText(confOptions.logout.question)).toBeInTheDocument();
    expect(within(dialog).getByTestId('confirmation-dialog-warning')).toHaveTextContent('');
  });

  test('renders component : variant==leave', async () => {
    render(<ConfirmationDialog show={true} variant="leave" />);
    const dialog = await screen.findByTestId('confirmation-dialog');
    expect(within(dialog).getByText(confOptions.leave.question)).toBeInTheDocument();
    expect(within(dialog).getByText(confOptions.leave.warning)).toBeInTheDocument();
  });

  test('renders component : variant==return', async () => {
    render(<ConfirmationDialog show={true} variant="return" />);
    const dialog = await screen.findByTestId('confirmation-dialog');
    expect(within(dialog).getByText(confOptions.return.question)).toBeInTheDocument();
    expect(within(dialog).getByTestId('confirmation-dialog-warning')).toHaveTextContent('');
  });

  test('renders component : variant==continue', async () => {
    render(<ConfirmationDialog show={true} variant="continue" />);
    const dialog = await screen.findByTestId('confirmation-dialog');
    expect(within(dialog).getByText(confOptions.continue.question)).toBeInTheDocument();
    expect(within(dialog).getByTestId('confirmation-dialog-warning')).toHaveTextContent('');
  });

  test('renders component with custom content', async () => {
    render(
      <ConfirmationDialog
        show={true}
        content={{ question: 'This is the last test', warning: 'Are you ready?' }}
        labelNo=""
      />,
    );
    const dialog = await screen.findByTestId('confirmation-dialog');
    expect(within(dialog).getByText('This is the last test')).toBeInTheDocument();
    expect(within(dialog).getByText('Are you ready?')).toBeInTheDocument();
    expect(within(dialog).queryByText('No')).not.toBeInTheDocument();
  });
});
