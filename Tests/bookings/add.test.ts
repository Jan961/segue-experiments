import handle from 'pages/api/bookings/add';
import { prismaMock } from 'Tests/prismaClient.test';

jest.mock('lib/mappers', () => ({
  bookingMapper: jest.fn().mockImplementation((booking) => booking),
  performanceMapper: jest.fn().mockImplementation((performance) => performance),
}));

describe('handle function', () => {
  const mockReq = {
    body: [
      {
        DateBlockId: 1,
        VenueId: 6,
        Date: '2024-02-28',
        performanceTimes: ['19:00:00', '21:00:00'],
        DateTypeId: 3,
        BookingStatus: 'C',
        PencilNo: 1,
        Notes: 'This is a sample booking note.',
      },
      {
        DateBlockId: 2,
        VenueId: 7,
        Date: '2024-03-01',
        performanceTimes: ['18:00:00', '20:00:00'],
        DateTypeId: 4,
        BookingStatus: 'P',
        PencilNo: 2,
        Notes: 'This is a second sample booking note.',
      },
    ],
  };

  const mockRes = {
    status: jest.fn(() => mockRes),
    json: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    prismaMock.$transaction.mockImplementation(async (callback) => {
      return callback(prismaMock);
    });
  });

  it('should create bookings and return them along with performances', async () => {
    // Assuming the implementation details of your handle function, adjust as necessary
    prismaMock.booking.create
      .mockResolvedValueOnce({
        FirstDate: new Date('2024-02-28'),
        Id: 936,
        VenueId: 6,
        StatusCode: 'C',
        PencilNum: 1,
        Notes: 'This is a sample booking note.',
      })
      .mockResolvedValueOnce({
        FirstDate: new Date('2024-03-01'),
        Id: 937,
        VenueId: 7,
        StatusCode: 'P',
        PencilNum: 2,
        Notes: 'This is a second sample booking note.',
      });

    // Mocking performance.createMany to simulate creating multiple performances
    prismaMock.performance.createMany.mockResolvedValue([
      // Assuming these are the performances related to the bookings, adjust according to your schema
      { Id: 2192, BookingId: 936, Date: '2024-02-28T19:00:00Z' },
      { Id: 2193, BookingId: 936, Date: '2024-02-28T21:00:00Z' },
      { Id: 2194, BookingId: 937, Date: '2024-03-01T18:00:00Z' },
      { Id: 2195, BookingId: 937, Date: '2024-03-01T20:00:00Z' },
    ]);

    // Execute the function with the mocked request and response objects
    await handle(mockReq, mockRes);

    // Assertions to ensure the function behaves as expected
    expect(prismaMock.booking.create).toHaveBeenCalledTimes(2); // Two bookings are created
    expect(prismaMock.performance.createMany).toHaveBeenCalledTimes(2); // Assuming each booking leads to a separate call
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      bookings: expect.arrayContaining([
        expect.objectContaining({
          date: expect.any(String),
          id: expect.any(Number),
          venueId: expect.any(Number),
          bookingStatus: expect.any(String),
          pencilNo: expect.any(Number),
          notes: expect.any(String),
        }),
      ]),
      performances: expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          bookingId: expect.any(Number),
          date: expect.any(String),
        }),
      ]),
    });
  });

  // Additional tests for error handling, etc.
});
