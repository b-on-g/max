flowchart TB
    %% ===== ВЕРХНЯЯ ЧАСТЬ: Бот и Маркетплейс =====
    subgraph Top[ ]
        direction LR
        Bot[Бот]
        MP[Маркетплейс]
    end

    %% ===== ЦЕНТР: Центральный сортировочный комплекс ИИ =====
    Body[Центральный сортировочный<br/>комплекс ИИ]

    %% ===== НИЖНЯЯ ЧАСТЬ: Организация =====
    subgraph Bottom[ ]
        direction LR
        Org[Организация]
        Process[Обработка жалобы<br/>с таймером]
        Intake[Поле приема жалоб]
    end

    %% Связи верхней части
    Bot --> BotChoice{Создать новую жалобу<br/>или посмотреть текущую?}

    BotChoice -->|Посмотреть текущую| MyComplaints[Ваши жалобы]
    BotChoice -->|Создать новую| CreateField[Поле создания жалоб]

    CreateField --> Form[Процесс заполнения анкеты]
    Form --> SplitChoice{Как отправить?}
    SplitChoice -->|Поделиться и отправить| ShareSend[Поделиться жалобой<br/>и отправить]
    SplitChoice -->|Просто отправить| JustSend[Отправить жалобу]

    JustSend --> Body
    ShareSend --> Body
    ShareSend --> MP

    %% Ветка: Бот → Вам могут быть интересны → Маркетплейс
    Bot --> Recommend[Вам могут быть интересны]
    Recommend --> MP

    MyComplaints --> ViewChoice{Посмотреть жалобу?}
    ViewChoice --> Complaint1[Жалоба 1]
    ViewChoice --> Complaint2[Жалоба 2]
    ViewChoice --> Complaint3[Жалоба 3]

    %% Ветка: Маркетплейс → Посмотреть жалобы других → ...
    MP --> ViewOthers[Посмотреть жалобы других]
    ViewOthers --> LikeChoice{Понравилась жалоба?}
    LikeChoice -->|отправить такую жалобу от себя| Body
    LikeChoice -->|Нет| ViewOthers

    %% ===== НИЖНЯЯ ВЕТКА: Организация → Обработка ↔ Поле приема =====
    Org --> Process
    Process -->|запрос на прием| Intake
    Intake -->|подтверждение приема| Process

    %% Связь поля приема с ЦСК
    Intake <-->|обмен информацией<br/>с квалифицированной подписью| Body

    %% Зелёная заливка входов
    style Org fill:#cfc,stroke:#3a3,stroke-width:2px
    style Bot fill:#cfc,stroke:#3a3,stroke-width:2px
    style MP  fill:#cfc,stroke:#3a3,stroke-width:2px
