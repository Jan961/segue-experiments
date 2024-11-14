// ConfirmationDialog.cy.tsx

import { mount } from 'cypress/react18';
import ConfirmationDialog, {
  confOptions,
  ConfDialogVariant,
  ConfirmationDialogProps,
} from '../../../components/core-ui-lib/ConfirmationDialog';
import { useState } from 'react';
import BaseComp from '../global/BaseComp';

describe('ConfirmationDialog Component', () => {
  const defaultProps: Partial<ConfirmationDialogProps> = {
    show: true,
    labelYes: 'Yes',
    labelNo: 'No',
    variant: 'delete',
    hasOverlay: false,
    testId: 'test-confirmation-dialog',
  };

  const Wrapper = ({ props }) => (
    <BaseComp>
      <ConfirmationDialog {...props} />
    </BaseComp>
  );

  it('should render correctly with default props', () => {
    let onYesClickStub = cy.stub().as('onYesClick');
    let onNoClickStub = cy.stub().as('onNoClick');

    mount(<ConfirmationDialog {...defaultProps} onYesClick={onYesClickStub} onNoClick={onNoClickStub} />);
    cy.get('[data-testid="test-confirmation-dialog"]').should('be.visible');
    cy.get('[data-testid="confirmation-dialog-question"]').should('contain.text', confOptions['delete'].question);
    cy.get('[data-testid="confirmation-dialog-warning"]').should('contain.text', confOptions['delete'].warning);
    cy.get('[data-testid="confirmation-dialog-yes-btn"]').should('contain.text', 'Yes');
    cy.get('[data-testid="confirmation-dialog-no-btn"]').should('contain.text', 'No');
  });

  it('should call onYesClick when Yes button is clicked', () => {
    let onYesClickStub = cy.stub().as('onYesClick');
    let onNoClickStub = cy.stub().as('onNoClick');

    mount(<ConfirmationDialog {...defaultProps} onYesClick={onYesClickStub} onNoClick={onNoClickStub} />);
    cy.get('[data-testid="confirmation-dialog-yes-btn"]').click();
    cy.get('@onYesClick').should('have.been.calledOnce');
  });

  it('should call onNoClick when No button is clicked', () => {
    let onYesClickStub = cy.stub().as('onYesClick');
    let onNoClickStub = cy.stub().as('onNoClick');

    mount(<ConfirmationDialog {...defaultProps} onYesClick={onYesClickStub} onNoClick={onNoClickStub} />);
    cy.get('[data-testid="confirmation-dialog-no-btn"]').click();
    cy.get('@onNoClick').should('have.been.calledOnce');
  });

  it('should not render when show is false', () => {
    let onYesClickStub = cy.stub().as('onYesClick');
    let onNoClickStub = cy.stub().as('onNoClick');

    mount(<ConfirmationDialog {...defaultProps} show={false} onYesClick={onYesClickStub} onNoClick={onNoClickStub} />);
    cy.get('[data-testid="test-confirmation-dialog"]').should('not.exist');
  });

  it('should render custom content when content prop is provided', () => {
    const customContent = {
      question: 'Custom Question?',
      warning: 'Custom Warning!',
    };

    let onYesClickStub = cy.stub().as('onYesClick');
    let onNoClickStub = cy.stub().as('onNoClick');

    mount(
      <ConfirmationDialog
        {...defaultProps}
        content={customContent}
        onYesClick={onYesClickStub}
        onNoClick={onNoClickStub}
      />,
    );
    cy.get('[data-testid="confirmation-dialog-question"]').should('contain.text', customContent.question);
    cy.get('[data-testid="confirmation-dialog-warning"]').should('contain.text', customContent.warning);
  });

  it('should display correct content based on variant prop', () => {
    let onYesClickStub = cy.stub().as('onYesClick');
    let onNoClickStub = cy.stub().as('onNoClick');

    const variants: ConfDialogVariant[] = ['close', 'cancel', 'delete', 'logout', 'leave', 'return', 'continue'];
    variants.forEach((variant) => {
      mount(
        <ConfirmationDialog
          {...defaultProps}
          variant={variant}
          onYesClick={onYesClickStub}
          onNoClick={onNoClickStub}
        />,
      );
      cy.get('[data-testid="confirmation-dialog-question"]').should('contain.text', confOptions[variant].question);
      cy.get('[data-testid="confirmation-dialog-warning"]').should('contain.text', confOptions[variant].warning);
    });
  });

  it('should display only the Yes button when labelNo is not provided', () => {
    let onYesClickStub = cy.stub().as('onYesClick');

    mount(<ConfirmationDialog {...defaultProps} showNoButton={false} labelNo="No" onYesClick={onYesClickStub} />);
    cy.get('[data-testid="confirmation-dialog-no-btn"]').should('not.exist');
    cy.get('[data-testid="confirmation-dialog-yes-btn"]').should('exist');
  });

  // Assuming the PopupModal adds an 'overlay' class when hasOverlay is true
  it('should pass hasOverlay prop to PopupModal', () => {
    let onYesClickStub = cy.stub().as('onYesClick');
    let onNoClickStub = cy.stub().as('onNoClick');

    mount(
      <ConfirmationDialog {...defaultProps} hasOverlay={true} onYesClick={onYesClickStub} onNoClick={onNoClickStub} />,
    );
    cy.get('[data-testid="test-confirmation-dialog"]').parents().filter('.overlay').should('exist');
  });

  it('should update visibility when show prop changes', () => {
    const WrapperComponent = () => {
      let onYesClickStub = cy.stub().as('onYesClick');
      let onNoClickStub = cy.stub().as('onNoClick');

      const [show, setShow] = useState(true);
      return (
        <>
          <button data-testid="toggle-button" onClick={() => setShow(!show)}>
            Toggle
          </button>
          <ConfirmationDialog {...defaultProps} show={show} onYesClick={onYesClickStub} onNoClick={onNoClickStub} />
        </>
      );
    };
    mount(<WrapperComponent />);
    cy.get('[data-testid="test-confirmation-dialog"]').should('be.visible');
    cy.get('[data-testid="toggle-button"]').click();
    cy.get('[data-testid="test-confirmation-dialog"]').should('not.exist');
  });

  // Additional Tests

  it('should use correct button variant based on the dialog variant', () => {
    let onYesClickStub = cy.stub().as('onYesClick');
    let onNoClickStub = cy.stub().as('onNoClick');

    mount(
      <ConfirmationDialog {...defaultProps} variant="delete" onYesClick={onYesClickStub} onNoClick={onNoClickStub} />,
    );
    cy.get('[data-testid="confirmation-dialog-yes-btn"]').should('have.class', 'tertiary');

    mount(
      <ConfirmationDialog {...defaultProps} variant="close" onYesClick={onYesClickStub} onNoClick={onNoClickStub} />,
    );
    cy.get('[data-testid="confirmation-dialog-yes-btn"]').should('have.class', 'primary');
  });

  it('should display custom labels for buttons', () => {
    let onYesClickStub = cy.stub().as('onYesClick');
    let onNoClickStub = cy.stub().as('onNoClick');

    mount(
      <ConfirmationDialog
        {...defaultProps}
        labelYes="Proceed"
        labelNo="Abort"
        onYesClick={onYesClickStub}
        onNoClick={onNoClickStub}
      />,
    );
    cy.get('[data-testid="confirmation-dialog-yes-btn"]').should('contain.text', 'Proceed');
    cy.get('[data-testid="confirmation-dialog-no-btn"]').should('contain.text', 'Abort');
  });

  it('should handle absence of onNoClick prop gracefully', () => {
    let onYesClickStub = cy.stub().as('onYesClick');
    let onNoClickStub = cy.stub().as('onNoClick');

    mount(<ConfirmationDialog {...defaultProps} onYesClick={onYesClickStub} onNoClick={undefined} />);
    cy.get('[data-testid="confirmation-dialog-no-btn"]').click();
    // Since onNoClick is undefined, clicking No should not cause an error
    cy.get('@onYesClick').should('not.have.been.called');
  });

  it('should handle absence of onYesClick prop gracefully', () => {
    let onYesClickStub = cy.stub().as('onYesClick');
    let onNoClickStub = cy.stub().as('onNoClick');

    mount(<ConfirmationDialog {...defaultProps} onYesClick={undefined} onNoClick={onNoClickStub} />);
    cy.get('[data-testid="confirmation-dialog-yes-btn"]').click();
    // Since onYesClick is undefined, clicking Yes should not cause an error
    cy.get('@onNoClick').should('not.have.been.called');
  });

  it('should close the dialog when either button is clicked if no handlers are provided', () => {
    const WrapperComponent = () => {
      const [show, setShow] = useState(true);
      return (
        <>
          <ConfirmationDialog
            {...defaultProps}
            show={show}
            onYesClick={() => setShow(false)}
            onNoClick={() => setShow(false)}
          />
        </>
      );
    };
    mount(<WrapperComponent />);
    cy.get('[data-testid="test-confirmation-dialog"]').should('be.visible');
    cy.get('[data-testid="confirmation-dialog-no-btn"]').click();
    cy.get('[data-testid="test-confirmation-dialog"]').should('not.exist');
  });

  it('should render children if provided', () => {
    let onYesClickStub = cy.stub().as('onYesClick');
    let onNoClickStub = cy.stub().as('onNoClick');

    const CustomContent = () => <div data-testid="custom-content">Custom Content Here</div>;
    mount(
      <ConfirmationDialog {...defaultProps} onYesClick={onYesClickStub} onNoClick={onNoClickStub}>
        <CustomContent />
      </ConfirmationDialog>,
    );
    cy.get('[data-testid="custom-content"]').should('exist').and('contain.text', 'Custom Content Here');
  });
});
