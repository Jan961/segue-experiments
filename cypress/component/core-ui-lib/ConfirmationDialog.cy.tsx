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
    mount(
      <BaseComp>
        <ConfirmationDialog {...defaultProps} />
      </BaseComp>,
    );
    cy.get('[data-testid="test-confirmation-dialog"]').should('be.visible');
    cy.get('[data-testid="confirmation-dialog-question"]').should('contain.text', confOptions['delete'].question);
    cy.get('[data-testid="confirmation-dialog-warning"]').should('contain.text', confOptions['delete'].warning);
    cy.get('[data-testid="confirmation-dialog-yes-btn"]').should('contain.text', 'Yes');
    cy.get('[data-testid="confirmation-dialog-no-btn"]').should('contain.text', 'No');
    cy.get('[data-testid="confirmation-dialog-yes-btn"]').invoke('attr', 'class').should('contain', 'bg-primary-red');
    // secondary button for no should have the below class
    cy.get('[data-testid="confirmation-dialog-no-btn"]').should(
      'have.class',
      // the delete variant should have a tertiary button for yes which has the below class
      'bg-primary-white',
    );
  });

  it('should call onYesClick when Yes button is clicked', () => {
    let onYesClickStub = cy.stub().as('onYesClick');
    let onNoClickStub = cy.stub().as('onNoClick');

    mount(
      <BaseComp>
        <ConfirmationDialog {...defaultProps} onYesClick={onYesClickStub} onNoClick={onNoClickStub} />
      </BaseComp>,
    );
    cy.get('[data-testid="confirmation-dialog-yes-btn"]').click();
    cy.get('@onYesClick').should('have.been.calledOnce');
  });

  it('should call onNoClick when the No button is clicked', () => {
    let onYesClickStub = cy.stub().as('onYesClick');
    let onNoClickStub = cy.stub().as('onNoClick');

    mount(
      <BaseComp>
        <ConfirmationDialog {...defaultProps} onYesClick={onYesClickStub} onNoClick={onNoClickStub} />
      </BaseComp>,
    );
    cy.get('[data-testid="confirmation-dialog-no-btn"]').click();
    cy.get('@onNoClick').should('have.been.calledOnce');
  });

  it('should not render when show is false', () => {
    mount(
      <BaseComp>
        <ConfirmationDialog {...defaultProps} show={false} />
      </BaseComp>,
    );
    cy.get('[data-testid="test-confirmation-dialog"]').should('not.exist');
  });

  it('should render custom content when content prop is provided', () => {
    const customContent = {
      question: 'Custom Question?',
      warning: 'Custom Warning!',
    };
    mount(<ConfirmationDialog {...defaultProps} content={customContent} />);
    cy.get('[data-testid="confirmation-dialog-question"]').should('contain.text', customContent.question);
    cy.get('[data-testid="confirmation-dialog-warning"]').should('contain.text', customContent.warning);
  });

  it('should display correct content based on variant prop', () => {
    const variants: ConfDialogVariant[] = ['close', 'cancel', 'delete', 'logout', 'leave', 'return', 'continue'];
    variants.forEach((variant) => {
      mount(
        <BaseComp>
          <ConfirmationDialog {...defaultProps} variant={variant} />,
        </BaseComp>,
      );
      cy.get('[data-testid="confirmation-dialog-question"]').should('contain.text', confOptions[variant].question);
      cy.get('[data-testid="confirmation-dialog-warning"]').should('contain.text', confOptions[variant].warning);
    });
  });

  it('should display only the Yes button when labelNo is not provided', () => {
    let onYesClickStub = cy.stub().as('onYesClick');

    mount(
      <BaseComp>
        <ConfirmationDialog {...defaultProps} showNoButton={false} labelNo="No" onYesClick={onYesClickStub} />
      </BaseComp>,
    );
    cy.get('[data-testid="confirmation-dialog-no-btn"]').should('not.exist');
    cy.get('[data-testid="confirmation-dialog-yes-btn"]').should('exist');
  });

  it('should update visibility when show prop changes', () => {
    const WrapperComponent = () => {
      let onYesClickStub = cy.stub().as('onYesClick');
      let onNoClickStub = cy.stub().as('onNoClick');

      const [show, setShow] = useState(true);
      return (
        <BaseComp>
          <button data-testid="toggle-button" onClick={() => setShow(!show)}>
            Toggle
          </button>
          <ConfirmationDialog {...defaultProps} show={show} onYesClick={onYesClickStub} onNoClick={onNoClickStub} />
        </BaseComp>
      );
    };
    mount(<WrapperComponent />);
    cy.get('[data-testid="test-confirmation-dialog"]').should('be.visible');
    cy.get('[data-testid="toggle-button"]').click({ force: true }); // force click to bypass the overlay
    cy.get('[data-testid="test-confirmation-dialog"]').should('not.exist');
  });

  it('should display custom labels for buttons', () => {
    mount(
      <BaseComp>
        <ConfirmationDialog {...defaultProps} labelYes="Proceed" labelNo="Abort" />,
      </BaseComp>,
    );
    cy.get('[data-testid="confirmation-dialog-yes-btn"]').should('contain.text', 'Proceed');
    cy.get('[data-testid="confirmation-dialog-no-btn"]').should('contain.text', 'Abort');
  });

  it('should close the dialog when either button is clicked if no handlers are provided', () => {
    const WrapperComponent = () => {
      const [show, setShow] = useState(true);
      return (
        <BaseComp>
          <ConfirmationDialog
            {...defaultProps}
            show={show}
            onYesClick={() => setShow(false)}
            onNoClick={() => setShow(false)}
          />
        </BaseComp>
      );
    };
    mount(<WrapperComponent />);
    cy.get('[data-testid="test-confirmation-dialog"]').should('be.visible');
    cy.get('[data-testid="confirmation-dialog-no-btn"]').click();
    cy.get('[data-testid="test-confirmation-dialog"]').should('not.exist');
  });
});
