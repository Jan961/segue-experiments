Object.defineProperty(exports, '__esModule', { value: true });

const {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
  PrismaClientInitializationError,
  PrismaClientValidationError,
  NotFoundError,
  getPrismaClient,
  sqltag,
  empty,
  join,
  raw,
  Decimal,
  Debug,
  objectEnumValues,
  makeStrictEnum,
  Extensions,
  warnOnce,
  defineDmmfProperty,
  Public,
  getRuntime,
} = require('./runtime/library.js');

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

Prisma.PrismaClientKnownRequestError = PrismaClientKnownRequestError;
Prisma.PrismaClientUnknownRequestError = PrismaClientUnknownRequestError;
Prisma.PrismaClientRustPanicError = PrismaClientRustPanicError;
Prisma.PrismaClientInitializationError = PrismaClientInitializationError;
Prisma.PrismaClientValidationError = PrismaClientValidationError;
Prisma.NotFoundError = NotFoundError;
Prisma.Decimal = Decimal;

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = sqltag;
Prisma.empty = empty;
Prisma.join = join;
Prisma.raw = raw;
Prisma.validator = Public.validator;

/**
 * Extensions
 */
Prisma.getExtensionContext = Extensions.getExtensionContext;
Prisma.defineExtension = Extensions.defineExtension;

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

const path = require('path');

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
 * Create the Client
 */
const config = {
  generator: {
    name: 'client',
    provider: {
      fromEnvVar: null,
      value: 'prisma-client-js',
    },
    output: {
      value: '/home/arun/projects/segue/prisma/generated/prisma-master',
      fromEnvVar: null,
    },
    config: {
      engineType: 'library',
    },
    binaryTargets: [
      {
        fromEnvVar: null,
        value: 'debian-openssl-1.0.x',
        native: true,
      },
      {
        fromEnvVar: null,
        value: 'darwin-arm64',
      },
      {
        fromEnvVar: null,
        value: 'linux-arm64-openssl-1.1.x',
      },
      {
        fromEnvVar: null,
        value: 'windows',
      },
    ],
    previewFeatures: ['views'],
    sourceFilePath: '/home/arun/projects/segue/prisma/schema_master.prisma',
    isCustomOutput: true,
  },
  relativeEnvPaths: {
    rootEnvPath: null,
    schemaEnvPath: '../../../.env',
  },
  relativePath: '../..',
  clientVersion: '5.18.0',
  engineVersion: '4c784e32044a8a016d99474bd02a3b6123742169',
  datasourceNames: ['db'],
  activeProvider: 'mysql',
  postinstall: false,
  inlineDatasources: {
    db: {
      url: {
        fromEnvVar: 'MASTER_DATABASE_URL',
        value: null,
      },
    },
  },
  inlineSchema:
    'generator client {\n  provider        = "prisma-client-js"\n  output          = "./generated/prisma-master"\n  previewFeatures = ["views"]\n  binaryTargets   = ["native", "darwin-arm64", "linux-arm64-openssl-1.1.x", "windows"]\n}\n\ndatasource db {\n  provider  = "mysql"\n  url       = env("MASTER_DATABASE_URL")\n  directUrl = env("MASTER_DATABASE_URL")\n}\n\nmodel Account {\n  AccountId                  Int                   @id @default(autoincrement())\n  AccountName                String                @db.VarChar(50)\n  AccountAddress1            String?               @db.VarChar(50)\n  AccountAddress2            String?               @db.VarChar(50)\n  AccountAddress3            String?               @db.VarChar(50)\n  AccountAddressTown         String?               @db.VarChar(50)\n  AccountAddressCounty       String?               @db.VarChar(50)\n  AccountAddressPostcode     String?               @db.VarChar(20)\n  AccountAddressCountry      String?               @db.VarChar(30)\n  AccountVATNumber           String?               @db.VarChar(20)\n  AccountCurrencyCode        String                @db.VarChar(3)\n  AccountCompanyNumber       String?               @db.VarChar(20)\n  AccountLogoFileId          Int?\n  AccountMainEmail           String?               @db.VarChar(120)\n  AccountNumPeople           Int?                  @db.TinyInt\n  AccountOrganisationId      String?               @unique(map: "Account_AccountOrganisationId_Unique") @db.VarChar(8)\n  AccountTermsAgreedBy       String?               @db.VarChar(100)\n  AccountTermsAgreedDate     DateTime?             @db.Date\n  AccountWebsite             String?               @db.VarChar(255)\n  AccountTypeOfCompany       String?               @db.VarChar(30)\n  AccountPhone               String?               @db.VarChar(30)\n  AccountPaymentCurrencyCode String?               @db.VarChar(3)\n  Currency                   Currency?             @relation(fields: [AccountPaymentCurrencyCode], references: [CurrencyCode], onDelete: Restrict, map: "Currency_Account_Payment")\n  File                       File?                 @relation(fields: [AccountLogoFileId], references: [FileId], map: "File_Account")\n  AccountContact             AccountContact[]\n  AccountSubscription        AccountSubscription[]\n  AccountUser                AccountUser[]\n  ProductionCompany          ProductionCompany[]\n\n  @@index([AccountPaymentCurrencyCode], map: "Currency_Account_Payment")\n  @@index([AccountLogoFileId], map: "File_Account")\n}\n\nmodel AccountContact {\n  AccContId        Int     @id @default(autoincrement())\n  AccContAccountId Int\n  AccContFirstName String  @db.VarChar(50)\n  AccContLastName  String? @db.VarChar(50)\n  AccContPhone     String? @db.VarChar(40)\n  AccContMainEmail String? @db.VarChar(120)\n  Account          Account @relation(fields: [AccContAccountId], references: [AccountId], onDelete: Cascade, map: "Account_AccountContact")\n\n  @@index([AccContAccountId], map: "Account_AccountContact")\n}\n\nmodel AccountSubscription {\n  AccSubId         Int              @id @default(autoincrement())\n  AccSubAccountId  Int\n  AccSubPlanId     Int\n  AccSubStartDate  DateTime         @db.DateTime(0)\n  AccSubEndDate    DateTime?        @db.DateTime(0)\n  AccSubIsActive   Boolean?         @db.Bit(1)\n  Account          Account          @relation(fields: [AccSubAccountId], references: [AccountId], onDelete: Cascade, map: "Account_AccountSubscription")\n  SubscriptionPlan SubscriptionPlan @relation(fields: [AccSubPlanId], references: [PlanId], onDelete: Cascade, map: "SubscriptionPlan_AccountSubscription")\n\n  @@index([AccSubAccountId], map: "Account_AccountSubscription")\n  @@index([AccSubPlanId], map: "SubscriptionPlan_AccountSubscription")\n}\n\nmodel AccountUser {\n  AccUserId             Int                     @id @default(autoincrement())\n  AccUserUserId         Int                     @unique(map: "AccUserUserId_UNIQUE")\n  AccUserAccountId      Int\n  AccUserIsAdmin        Boolean                 @default(dbgenerated("(b\'0\')")) @db.Bit(1)\n  AccUserPIN            String?                 @db.VarChar(4)\n  Account               Account                 @relation(fields: [AccUserAccountId], references: [AccountId], onDelete: Cascade, map: "Account_AccountUser")\n  User                  User                    @relation(fields: [AccUserUserId], references: [UserId], onDelete: Cascade, map: "User_AccountUser")\n  AccountUserPermission AccountUserPermission[]\n\n  @@index([AccUserAccountId], map: "Account_AccountUser")\n}\n\nmodel AccountUserPermission {\n  UserAuthId           Int         @id @default(autoincrement())\n  UserAuthAccUserId    Int\n  UserAuthPermissionId Int\n  AccountUser          AccountUser @relation(fields: [UserAuthAccUserId], references: [AccUserId], onDelete: Cascade, map: "AccountUser_AccountUserPermission")\n  Permission           Permission  @relation(fields: [UserAuthPermissionId], references: [PermissionId], onDelete: Cascade, map: "Permission_AccountUserPermission")\n\n  @@index([UserAuthAccUserId], map: "AccountUser_AccountUserPermission")\n  @@index([UserAuthPermissionId], map: "Permission_AccountUserPermission")\n}\n\nmodel Currency {\n  CurrencyCode          String    @id @db.VarChar(3)\n  CurrencyName          String    @db.VarChar(30)\n  CurrencySymbolUnicode String?   @db.VarChar(30)\n  Account               Account[]\n}\n\nmodel DBSetting {\n  DBSettingId    Int    @id @default(autoincrement())\n  DBSettingName  String @unique(map: "SettingName") @db.VarChar(50)\n  DBSettingValue String @db.VarChar(255)\n}\n\nmodel File {\n  FileId               Int                 @id @default(autoincrement())\n  FileOriginalFilename String              @db.VarChar(200)\n  FileMediaType        String?             @db.VarChar(200)\n  FileLocation         String              @db.VarChar(512)\n  FileUploadDateTime   DateTime            @db.DateTime(0)\n  FileUploadUserId     Int\n  FileSizeBytes        BigInt?\n  Account              Account[]\n  User                 User                @relation(fields: [FileUploadUserId], references: [UserId], map: "User_AttachedFile")\n  ProductionCompany    ProductionCompany[]\n\n  @@index([FileUploadUserId], map: "User_AttachedFile")\n}\n\nmodel Permission {\n  PermissionId                 Int                     @id @default(autoincrement())\n  PermissionParentPermissionId Int?\n  PermissionName               String                  @db.VarChar(50)\n  PermissionDescription        String                  @db.LongText\n  PermissionSeqNo              Int?                    @db.TinyInt\n  AccountUserPermission        AccountUserPermission[]\n}\n\nmodel ProductionCompany {\n  ProdCoId            Int     @id @default(autoincrement())\n  ProdCoAccountId     Int\n  ProdCoName          String  @db.VarChar(50)\n  ProdCoWebSite       String? @db.VarChar(80)\n  ProdCoSaleStartWeek Int?    @default(-50) @db.SmallInt\n  ProdCoVATCode       String? @db.VarChar(20)\n  ProdCoLogoFileId    Int?\n  Account             Account @relation(fields: [ProdCoAccountId], references: [AccountId], onDelete: Cascade, map: "Account_ProductionCompany")\n  File                File?   @relation(fields: [ProdCoLogoFileId], references: [FileId], map: "File_ProductionCompany")\n\n  @@index([ProdCoAccountId], map: "Account_ProductionCompany")\n  @@index([ProdCoLogoFileId], map: "File_ProductionCompany")\n}\n\nmodel SubscriptionPlan {\n  PlanId              Int                   @id @default(autoincrement())\n  PlanName            String                @db.VarChar(100)\n  PlanDescription     String?               @db.LongText\n  PlanPrice           Decimal               @db.Decimal(10, 2)\n  PlanFrequency       Int\n  PlanPriceId         String?               @db.VarChar(100)\n  PlanCurrency        String                @db.VarChar(3)\n  AccountSubscription AccountSubscription[]\n}\n\nmodel User {\n  UserId        Int          @id @unique(map: "UserIdUnique") @default(autoincrement())\n  UserEmail     String       @unique(map: "UserEmail_uk") @db.VarChar(120)\n  UserFirstName String       @db.VarChar(50)\n  UserLastName  String?      @db.VarChar(50)\n  AccountUser   AccountUser?\n  File          File[]\n}\n',
  inlineSchemaHash: 'e7d34773e0687852118dfdd4921afba58db22be5fb0d200d20201612e4239cb0',
  copyEngine: true,
};

const fs = require('fs');

config.dirname = __dirname;
if (!fs.existsSync(path.join(__dirname, 'schema.prisma'))) {
  const alternativePaths = ['prisma/generated/prisma-master', 'generated/prisma-master'];

  const alternativePath =
    alternativePaths.find((altPath) => {
      return fs.existsSync(path.join(process.cwd(), altPath, 'schema.prisma'));
    }) ?? alternativePaths[0];

  config.dirname = path.join(process.cwd(), alternativePath);
  config.isBundled = true;
}

config.runtimeDataModel = JSON.parse(
  '{"models":{"Account":{"dbName":null,"fields":[{"name":"AccountId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"Int","default":{"name":"autoincrement","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"AccountName","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"AccountAddress1","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"AccountAddress2","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"AccountAddress3","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"AccountAddressTown","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"AccountAddressCounty","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"AccountAddressPostcode","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"AccountAddressCountry","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"AccountVATNumber","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"AccountCurrencyCode","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"AccountCompanyNumber","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"AccountLogoFileId","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"Int","isGenerated":false,"isUpdatedAt":false},{"name":"AccountMainEmail","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"AccountNumPeople","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Int","isGenerated":false,"isUpdatedAt":false},{"name":"AccountOrganisationId","kind":"scalar","isList":false,"isRequired":false,"isUnique":true,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"AccountTermsAgreedBy","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"AccountTermsAgreedDate","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":false},{"name":"AccountWebsite","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"AccountTypeOfCompany","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"AccountPhone","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"AccountPaymentCurrencyCode","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"Currency","kind":"object","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Currency","relationName":"AccountToCurrency","relationFromFields":["AccountPaymentCurrencyCode"],"relationToFields":["CurrencyCode"],"relationOnDelete":"Restrict","isGenerated":false,"isUpdatedAt":false},{"name":"File","kind":"object","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"File","relationName":"AccountToFile","relationFromFields":["AccountLogoFileId"],"relationToFields":["FileId"],"isGenerated":false,"isUpdatedAt":false},{"name":"AccountContact","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"AccountContact","relationName":"AccountToAccountContact","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"AccountSubscription","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"AccountSubscription","relationName":"AccountToAccountSubscription","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"AccountUser","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"AccountUser","relationName":"AccountToAccountUser","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"ProductionCompany","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"ProductionCompany","relationName":"AccountToProductionCompany","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"AccountContact":{"dbName":null,"fields":[{"name":"AccContId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"Int","default":{"name":"autoincrement","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"AccContAccountId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"Int","isGenerated":false,"isUpdatedAt":false},{"name":"AccContFirstName","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"AccContLastName","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"AccContPhone","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"AccContMainEmail","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"Account","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Account","relationName":"AccountToAccountContact","relationFromFields":["AccContAccountId"],"relationToFields":["AccountId"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"AccountSubscription":{"dbName":null,"fields":[{"name":"AccSubId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"Int","default":{"name":"autoincrement","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"AccSubAccountId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"Int","isGenerated":false,"isUpdatedAt":false},{"name":"AccSubPlanId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"Int","isGenerated":false,"isUpdatedAt":false},{"name":"AccSubStartDate","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":false},{"name":"AccSubEndDate","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":false},{"name":"AccSubIsActive","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Boolean","isGenerated":false,"isUpdatedAt":false},{"name":"Account","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Account","relationName":"AccountToAccountSubscription","relationFromFields":["AccSubAccountId"],"relationToFields":["AccountId"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"SubscriptionPlan","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"SubscriptionPlan","relationName":"AccountSubscriptionToSubscriptionPlan","relationFromFields":["AccSubPlanId"],"relationToFields":["PlanId"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"AccountUser":{"dbName":null,"fields":[{"name":"AccUserId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"Int","default":{"name":"autoincrement","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"AccUserUserId","kind":"scalar","isList":false,"isRequired":true,"isUnique":true,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"Int","isGenerated":false,"isUpdatedAt":false},{"name":"AccUserAccountId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"Int","isGenerated":false,"isUpdatedAt":false},{"name":"AccUserIsAdmin","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Boolean","default":{"name":"dbgenerated","args":["(b\'0\')"]},"isGenerated":false,"isUpdatedAt":false},{"name":"AccUserPIN","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"Account","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Account","relationName":"AccountToAccountUser","relationFromFields":["AccUserAccountId"],"relationToFields":["AccountId"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"User","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"User","relationName":"AccountUserToUser","relationFromFields":["AccUserUserId"],"relationToFields":["UserId"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"AccountUserPermission","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"AccountUserPermission","relationName":"AccountUserToAccountUserPermission","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"AccountUserPermission":{"dbName":null,"fields":[{"name":"UserAuthId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"Int","default":{"name":"autoincrement","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"UserAuthAccUserId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"Int","isGenerated":false,"isUpdatedAt":false},{"name":"UserAuthPermissionId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"Int","isGenerated":false,"isUpdatedAt":false},{"name":"AccountUser","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"AccountUser","relationName":"AccountUserToAccountUserPermission","relationFromFields":["UserAuthAccUserId"],"relationToFields":["AccUserId"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"Permission","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Permission","relationName":"AccountUserPermissionToPermission","relationFromFields":["UserAuthPermissionId"],"relationToFields":["PermissionId"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"Currency":{"dbName":null,"fields":[{"name":"CurrencyCode","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"CurrencyName","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"CurrencySymbolUnicode","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"Account","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Account","relationName":"AccountToCurrency","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"DBSetting":{"dbName":null,"fields":[{"name":"DBSettingId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"Int","default":{"name":"autoincrement","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"DBSettingName","kind":"scalar","isList":false,"isRequired":true,"isUnique":true,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"DBSettingValue","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"File":{"dbName":null,"fields":[{"name":"FileId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"Int","default":{"name":"autoincrement","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"FileOriginalFilename","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"FileMediaType","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"FileLocation","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"FileUploadDateTime","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":false},{"name":"FileUploadUserId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"Int","isGenerated":false,"isUpdatedAt":false},{"name":"FileSizeBytes","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"BigInt","isGenerated":false,"isUpdatedAt":false},{"name":"Account","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Account","relationName":"AccountToFile","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"User","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"User","relationName":"FileToUser","relationFromFields":["FileUploadUserId"],"relationToFields":["UserId"],"isGenerated":false,"isUpdatedAt":false},{"name":"ProductionCompany","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"ProductionCompany","relationName":"FileToProductionCompany","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"Permission":{"dbName":null,"fields":[{"name":"PermissionId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"Int","default":{"name":"autoincrement","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"PermissionParentPermissionId","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Int","isGenerated":false,"isUpdatedAt":false},{"name":"PermissionName","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"PermissionDescription","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"PermissionSeqNo","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Int","isGenerated":false,"isUpdatedAt":false},{"name":"AccountUserPermission","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"AccountUserPermission","relationName":"AccountUserPermissionToPermission","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"ProductionCompany":{"dbName":null,"fields":[{"name":"ProdCoId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"Int","default":{"name":"autoincrement","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"ProdCoAccountId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"Int","isGenerated":false,"isUpdatedAt":false},{"name":"ProdCoName","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"ProdCoWebSite","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"ProdCoSaleStartWeek","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Int","default":-50,"isGenerated":false,"isUpdatedAt":false},{"name":"ProdCoVATCode","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"ProdCoLogoFileId","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"Int","isGenerated":false,"isUpdatedAt":false},{"name":"Account","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Account","relationName":"AccountToProductionCompany","relationFromFields":["ProdCoAccountId"],"relationToFields":["AccountId"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"File","kind":"object","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"File","relationName":"FileToProductionCompany","relationFromFields":["ProdCoLogoFileId"],"relationToFields":["FileId"],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"SubscriptionPlan":{"dbName":null,"fields":[{"name":"PlanId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"Int","default":{"name":"autoincrement","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"PlanName","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"PlanDescription","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"PlanPrice","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Decimal","isGenerated":false,"isUpdatedAt":false},{"name":"PlanFrequency","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Int","isGenerated":false,"isUpdatedAt":false},{"name":"PlanPriceId","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"PlanCurrency","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"AccountSubscription","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"AccountSubscription","relationName":"AccountSubscriptionToSubscriptionPlan","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"User":{"dbName":null,"fields":[{"name":"UserId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"Int","default":{"name":"autoincrement","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"UserEmail","kind":"scalar","isList":false,"isRequired":true,"isUnique":true,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"UserFirstName","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"UserLastName","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"AccountUser","kind":"object","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"AccountUser","relationName":"AccountUserToUser","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"File","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"File","relationName":"FileToUser","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false}},"enums":{},"types":{}}',
);
defineDmmfProperty(exports.Prisma, config.runtimeDataModel);
config.engineWasm = undefined;

const { warnEnvConflicts } = require('./runtime/library.js');

warnEnvConflicts({
  rootEnvPath: config.relativeEnvPaths.rootEnvPath && path.resolve(config.dirname, config.relativeEnvPaths.rootEnvPath),
  schemaEnvPath:
    config.relativeEnvPaths.schemaEnvPath && path.resolve(config.dirname, config.relativeEnvPaths.schemaEnvPath),
});

const PrismaClient = getPrismaClient(config);
exports.PrismaClient = PrismaClient;
Object.assign(exports, Prisma);

// file annotations for bundling tools to include these files
path.join(__dirname, 'libquery_engine-debian-openssl-1.0.x.so.node');
path.join(process.cwd(), 'prisma/generated/prisma-master/libquery_engine-debian-openssl-1.0.x.so.node');

// file annotations for bundling tools to include these files
path.join(__dirname, 'libquery_engine-darwin-arm64.dylib.node');
path.join(process.cwd(), 'prisma/generated/prisma-master/libquery_engine-darwin-arm64.dylib.node');

// file annotations for bundling tools to include these files
path.join(__dirname, 'libquery_engine-linux-arm64-openssl-1.1.x.so.node');
path.join(process.cwd(), 'prisma/generated/prisma-master/libquery_engine-linux-arm64-openssl-1.1.x.so.node');

// file annotations for bundling tools to include these files
path.join(__dirname, 'query_engine-windows.dll.node');
path.join(process.cwd(), 'prisma/generated/prisma-master/query_engine-windows.dll.node');
// file annotations for bundling tools to include these files
path.join(__dirname, 'schema.prisma');
path.join(process.cwd(), 'prisma/generated/prisma-master/schema.prisma');
