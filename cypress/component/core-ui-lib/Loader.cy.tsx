// Loader.spec.tsx
import Loader, { LoaderProps, variant } from '../../../components/core-ui-lib/Loader';
import { mount } from 'cypress/react18';
import BaseComp from '../global/BaseComp';

const setup = (props: LoaderProps) => {
  return mount(
    <BaseComp>
      <Loader {...props} />
    </BaseComp>,
  );
};

describe('Loader Component', () => {
  it('renders without crashing with default props', () => {
    setup({});
    cy.get('[data-testid="core-ui-lib-loader"]').should('exist');
    cy.get('[data-testid="spinIcon"]').should('exist');
  });

  it('displays the provided text', () => {
    const text = 'Loading...';
    setup({ text });
    cy.get('span').should('contain.text', text);
  });

  // note: the below sizes are copied from the component definition in Loader.tsx
  it('applies correct size based on variant', () => {
    const variants: variant[] = ['xs', 'sm', 'md', 'lg'];
    const sizes = {
      xs: '15px',
      sm: '18px',
      md: '20px',
      lg: '22px',
    };

    variants.forEach((v) => {
      setup({ variant: v });
      cy.get('[data-testid="spinIcon"]').should('have.attr', 'width', sizes[v]).and('have.attr', 'height', sizes[v]);
    });
  });

  it('applies additional className to the container', () => {
    const className = 'custom-class';
    setup({ className });
    cy.get('[data-testid="core-ui-lib-loader"]').should('have.class', className);
  });

  it('passes iconProps to the SpinIcon', () => {
    const iconProps = { fill: 'red', stroke: 'blue' };
    setup({ iconProps });
    cy.get('[data-testid="spinIcon"]').should('have.attr', 'fill', 'red').and('have.attr', 'stroke', 'blue');
  });

  it('uses custom testId if provided', () => {
    const testId = 'custom-loader';
    setup({ testId });
    cy.get(`[data-testid="${testId}"]`).should('exist');
  });
});
