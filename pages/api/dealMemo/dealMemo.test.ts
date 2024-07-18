import { getDealMemoCall, getPrice, getTechProvision } from './utils';

describe('getPrice', () => {
  it('should categorize prices into update and create correctly', () => {
    const input = [
      { DMPId: 1, DMPDeMoId: 10, DMPTicketName: 'Premium', DMPTicketPrice: 100 },
      { DMPDeMoId: 20, DMPTicketName: 'Standard', DMPTicketPrice: 50 },
    ];
    const [updatePrice, createPrice] = getPrice(input);

    expect(updatePrice).toEqual([{ where: { DMPId: 1 }, data: { DMPTicketName: 'Premium', DMPTicketPrice: 100 } }]);
    expect(createPrice).toEqual([{ DMPTicketName: 'Standard', DMPTicketPrice: 50 }]);
  });
});

describe('getTechProvision', () => {
  it('should categorize tech provisions into update and create correctly', () => {
    const input = [
      { DMTechDeMoId: 1, DMTechName: 'Lighting', DMTechVenue: 'Venue1', DMTechCompany: 'Company1' },
      { DMTechName: 'Sound', DMTechVenue: 'Venue2', DMTechCompany: 'Company2' },
    ];
    const [updateTechProvision, createTechProvision] = getTechProvision(input);

    expect(updateTechProvision).toEqual([
      {
        where: { DMTechDeMoId: 1 },
        data: { DMTechName: 'Lighting', DMTechVenue: 'Venue1', DMTechCompany: 'Company1' },
      },
    ]);
    expect(createTechProvision).toEqual([{ DMTechName: 'Sound', DMTechVenue: 'Venue2', DMTechCompany: 'Company2' }]);
  });
});

describe('getDealMemoCall', () => {
  it('should categorize deal memo calls into update and create correctly', () => {
    const input = [
      { DMCId: 1, DMCCallNum: 100, DMCPromoterOrVenue: 'Venue1', DMCType: 'Type1', DMCValue: 1000 },
      { DMCCallNum: 200, DMCPromoterOrVenue: 'Venue2', DMCType: 'Type2', DMCValue: 2000 },
    ];
    const [updateCall, createCall] = getDealMemoCall(input);
    console.log('updateCall===>', updateCall);
    expect(updateCall).toEqual([
      {
        where: { DMCId: 1 },
        data: { DMCId: 1, DMCCallNum: 100, DMCPromoterOrVenue: 'Venue1', DMCType: 'Type1', DMCValue: 1000 },
      },
    ]);
    expect(createCall).toEqual([{ DMCCallNum: 200, DMCPromoterOrVenue: 'Venue2', DMCType: 'Type2', DMCValue: 2000 }]);
  });
});
