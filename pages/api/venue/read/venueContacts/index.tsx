
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

/**
 *
 * Default query using Prisma to provide ORM
 *

 SELECT
 Venue.Code,
 Venue.Name,
 Venue.Website,
 Venue.VenueFamily,
 Venue.Address1 AS MainAddress1,
 Venue.Address3 AS MainAddress2,
 Venue.Address3 AS MainAddress3,
 Venue.Town AS MainAddressTown,
 Venue.County As MainAddressCounty,
 Venue.Postcode As MainAddressPostcode,
 Venue.Country As MainAddressCountry,
 Venue.Currency As Currency,
 Venue.VATIndicator AS VatIndicator,
 Venue.Seats,
 Venue.TownPopulation,
 Venue.Notes,
 Venue.DeliveryAddress1 AS DeliveryAddress1,
 Venue.DeliveryAddress3 AS DeliveryAddress2,
 Venue.DeliveryAddress3 AS DeliveryAddress3,
 Venue.DeliveryTown AS DeliveryAddressTown,
 Venue.DeliveryCounty As DeliveryAddressCounty,
 Venue.DeliveryPostcode As DeliveryAddressPostcode,
 Venue.DeliveryCountry As DeliveryAddressCountry,
 Venue.LXDesk,
 Venue.LXNotes,
 Venue.SoundDesk,
 Venue.SoundNotes,
 Venue.StageSize,
 Venue.GridHeight,
 Venue.VenueFlags,
 CONCAT(atm.FirstName, " ", atm.LastName) AS ActingThearterManagerName,
 atm.Phone AS ActingThearterManagerPhone,
 atm.Email AS ActingThearterManagerEmail,
 CONCAT(a.FirstName, " ", a.LastName) AS AdministrationName,
 a.Phone AS AdministrationPhone,
 a.Email AS AdministrationEmail,
 CONCAT(bom.FirstName, " ", bom.LastName) AS BoxOfficeManagerName,
 bom.Phone AS BoxOfficeManagerPhone,
 bom.Email AS BoxOfficeManagerEmail,
 CONCAT(bom2.FirstName, " ", bom2.LastName) AS BoxOfficeManager2Name,
 bom2.Phone AS BoxOfficeManager2Phone,
 bom2.Email AS BoxOfficeManager2Email,
 CONCAT(clx.FirstName, " ", clx.LastName) AS ChiefLXName,
 clx.Phone AS ChiefLXPhone,
 clx.Email AS ChiefLXEmail,
 CONCAT(cd.FirstName, " ", cd.LastName) AS CreativeDirectorName,
 cd.Phone AS CreativeDirectorPhone,
 cd.Email AS CreativeDirectorEmail,
 CONCAT(dtm.FirstName, " ", dtm.LastName) AS DeputyTechManagerName,
 dtm.Phone AS DeputyTechManagerPhone,
 dtm.Email AS DeputyTechManagerEmail,
 CONCAT(dtm.FirstName, " ", dmc.LastName) AS DigitalMarketingContactName,
 dmc.Phone AS DigitalMarketingContactPhone,
 dmc.Email AS DigitalMarketingContactEmail,
 CONCAT(dtm.FirstName, " ", fm.LastName) AS FinanceManagerName,
 fm.Phone AS FinanceManagerPhone,
 fm.Email AS FinanceManagerEmail,
 CONCAT(m.FirstName, " ", m.LastName) AS MainName,
 m.Phone AS MainPhone,
 m.Email AS MainEmail,
 CONCAT(man.FirstName, " ", man.LastName) AS ManagerName,
 man.Phone AS ManagerPhone,
 man.Email AS ManagerEmail,
 CONCAT(ma.FirstName, " ", ma.LastName) AS MarketingAssistantName,
 ma.Phone AS MarketingAssistantPhone,
 ma.Email AS MarketingAssistantEmail,
 CONCAT(ma2.FirstName, " ", ma2.LastName) AS MarketingAssistant2Name,
 ma2.Phone AS MarketingAssistant2Phone,
 ma2.Email AS MarketingAssistant2Email,
 CONCAT(vcm.FirstName, " ", vcm.LastName) AS MarketingContactName,
 vcm.Phone AS MarketingContactPhone,
 vcm.Email AS MarketingContactEmail,
 CONCAT(mcp.FirstName, " ", mcp.LastName) AS MarketingContactPRName,
 mcp.Phone AS MarketingContactPRPhone,
 mcp.Email AS MarketingContactPREmail,
 CONCAT(mm.FirstName, " ", mm.LastName) AS MarketingManagerName,
 mm.Phone AS MarketingManagerPhone,
 mm.Email AS MarketingManagerEmail,
 CONCAT(oa.FirstName, " ", oa.LastName) AS OperationsAssistantName,
 oa.Phone AS OperationsAssistantPhone,
 oa.Email AS OperationsAssistantEmail,
 CONCAT(om.FirstName, " ", om.LastName) AS OperationsManagerName,
 om.Phone AS OperationsManagerPhone,
 om.Email AS OperationsManagerEmail,
 CONCAT(p.FirstName, " ", p.LastName) AS ProgrammingName,
 p.Phone AS ProgrammingPhone,
 p.Email AS DProgrammingEmail,
 CONCAT(sd.FirstName, " ", sd.LastName) AS StageDoorName,
 sd.Phone AS StageDoorPhone,
 sd.Email AS StageDoorEmail,
 CONCAT(tm.FirstName, " ", tm.LastName) AS TechnicalManagerName,
 tm.Phone AS TechnicalManagerPhone,
 tm.Email AS TechnicalManagerEmail,
 CONCAT(tech.FirstName, " ", tech.LastName) AS TechnicianName,
 tech.Phone AS TechnicianPhone,
 tech.Email AS TechnicianEmail,
 CONCAT(vmg.FirstName, " ", vmg.LastName) AS VenueManagerName,
 vmg.Phone AS VenueManagerPhone,
 vmg.Email AS VenueManagerEmail
 FROM `Venue`
 LEFT JOIN VenueContact AS atm
 On Venue.VenueId = atm.VenueId AND atm.Role = "Acting Theatre Manager"
 LEFT JOIN VenueContact AS a
 On Venue.VenueId = a.VenueId AND a.Role = "Administration"
 LEFT JOIN VenueContact AS bom
 On Venue.VenueId = bom.VenueId AND bom.Role = "Box Office Manager"
 LEFT JOIN VenueContact AS bom2
 On Venue.VenueId = bom2.VenueId AND bom2.Role = "Box Office Manager 2"
 LEFT JOIN VenueContact AS clx
 On Venue.VenueId = clx.VenueId AND clx.Role = "Chief LX"
 LEFT JOIN VenueContact AS cd
 On Venue.VenueId = cd.VenueId AND cd.Role = "Creative Director"
 LEFT JOIN VenueContact AS dtm
 On Venue.VenueId = dtm.VenueId AND dtm.Role = "Deputy Tech Manager"
 LEFT JOIN VenueContact AS dmc
 On Venue.VenueId = dmc.VenueId AND dmc.Role = "Digital Marketing Contact"
 LEFT JOIN VenueContact AS fm
 On Venue.VenueId = fm.VenueId AND fm.Role = "Finance Manager"
 LEFT JOIN VenueContact AS m
 On Venue.VenueId = m.VenueId AND m.Role = "Main"
 LEFT JOIN VenueContact AS man
 On Venue.VenueId = man.VenueId AND man.Role = "Manager"
 LEFT JOIN VenueContact AS ma
 On Venue.VenueId = ma.VenueId AND ma.Role = "Marketing Assistant"
 LEFT JOIN VenueContact AS ma2
 On Venue.VenueId = ma2.VenueId AND ma2.Role = "Marketing Assitant 2"
 LEFT JOIN VenueContact AS vcm
 On Venue.VenueId = vcm.VenueId AND vcm.Role = "Marketing Contact"
 LEFT JOIN VenueContact AS mcp
 On Venue.VenueId = mcp.VenueId AND mcp.Role = "Marketing Contact (PR)"
 LEFT JOIN VenueContact AS mm
 On Venue.VenueId = mm.VenueId AND mm.Role = "Marketing Manager"
 LEFT JOIN VenueContact AS oa
 On Venue.VenueId = oa.VenueId AND oa.Role = "Operations Assitant"
 LEFT JOIN VenueContact AS om
 On Venue.VenueId = om.VenueId AND om.Role = "Opperations Manager"
 LEFT JOIN VenueContact AS p
 On Venue.VenueId = p.VenueId AND p.Role = "Programming"
 LEFT JOIN VenueContact AS sd
 On Venue.VenueId = sd.VenueId AND sd.Role = "Stage Door"
 LEFT JOIN VenueContact AS tm
 On Venue.VenueId = tm.VenueId AND tm.Role = "Technical Manager"
 LEFT JOIN VenueContact AS tech
 On Venue.VenueId = tech.VenueId AND tech.Role = "Technitian"
 LEFT JOIN VenueContact AS vmg
 On Venue.VenueId = vmg.VenueId AND vmg.Role = "Venue Manager";


 */

const query = "SELECT Venue.Code, Venue.Name, Venue.Website, Venue.VenueFamily, Venue.Address1 AS MainAddress1, Venue.Address3 AS MainAddress2, Venue.Address3 AS MainAddress3, Venue.Town AS MainAddressTown, Venue.County As MainAddressCounty, Venue.Postcode As MainAddressPostcode, Venue.Country As MainAddressCountry, Venue.Currency As Currency, Venue.VATIndicator AS VatIndicator, Venue.Seats, Venue.TownPopulation, Venue.Notes, Venue.DeliveryAddress1 AS DeliveryAddress1, Venue.DeliveryAddress3 AS DeliveryAddress2, Venue.DeliveryAddress3 AS DeliveryAddress3, Venue.DeliveryTown AS DeliveryAddressTown, Venue.DeliveryCounty As DeliveryAddressCounty, Venue.DeliveryPostcode As DeliveryAddressPostcode, Venue.DeliveryCountry As DeliveryAddressCountry, Venue.LXDesk, Venue.LXNotes, Venue.SoundDesk, Venue.SoundNotes, Venue.StageSize, Venue.GridHeight, Venue.VenueFlags, CONCAT(atm.FirstName, ' ', atm.LastName) AS ActingThearterManagerName, atm.Phone AS ActingThearterManagerPhone, atm.Email AS ActingThearterManagerEmail, CONCAT(a.FirstName, ' ', a.LastName) AS AdministrationName, a.Phone AS AdministrationPhone, a.Email AS AdministrationEmail, CONCAT(bom.FirstName, ' ', bom.LastName) AS BoxOfficeManagerName, bom.Phone AS BoxOfficeManagerPhone, bom.Email AS BoxOfficeManagerEmail, CONCAT(bom2.FirstName, ' ', bom2.LastName) AS BoxOfficeManager2Name, bom2.Phone AS BoxOfficeManager2Phone, bom2.Email AS BoxOfficeManager2Email, CONCAT(clx.FirstName, ' ', clx.LastName) AS ChiefLXName, clx.Phone AS ChiefLXPhone, clx.Email AS ChiefLXEmail, CONCAT(cd.FirstName, ' ', cd.LastName) AS CreativeDirectorName, cd.Phone AS CreativeDirectorPhone, cd.Email AS CreativeDirectorEmail, CONCAT(dtm.FirstName, ' ', dtm.LastName) AS DeputyTechManagerName, dtm.Phone AS DeputyTechManagerPhone, dtm.Email AS DeputyTechManagerEmail, CONCAT(dtm.FirstName, ' ', dmc.LastName) AS DigitalMarketingContactName, dmc.Phone AS DigitalMarketingContactPhone, dmc.Email AS DigitalMarketingContactEmail, CONCAT(dtm.FirstName, ' ', fm.LastName) AS FinanceManagerName, fm.Phone AS FinanceManagerPhone, fm.Email AS FinanceManagerEmail, CONCAT(m.FirstName, ' ', m.LastName) AS MainName, m.Phone AS MainPhone, m.Email AS MainEmail, CONCAT(man.FirstName, ' ', man.LastName) AS ManagerName, man.Phone AS ManagerPhone, man.Email AS ManagerEmail, CONCAT(ma.FirstName, ' ', ma.LastName) AS MarketingAssistantName, ma.Phone AS MarketingAssistantPhone, ma.Email AS MarketingAssistantEmail, CONCAT(ma2.FirstName, ' ', ma2.LastName) AS MarketingAssistant2Name, ma2.Phone AS MarketingAssistant2Phone, ma2.Email AS MarketingAssistant2Email, CONCAT(vcm.FirstName, ' ', vcm.LastName) AS MarketingContactName, vcm.Phone AS MarketingContactPhone, vcm.Email AS MarketingContactEmail, CONCAT(mcp.FirstName, ' ', mcp.LastName) AS MarketingContactPRName, mcp.Phone AS MarketingContactPRPhone, mcp.Email AS MarketingContactPREmail, CONCAT(mm.FirstName, ' ', mm.LastName) AS MarketingManagerName, mm.Phone AS MarketingManagerPhone, mm.Email AS MarketingManagerEmail, CONCAT(oa.FirstName, ' ', oa.LastName) AS OperationsAssistantName, oa.Phone AS OperationsAssistantPhone, oa.Email AS OperationsAssistantEmail, CONCAT(om.FirstName, ' ', om.LastName) AS OperationsManagerName, om.Phone AS OperationsManagerPhone, om.Email AS OperationsManagerEmail, CONCAT(p.FirstName, ' ', p.LastName) AS ProgrammingName, p.Phone AS ProgrammingPhone, p.Email AS DProgrammingEmail, CONCAT(sd.FirstName, ' ', sd.LastName) AS StageDoorName, sd.Phone AS StageDoorPhone, sd.Email AS StageDoorEmail, CONCAT(tm.FirstName, ' ', tm.LastName) AS TechnicalManagerName, tm.Phone AS TechnicalManagerPhone, tm.Email AS TechnicalManagerEmail, CONCAT(tech.FirstName, ' ', tech.LastName) AS TechnicianName, tech.Phone AS TechnicianPhone, tech.Email AS TechnicianEmail, CONCAT(vmg.FirstName, ' ', vmg.LastName) AS VenueManagerName, vmg.Phone AS VenueManagerPhone, vmg.Email AS VenueManagerEmail FROM `Venue` LEFT JOIN VenueContact AS atm On Venue.VenueId = atm.VenueId AND atm.Role = 'Acting Theatre Manager' LEFT JOIN VenueContact AS a On Venue.VenueId = a.VenueId AND a.Role = 'Administration' LEFT JOIN VenueContact AS bom On Venue.VenueId = bom.VenueId AND bom.Role = 'Box Office Manager' LEFT JOIN VenueContact AS bom2 On Venue.VenueId = bom2.VenueId AND bom2.Role = 'Box Office Manager 2' LEFT JOIN VenueContact AS clx On Venue.VenueId = clx.VenueId AND clx.Role = 'Chief LX' LEFT JOIN VenueContact AS cd On Venue.VenueId = cd.VenueId AND cd.Role = 'Creative Director' LEFT JOIN VenueContact AS dtm On Venue.VenueId = dtm.VenueId AND dtm.Role = 'Deputy Tech Manager' LEFT JOIN VenueContact AS dmc On Venue.VenueId = dmc.VenueId AND dmc.Role = 'Digital Marketing Contact' LEFT JOIN VenueContact AS fm On Venue.VenueId = fm.VenueId AND fm.Role = 'Finance Manager' LEFT JOIN VenueContact AS m On Venue.VenueId = m.VenueId AND m.Role = 'Main' LEFT JOIN VenueContact AS man On Venue.VenueId = man.VenueId AND man.Role = 'Manager' LEFT JOIN VenueContact AS ma On Venue.VenueId = ma.VenueId AND ma.Role = 'Marketing Assistant' LEFT JOIN VenueContact AS ma2 On Venue.VenueId = ma2.VenueId AND ma2.Role = 'Marketing Assitant 2' LEFT JOIN VenueContact AS vcm On Venue.VenueId = vcm.VenueId AND vcm.Role = 'Marketing Contact' LEFT JOIN VenueContact AS mcp On Venue.VenueId = mcp.VenueId AND mcp.Role = 'Marketing Contact (PR)' LEFT JOIN VenueContact AS mm On Venue.VenueId = mm.VenueId AND mm.Role = 'Marketing Manager' LEFT JOIN VenueContact AS oa On Venue.VenueId = oa.VenueId AND oa.Role = 'Operations Assitant' LEFT JOIN VenueContact AS om On Venue.VenueId = om.VenueId AND om.Role = 'Opperations Manager' LEFT JOIN VenueContact AS p On Venue.VenueId = p.VenueId AND p.Role = 'Programming' LEFT JOIN VenueContact AS sd On Venue.VenueId = sd.VenueId AND sd.Role = 'Stage Door' LEFT JOIN VenueContact AS tm On Venue.VenueId = tm.VenueId AND tm.Role = 'Technical Manager' LEFT JOIN VenueContact AS tech On Venue.VenueId = tech.VenueId AND tech.Role = 'Technitian' LEFT JOIN VenueContact AS vmg On Venue.VenueId = vmg.VenueId AND vmg.Role = 'Venue Manager';"
/**
 * @param req
 * @param res
 */
export default async function handle(req, res) {


    try {
        const result = await prisma.$queryRaw` SELECT Venue.Code,
                                                      Venue.Name,
                                                      Venue.Website,
                                                      Venue.VenueFamily,
                                                      Venue.Address1                             AS MainAddress1,
                                                      Venue.Address3                             AS MainAddress2,
                                                      Venue.Address3                             AS MainAddress3,
                                                      Venue.Town                                 AS MainAddressTown,
                                                      Venue.County                               As MainAddressCounty,
                                                      Venue.Postcode                             As MainAddressPostcode,
                                                      Venue.Country                              As MainAddressCountry,
                                                      Venue.Currency                             As Currency,
                                                      Venue.VATIndicator                         AS VatIndicator,
                                                      Venue.Seats,
                                                      Venue.TownPopulation,
                                                      Venue.Notes,
                                                      Venue.DeliveryAddress1                     AS DeliveryAddress1,
                                                      Venue.DeliveryAddress3                     AS DeliveryAddress2,
                                                      Venue.DeliveryAddress3                     AS DeliveryAddress3,
                                                      Venue.DeliveryTown                         AS DeliveryAddressTown,
                                                      Venue.DeliveryCounty                       As DeliveryAddressCounty,
                                                      Venue.DeliveryPostcode                     As DeliveryAddressPostcode,
                                                      Venue.DeliveryCountry                      As DeliveryAddressCountry,
                                                      Venue.LXDesk,
                                                      Venue.LXNotes,
                                                      Venue.SoundDesk,
                                                      Venue.SoundNotes,
                                                      Venue.StageSize,
                                                      Venue.GridHeight,
                                                      Venue.VenueFlags,
                                                      CONCAT(atm.FirstName, " ", atm.LastName)   AS ActingThearterManagerName,
                                                      atm.Phone                                  AS ActingThearterManagerPhone,
                                                      atm.Email                                  AS ActingThearterManagerEmail,
                                                      CONCAT(a.FirstName, " ", a.LastName)       AS AdministrationName,
                                                      a.Phone                                    AS AdministrationPhone,
                                                      a.Email                                    AS AdministrationEmail,
                                                      CONCAT(bom.FirstName, " ", bom.LastName)   AS BoxOfficeManagerName,
                                                      bom.Phone                                  AS BoxOfficeManagerPhone,
                                                      bom.Email                                  AS BoxOfficeManagerEmail,
                                                      CONCAT(bom2.FirstName, " ", bom2.LastName) AS BoxOfficeManager2Name,
                                                      bom2.Phone                                 AS BoxOfficeManager2Phone,
                                                      bom2.Email                                 AS BoxOfficeManager2Email,
                                                      CONCAT(clx.FirstName, " ", clx.LastName)   AS ChiefLXName,
                                                      clx.Phone                                  AS ChiefLXPhone,
                                                      clx.Email                                  AS ChiefLXEmail,
                                                      CONCAT(cd.FirstName, " ", cd.LastName)     AS CreativeDirectorName,
                                                      cd.Phone                                   AS CreativeDirectorPhone,
                                                      cd.Email                                   AS CreativeDirectorEmail,
                                                      CONCAT(dtm.FirstName, " ", dtm.LastName)   AS DeputyTechManagerName,
                                                      dtm.Phone                                  AS DeputyTechManagerPhone,
                                                      dtm.Email                                  AS DeputyTechManagerEmail,
                                                      CONCAT(dtm.FirstName, " ", dmc.LastName)   AS DigitalMarketingContactName,
                                                      dmc.Phone                                  AS DigitalMarketingContactPhone,
                                                      dmc.Email                                  AS DigitalMarketingContactEmail,
                                                      CONCAT(dtm.FirstName, " ", fm.LastName)    AS FinanceManagerName,
                                                      fm.Phone                                   AS FinanceManagerPhone,
                                                      fm.Email                                   AS FinanceManagerEmail,
                                                      CONCAT(m.FirstName, " ", m.LastName)       AS MainName,
                                                      m.Phone                                    AS MainPhone,
                                                      m.Email                                    AS MainEmail,
                                                      CONCAT(man.FirstName, " ", man.LastName)   AS ManagerName,
                                                      man.Phone                                  AS ManagerPhone,
                                                      man.Email                                  AS ManagerEmail,
                                                      CONCAT(ma.FirstName, " ", ma.LastName)     AS MarketingAssistantName,
                                                      ma.Phone                                   AS MarketingAssistantPhone,
                                                      ma.Email                                   AS MarketingAssistantEmail,
                                                      CONCAT(ma2.FirstName, " ", ma2.LastName)   AS MarketingAssistant2Name,
                                                      ma2.Phone                                  AS MarketingAssistant2Phone,
                                                      ma2.Email                                  AS MarketingAssistant2Email,
                                                      CONCAT(vcm.FirstName, " ", vcm.LastName)   AS MarketingContactName,
                                                      vcm.Phone                                  AS MarketingContactPhone,
                                                      vcm.Email                                  AS MarketingContactEmail,
                                                      CONCAT(mcp.FirstName, " ", mcp.LastName)   AS MarketingContactPRName,
                                                      mcp.Phone                                  AS MarketingContactPRPhone,
                                                      mcp.Email                                  AS MarketingContactPREmail,
                                                      CONCAT(mm.FirstName, " ", mm.LastName)     AS MarketingManagerName,
                                                      mm.Phone                                   AS MarketingManagerPhone,
                                                      mm.Email                                   AS MarketingManagerEmail,
                                                      CONCAT(oa.FirstName, " ", oa.LastName)     AS OperationsAssistantName,
                                                      oa.Phone                                   AS OperationsAssistantPhone,
                                                      oa.Email                                   AS OperationsAssistantEmail,
                                                      CONCAT(om.FirstName, " ", om.LastName)     AS OperationsManagerName,
                                                      om.Phone                                   AS OperationsManagerPhone,
                                                      om.Email                                   AS OperationsManagerEmail,
                                                      CONCAT(p.FirstName, " ", p.LastName)       AS ProgrammingName,
                                                      p.Phone                                    AS ProgrammingPhone,
                                                      p.Email                                    AS DProgrammingEmail,
                                                      CONCAT(sd.FirstName, " ", sd.LastName)     AS StageDoorName,
                                                      sd.Phone                                   AS StageDoorPhone,
                                                      sd.Email                                   AS StageDoorEmail,
                                                      CONCAT(tm.FirstName, " ", tm.LastName)     AS TechnicalManagerName,
                                                      tm.Phone                                   AS TechnicalManagerPhone,
                                                      tm.Email                                   AS TechnicalManagerEmail,
                                                      CONCAT(tech.FirstName, " ", tech.LastName) AS TechnicianName,
                                                      tech.Phone                                 AS TechnicianPhone,
                                                      tech.Email                                 AS TechnicianEmail,
                                                      CONCAT(vmg.FirstName, " ", vmg.LastName)   AS VenueManagerName,
                                                      vmg.Phone                                  AS VenueManagerPhone,
                                                      vmg.Email                                  AS VenueManagerEmail
                                               FROM \`Venue\`
                                                        LEFT JOIN VenueContact AS atm
                                                                  On Venue.VenueId = atm.VenueId AND atm.Role = "Acting Theatre Manager"
                                                        LEFT JOIN VenueContact AS a
                                                                  On Venue.VenueId = a.VenueId AND a.Role = "Administration"
                                                        LEFT JOIN VenueContact AS bom
                                                                  On Venue.VenueId = bom.VenueId AND bom.Role = "Box Office Manager"
                                                        LEFT JOIN VenueContact AS bom2
                                                                  On Venue.VenueId = bom2.VenueId AND bom2.Role = "Box Office Manager 2"
                                                        LEFT JOIN VenueContact AS clx
                                                                  On Venue.VenueId = clx.VenueId AND clx.Role = "Chief LX"
                                                        LEFT JOIN VenueContact AS cd
                                                                  On Venue.VenueId = cd.VenueId AND cd.Role = "Creative Director"
                                                        LEFT JOIN VenueContact AS dtm
                                                                  On Venue.VenueId = dtm.VenueId AND dtm.Role = "Deputy Tech Manager"
                                                        LEFT JOIN VenueContact AS dmc
                                                                  On Venue.VenueId = dmc.VenueId AND dmc.Role = "Digital Marketing Contact"
                                                        LEFT JOIN VenueContact AS fm
                                                                  On Venue.VenueId = fm.VenueId AND fm.Role = "Finance Manager"
                                                        LEFT JOIN VenueContact AS m On Venue.VenueId = m.VenueId AND m.Role = "Main"
                                                        LEFT JOIN VenueContact AS man
                                                                  On Venue.VenueId = man.VenueId AND man.Role = "Manager"
                                                        LEFT JOIN VenueContact AS ma
                                                                  On Venue.VenueId = ma.VenueId AND ma.Role = "Marketing Assistant"
                                                        LEFT JOIN VenueContact AS ma2
                                                                  On Venue.VenueId = ma2.VenueId AND ma2.Role = "Marketing Assitant 2"
                                                        LEFT JOIN VenueContact AS vcm
                                                                  On Venue.VenueId = vcm.VenueId AND vcm.Role = "Marketing Contact"
                                                        LEFT JOIN VenueContact AS mcp
                                                                  On Venue.VenueId = mcp.VenueId AND mcp.Role = "Marketing Contact (PR)"
                                                        LEFT JOIN VenueContact AS mm
                                                                  On Venue.VenueId = mm.VenueId AND mm.Role = "Marketing Manager"
                                                        LEFT JOIN VenueContact AS oa
                                                                  On Venue.VenueId = oa.VenueId AND oa.Role = "Operations Assitant"
                                                        LEFT JOIN VenueContact AS om
                                                                  On Venue.VenueId = om.VenueId AND om.Role = "Opperations Manager"
                                                        LEFT JOIN VenueContact AS p On Venue.VenueId = p.VenueId AND p.Role = "Programming"
                                                        LEFT JOIN VenueContact AS sd
                                                                  On Venue.VenueId = sd.VenueId AND sd.Role = "Stage Door"
                                                        LEFT JOIN VenueContact AS tm
                                                                  On Venue.VenueId = tm.VenueId AND tm.Role = "Technical Manager"
                                                        LEFT JOIN VenueContact AS tech
                                                                  On Venue.VenueId = tech.VenueId AND tech.Role = "Technitian"
                                                        LEFT JOIN VenueContact AS vmg
                                                                  On Venue.VenueId = vmg.VenueId AND vmg.Role = "Venue Manager";`

        res.json(result)

    } catch (err) {
        console.log(err);
        res.status(403).json({ err: "Error occurred while generating search results." });
    }


}