export const VerticalContent = () => {
  return (
    <div
      style={{
        width: '800px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <div style={{ height: '50px' }}>
        <p>Content 1</p>
      </div>

      <div style={{ height: '50px' }}>
        <p>Content 2</p>
      </div>

      <div style={{ height: '50px' }}>
        <p>Content 3</p>
      </div>

      <div style={{ height: '50px' }}>
        <p>Content 4</p>
      </div>

      <div style={{ height: '50px' }}>
        <p>Content 5</p>
      </div>

      <div style={{ height: '50px' }}>
        <p>Content 6</p>
      </div>

      <div style={{ height: '50px' }}>
        <p>Content 7</p>
      </div>

      <div style={{ height: '50px' }}>
        <p>Content 8</p>
      </div>

      <div style={{ height: '50px' }}>
        <p>Content 9</p>
      </div>

      <div style={{ height: '50px' }}>
        <p>Content 10</p>
      </div>

      <div style={{ height: '50px' }}>
        <p>Content 11</p>
      </div>
    </div>
  );
};

export const GridContent = () => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)', // 3 columns, each taking equal space
        gap: '10px', // spacing between grid items
      }}
    >
      <div style={{ height: '50px', padding: '20px' }}>
        <p>Content 1</p>
      </div>

      <div style={{ height: '50px', padding: '20px' }}>
        <p>Content 2</p>
      </div>

      <div style={{ height: '50px', padding: '20px' }}>
        <p>Content 3</p>
      </div>

      <div style={{ height: '50px', padding: '20px' }}>
        <p>Content 1</p>
      </div>

      <div style={{ height: '50px', padding: '20px' }}>
        <p>Content 2</p>
      </div>

      <div style={{ height: '50px', padding: '20px' }}>
        <p>Content 3</p>
      </div>

      <div style={{ height: '50px', padding: '20px' }}>
        <p>Content 1</p>
      </div>

      <div style={{ height: '50px', padding: '20px' }}>
        <p>Content 2</p>
      </div>

      <div style={{ height: '50px', padding: '20px' }}>
        <p>Content 3</p>
      </div>
    </div>
  );
};
