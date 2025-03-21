export interface IDataKeyValue {
  // This appears to be a nullable element without defined properties
}

export interface IItemStringKeyValue {
  Key: string;
  Value: string;
  Label: string;
  Text: string;
  Operand: string;
  DefaultType: string;
  WasChanged: string;
  data: {
    DataKeyValue: IDataKeyValue[];
  };
}

export interface IPrivacySettings {
  Initials: boolean;
  NamePrefix: boolean;
  NameSuffix: boolean;
  JobTitle: boolean;
  Gender: boolean;
  BirthDate: boolean;
  Status: boolean;
  EmploymentDate: boolean;
  EmployeeJobDescription: boolean;
  Address: boolean;
  MobilePhone: boolean;
  PersonalEmail: boolean;
  OnlineChatID: boolean;
  EmployeeCode: boolean;
  WorkTelephoneExtension: boolean;
}

export interface IUserLoginResponse {
  LoginUserWSI: {
    TimeZone: string;
    BusinessEntity: string;
    FirstName: string;
    LastName: string;
    IsSuperAdmin: boolean;
    LanguageID: number;
    DateFormat: string;
    TimeFormat: string;
    LoginUsing: string;
    UseSSOOnly: boolean;
    PendingNotifications: {
      ItemStringKeyValue: IItemStringKeyValue[];
    };
    PrivacySettings: IPrivacySettings;
    NeedChangePassword: boolean;
  };
}

export interface IExelsysEmployeeDetailedResponse {
  TerminationReasonCode?: string;
  ParentDepartmentCode?: string;
  PayrollCompanyNo?: string;
  TAEmployeeNumber?: string;
  NationalInsuranceNo?: string;
  ParentDepartmentName?: string;
  WorkPermitExpiryDate?: { _xsi_nil?: string } | null;
  WorkPermitReference?: string;
  DaysTaken?: string;
  DepartmentList?: string;
  LoginWindows?: string;
  EmployeeGradeCode?: string;
  EmployeeJobDescriptionCode?: string;
  ID: number;
  Department?: string;
  DepartmentCode?: string;
  DepartmentLocation?: string;
  FirstName: string;
  LastName: string;
  EmployeeCode?: string;
  WeeklyWorkingHours?: { _xsi_nil?: string } | null;
  DailyWorkingHours?: { _xsi_nil?: string } | null;
  Initials?: string;
  NamePrefix?: string;
  NameSuffix?: string;
  JobTitle?: string;
  Gender?: string;
  BirthDate?: string;
  Status?: string;
  EmploymentDate?: string;
  DateOfClassification?: string;
  MainAddress?: {
    ID?: string;
    ServerTimeSetted?: string;
    ClientTimeSetted?: string;
    UIID?: string;
    AddressID?: string;
    BusinessEntityId?: string;
    AddressType?: string;
    AddressOwnerId?: string;
    AddressLanguageID?: string;
    AddressLine1?: string;
    AddressLine2?: string;
    AddressLine3?: string;
    FirstName?: string;
    LastName?: string;
    MiddleName?: string;
    CompanyName?: string;
    PostCode?: string;
    POBox?: string;
    POBoxPostCode?: string;
    City?: string;
    DistrictProvince?: string;
    CountryISOCode?: string;
    PhoneNo?: string;
    PhoneNo2?: string;
    FaxNo?: string;
    MobilePhone?: string;
    CarPhone?: string;
    eMail?: string;
    HomePage?: string;
    OnlineChatID?: string;
    DateCreated?: string;
    CreatedBy?: string;
    DateUpdated?: string;
    UpdatedBy?: string;
    Country?: string;
    CreatedDate?: string;
    UpdatedDate?: string;
  };
  CompanyName?: string;
  PostCode?: string;
  POBox?: string;
  POBoxPostCode?: string;
  City?: string;
  DistrictProvince?: string;
  CountryISOCode?: string;
  Country?: string;
  PhoneNo?: string;
  PhoneNo2?: string;
  FaxNo?: string;
  MobilePhone?: string;
  CarPhone?: string;
  eMail?: string;
  HomePage?: string;
  MaritalStatus?: string;
  Religion?: string;
  SocialSecurityNo?: string;
  UnionMembershipNo?: string;
  IdentityCardNo?: string;
  IdentityCardDateofIssue?: { _xsi_nil?: string } | null;
  IdentityCardPlaceofIssue?: string;
  IdentityCardIssuedBy?: string;
  IdentityCardExpiryDate?: { _xsi_nil?: string } | null;
  PassportNo?: string;
  PassportDateofIssue?: { _xsi_nil?: string } | null;
  PassportPlaceofIssue?: string;
  PassportExpiryDate?: { _xsi_nil?: string } | null;
  IncomeTaxNo?: string;
  EmployeeJobDescription?: string;
  WorkTelephoneExtension?: string;
  WorkIM?: string;
  WorkEMail?: string;
  EmployeeManager?: string;
  EmployeeManagerCode?: string;
  EmployeeName?: string;
  EmployeeContractType?: string;
  EmployeeContractTypeCode?: string;
  PaymentFrequency?: string;
  CurrencyID?: string;
  NationalityCountryISOCode?: string;
  NationalityCountryISOName?: string;
  FathersName?: string;
  MothersName?: string;
  EmployeeUnionCode?: string;
  PayrollNo?: string;
  BankName?: string;
  BankBranch?: string;
  BankAccountNo?: string;
  IBAN?: string;
  SWIFT?: string;
  EmployeeAccountCode?: string;
  TerminationDate?: { _xsi_nil?: string } | null;
  TerminationComments?: string;
  TerminationAmount?: string;
  InactiveDate?: { _xsi_nil?: string } | null;
  EmployeeGrade?: string;
  PreviousEmploymentMonths?: { _xsi_nil?: string } | null;
  OtherPreviousEmploymentMonths?: { _xsi_nil?: string } | null;
  FTEquivalent?: string;
  PositionCode?: string;
  PositionDate?: string;
  ApplicantReference?: string;
  CurrentSalaryAmount?: string;
  SalaryType?: string;
  SalaryLastUpdated?: { _xsi_nil?: string } | null;
  Notes?: string;
  AllowToAccessSubordinates?: string;
  ContractExpiryDate?: string;
  CFBalance?: string;
  Entitled?: string;
  Used?: string;
  Requested?: string;
  Approved?: string;
  TotalAvailable?: string;
  Balance?: string;
  CreatedDate?: string;
  UpdatedDate?: string;
  DateCreated?: string;
  CreatedBy?: string;
  DateUpdated?: string;
  UpdatedBy?: string;
  Age?: string;
  YearsOfService?: string;
  Location?: string;
  LocationCode?: string;
  LocationID?: string;
  PictureID?: string;
  Bradford?: string;
  Appraisal?: string;
  WorkPermitType?: string;
  ValidRightToWork?: string;
  WorkMobileNo?: string;
  KnownAs?: string;
  AddressedAs?: string;
  Ethnicity?: string;
  SexualOrientation?: string;
  PassportCountryCode?: string;
  DrivingLicenseNo?: string;
  Disability?: string;
  BankAccountName?: string;
  TaxCode?: string;
  TaxCodeCode?: string;
  TaxCodeDescription?: string;
  EmployeeAbsences?: string;
  AbsenceRequests?: string;
  UserFields?: {
    EmployeeUserField?: Array<{
      Description?: string;
      Value?: string;
      GUID?: string;
      Name?: string;
      DateCreated?: string;
      CreatedDate?: string;
      UpdatedDate?: string;
      DateUpdated?: string;
    }>;
  };
  Dimensions?: string;
  EmployeeQualifications?: string;
  EmployeeRelatives?: string;
  EmployeeNextOfKin?: {
    AddressLine1?: string;
    AddressLine2?: string;
    AddressLine3?: string;
    ContactPostCode?: string;
    ContactCountry?: string;
    ContactEmail?: string;
    ContactMobile?: string;
    ContactTel?: string;
    ContactName?: string;
    UseContact?: string;
    RelativeTypeID?: string;
    DescriptionID?: string;
    IdentityCardDateofIssue?: { _xsi_nil?: string } | null;
    LanguageID?: string;
    PassportExpiryDate?: { _xsi_nil?: string } | null;
    PassportDateofIssue?: { _xsi_nil?: string } | null;
    LastName?: string;
    InsertDate?: string;
    BirthDate?: { _xsi_nil?: string } | null;
    EmployeeRelativeID?: string;
    WorkPermitTypeID?: { _xsi_nil?: string } | null;
    WorkPermitExpiryDate?: { _xsi_nil?: string } | null;
    Dependent?: string;
    MedicalSchemeStart?: { _xsi_nil?: string } | null;
    MedicalSchemeEnd?: { _xsi_nil?: string } | null;
    DateCreated?: string;
    CreatedDate?: string;
    UpdatedDate?: string;
    DateUpdated?: string;
  };
  EmployeeEducations?: string;
  EmployeeReferences?: string;
  EmployeeBenefits?: string;
  EmployeeAssignedArticles?: string;
  EmployeePastExperience?: string;
  EmployeeAffiliations?: string;
  EmployeeTrainings?: string;
  PositionAssignments?: string;
  EmployeeDocuments?: string;
  EmployeePictures?: string;
  Email?: string; // Added based on your service implementation
}