// import handle from './pathToYourFunction'; // Update with the actual path to your function
import handle from 'pages/api/bookings/add';
// import { prismaMock } from './prismaMock'; // Assuming this is in the same directory
// import { bookingMapper, performanceMapper } from './yourMappers'; // Update paths as necessary
import { prismaMock } from 'Tests/prismaClient.test';

// Mock additional dependencies if they're not already globally mocked
jest.mock('lib/mappers', () => ({
  bookingMapper: jest.fn().mockImplementation((booking) => booking),
  performanceMapper: jest.fn().mockImplementation((performance) => performance),
}));

describe('handle function', () => {
  const mockReq = {
    body: [
      {
        DateBlockId: 1,
        VenueId: 2,
        Date: '2024-02-20',
        performanceTimes: ['12:00:00', '15:00:00'],
      },
    ],
  };
  const mockRes = {
    status: jest.fn(() => mockRes),
    json: jest.fn(),
  };

  it('should create bookings and return them along with performances', async () => {
    // Setup Prisma mock to mimic the expected behavior
    prismaMock.$transaction.mockImplementation(async (callback) => {
      return callback(prismaMock);
    });
    prismaMock.booking.create.mockResolvedValue({
      FirstDate: new Date('2024-02-20'),
      Performance: [
        { Time: new Date('2024-02-20T12:00:00'), Date: new Date('2024-02-20') },
        { Time: new Date('2024-02-20T15:00:00'), Date: new Date('2024-02-20') },
      ],
      Venue: { Id: 2 },
    });

    // Execute the function with the mocked request and response objects
    await handle(mockReq, mockRes);

    // Assertions
    // expect(prismaMock.booking.create).toHaveBeenCalled(1);
    expect(prismaMock.booking.create).toHaveBeenCalledTimes(1);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        bookings: expect.any(Array),
        performances: expect.any(Array),
      }),
    );
    // Add more specific assertions regarding the structure of the bookings and performances if needed
  });

  // Add more tests to cover error handling, different input scenarios, etc.
});
