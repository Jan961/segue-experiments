// Icon.spec.tsx
import { mount } from 'cypress/react18';
import Icon, { IconName } from '../../../components/core-ui-lib/Icon';

describe('Icon Component', () => {
  const validIconName: IconName = 'search';

  it('renders correctly with a valid iconName', () => {
    mount(<Icon iconName={validIconName} />);
    cy.get('svg').should('exist');
  });

  it('does not render with an invalid iconName', () => {
    mount(<Icon iconName="invalid-icon" />);
    cy.get('svg').should('not.exist');
  });

  it('applies the correct size for each variant', () => {
    const variants = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '5xl', '7xl'] as const;
    const variantSizes = {
      xs: '15px',
      sm: '18px',
      md: '20px',
      lg: '22px',
      xl: '24px',
      '2xl': '26px',
      '3xl': '30px',
      '5xl': '50px',
      '7xl': '80px',
    };

    variants.forEach((variant) => {
      mount(<Icon iconName={validIconName} variant={variant} />);
      cy.get('svg')
        .should('have.attr', 'width', variantSizes[variant])
        .and('have.attr', 'height', variantSizes[variant]);
    });
  });

  it('applies stroke, strokeWidth, fill, and color props correctly', () => {
    const stroke = '#ff0000';
    const strokeWidth = '2';
    const fill = '#00ff00';
    const color = '#0000ff';

    mount(<Icon iconName={validIconName} stroke={stroke} strokeWidth={strokeWidth} fill={fill} color={color} />);

    cy.get('svg')
      .should('have.attr', 'stroke', stroke)
      .and('have.attr', 'stroke-width', strokeWidth)
      .and('have.attr', 'fill', fill)
      .and('have.attr', 'color', color);
  });

  it('calls onClick when the icon is clicked', () => {
    const onClick = cy.stub().as('onClickStub');
    mount(<Icon iconName={validIconName} onClick={onClick} />);
    cy.get('svg').click();
    cy.get('@onClickStub').should('have.been.calledOnce');
  });

  it('applies disabled state correctly by adjusting fill and stroke opacity', () => {
    const stroke = '#ff0000';
    const fill = '#00ff00';
    const expectedStroke = '#66ff0000';
    const expectedFill = '#6600ff00';

    mount(<Icon iconName={validIconName} stroke={stroke} fill={fill} disabled />);
    cy.get('svg').should('have.attr', 'stroke', expectedStroke).and('have.attr', 'fill', expectedFill);
  });

  it('applies the className prop correctly', () => {
    const className = 'test-class';
    mount(<Icon iconName={validIconName} className={className} />);
    cy.get('svg').should('have.class', className);
  });

  it('sets the role attribute to img', () => {
    mount(<Icon iconName={validIconName} />);
    cy.get('svg').should('have.attr', 'role', 'img');
  });

  it('sets the data-testid attribute when testId prop is provided', () => {
    const testId = 'icon-test-id';
    mount(<Icon iconName={validIconName} testId={testId} />);
    cy.get(`[data-testid="${testId}"]`).should('exist');
  });
});
