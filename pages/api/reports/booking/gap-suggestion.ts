import { NextApiRequest, NextApiResponse } from 'next';
import ExcelJS from 'exceljs';
import getPrismaClient from 'lib/prisma';
import { GapSuggestionUnbalancedProps, VenueWithDistance } from 'services/booking/gapSuggestion/types';
import { calculateGapSuggestions } from 'services/booking/gapSuggestion';
import { addBorderToAllCells, getExportedAtTitle } from 'utils/export';
import { formatDate, newDate } from 'services/dateService';
import { COLOR_HEXCODE } from 'services/salesSummaryService';
import { formatMinutes } from 'utils/booking';
import { addWidthAsPerContent } from 'services/reportsService';
import { omit, unique } from 'radash';

interface VenueContactInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
}

/**
 * fetch venue contacts for the given venue ids
 * @param prisma
 * @param venueIds
 * @returns
 */
async function getVenueContacts(prisma: any, venueIds: number[]): Promise<Map<number, VenueContactInfo>> {
  const contactsMap = new Map<number, VenueContactInfo>();
  const priorityRoles = ['Programming', 'Manager', 'Box Office Default'];

  // Fetch all contacts for the given venues and roles in one query
  const allContacts = await prisma.venueContact.findMany({
    where: {
      VenueId: { in: venueIds },
      VenueRole: {
        Name: { in: priorityRoles },
      },
    },
    select: {
      VenueId: true,
      FirstName: true,
      LastName: true,
      Email: true,
      Phone: true,
      Role: true,
      VenueRole: {
        select: {
          Name: true,
        },
      },
    },
    orderBy: {
      VenueRole: {
        Name: 'asc', // This will help in prioritizing roles
      },
    },
  });

  // Group contacts by VenueId
  const contactsByVenue = allContacts.reduce((acc, contact) => {
    if (!acc.has(contact.VenueId)) {
      acc.set(contact.VenueId, []);
    }
    acc.get(contact.VenueId)!.push(contact);
    return acc;
  }, new Map<number, typeof allContacts>());

  // For each venue, get the highest priority contact
  for (const venueId of venueIds) {
    const venueContacts = contactsByVenue.get(venueId) || [];
    let selectedContact = null;

    // Find the first contact matching our priority order
    for (const roleName of priorityRoles) {
      selectedContact = venueContacts.find((contact) => contact.VenueRole.Name === roleName);
      if (selectedContact) break;
    }
    contactsMap.set(venueId, {
      firstName: selectedContact?.FirstName || '',
      lastName: selectedContact?.LastName || '',
      email: selectedContact?.Email || '',
      phone: selectedContact?.Phone || '',
      role: selectedContact?.VenueRole?.Name || '',
    });
  }

  return contactsMap;
}

/**
 * exports the gap suggestions to an excel file
 * @param req
 * @param res
 * @returns
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const prisma = await getPrismaClient(req);
    const params = req.body as GapSuggestionUnbalancedProps & {
      filteredVenueIds: number[];
      prodCode: string;
      exportedAt: string;
    };
    const filename = `Venue Gap Suggestions ${params.prodCode || ''} ${formatDate(newDate(), 'dd.MM.yy')}`;
    // Get the gap suggestions data
    const result = await calculateGapSuggestions(prisma, omit(params, ['filteredVenueIds']));
    // Get all venue contacts at once
    const filteredVenueInfo =
      result.VenueInfo?.filter((venue) => !params.filteredVenueIds.includes(venue.VenueId))?.sort(
        (a, b) => a.MinsFromStart - b.MinsFromStart,
      ) || [];
    // Get unique venue ids
    const venueIds = unique(filteredVenueInfo?.map((venue) => venue.VenueId) || []);
    // Get venue contacts for the list of venue ids in the filtered venue info
    const contactsMap = await getVenueContacts(prisma, venueIds);

    // Create new excel worknook instance and add a worksheet to it with title Venue Gap Suggestions
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Venue Gap Suggestions', {
      pageSetup: { fitToPage: true, fitToHeight: 5, fitToWidth: 7 },
      views: [{ state: 'frozen', ySplit: 3 }],
    });

    // Add title row
    const titleRow = worksheet.addRow([filename]);
    titleRow.height = 30;
    titleRow.font = {
      bold: true,
      color: { argb: COLOR_HEXCODE.WHITE },
      size: 16,
    };
    titleRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: COLOR_HEXCODE.DARK_ORANGE },
    };
    // merge cells for title to span over all the columns and align it to center
    worksheet.mergeCells(1, 1, 1, 12); // Merge cells for title
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' };

    // Add exported at row
    const exportedAtRow = worksheet.addRow([getExportedAtTitle(params.exportedAt)]);
    exportedAtRow.height = 25;
    exportedAtRow.font = {
      bold: true,
      color: { argb: COLOR_HEXCODE.WHITE },
      size: 14,
    };
    exportedAtRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: COLOR_HEXCODE.DARK_ORANGE },
    };
    worksheet.mergeCells(2, 1, 2, 12); // Merge cells for exported at
    exportedAtRow.alignment = { vertical: 'middle', horizontal: 'left' };

    // Add header columns to the worksheet
    const headers = [
      'Venue',
      'Town',
      'Seats',
      'Travel Time to Venue',
      'Miles to Venue',
      'Travel Time From Venue',
      'Miles From Venue',
      'Contact First Name',
      'Contact Last Name',
      'Contact Email',
      'Contact Phone',
      'Contact Role',
    ];

    // Add header row and style them to have bold text, white color, dark orange background and left alignment
    const headerRow = worksheet.addRow(headers);
    headerRow.height = 25;
    headerRow.font = {
      bold: true,
      color: { argb: COLOR_HEXCODE.WHITE },
      size: 11,
    };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: COLOR_HEXCODE.DARK_ORANGE },
    };
    headerRow.alignment = {
      vertical: 'middle',
      horizontal: 'left',
    };

    if (filteredVenueInfo) {
      // loop through the filtered venue info and add them to the worksheet
      filteredVenueInfo.forEach((venue: VenueWithDistance) => {
        const contactInfo = contactsMap.get(venue.VenueId);

        const row = worksheet.addRow([
          venue.Name,
          venue.Town,
          venue.Capacity,
          formatMinutes(venue.MinsFromStart),
          venue.MileageFromStart,
          formatMinutes(venue.MinsFromEnd),
          venue.MileageFromEnd,
          contactInfo?.firstName || '',
          contactInfo?.lastName || '',
          contactInfo?.email || '',
          contactInfo?.phone || '',
          contactInfo?.role || '',
        ]);

        // Style data rows
        row.height = 25;
        row.alignment = {
          vertical: 'middle',
          horizontal: 'left',
        };
        row.font = {
          size: 11,
        };
      });
    }
    const numberOfColumns = worksheet.columnCount;
    // add border to all cells
    addBorderToAllCells({ worksheet });
    // calculate the width of the columns based on the content and set the width of the columns
    addWidthAsPerContent({
      worksheet,
      fromColNumber: 1,
      toColNumber: numberOfColumns,
      startingColAsCharWIthCapsOn: 'A',
      minColWidth: 10,
      bufferWidth: 0,
      rowsToIgnore: 2,
      maxColWidth: Infinity,
    });
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}.xlsx"`);

    workbook.xlsx.write(res).then(() => {
      res.end();
    });
  } catch (err) {
    console.error('Error generating Excel file:', err);
    res.status(500).json({ error: 'Error generating Excel file' });
  }
};

export default handler;
