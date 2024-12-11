// cypress/component/Iframe.cy.tsx
import { mount } from 'cypress/react18';
import Iframe, { IframeProps, Variant } from '../../../components/core-ui-lib/Iframe';
import BaseComp from '../helpers/BaseComp'; // Adjust the import path accordingly

const setup = (props: IframeProps) => {
  mount(
    <BaseComp>
      <Iframe {...props} />
    </BaseComp>,
  );
};

describe('Iframe Component', () => {
  it('displays "No URL provided." when src is not given', () => {
    setup({ src: '' });
    cy.contains('No URL provided.').should('exist');
  });

  it('renders iframe when src is provided', () => {
    const src = 'https://example.com';
    setup({ src });
    cy.get('iframe').should('exist').and('have.attr', 'src', src);
  });

  it('applies correct classes for variants', () => {
    const variants = ['xs', 'sm', 'md', 'lg'] as Variant[];
    const IFRAME_SIZES = {
      xs: 'w-[150px] h-[81px]',
      sm: 'w-[326px] h-[183px]',
      md: 'w-[435px] h-[244px]',
      lg: 'w-[544px] h-[306px]',
    };
    const src = 'https://example.com';
    variants.forEach((variant) => {
      setup({ src, variant, testId: 'test-iframe' });
      const expectedClasses = IFRAME_SIZES[variant];
      expectedClasses.split(' ').forEach((className) => {
        cy.get('[data-testId="test-iframe"]').should('have.class', className);
      });
    });
  });

  it('opens the formattedUrl in a new tab when clicked', () => {
    const testUrl = 'https://example.com';
    cy.window().then((win) => {
      cy.stub(win, 'open').as('windowOpen');
    });
    const src = 'https://example.com';
    setup({ src, testId: 'test-iframe' });
    cy.get('[data-testId="test-iframe"]').click();
    cy.get('@windowOpen').should('have.been.calledWith', testUrl, '_blank');
  });

  it('applies the correct transform style to the iframe', () => {
    const testUrl = 'https://example.com';
    setup({ src: testUrl, testId: 'test-iframe' });
    cy.get('iframe').should(($iframe) => {
      const style = $iframe[0].style;
      expect(style.transform).to.match(/scale\(.+\)/);
      expect(style.width).to.match(/px/);
      expect(style.height).to.match(/px/);
      expect(style.transformOrigin).to.equal('left top');
      expect(style.visibility).to.equal('hidden');
      expect(style.pointerEvents).to.equal('none');
    });
    // Simulate iframe load
    cy.get('iframe').then(($iframe) => {
      $iframe[0].dispatchEvent(new Event('load'));
    });
    cy.get('iframe').should('have.css', 'visibility', 'visible');
  });
});
