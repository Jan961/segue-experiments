// cypress/component/UploadModal.spec.tsx

import { mount } from 'cypress/react18';
import UploadModal from '../../../components/core-ui-lib/UploadModal';
import { UploadModalProps } from '../../../components/core-ui-lib/UploadModal';
import 'cypress-file-upload';
import BaseComp from '../global/BaseComp';

function setup(props: UploadModalProps) {
  mount(
    <BaseComp>
      <UploadModal {...props} />
    </BaseComp>,
  );
}

describe('UploadModal Component', () => {
  const defaultProps: UploadModalProps = {
    visible: true,
    title: 'Upload Files',
    info: 'Please upload your files.',
    isMultiple: true,
    maxFiles: 3,
    maxFileSize: 1024 * 1024 * 5, // 5MB
    allowedFormats: ['image/png', 'image/jpeg'],
    testId: 'core-ui-lib-upload-model',
  };

  it('renders correctly when visible is true', () => {
    const onCloseStub = cy.stub();
    setup({ ...defaultProps, onClose: onCloseStub });

    // Check that the modal is visible - using the default testId of the Modal component -i.e. overlay
    cy.get('[data-testid="overlay"]').should('be.visible');

    // Check that the title is displayed
    cy.contains(defaultProps.title).should('be.visible');

    // Check that the info text is displayed
    cy.get(`[data-testid="${defaultProps.testId}-info"]`).should('contain', defaultProps.info);
  });

  it('opens file dialog when upload area is clicked', () => {
    setup(defaultProps);

    // Spy on the file input click
    cy.get('[data-testid="hidden-input"]').then(($input) => {
      cy.spy($input[0], 'click').as('fileInputClick');
    });

    // Click on the upload area
    cy.get(`[data-testid="${defaultProps.testId}-upload-image"]`).click();

    // Check that the hidden file input was clicked
    cy.get('@fileInputClick').should('have.been.called');
  });

  it('allows user to select files and displays them', () => {
    const onChangeStub = cy.stub();
    setup({ ...defaultProps, onChange: onChangeStub });

    // Click on the upload area
    cy.get(`[data-testid="${defaultProps.testId}-upload-image"]`).click();

    // Attach a file
    const fileName = 'placeholder.png';
    cy.fixture(fileName, 'base64').then((fileContent) => {
      cy.get('[data-testid="hidden-input"]').attachFile(
        {
          fileContent,
          fileName,
          mimeType: 'image/png',
          encoding: 'base64',
        },
        {
          force: true,
        },
      );
    });

    // Check that the FileCard is displayed
    cy.get('.grid').within(() => {
      cy.contains(fileName).should('be.visible');
    });

    // Check that onChange was called
    cy.wrap(onChangeStub).should('have.been.called');
  });

  it('shows error when no file is selected', () => {
    setup(defaultProps);

    // Simulate file input change with no files
    cy.get('[data-testid="hidden-input"]').trigger('change', { force: true });

    // Check that error is displayed
    cy.get('[data-testid="error"]').should('be.visible').and('contain', 'No file selected');
  });

  it('shows error when maxFiles is exceeded', () => {
    setup({ ...defaultProps, maxFiles: 1 });

    // Click on the upload area
    cy.get(`[data-testid="${defaultProps.testId}-upload-image"]`).click();

    // Attach two files
    const files = ['placeholder.png', 'placeholder.png'];
    cy.fixture(files[0], 'base64').then((fileContent1) => {
      cy.fixture(files[1], 'base64').then((fileContent2) => {
        cy.get('[data-testid="hidden-input"]').attachFile(
          [
            {
              fileContent: fileContent1,
              fileName: files[0],
              mimeType: 'image/png',
              encoding: 'base64',
            },
            {
              fileContent: fileContent2,
              fileName: files[1],
              mimeType: 'image/png',
              encoding: 'base64',
            },
          ],
          {
            force: true,
          },
        );
      });
    });

    // Check that error is displayed
    cy.get('[data-testid="error"]').should('be.visible').and('contain', 'You can upload 1 file');

    // Ensure no files are selected
    cy.get('.grid').should('not.be.visible');
  });

  it('shows error when file exceeds maxFileSize', () => {
    setup({ ...defaultProps, maxFileSize: 1 }); // Set maxFileSize to 1 byte

    // Click on the upload area
    cy.get(`[data-testid="${defaultProps.testId}-upload-image"]`).click();

    // Attach a file
    const fileName = 'placeholder.png';
    cy.fixture(fileName, 'base64').then((fileContent) => {
      cy.get('[data-testid="hidden-input"]').attachFile(
        {
          fileContent,
          fileName,
          mimeType: 'image/png',
          encoding: 'base64',
        },
        {
          force: true,
        },
      );
    });

    // Check that error is displayed in FileCard
    cy.get('.grid').within(() => {
      cy.contains('This file is too big. Please upload a smaller file.').should('be.visible');
    });

    // Upload button should be disabled
    cy.get('button').contains('Upload').should('be.disabled');
  });

  it('shows error when file is of invalid format', () => {
    setup(defaultProps);

    // Click on the upload area
    cy.get(`[data-testid="${defaultProps.testId}-upload-image"]`).click();

    // Attach a PDF file
    const fileName = 'example_pdf.pdf';
    cy.fixture(fileName, 'base64').then((fileContent) => {
      cy.get('[data-testid="hidden-input"]').attachFile(
        {
          fileContent,
          fileName,
          mimeType: 'application/pdf',
          encoding: 'base64',
        },
        {
          force: true,
        },
      );
    });

    // Check that error is displayed in FileCard
    cy.get('.grid').within(() => {
      cy.contains(`Invalid file format. Allowed formats: image/png, image/jpeg.`).should('be.visible');
    });

    // Upload button should be disabled
    cy.get('button').contains('Upload').should('be.disabled');
  });

  it('disables Upload button when there are errors', () => {
    setup({ ...defaultProps, maxFileSize: 1 });

    // Click on the upload area
    cy.get(`[data-testid="${defaultProps.testId}-upload-image"]`).click();

    // Attach a file
    const fileName = 'placeholder.png';
    cy.fixture(fileName, 'base64').then((fileContent) => {
      cy.get('[data-testid="hidden-input"]').attachFile(
        {
          fileContent,
          fileName,
          mimeType: 'image/png',
          encoding: 'base64',
        },
        {
          force: true,
        },
      );
    });

    // Upload button should be disabled
    cy.get('button').contains('Upload').should('be.disabled');
  });

  it('calls onSave when upload is clicked and there are no errors', () => {
    const onSaveStub = cy.stub();
    const onCloseStub = cy.stub();
    setup({ ...defaultProps, onSave: onSaveStub, onClose: onCloseStub });

    // Click on the upload area
    cy.get(`[data-testid="${defaultProps.testId}-upload-image"]`).click();

    // Attach a valid image file
    const fileName = 'placeholder.png';
    cy.fixture(fileName, 'base64').then((fileContent) => {
      cy.get('[data-testid="hidden-input"]').attachFile(
        {
          fileContent,
          fileName,
          mimeType: 'image/png',
          encoding: 'base64',
        },
        {
          force: true,
        },
      );
    });

    // Click the Upload button
    cy.get('button').contains('Upload').click();

    // Check that onSave was called
    cy.wrap(onSaveStub).should('have.been.called');

    // Simulate upload completion by calling onSave's callback
    // Assuming onSave accepts (files, onProgress, onError, onUploadingImage)
    cy.then(() => {
      const [files, onProgress, onError, onUploadingImage] = onSaveStub.getCall(0).args;

      // Simulate progress completion
      files.forEach((file) => {
        onProgress(file.file, 100);
      });
    });

    // Button should now say 'OK'
    cy.contains('OK').should('be.visible');

    // Click 'OK' to close the modal
    cy.contains('OK').click();

    // Check that onClose was called
    cy.wrap(onCloseStub).should('have.been.called');
  });

  it('calls onClose when cancel is clicked', () => {
    const onCloseStub = cy.stub();
    setup({ ...defaultProps, onClose: onCloseStub });

    // Click the Cancel button
    cy.contains('Cancel').click();

    // Check that onClose was called
    cy.wrap(onCloseStub).should('have.been.called');
  });

  it('allows user to delete a selected file', () => {
    const onChangeStub = cy.stub();
    setup({ ...defaultProps, onChange: onChangeStub });

    // Click on the upload area
    cy.get(`[data-testid="${defaultProps.testId}-upload-image"]`).click();

    // Attach a file
    const fileName = 'placeholder.png';
    cy.fixture(fileName, 'base64').then((fileContent) => {
      cy.get('[data-testid="hidden-input"]').attachFile(
        {
          fileContent,
          fileName,
          mimeType: 'image/png',
          encoding: 'base64',
        },
        {
          force: true,
        },
      );
    });

    // Check that the FileCard is displayed
    cy.get('.grid').within(() => {
      cy.contains(fileName).should('be.visible');
    });

    // Click on delete button for the file
    cy.get('.grid').within(() => {
      cy.contains(fileName).parent().find('[data-testid="delete-button"]').click();
    });

    // Check that the FileCard is removed
    cy.get('.grid').should('not.contain', fileName);

    // Check that onChange was called
    cy.wrap(onChangeStub).should('have.been.called');
  });

  it('changes button label to OK when upload is complete', () => {
    const onCloseStub = cy.stub();
    const onSaveStub = cy.stub();
    setup({ ...defaultProps, onClose: onCloseStub, onSave: onSaveStub });

    // Initially, with no selected files, the button should say 'OK'
    cy.contains('OK').should('be.visible');

    // Now, upload a file
    cy.get(`[data-testid="${defaultProps.testId}-upload-image"]`).click();

    const fileName = 'placeholder.png';
    cy.fixture(fileName, 'base64').then((fileContent) => {
      cy.get('[data-testid="hidden-input"]').attachFile(
        {
          fileContent,
          fileName,
          mimeType: 'image/png',
          encoding: 'base64',
        },
        {
          force: true,
        },
      );
    });

    // Button should now say 'Upload'
    cy.get('button').contains('Upload').should('be.visible');

    // Simulate upload completion
    cy.get('button').contains('Upload').click();
    cy.wrap(onSaveStub).should('have.been.called');

    // Simulate the onProgress callback to indicate upload completion
    cy.then(() => {
      const [files, onProgress] = onSaveStub.getCall(0).args;
      files.forEach((file) => {
        onProgress(file.file, 100);
      });
    });

    // Button should now say 'OK'
    cy.contains('OK').should('be.visible');

    // Simulate file deletion
    cy.get('.grid').within(() => {
      cy.contains(fileName).parent().find('[data-testid="delete-button"]').click();
    });

    // Button should now say 'OK' again
    cy.contains('OK').should('be.visible');
  });
});
