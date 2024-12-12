// cypress/component/ImagePreviewModal.spec.tsx

import { mount } from 'cypress/react18';
import ImagePreviewModal, { ImagePreviewModalProps } from '../../../components/core-ui-lib/ImagePreviewModal';
import BaseComp from '../helpers/BaseComp';

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
    imageUrl: '',
    altText: 'Test Image',
  });

  it('should not display the modal when show is false', () => {
    cy.fixture('placeholder.png', 'base64').then((imageData) => {
      const imageUrl = `data:image/jpeg;base64,${imageData}`;
      setup({ ...defaultProps(), show: true, imageUrl });
      // cy.get('[data-testid="preview-image"]')
      //   .should('be.visible')
    });
    setup({ ...defaultProps(), show: false });
    cy.get('[data-testid="preview-image"]').should('not.exist');
  });

  it('should display the modal and image when show is true', () => {
    let imageUrl = '';
    cy.fixture('placeholder.png', 'base64').then((imageData) => {
      imageUrl = `data:image/jpeg;base64,${imageData}`;
      setup({ ...defaultProps(), show: true, imageUrl });
    });

    cy.then(() => {
      cy.get('[data-testid="preview-image"]')
        .should('be.visible')
        .and('have.attr', 'src', imageUrl)
        .and('have.attr', 'alt', defaultProps().altText);
    });
  });

  it('should use default altText if not provided', () => {
    cy.fixture('placeholder.png', 'base64').then((imageData) => {
      const imageUrl = `data:image/jpeg;base64,${imageData}`;
      setup({ ...defaultProps(), show: true, altText: undefined, imageUrl });
    });
    setup({ ...defaultProps(), show: true, altText: undefined });
    cy.get('[data-testid="preview-image"]').should('have.attr', 'alt', 'Image preview');
  });

  it('should call onClose when overlay is clicked', () => {
    cy.fixture('placeholder.png', 'base64').then((imageData) => {
      const imageUrl = `data:image/jpeg;base64,${imageData}`;
      setup({ ...defaultProps(), show: true, imageUrl });
    });

    cy.get('[data-testid="overlay"]').click();
    cy.get('@onClose').should('have.been.calledOnce');
  });

  it('should call onClose when close button is clicked', () => {
    cy.fixture('placeholder.png', 'base64').then((imageData) => {
      const imageUrl = `data:image/jpeg;base64,${imageData}`;
      setup({ ...defaultProps(), show: true, imageUrl });
    });
    // Assuming the close button has data-testid="close-button"
    cy.get('[data-testid="close-icon"]').click();
    cy.get('@onClose').should('have.been.calledOnce');
  });

  it('should have the correct styles applied', () => {
    cy.fixture('placeholder.png', 'base64').then((imageData) => {
      const imageUrl = `data:image/jpeg;base64,${imageData}`;
      setup({ ...defaultProps(), show: true, imageUrl });
    });
    cy.get('[data-testid="preview-image"]').should('have.class', 'w-11/12').and('have.class', 'h-1/2');
  });
});
