// cypress/component/Iframe.cy.tsx

import React from 'react';
import { mount } from 'cypress/react';
import Iframe from '../../components/Iframe'; // Adjust the import path accordingly

// Mock the formatUrl function
const formatUrl = (url: string) => url;

// Mock the Spinner component
const Spinner = ({ size }: { size: string }) => <div className={`spinner size-${size}`}>Loading...</div>;

// Mock classNames function (if not using a library like 'classnames')
const classNames = (...classes: string[]) => classes.filter(Boolean).join(' ');

describe('Iframe Component', () => {
  beforeEach(() => {
    // Replace the actual implementations with mocks
    cy.stub(window, 'formatUrl').callsFake(formatUrl);
    cy.stub(window, 'Spinner').value(Spinner);
    cy.stub(window, 'classNames').callsFake(classNames);
  });

  it('displays "No URL provided." when src is not given', () => {
    mount(<Iframe />);
    cy.contains('No URL provided.').should('exist');
  });

  it('renders iframe when src is provided', () => {
    const testUrl = 'https://example.com';
    mount(<Iframe src={testUrl} />);
    cy.get('iframe').should('exist').and('have.attr', 'src', testUrl);
  });

  it('shows spinner while iframe is loading and hides after load', () => {
    const testUrl = 'https://example.com';
    mount(<Iframe src={testUrl} />);
    cy.get('.spinner').should('exist');
    // Simulate iframe load
    cy.get('iframe').then(($iframe) => {
      $iframe[0].dispatchEvent(new Event('load'));
    });
    cy.get('.spinner').should('not.exist');
  });

  it('applies correct classes for variants', () => {
    const variants = ['xs', 'sm', 'md', 'lg'] as const;
    const IFRAME_SIZES = {
      xs: 'w-[150px] h-[81px]',
      sm: 'w-[326px] h-[183px]',
      md: 'w-[435px] h-[244px]',
      lg: 'w-[544px] h-[306px]',
    };
    variants.forEach((variant) => {
      mount(<Iframe src="https://example.com" variant={variant} />);
      const expectedClasses = IFRAME_SIZES[variant];
      expectedClasses.split(' ').forEach((className) => {
        cy.get('div').first().should('have.class', className);
      });
    });
  });

  it('opens the formattedUrl in a new tab when clicked', () => {
    const testUrl = 'https://example.com';
    cy.window().then((win) => {
      cy.stub(win, 'open').as('windowOpen');
    });
    mount(<Iframe src={testUrl} />);
    cy.get('div').first().click();
    cy.get('@windowOpen').should('have.been.calledWith', testUrl, '_blank');
  });

  it('applies the correct transform style to the iframe', () => {
    const testUrl = 'https://example.com';
    mount(<Iframe src={testUrl} />);
    cy.get('iframe').should(($iframe) => {
      const style = $iframe[0].style;
      expect(style.transform).to.match(/scale\(.+\)/);
      expect(style.width).to.match(/px/);
      expect(style.height).to.match(/px/);
      expect(style.transformOrigin).to.equal('top left');
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
