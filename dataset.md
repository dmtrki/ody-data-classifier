# Описание ключей ответа
Поле dataset содержит:
- common - базовые данные
- personal - персональные данные
- contacts - контактные данные
- relatedPersons - данные о связанных личностях
- jobs - данные о трудовой деятельности и доходах
- vehicles - данные о транспортных средствах
- education - данные об образовании
- addresses - данные об адресах
- movements - данные о передвижениях
- negative - негативная информация

Значения этих полей - объекты. Могут быть пустыми `{}`, либо содержать некоторые из нижеперечисленных ключей, в зависимости от группы:

## common
- **fullname** - ФИО
- **birth** - дата рождения
- **death** - дата смерти
- **militariable** - отношение к воинской службе
- **militaryId** - номер военного билета
- **sex** - пол

## personal
- **itn** - ИНН
- **insurance** - СНИЛС 
- **birthLocation** - место рождения
- **citizenship** - гражданство
- **nationality** - национальность
- **passport** - массив объектов с данными паспортов
  - **passportSerialNum** - серия и номер
  - **passportReleaseDate** - дата выдачи
  - **passportReleaseUnit** - кем выдан
  - **passportReleaseUnitId** - номер органа, выдавшего паспорт

## contacts
- **phoneNum** - номер телефона
- **phoneDevice** - модель устройства
- **homePhone** - номер домашнего телефона
- **email**
- **website** - адрес личного веб-сайта 
- **viber** - ID вайбера
- **whatsapp** - ID ватсапа
- **telegram** - ID телеграма
- **skype** - ID скайпа
- **vkID** - ссыдка на страницу в вк, либо ID страницы
- **vkPrivacyStatus** - статус страницы (открыта\закрыта)
- **instagram** - ID в инстраграме
- **facebook** - ID в фейсбуке
- **twitter** - ID в твиттере
- **possiblePassword** - возможный пароль
- **nickname** - никнейм
- **tags** - возможные упоминания исследуемого лица в контактных данных

## relatedPersons
- **relatedFullname** - ФИО связанного лица
- **relatedPhone** - телефон связанного лица
- **relatedBirth** - дата рождения связанного лица
- **relatedAddress** - адрес связанного лица

## jobs
- **employer** - массив объектов с данными о работодателях
  - **jobEmployerTitle** - название организации
  - **jobEmployerItn** - ИНН организации
  - **jobEmployerAddress** - адрес организации
  - **jobEmployerPhone** - телефон места работы
  - **jobEmployerManagersPhone** - телефон директора\начальника
  - **jobEmployerAccountantsPhone** - телефон бухгалтера
  - **jobTitle** - название должности 
  - **jobRelatedPersons** - коллеги
- **income** - массив объектов с данными о доходах
  - **jobIncomeSum** - сумма дохода 
  - **jobIncomeDate** - дата получения дохода
  - **additionalIncome** - дополнительные источники дохода

## vehicles
- **driversLicense** - массив объектов с данными о ВУ
  - **driversLicenseNum** - номер ВУ
  - **driversLicenseReleaseDate** - дата выдачи ВУ
  - **driversLicenseCategory** - категория ВУ
- **vehicle** - массив объектов с данными о ТС
  - **vehicleNum** - госномер тс
  - **vehicleNumOutdated** - старый госномер
  - **vehicleVin** - VIN тс
  - **vehicleRelatedPersons** - связанные с тс личности
  - **vehicleBrandModel** - марка и модель тс
  - **vehicleBrand** - только марка
  - **vehicleModel** - только модель
  - **vehicleColor** - цвет тс
  - **vehicleReleaseYear** - год выпуска тс
  - **vehiclePassport** - номер птс
  - **vehicleRegistrationDate** - дата постановки на учет тс
  - **vehicleDeregistrationDate** - дата снятия с учета тс
  - **vehicleRegistrationCertificateNum** - номер стс
  - **vehicleInsuranceAgent** - название страховой организации
  - **vehicleInsuranceNum** - номер страхового полиса тс
  - **vehicleInsuranceStatus** - статус страхового полиса
  - **vehicleRestriction** - ограничения, наложенные на тс
  - **vehicleOwnerFullname** - ФИО владельца

## education
- **educationInstitution** - место обучения
- **educationFaculty** - факультет
- **educationSpeciality** - специальность
- **educationForm** - форма обучения
- **educationDiplomaReleaseDate** - дата получения диплома об окончании обучения

## addresses
- **addressResidence** - адрес проживания
- **addressRegistration** - адрес регистрации
- **addressOther** - другие адреса

## movements
- **movement** - массив объектов с данными о перемещениях
  - **movementFrom** - откуда
  - **movementTo** - куда
  - **movementVehicleNum** - номер авто
  - **movementSocialCardNum** - номер социальной карты москвича
  - **movementTroykaCardNum** - номер карты "Тройка"
  - **movementStrelkaCardNum** - номер карты "Стрелка"
  - **movementDirection** - направление передвижения
  - **movementDate** - дата перемещения
  - **movementIsAeroflot** - аэрофлот ли
  - **movementAdditional** - дополнительная информация о передвижении
  - **movementType** - тип передвижения

## negative
- **criminal** - массив объектов с данными об уголовных преступлениях 
  - **criminalArticle** - статья УК
  - **criminalPart** - часть статьи
  - **criminalPoint** - пункт статьи
  - **criminalArticleContent** - содержание статьи
  - **criminalDate** - дата осуждения
  - **criminalYear** - год осуждения
  - **criminalDateInitiation** - дата возбуждения дела
  - **criminalNumber** - номер дела
  - **criminalNote** - дополнительная информация
  - **criminalNickname** - кличка
  - **criminalSigns** - особые приметы
- **administrativeResponsibility** - статья КОАП
- **debt** - массив объектов с данными о взыскании долгов
  - **executiveProcedureInitiatorOsp** - инициатор судебного производства
  - **executiveProcedureBaseIp** - основание
  - **executiveProcedureDebt** - сумма долга
  - **executiveProcedureNumber** - номер исполнительного производства
  - **executiveProcedureOffenseType** - вид правонарушения
  - **executiveProcedureResolution** - орган вынесший постановление
  - **executiveProcedurePunishment** - наказание
  - **executiveProcedureDate** - дата ИП
- **wanted** - массив объектов с данными о розыске
  - **wantedDateStart** - дата начала розыска
  - **wantedFable** - фабула
  - **wantedBasis** - основание
  - **wantedSearchType** - тип розыска
  - **wantedSearchCategory** - категория
  - **wantedPreventiveMeasure** - мера пресечения
  - **wantedSearchInitiator** - инициатор розыска
  - **wantedDateStartCriminal** - дата возбуждения УД
  - **wantedDateEndCriminal** - дата приостановления УД
  - **wantedDateTerminationSearch** - дата прекращения розыска
  - **wantedArmed** - вооружен (да/нет)
  - **wantedPreviouslyJudged** - ранее судим
  - **wantedNote** - дополнительная информация
- **blacklistNote** - дополнительные данные из черных списков
- **specialAccounting** - информация по лицу
- **specialPunishment** - другие приговоры