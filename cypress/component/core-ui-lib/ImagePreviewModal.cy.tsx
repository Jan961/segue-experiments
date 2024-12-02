// cypress/component/ImagePreviewModal.spec.tsx

import { mount } from 'cypress/react18';
import ImagePreviewModal, { ImagePreviewModalProps } from '../../../components/core-ui-lib/ImagePreviewModal';
import BaseComp from '../global/BaseComp';

function setup(props: ImagePreviewModalProps) {
  mount(
    <BaseComp>
      <ImagePreviewModal {...props} />
    </BaseComp>,
  );
}

describe('ImagePreviewModal Component', () => {
  let onCloseStub;

  beforeEach(() => {
    onCloseStub = cy.stub().as('onClose');
  });

  const defaultProps = (): ImagePreviewModalProps => ({
    show: false,
    onClose: onCloseStub,
    imageUrl: 'https://example.com/image.jpg',
    altText: 'Test Image',
  });

  it('should not display the modal when show is false', () => {
    setup({ ...defaultProps(), show: false });
    cy.get('[data-testid="preview-image"]').should('not.exist');
  });

  it('should display the modal and image when show is true', () => {
    setup({ ...defaultProps(), show: true });
    cy.get('[data-testid="preview-image"]')
      .should('be.visible')
      .and('have.attr', 'src', defaultProps().imageUrl)
      .and('have.attr', 'alt', defaultProps().altText);
  });

  it('should use default altText if not provided', () => {
    setup({ ...defaultProps(), show: true, altText: undefined });
    cy.get('[data-testid="preview-image"]').should('have.attr', 'alt', 'Image preview');
  });

  it('should call onClose when overlay is clicked', () => {
    setup({ ...defaultProps(), show: true });
    // Assuming the overlay has data-testid="popup-overlay"
    cy.get('[data-testid="popup-overlay"]').click({ force: true });
    cy.get('@onClose').should('have.been.calledOnce');
  });

  it('should call onClose when close button is clicked', () => {
    setup({ ...defaultProps(), show: true });
    // Assuming the close button has data-testid="close-button"
    cy.get('[data-testid="close-button"]').click();
    cy.get('@onClose').should('have.been.calledOnce');
  });

  it('should have the correct styles applied', () => {
    setup({ ...defaultProps(), show: true });
    cy.get('[data-testid="preview-image"]').should('have.class', 'w-11/12').and('have.class', 'h-1/2');
  });
});
