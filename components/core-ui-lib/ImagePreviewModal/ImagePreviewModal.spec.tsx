import { render, fireEvent, screen } from '@testing-library/react';
import ImagePreviewModal from './ImagePreviewModal';

describe('ImagePreviewModal', () => {
  const mockClose = jest.fn();

  it('renders correctly', () => {
    const imageUrl = 'https://example.com/test-image.jpg';
    const altText = 'Test Image';

    render(<ImagePreviewModal show={true} onClose={mockClose} imageUrl={imageUrl} altText={altText} />);
    const image = screen.getByTestId('preview-image');
    expect(image).toHaveAttribute('src', imageUrl);
    expect(image).toHaveAttribute('alt', altText);
  });

  it('displays the image with the correct src and alt text', () => {
    render(
      <ImagePreviewModal
        show={true}
        onClose={mockClose}
        imageUrl="https://example.com/test-image.jpg"
        altText="Test Image"
      />,
    );
    const image = screen.getByTestId('preview-image');
    expect(image).toHaveAttribute('src', 'https://example.com/test-image.jpg');
    expect(image).toHaveAttribute('alt', 'Test Image');
  });

  it('calls onClose when the overlay is clicked', () => {
    render(<ImagePreviewModal show={true} onClose={mockClose} imageUrl="https://example.com/test-image.jpg" />);

    fireEvent.click(screen.getByTestId('overlay')); // Ensure your PopupModal has a testId on the overlay div
    expect(mockClose).toHaveBeenCalled();
  });
});
