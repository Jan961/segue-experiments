// Table.spec.tsx

import { mount } from 'cypress/react18';
import Table, { TableProps } from '../../../components/core-ui-lib/Table'; // Adjust the import path accordingly
import BaseComp from '../global/BaseComp'; // Adjust the import path accordingly
import { GridApi } from 'ag-grid-community';
import { useRef } from 'react';

// Helper function to mount the component
function setup(props: TableProps) {
  mount(
    <BaseComp>
      <Table {...props} />
    </BaseComp>,
  );
}

describe('Table Component', () => {
  it('should render the Table component with default props', () => {
    const props: TableProps = {};
    setup(props);
    cy.get('[data-testid="core-ui-lib-table"]').should('exist');
  });

  it('should display the correct number of rows and columns when provided with rowData and columnDefs', () => {
    const props: TableProps = {
      rowData: [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Doe' },
      ],
      columnDefs: [
        { field: 'id', headerName: 'ID' },
        { field: 'name', headerName: 'Name' },
      ],
    };
    setup(props);

    // Check that the grid has two rows (excluding header)
    cy.get('.ag-center-cols-container .ag-row').should('have.length', 2);

    // Check that the grid has two columns
    cy.get('.ag-header-cell').should('have.length', 2);
  });

  it('should call onCellClicked when a cell is clicked', () => {
    const onCellClicked = cy.stub();
    const props: TableProps = {
      rowData: [{ id: 1, name: 'John Doe' }],
      columnDefs: [{ field: 'id' }, { field: 'name' }],
      onCellClicked,
    };
    setup(props);

    // Click on a cell
    cy.get('.ag-center-cols-container .ag-cell').first().click();

    // Verify that onCellClicked was called
    cy.wrap(onCellClicked).should('have.been.called');
  });

  it('should call onRowClicked when a row is clicked', () => {
    const onRowClicked = cy.stub();
    const props: TableProps = {
      rowData: [{ id: 1, name: 'John Doe' }],
      columnDefs: [{ field: 'id' }, { field: 'name' }],
      onRowClicked,
    };
    setup(props);

    // Click on a row
    cy.get('.ag-center-cols-container .ag-row').first().click();

    // Verify that onRowClicked was called
    cy.wrap(onRowClicked).should('have.been.called');
  });

  it('should call onCellValueChange when a cell value changes', () => {
    const onCellValueChange = cy.stub();
    const props: TableProps = {
      rowData: [{ id: 1, name: 'John Doe' }],
      columnDefs: [
        { field: 'id', editable: true },
        { field: 'name', editable: true },
      ],
      onCellValueChange,
    };
    setup(props);

    // Start editing a cell
    cy.get('.ag-center-cols-container .ag-cell').first().dblclick();

    // Type a new value
    cy.get('.ag-cell-editor').type('2{enter}');

    // Verify that onCellValueChange was called
    cy.wrap(onCellValueChange).should('have.been.called');
  });

  it('should apply custom gridOptions', () => {
    const gridOptions = {
      suppressRowClickSelection: true,
    };
    const props: TableProps = {
      rowData: [{ id: 1, name: 'John Doe' }],
      columnDefs: [{ field: 'id' }, { field: 'name' }],
      gridOptions,
    };
    setup(props);

    // Since suppressRowClickSelection is true, clicking on a row should not select it
    cy.get('.ag-center-cols-container .ag-row').first().click();

    // Verify that the row is not selected
    cy.get('.ag-row-selected').should('not.exist');
  });

  it('should adjust height based on rowData and tableHeight', () => {
    const props: TableProps = {
      rowData: [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Doe' },
        { id: 3, name: 'Bob Smith' },
      ],
      columnDefs: [{ field: 'id' }, { field: 'name' }],
      tableHeight: 200,
    };
    setup(props);

    // Verify that the grid container has the expected height
    cy.get('[data-testid="core-ui-lib-table"]').then(($el) => {
      const height = $el.height();
      expect(height).to.be.lessThan(200);
    });
  });

  it('should update grid options on window resize', () => {
    const props: TableProps = {
      rowData: [{ id: 1, name: 'John Doe' }],
      columnDefs: [{ field: 'id' }, { field: 'name' }],
    };
    setup(props);

    // Simulate window resize
    cy.viewport(800, 600);
    cy.wait(100); // Wait for the resize event to be handled

    // Additional checks can be implemented based on specific resize behaviors
  });

  it('should provide gridApi via useImperativeHandle', () => {
    const TestComponent = () => {
      const tableRef = useRef<any>(null);
      const props: TableProps = {
        rowData: [{ id: 1, name: 'John Doe' }],
        columnDefs: [{ field: 'id' }, { field: 'name' }],
      };
      return (
        <BaseComp>
          <Table {...props} ref={tableRef} />
          <button
            data-testid="api-button"
            onClick={() => {
              const api: GridApi = tableRef.current.getApi();
              api.selectAll();
            }}
          >
            Select All
          </button>
        </BaseComp>
      );
    };

    mount(<TestComponent />);

    // Click the button to use the gridApi
    cy.get('[data-testid="api-button"]').click();

    // Verify that all rows are selected
    cy.get('.ag-row-selected').should('have.length', 1);
  });

  it('should apply custom styles via styleProps', () => {
    const styleProps = {
      headerColor: 'red',
    };
    const props: TableProps = {
      styleProps,
      rowData: [{ id: 1, name: 'John Doe' }],
      columnDefs: [{ field: 'id' }, { field: 'name' }],
    };
    setup(props);

    // Verify that the header has the custom style
    cy.get('.ag-header').should('have.css', 'background-color', 'rgb(255, 0, 0)');
  });

  it('should hide header when displayHeader is false', () => {
    const props: TableProps = {
      displayHeader: false,
      rowData: [{ id: 1, name: 'John Doe' }],
      columnDefs: [{ field: 'id' }, { field: 'name' }],
    };
    setup(props);

    // Verify that the header is hidden
    cy.get('.ag-header').should('have.css', 'height', '0px');
  });

  it('should apply getRowStyle function', () => {
    const getRowStyle = (params) => {
      if (params.data.id === 1) {
        return { backgroundColor: 'yellow' };
      }
      return null;
    };
    const props: TableProps = {
      getRowStyle,
      rowData: [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Doe' },
      ],
      columnDefs: [{ field: 'id' }, { field: 'name' }],
    };
    setup(props);

    // Verify that the row with id === 1 has the custom style
    cy.get('.ag-center-cols-container .ag-row').first().should('have.css', 'background-color', 'rgb(255, 255, 0)');
  });

  it('should apply rowClassRules', () => {
    const rowClassRules = {
      'highlight-row': (params) => params.data.id === 1,
    };
    const props: TableProps = {
      rowClassRules,
      rowData: [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Doe' },
      ],
      columnDefs: [{ field: 'id' }, { field: 'name' }],
    };
    setup(props);

    // Add CSS for the 'highlight-row' class in the test
    cy.document().then((doc) => {
      const style = doc.createElement('style');
      style.innerHTML = '.highlight-row { background-color: green; }';
      doc.head.appendChild(style);
    });

    // Verify that the row with id === 1 has the custom class applied
    cy.get('.ag-center-cols-container .ag-row')
      .first()
      .should('have.class', 'highlight-row')
      .and('have.css', 'background-color', 'rgb(0, 128, 0)');
  });

  it('should set headerHeight when provided', () => {
    const props: TableProps = {
      headerHeight: 100,
      rowData: [{ id: 1, name: 'John Doe' }],
      columnDefs: [{ field: 'id' }, { field: 'name' }],
    };
    setup(props);

    // Verify that the header has the specified height
    cy.get('.ag-header').should('have.css', 'height', '100px');
  });

  it('should handle selection change with onSelectionChanged', () => {
    const onSelectionChanged = cy.stub();
    const props: TableProps = {
      rowData: [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Doe' },
      ],
      columnDefs: [{ field: 'id' }, { field: 'name' }],
      onSelectionChanged,
      rowSelection: 'multiple',
    };
    setup(props);

    // Select a row
    cy.get('.ag-center-cols-container .ag-row').first().click();

    // Verify that onSelectionChanged was called
    cy.wrap(onSelectionChanged).should('have.been.called');
  });

  it('should test that isDirty ref works', () => {
    const TestComponent = () => {
      const tableRef = useRef<any>(null);
      const props: TableProps = {
        rowData: [{ id: 1, name: 'John Doe' }],
        columnDefs: [
          { field: 'id', editable: true },
          { field: 'name', editable: true },
        ],
      };
      return (
        <BaseComp>
          <Table {...props} ref={tableRef} />
          <button
            data-testid="is-dirty-button"
            onClick={() => {
              const isDirty = tableRef.current.isDirty();
              alert(`isDirty: ${isDirty}`);
            }}
          >
            Check isDirty
          </button>
        </BaseComp>
      );
    };

    mount(<TestComponent />);

    // Initially, isDirty should be false
    cy.get('[data-testid="is-dirty-button"]').click();
    cy.on('window:alert', (txt) => {
      expect(txt).to.equal('isDirty: false');
    });

    // Modify a cell value
    cy.get('.ag-center-cols-container .ag-cell').first().dblclick();
    cy.get('.ag-cell-editor').type('2{enter}');

    // Now, isDirty should be true
    cy.get('[data-testid="is-dirty-button"]').click();
    cy.on('window:alert', (txt) => {
      expect(txt).to.equal('isDirty: true');
    });
  });

  it('should display loading overlay when loading', () => {
    const props: TableProps = {
      rowData: null, // When rowData is null, the grid shows the loading overlay
      columnDefs: [{ field: 'id' }, { field: 'name' }],
    };
    setup(props);

    // Verify that the loading overlay is displayed
    cy.get('.ag-overlay-loading-center').should('exist');
  });
});
