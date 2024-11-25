// cypress/component/ExportModal.spec.js

import { mount } from 'cypress/react18';
import ExportModal from '../../../components/core-ui-lib/ExportModal/ExportModal';
import BaseComp from '../global/BaseComp';

// Define the setup function for mounting the component
function setup(props) {
  mount(
    <BaseComp>
      <ExportModal {...props} />
    </BaseComp>,
  );
}

describe('ExportModal Component', () => {
  const ExportList = [
    { key: 'PDF', iconName: 'pdf-icon', iconProps: {} },
    { key: 'Excel', iconName: 'excel-icon', iconProps: {} },
    // Add more export types if needed
  ];

  let onClose;
  let onItemClick;

  beforeEach(() => {
    onClose = cy.stub().as('onClose');
    onItemClick = cy.stub().as('onItemClick');
  });

  it('should render when visible is true', () => {
    setup({
      visible: true,
      onClose,
      ExportList,
      onItemClick,
    });

    // Check that the modal content is visible
    cy.get('.rounded-lg').should('be.visible');
  });

  it('should not render when visible is false', () => {
    setup({
      visible: false,
      onClose,
      ExportList,
      onItemClick,
    });

    // The modal content should not be in the DOM
    cy.get('.rounded-lg').should('not.exist');
  });

  it('should display all export options', () => {
    setup({
      visible: true,
      onClose,
      ExportList,
      onItemClick,
    });

    ExportList.forEach((item) => {
      cy.contains(item.key).should('be.visible');
    });
  });

  it('should call onItemClick with correct key and close modal when an option is clicked', () => {
    setup({
      visible: true,
      onClose,
      ExportList,
      onItemClick,
    });

    cy.contains('PDF').click();

    cy.get('@onItemClick').should('have.been.calledWith', 'PDF');
    cy.get('@onClose').should('have.been.calledOnce');
  });
});
