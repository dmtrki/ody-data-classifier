## Запуск контейнера
- Клонируйте репозиторий, перейдите в директорию с проектом, переименуйте `.env.example` в `.env`:
```
git clone https://gitlab.com/ittinc/sweep-net.git odyssey-adapter
cd odyssey-adapter
mv .env.example .env
```
- Теперь необходимо заполнить пустые переменные в файле .env
- После заполнения .env, запустите:
```
docker-compose up -d
```
- Когда контейнер запустится, приложение будет доступно по адресу, сконфигурированному в `.env` 
  - по дефолту: `http://localhost:3333`

## [Описание ключей ответа](./dataset.md)

## [Схема базы данных](./schema.png)
```mermaid
erDiagram

EnquiryStatus {
    ACCEPTED ACCEPTED
    WAITING WAITING
    PROCESSING PROCESSING
    COMPLETE COMPLETE
    ERROR ERROR
}

EnquiryAttemptProducedType {
    CREATE CREATE
    REFRESH REFRESH
    GIVE GIVE
    VOID VOID
}


enquiries {
    String identities PK 
    EnquiryStatus status  
    Json meta  "nullable"
    String hash  "nullable"
    DateTime createdAt  
    DateTime updatedAt  
}

enquiry_attempts {
    String identities PK 
    EnquiryAttemptProducedType produced  
    Json meta  "nullable"
    DateTime createdAt  
}

identities {
    String identities PK 
    String itn  "nullable"
    DateTime createdAt  
    DateTime updatedAt  
    Json personal  "nullable"
}

rows {
    String id PK 
    String value  
    String hash  
    DateTime createdAt  
    Json meta  "nullable"
}

row_unuions {
    String id PK 
    String hash  "nullable"
    DateTime createdAt  
    DateTime updatedAt  
}

row_union_types {
    Int id PK 
    String key  
}

row_types {
    Int id PK 
    String key  
}

data_groups {
    Int id PK 
    String key  
    Json meta  "nullable"
}


enquiries o|--|| EnquiryStatus : "enum:status"
enquiries o{--}o Identity : ""
enquiry_attempts o|--|| EnquiryAttemptProducedType : "enum:produced"
enquiry_attempts o{--|| enquiries : "enquiry_attempts"
identities o{--}o Enquiry : ""
rows o{--|| enquiries : "enquiry"
rows o{--|| identities : "identity"
rows o{--|| row_types : "row_union_types"
rows o{--|| row_unuions : "row_union_types"
row_unuions o{--|| row_union_types : "row_union_types"
row_union_types o{--|| data_groups : "data_groups"
row_types o{--|| data_groups : "data_groups"
row_types o{--|| row_union_types : "union"
```