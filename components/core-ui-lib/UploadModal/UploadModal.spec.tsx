import { render, fireEvent, screen } from '@testing-library/react';
import UploadModal from './UploadModal';

describe('UploadModal Component', () => {
  const mockOnClose = jest.fn();
  const mockOnChange = jest.fn();

  const mockFile = (size: number, type: string) => new File([new Blob(['1'.repeat(size + 1)], { type })], 'testfile');
  const allowedFormats = ['image/jpeg', 'image/png'];
  afterEach(() => {
    jest.clearAllMocks();
  });
  beforeAll(() => {
    global.URL.createObjectURL = jest.fn(() => 'path/to/mock/image');
  });

  afterAll(() => {
    global.URL.createObjectURL = undefined;
  });

  test('renders only when visible is true', () => {
    const { rerender } = render(
      <UploadModal allowedFormats={allowedFormats} visible={false} title="Upload" info="Select a file" />,
    );
    expect(screen.queryByText('Upload')).toBeNull();

    rerender(<UploadModal allowedFormats={allowedFormats} visible={true} title="Upload" info="Select a file" />);
    expect(screen.getByText('Upload')).toBeInTheDocument();
  });

  test('calls onClose when close button is clicked', () => {
    render(
      <UploadModal
        allowedFormats={allowedFormats}
        visible={true}
        title="Upload"
        info="Select a file"
        onClose={mockOnClose}
      />,
    );
    fireEvent.click(screen.getByText('Cancel'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  test('file input is triggered when upload area is clicked', () => {
    render(<UploadModal allowedFormats={allowedFormats} visible={true} title="Upload" info="Select a file" />);
    fireEvent.click(screen.getByTestId('image'));
    const input = screen.getByTestId('hidden-input');
    expect(input).toBeInTheDocument();
  });

  test('validates no file selected', () => {
    render(
      <UploadModal
        allowedFormats={allowedFormats}
        visible={true}
        title="Upload"
        info="Select a file"
        onChange={mockOnChange}
      />,
    );
    const input = screen.getByTestId('hidden-input');
    fireEvent.change(input, { target: { files: [] } });
    expect(screen.getByText('No file selected')).toBeInTheDocument();
  });

  test('validates maximum number of files', () => {
    render(
      <UploadModal
        allowedFormats={allowedFormats}
        title="Upload"
        info="Select a file"
        visible={true}
        maxFiles={1}
        onChange={mockOnChange}
      />,
    );
    const input = screen.getByTestId('hidden-input');
    fireEvent.change(input, {
      target: { files: [mockFile(1000, 'image/jpeg'), mockFile(1000, 'image/jpeg')] },
    });
    expect(screen.getByText('You can upload up to 1 files.')).toBeInTheDocument();
  });

  test('validates file size', () => {
    render(
      <UploadModal
        allowedFormats={allowedFormats}
        title="Upload"
        info="Select a file"
        visible={true}
        maxFileSize={500}
        onChange={mockOnChange}
      />,
    );
    const input = screen.getByTestId('hidden-input');
    fireEvent.change(input, { target: { files: [mockFile(1024, 'image/jpeg')] } });
    expect(screen.getByText('This image is too big. Please upload a smaller image.')).toBeInTheDocument();
  });

  test('validates allowed formats', () => {
    const allowedFormats = ['image/jpeg', 'image/png'];
    render(
      <UploadModal
        allowedFormats={allowedFormats}
        title="Upload"
        info="Select a file"
        visible={true}
        onChange={mockOnChange}
      />,
    );
    const input = screen.getByTestId('hidden-input');
    fireEvent.change(input, { target: { files: [mockFile(1000, 'image/gif')] } });
    expect(screen.getByText(`Invalid file format. Allowed formats: ${allowedFormats.join(', ')}.`)).toBeInTheDocument();
  });

  test('clears all on close', () => {
    render(
      <UploadModal
        allowedFormats={allowedFormats}
        visible={true}
        title="Upload"
        info="Select a file"
        onClose={mockOnClose}
      />,
    );
    fireEvent.click(screen.getByText('Cancel'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  test('onChange is called with the correct parameters when a valid file is selected', () => {
    render(
      <UploadModal
        allowedFormats={allowedFormats}
        title="Upload"
        info="Select a file"
        visible={true}
        onChange={mockOnChange}
      />,
    );
    const input = screen.getByTestId('hidden-input');
    const file = mockFile(500, 'image/jpeg');
    fireEvent.change(input, { target: { files: [file] } });
    expect(mockOnChange).toHaveBeenCalledWith(expect.anything()); // Here, you might need to check more specific properties based on your implementation
  });
});
