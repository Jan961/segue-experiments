/// <reference types="cypress" />

import { mount } from 'cypress/react18';
import PopupModal from '../../../components/core-ui-lib/PopupModal';
import BaseComp from '../global/BaseComp';
import { GridContent, VerticalContent } from '../global/Content';

// Setup function to mount the component
function setup(props) {
  mount(
    <BaseComp>
      <PopupModal {...props} />
    </BaseComp>,
  );
}

describe('PopupModal Component', () => {
  it('renders the modal when "show" is true', () => {
    setup({ show: true, title: 'Test Modal' });

    cy.get('[data-testid="overlay"]').should('exist').and('be.visible');
    cy.contains('Test Modal').should('be.visible');
  });

  it('does not render the modal when "show" is false', () => {
    setup({ show: false });

    cy.get('[data-testid="overlay"]').should('not.exist');
  });

  it('renders the title and subtitle', () => {
    setup({ show: true, title: 'Test Title', subtitle: 'Test Subtitle' });

    cy.contains('Test Title').should('be.visible');
    cy.contains('Test Subtitle').should('be.visible');
  });

  it('renders children content', () => {
    setup({
      show: true,
      children: <div data-testid="child">Child Content</div>,
    });

    cy.get('[data-testid="child"]').should('exist').and('contain.text', 'Child Content');
  });

  it('renders the close icon when "showCloseIcon" is true', () => {
    setup({ show: true, showCloseIcon: true });

    cy.get('[data-testid="close-icon"]').should('exist').and('be.visible');
  });

  it('does not render the close icon when "showCloseIcon" is false', () => {
    setup({ show: true, showCloseIcon: false });

    cy.get('[data-testid="close-icon"]').should('not.exist');
  });

  it('closes the modal when close icon is clicked', () => {
    const onClose = cy.stub();
    setup({ show: true, showCloseIcon: true, onClose });

    cy.get('[data-testid="close-icon"]').click();
    cy.wrap(onClose).should('have.been.called');
  });

  it('calls "onClose" when clicking the overlay and "closeOnOverlayClick" is true', () => {
    const onClose = cy.stub();
    setup({ show: true, closeOnOverlayClick: true, onClose });

    cy.get('[data-testid="overlay"]').click('topLeft'); // Clicking outside the panel
    cy.wrap(onClose).should('have.been.called');
  });

  it('does not call "onClose" when clicking the overlay if "closeOnOverlayClick" is false', () => {
    const onClose = cy.stub();
    setup({ show: true, closeOnOverlayClick: false, onClose });

    cy.get('[data-testid="overlay"]').click('topLeft');
    cy.wrap(onClose).should('not.have.been.called');
  });

  it('renders the footerComponent if provided', () => {
    setup({
      show: true,
      footerComponent: <div data-testid="footer">Footer Content</div>,
    });

    cy.get('[data-testid="footer"]').should('exist').and('contain.text', 'Footer Content');
  });

  it('applies custom panel classes if "panelClass" is provided', () => {
    setup({ show: true, panelClass: 'custom-panel-class' });

    cy.get('[data-testid="overlay"] .custom-panel-class').should('exist');
  });

  it('applies custom title classes if "titleClass" is provided', () => {
    setup({ show: true, title: 'Test Title', titleClass: 'custom-title-class' });

    cy.contains('Test Title').should('have.class', 'custom-title-class');
  });

  it('render as expected with loads of overflowing content', () => {
    const loadsOfVerticalContent = () => {
      return (
        <BaseComp styles={{ width: '100vw', height: '100vh' }}>
          <PopupModal show={true} title="Loads of vertical content">
            <VerticalContent />
          </PopupModal>
        </BaseComp>
      );
    };
    mount(loadsOfVerticalContent());
    cy.get('[data-testid="popup-modal-content"] div ').should('be.visible');
    cy.get('[data-testid="popup-modal-content"]').should(($el) => {
      const el = $el[0];
      // Check if the element is scrollable
      expect(el.scrollHeight).to.be.greaterThan(el.clientHeight);
    });
  });
  it('render as expected with not enough content to overflow given the popup modal max height & width', () => {
    const loadsHorizontalContent = () => {
      return (
        <BaseComp>
          <PopupModal show={true} title="Loads of vertical content">
            <GridContent />
          </PopupModal>
        </BaseComp>
      );
    };

    mount(loadsHorizontalContent());
    cy.get('[data-testid="popup-modal-content"]').should('be.visible');
    cy.get('[data-testid="popup-modal-content"]').should(($el) => {
      const el = $el[0];
      // Check if the element is scrollable
      expect(el.scrollHeight).to.be.equal(el.clientHeight);
    });
  });
});