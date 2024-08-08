Object.defineProperty(exports, '__esModule', { value: true });

const { Decimal, objectEnumValues, makeStrictEnum, Public, getRuntime } = require('./runtime/index-browser.js');

const Prisma = {};

exports.Prisma = Prisma;
exports.$Enums = {};

/**
 * Prisma Client JS version: 5.18.0
 * Query Engine version: 4c784e32044a8a016d99474bd02a3b6123742169
 */
Prisma.prismaVersion = {
  client: '5.18.0',
  engine: '4c784e32044a8a016d99474bd02a3b6123742169',
};

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.Decimal = Decimal;

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.validator = Public.validator;

/**
 * Extensions
 */
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull;
Prisma.JsonNull = objectEnumValues.instances.JsonNull;
Prisma.AnyNull = objectEnumValues.instances.AnyNull;

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull,
};

/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable',
});

exports.Prisma.AccountScalarFieldEnum = {
  AccountId: 'AccountId',
  AccountName: 'AccountName',
  AccountAddress1: 'AccountAddress1',
  AccountAddress2: 'AccountAddress2',
  AccountAddress3: 'AccountAddress3',
  AccountAddressTown: 'AccountAddressTown',
  AccountAddressCounty: 'AccountAddressCounty',
  AccountAddressPostcode: 'AccountAddressPostcode',
  AccountAddressCountry: 'AccountAddressCountry',
  AccountVATNumber: 'AccountVATNumber',
  AccountCurrencyCode: 'AccountCurrencyCode',
  AccountCompanyNumber: 'AccountCompanyNumber',
  AccountLogoFileId: 'AccountLogoFileId',
  AccountMainEmail: 'AccountMainEmail',
  AccountNumPeople: 'AccountNumPeople',
  AccountOrganisationId: 'AccountOrganisationId',
  AccountTermsAgreedBy: 'AccountTermsAgreedBy',
  AccountTermsAgreedDate: 'AccountTermsAgreedDate',
  AccountWebsite: 'AccountWebsite',
  AccountTypeOfCompany: 'AccountTypeOfCompany',
  AccountPhone: 'AccountPhone',
  AccountPaymentCurrencyCode: 'AccountPaymentCurrencyCode',
};

exports.Prisma.AccountContactScalarFieldEnum = {
  AccContId: 'AccContId',
  AccContAccountId: 'AccContAccountId',
  AccContFirstName: 'AccContFirstName',
  AccContLastName: 'AccContLastName',
  AccContPhone: 'AccContPhone',
  AccContMainEmail: 'AccContMainEmail',
};

exports.Prisma.AccountSubscriptionScalarFieldEnum = {
  AccSubId: 'AccSubId',
  AccSubAccountId: 'AccSubAccountId',
  AccSubPlanId: 'AccSubPlanId',
  AccSubStartDate: 'AccSubStartDate',
  AccSubEndDate: 'AccSubEndDate',
  AccSubIsActive: 'AccSubIsActive',
};

exports.Prisma.AccountUserScalarFieldEnum = {
  AccUserId: 'AccUserId',
  AccUserUserId: 'AccUserUserId',
  AccUserAccountId: 'AccUserAccountId',
  AccUserIsAdmin: 'AccUserIsAdmin',
  AccUserPIN: 'AccUserPIN',
};

exports.Prisma.AccountUserPermissionScalarFieldEnum = {
  UserAuthId: 'UserAuthId',
  UserAuthAccUserId: 'UserAuthAccUserId',
  UserAuthPermissionId: 'UserAuthPermissionId',
};

exports.Prisma.CurrencyScalarFieldEnum = {
  CurrencyCode: 'CurrencyCode',
  CurrencyName: 'CurrencyName',
  CurrencySymbolUnicode: 'CurrencySymbolUnicode',
};

exports.Prisma.DBSettingScalarFieldEnum = {
  DBSettingId: 'DBSettingId',
  DBSettingName: 'DBSettingName',
  DBSettingValue: 'DBSettingValue',
};

exports.Prisma.FileScalarFieldEnum = {
  FileId: 'FileId',
  FileOriginalFilename: 'FileOriginalFilename',
  FileMediaType: 'FileMediaType',
  FileLocation: 'FileLocation',
  FileUploadDateTime: 'FileUploadDateTime',
  FileUploadUserId: 'FileUploadUserId',
  FileSizeBytes: 'FileSizeBytes',
};

exports.Prisma.PermissionScalarFieldEnum = {
  PermissionId: 'PermissionId',
  PermissionParentPermissionId: 'PermissionParentPermissionId',
  PermissionName: 'PermissionName',
  PermissionDescription: 'PermissionDescription',
  PermissionSeqNo: 'PermissionSeqNo',
};

exports.Prisma.ProductionCompanyScalarFieldEnum = {
  ProdCoId: 'ProdCoId',
  ProdCoAccountId: 'ProdCoAccountId',
  ProdCoName: 'ProdCoName',
  ProdCoWebSite: 'ProdCoWebSite',
  ProdCoSaleStartWeek: 'ProdCoSaleStartWeek',
  ProdCoVATCode: 'ProdCoVATCode',
  ProdCoLogoFileId: 'ProdCoLogoFileId',
};

exports.Prisma.SubscriptionPlanScalarFieldEnum = {
  PlanId: 'PlanId',
  PlanName: 'PlanName',
  PlanDescription: 'PlanDescription',
  PlanPrice: 'PlanPrice',
  PlanFrequency: 'PlanFrequency',
  PlanPriceId: 'PlanPriceId',
  PlanCurrency: 'PlanCurrency',
};

exports.Prisma.UserScalarFieldEnum = {
  UserId: 'UserId',
  UserEmail: 'UserEmail',
  UserFirstName: 'UserFirstName',
  UserLastName: 'UserLastName',
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc',
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last',
};

exports.Prisma.ModelName = {
  Account: 'Account',
  AccountContact: 'AccountContact',
  AccountSubscription: 'AccountSubscription',
  AccountUser: 'AccountUser',
  AccountUserPermission: 'AccountUserPermission',
  Currency: 'Currency',
  DBSetting: 'DBSetting',
  File: 'File',
  Permission: 'Permission',
  ProductionCompany: 'ProductionCompany',
  SubscriptionPlan: 'SubscriptionPlan',
  User: 'User',
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message;
        const runtime = getRuntime();
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message =
            'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' +
            runtime.prettyName +
            '`).';
        }

        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`;

        throw new Error(message);
      },
    });
  }
}

exports.PrismaClient = PrismaClient;

Object.assign(exports, Prisma);
