import { render, screen, fireEvent } from '@testing-library/react';
import UploadModal from './UploadModal';
import FileCard from './UploadFileCard';

describe('UploadModal and FileCard Component', () => {
  const mockProps = {
    title: 'Upload Files',
    visible: true,
    onClose: jest.fn(),
    info: 'Please select files to upload',
    isMultiple: true,
    maxFiles: 2,
    maxFileSize: 1024,
    allowedFormats: ['image/jpeg', 'image/png'],
    onChange: jest.fn(),
    onSave: jest.fn(),
  };

  const createMockBlobFile = (name = 'mock.png', size = 1000, type = 'image/png') => {
    const data = new Uint8Array(size);
    const blob = new Blob([data], { type });
    (blob as any).name = name;
    return blob as File;
  };

  test('renders UploadModal component correctly', () => {
    render(<UploadModal {...mockProps} />);
    expect(screen.getByText('Upload Files')).toBeInTheDocument();
    expect(screen.getByText('Please select files to upload')).toBeInTheDocument();
  });

  test('displays error message when no file is selected', () => {
    render(<UploadModal {...mockProps} />);
    fireEvent.change(screen.getByTestId('hidden-input'), {
      target: { files: [] },
    });
    expect(screen.getByText('No file selected')).toBeInTheDocument();
  });

  test('clicking on close button unmounts the component', () => {
    const mockOnClose = jest.fn();
    render(<UploadModal {...mockProps} onClose={mockOnClose} />);
    const closeButton = screen.getByRole('button', { name: 'Cancel' });
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalled();
  });

  test('displays error message for exceeding max files', () => {
    render(<UploadModal {...mockProps} />);
    const files = [createMockBlobFile('file1.jpg'), createMockBlobFile('file2.jpg'), createMockBlobFile('file3.jpg')];
    fireEvent.change(screen.getByTestId('hidden-input'), {
      target: { files },
    });
    expect(screen.getByText('You can upload up to 2 files.')).toBeInTheDocument();
  });

  test('displays error message for invalid file format', () => {
    render(<UploadModal {...mockProps} />);
    const files = [createMockBlobFile('file1.txt', 1000, 'text/plain')];
    fireEvent.change(screen.getByTestId('hidden-input'), {
      target: { files },
    });
    expect(screen.getByText('Invalid file format. Allowed formats: image/jpeg, image/png.')).toBeInTheDocument();
  });

  test('displays error message for file size exceeding the limit', () => {
    render(<UploadModal {...mockProps} />);

    const file = createMockBlobFile('test.png', 2048);
    fireEvent.change(screen.getByTestId('hidden-input'), {
      target: { files: [file] },
    });
    expect(screen.getByText('This file is too big. Please upload a smaller file.')).toBeInTheDocument();
  });

  test('disables the upload button when no files are selected', () => {
    render(<UploadModal {...mockProps} />);
    expect(screen.getByRole('button', { name: 'Upload' })).toBeDisabled();
  });

  test('disables the upload button when there are file errors', () => {
    render(<UploadModal {...mockProps} />);
    const file = createMockBlobFile('file1.txt', 1000, 'text/plain');
    fireEvent.change(screen.getByTestId('hidden-input'), {
      target: { files: [file] },
    });
    expect(screen.getByRole('button', { name: 'Upload' })).toBeDisabled();
  });

  test('enables the upload button when valid files are selected', () => {
    render(<UploadModal {...mockProps} />);
    const file = createMockBlobFile('testfile.png', 1000);
    fireEvent.change(screen.getByTestId('hidden-input'), {
      target: { files: [file] },
    });
    expect(screen.getByRole('button', { name: 'Upload' })).toBeEnabled();
  });

  test('renders FileCard component correctly', () => {
    const file = {
      name: 'file1.jpg',
      size: 500 * 1024,
      file: createMockBlobFile('file1.jpg', 1000, 'image/jpg'),
    };
    render(<FileCard file={file} index={0} onDelete={jest.fn()} progress={50} errorMessage={''} />);
    expect(screen.getByText('Uploading')).toBeInTheDocument();
    expect(screen.getByText('file1.jpg')).toBeInTheDocument();
    expect(screen.getByText('Size: 500.00 KB')).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  test('renders FileCard component with error message', () => {
    const file = {
      name: 'file1.txt',
      size: 500 * 1024,
      file: createMockBlobFile('file1.txt', 1000, 'text/plain'),
    };
    render(<FileCard file={file} index={0} onDelete={jest.fn()} progress={0} errorMessage={'Invalid file format'} />);
    expect(screen.getByText('Invalid file format')).toBeInTheDocument();
  });

  test('calls onSave with selected files and progress/error callbacks', () => {
    const mockOnSave = jest.fn();
    render(<UploadModal {...mockProps} onSave={mockOnSave} />);
    const files = [
      createMockBlobFile('file1.jpg', 1000, 'image/jpeg'),
      createMockBlobFile('file2.png', 1000, 'image/png'),
    ];
    fireEvent.change(screen.getByTestId('hidden-input'), {
      target: { files },
    });
    fireEvent.click(screen.getByText('Upload'));
    expect(mockOnSave).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ name: 'file1.jpg', size: files[0].size, file: files[0] }),
        expect.objectContaining({ name: 'file2.png', size: files[1].size, file: files[1] }),
      ]),
      expect.any(Function),
      expect.any(Function),
    );
  });
});
