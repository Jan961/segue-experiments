// Tabs.cy.tsx

import { mount } from 'cypress/react';
import Tabs from '../../../components/core-ui-lib/Tabs';
import { Tab } from '@headlessui/react';
import BaseComp from '../global/BaseComp';

describe('Tabs Component', () => {
  const tabs = ['Tab 1', 'Tab 2', 'Tab 3'];
  const selectedTabClass = 'selected-tab-class';

  const renderTabs = (props = {}) => {
    mount(
      <BaseComp>
        <Tabs tabs={tabs} selectedTabClass={selectedTabClass} {...props}>
          {tabs.map((tabLabel, index) => (
            <Tab.Panel key={index}>Content for {tabLabel}</Tab.Panel>
          ))}
        </Tabs>
        ,
      </BaseComp>,
    );
  };

  it('renders the correct number of tabs', () => {
    renderTabs();
    cy.get('button').should('have.length', tabs.length);
  });

  it('renders the tab labels correctly', () => {
    renderTabs();
    tabs.forEach((tabLabel) => {
      cy.contains('button', tabLabel).should('exist');
    });
  });

  it('selects the default tab based on defaultIndex', () => {
    const defaultIndex = 1;
    renderTabs({ defaultIndex });
    cy.get('button').eq(defaultIndex).should('have.class', selectedTabClass);
  });

  it('changes tab on click', () => {
    renderTabs();
    cy.contains('button', 'Tab 2').click();
    cy.contains('button', 'Tab 2').should('have.class', selectedTabClass);
    cy.contains('Content for Tab 2').should('be.visible');
    cy.contains('Content for Tab 1').should('not.exist');
  });

  it('calls onChange when tab is changed', () => {
    const onChange = cy.stub().as('onChange');
    renderTabs({ onChange });
    cy.contains('button', 'Tab 2').click();
    cy.get('@onChange').should('have.been.calledWith', 1);
  });

  it('does not change tab when disabled is true', () => {
    renderTabs({ disabled: true });
    cy.contains('button', 'Tab 2').click({ force: true });
    cy.contains('Content for Tab 1').should('be.visible');
    cy.contains('Content for Tab 2').should('not.exist');
  });

  it('disables the TabButtons when disabled prop is true', () => {
    renderTabs({ disabled: true });
    cy.get('button').each(($btn) => {
      cy.wrap($btn).should('be.disabled');
    });
  });

  it('applies selectedTabClass to the selected tab', () => {
    renderTabs();
    cy.contains('button', 'Tab 1').should('have.class', selectedTabClass);
    cy.contains('button', 'Tab 2').should('not.have.class', selectedTabClass);
  });

  it('applies buttonWidth to the TabButton className', () => {
    const buttonWidth = 'w-[200px]';
    renderTabs({ buttonWidth });
    cy.get('button').each(($btn) => {
      cy.wrap($btn).should('have.class', buttonWidth);
    });
  });
});
