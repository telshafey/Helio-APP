import type { Category, Service, Review, News, Notification, Property, EmergencyContact, ServiceGuide, AppUser, Supervisor, Driver, WeeklyScheduleItem, ExternalRoute, PublicPagesContent, Post, Advertisement, AboutCityPageContent, AdminUser, AuditLog, MarketplaceItem, JobPosting, Circle, ExclusiveOffer, LostAndFoundItem } from '../types';

export const mockReviews: Review[] = [
    { id: 1, userId: 1, username: 'أحمد محمود', avatar: 'https://picsum.photos/101', rating: 5, comment: 'خدمة ممتازة وتجربة رائعة! أنصح به بشدة.', date: '2024-07-10', adminReply: 'شكراً لتقييمك! نسعد بخدمتك دائماً.', helpfulCount: 12 },
    { id: 2, userId: 2, username: 'فاطمة الزهراء', avatar: 'https://picsum.photos/102', rating: 4, comment: 'المكان جميل والخدمة جيدة، لكن الأسعار مرتفعة قليلاً.', date: '2024-07-08', helpfulCount: 5 },
    { id: 3, userId: 3, username: 'خالد العتيبي', avatar: 'https://picsum.photos/103', rating: 3, comment: 'التأخير في تقديم الخدمة كان ملحوظاً.', date: '2024-07-05', adminReply: 'نعتذر عن التأخير، نعمل على تحسين سرعة الخدمة.', helpfulCount: 2 },
    { id: 4, userId: 4, username: 'سارة عبدالله', avatar: 'https://picsum.photos/106', rating: 5, comment: 'كل شيء كان مثالياً، شكراً لكم.', date: '2024-07-02', helpfulCount: 25 },
];

export const mockServices: Service[] = [
    // مطاعم (subCategoryId: 301)
    {
        id: 1, subCategoryId: 301, name: "مطعم ومقهى هيليو", images: ["https://picsum.photos/800/600?random=1", "https://picsum.photos/800/600?random=2", "https://picsum.photos/800/600?random=3", "https://picsum.photos/800/600?random=4"],
        address: "المنطقة الأولى، هليوبوليس الجديدة", phone: ["011-123-4567", "02-2345-6789"], whatsapp: ["966501234567"],
        about: "نقدم أشهى المأكولات الشرقية والغربية في أجواء عصرية ومريحة. لدينا جلسات داخلية وخارجية لتناسب جميع الأذواق.",
        rating: 4.5, reviews: mockReviews, facebookUrl: "#", instagramUrl: "#", isFavorite: true, views: 4821, creationDate: '2024-07-20',
        locationUrl: "https://maps.app.goo.gl/mE23vXqx4vSPxV987",
        workingHours: "السبت - الخميس: 9ص - 1ص\nالجمعة: 1م - 1ص"
    },
    {
        id: 2, subCategoryId: 301, name: "مطعم أسماك المحيط", images: ["https://picsum.photos/800/600?random=10"],
        address: "مول سيتي بلازا", phone: ["012-987-6543"], whatsapp: [],
        about: "أفضل المأكولات البحرية الطازجة والمعدة على أيدي أمهر الطهاة.",
        rating: 4.8, reviews: [], facebookUrl: "#", instagramUrl: "#", isFavorite: false, views: 3560, creationDate: '2024-07-15'
    },
    // كافيهات (subCategoryId: 302)
    {
        id: 3, subCategoryId: 302, name: "كافيه روز جاردن", images: ["https://picsum.photos/800/600?random=110"],
        address: "مول سيتي بلازا، الطابق الأرضي", phone: ["012-345-6789"], whatsapp: ["966509876543"],
        about: "مكان مثالي للاسترخاء مع الأصدقاء والاستمتاع بأفضل أنواع القهوة والمشروبات المنعشة والحلويات اللذيذة.",
        rating: 4.7, reviews: [], facebookUrl: "#", instagramUrl: "#", isFavorite: false, views: 5123, creationDate: '2024-06-30',
        workingHours: "يومياً: 10ص - 12ص"
    },
    // مستشفيات (subCategoryId: 201)
     {
        id: 4, subCategoryId: 201, name: "مستشفى هليوبوليس المركزي", images: ["https://picsum.photos/800/600?random=5", "https://picsum.photos/800/600?random=6"],
        address: "الحي الطبي، هليوبوليس الجديدة", phone: ["02-555-0100", "16001"], whatsapp: ["966555010010"],
        about: "مستشفى متكامل يقدم خدمات طبية على مدار 24 ساعة في جميع التخصصات.",
        rating: 4.2, reviews: [], facebookUrl: "#", instagramUrl: "#", isFavorite: true, views: 6890, creationDate: '2024-06-10',
        workingHours: "24/7"
    },
    // لياقة بدنية (subCategoryId: 701)
    {
        id: 5, subCategoryId: 701, name: "جيم فيتنس برو", images: ["https://picsum.photos/800/600?random=20"],
        address: "المنطقة الرياضية", phone: ["010-123-4567"], whatsapp: [],
        about: "أحدث الأجهزة الرياضية ومدربين محترفين لمساعدتك في الوصول لهدفك.",
        rating: 4.9, reviews: [], facebookUrl: "#", instagramUrl: "#", isFavorite: false, views: 2500, creationDate: '2024-07-22'
    },
    // جمال وعناية (subCategoryId: 801)
    {
        id: 6, subCategoryId: 801, name: "صالون بيوتي كوين", images: ["https://picsum.photos/800/600?random=25"],
        address: "مول سيتي بلازا، الطابق الأول", phone: ["011-987-6543"], whatsapp: [],
        about: "جميع خدمات التجميل والعناية بالشعر والبشرة للسيدات.",
        rating: 4.6, reviews: [], facebookUrl: "#", instagramUrl: "#", isFavorite: true, views: 1800, creationDate: '2024-07-18'
    },
];

export const mockCategories: Category[] = [
    {
        id: 1, name: "المدينة والجهاز", icon: 'BuildingLibraryIcon',
        subCategories: [
            { id: 105, name: "تعريف بشركة مصر الجديده (المالك)" },
            { id: 101, name: "التعريف بالمدينة" },
        ]
    },
    {
        id: 2, name: "الصحة", icon: 'HeartIcon',
        subCategories: [
            { id: 201, name: "مستشفيات" },
            { id: 202, name: "مراكز طبية" },
            { id: 203, name: "أطباء" },
            { id: 204, name: "صيدليات" },
        ]
    },
    {
        id: 3, name: "الطعام والشراب", icon: 'CakeIcon',
        subCategories: [
            { id: 301, name: "مطاعم" },
            { id: 302, name: "كافيهات" },
            { id: 303, name: "سوبر ماركت" },
        ]
    },
    {
        id: 4, name: "التعليم", icon: 'AcademicCapIcon',
        subCategories: [
            { id: 401, name: "مدارس" },
            { id: 402, name: "حضانات" },
        ]
    },
    {
        id: 5, name: "التسوق", icon: 'ShoppingBagIcon',
        subCategories: [
            { id: 501, name: "سوبر ماركت وعطارة" },
            { id: 502, name: "مخابز" },
            { id: 503, name: "أسواق خضار وفاكهة" },
            { id: 504, name: "طيور وجزارة وأسماك" },
            { id: 505, name: "محلات ملابس واكسسوات" },
            { id: 506, name: "محلات أدوات منزلية" }
        ]
    },
    {
        id: 6, name: "تكنولوجيا واتصالات", icon: 'DevicePhoneMobileIcon',
        subCategories: [
            { id: 601, name: "أنظمة مراقبة والانتركم" },
            { id: 602, name: "الكترونيات" },
            { id: 603, name: "انترنت ودش" },
            { id: 604, name: "خدمات المحمول" }
        ]
    },
    {
        id: 7, name: "اللياقة البدنية", icon: 'BoltIcon',
        subCategories: [
            { id: 701, name: "صالات الجيم" },
            { id: 702, name: "مدربين شخصيين" },
            { id: 703, name: "اكاديمات رياضية" },
            { id: 704, name: "نوادي رياضية" }
        ]
    },
    {
        id: 8, name: "الجمال والعناية الشخصية", icon: 'SparklesIcon',
        subCategories: [
            { id: 801, name: "صالون تجميل" },
            { id: 802, name: "مستحضرات تجميل" },
            { id: 803, name: "منتجات العناية بالبشرة" },
            { id: 804, name: "مراكز سبا" }
        ]
    },
    {
        id: 9, name: "الصيانه والخدمات المنزلية", icon: 'WrenchScrewdriverIcon',
        subCategories: [
            { id: 901, name: "سباكة وكهرباء" },
            { id: 902, name: "نظافة منزلية" },
            { id: 903, name: "صيانه الأجهزة الكهربائية" },
            { id: 904, name: "صيانة البوتاجاز والسخان" },
            { id: 905, name: "صيانه وتركيب التكييفات" },
            { id: 906, name: "مغسلة ومكوجي" }
        ]
    },
    {
        id: 10, name: "السيارات", icon: 'CarIcon',
        subCategories: [
            { id: 1001, name: "ورش السيارات" },
            { id: 1002, name: "قطع غيار" },
            { id: 1003, name: "محطات وقود" },
            { id: 1004, name: "غسيل سيارات" }
        ]
    },
    {
        id: 11, name: "خدمات متنوعة", icon: 'Squares2X2Icon',
        subCategories: [
            { id: 1101, name: "تصوير ومونتاج" },
            { id: 1102, name: "خدمات توصيل" },
            { id: 1103, name: "خدمات لاند سكيب" },
            { id: 1104, name: "خدمات مصرفية" },
            { id: 1105, name: "العناية بالحيوانات الاليفة" }
        ]
    },
    {
        id: 12, name: "أنشطة وفعاليات", icon: 'GiftIcon',
        subCategories: [
            { id: 1201, name: "أنشطة الأطفال" },
            { id: 1202, name: "مراكز ترفية" },
            { id: 1203, name: "دورات ومهارات" }
        ]
    },
    {
        id: 13, name: "التشطيبات", icon: 'PaintBrushIcon',
        subCategories: [
            { id: 1301, name: "شركات او مقاول تشطيب" },
            { id: 1302, name: "تشطيب كهرباء" },
            { id: 1303, name: "تشطيب سباكة" },
            { id: 1304, name: "تشطيب محارة واعمال جبس" },
            { id: 1305, name: "تشطيب دهانات" },
            { id: 1306, name: "تشطيب سيراميك ورخام" },
            { id: 1307, name: "باب وشباك" },
            { id: 1308, name: "الموان" },
            { id: 1309, name: "تشطيبات خارجية" }
        ]
    }
];

export const mockNews: News[] = [
    {
        id: 1,
        title: "افتتاح المرحلة الأولى من النادي الاجتماعي بهليوبوليس الجديدة",
        content: "تم بحمد الله افتتاح المرحلة الأولى من النادي الاجتماعي، والتي تضم ملاعب وحمام سباحة، في حضور عدد من المسؤولين وسكان المدينة.",
        imageUrl: "https://picsum.photos/600/400?random=11",
        date: "2024-07-15",
        author: "إدارة المدينة",
        externalUrl: "#",
        views: 1205
    },
    {
        id: 2,
        title: "بدء تشغيل خطوط النقل الداخلي الجديدة",
        content: "لتسهيل حركة السكان داخل المدينة، تم تشغيل ثلاثة خطوط نقل داخلي جديدة تغطي كافة الأحياء والمناطق الحيوية.",
        imageUrl: "https://picsum.photos/600/400?random=12",
        date: "2024-07-10",
        author: "جهاز النقل",
        externalUrl: "#",
        views: 980
    },
    {
        id: 3,
        title: "حملة تشجير وتجميل مداخل المدينة",
        content: "شارك العشرات من السكان في حملة تجميل وتشجير المداخل الرئيسية للمدينة، مما يضفي مظهراً جمالياً وحضارياً.",
        imageUrl: "https://picsum.photos/600/400?random=13",
        date: "2024-07-05",
        author: "لجنة البيئة",
        views: 750
    },
    {
        id: 4,
        title: "جدول انقطاع المياه المخطط له لأعمال الصيانة",
        content: "نحيط علم سيادتكم بأنه سيتم قطع المياه عن المنطقة الثالثة يوم الثلاثاء القادم من الساعة 10 صباحاً حتى 4 عصراً لأعمال الصيانة الدورية.",
        imageUrl: "https://picsum.photos/600/400?random=14",
        date: "2024-07-02",
        author: "شركة المياه",
        views: 2100
    },
];

export const mockAdvertisements: Advertisement[] = [
  {
    id: 1,
    title: 'عرض الصيف في مطعم ومقهى هيليو!',
    imageUrl: 'https://picsum.photos/800/400?random=101',
    serviceId: 1,
    startDate: '2024-07-01',
    endDate: '2025-10-31',
  },
  {
    id: 2,
    title: 'افتتاح كافيه روز جاردن!',
    imageUrl: 'https://picsum.photos/800/400?random=103',
    serviceId: 3,
    startDate: '2024-07-15',
    endDate: '2025-10-31',
  },
  {
    id: 3,
    title: 'تخفيضات كبرى على العقارات',
    imageUrl: 'https://picsum.photos/800/400?random=102',
    externalUrl: '#',
    startDate: '2024-08-01',
    endDate: '2025-10-31',
  },
];


export const mockNotifications: Notification[] = [
  {
    id: 1,
    title: 'صيانة طارئة لشبكة المياه',
    content: 'سيتم قطع المياه عن الحي الأول غداً من الساعة 10 صباحاً حتى 2 ظهراً لأعمال صيانة طارئة. نعتذر عن الإزعاج.',
    startDate: '2024-07-25',
    endDate: '2024-07-25',
    externalUrl: '#'
  },
  {
    id: 2,
    title: 'حملة تطعيم جديدة للأطفال',
    content: 'تعلن مستشفى هليوبوليس المركزي عن بدء حملة تطعيم شلل الأطفال من 1 أغسطس إلى 15 أغسطس.',
    serviceId: 4,
    startDate: '2024-08-01',
    endDate: '2024-08-15',
  },
  {
    id: 3,
    title: 'إشعار قادم',
    content: 'هذا الإشعار لم يبدأ بعد.',
    startDate: '2025-01-01',
    endDate: '2025-01-05',
  },
  {
    id: 4,
    title: 'إشعار منتهي الصلاحية',
    content: 'هذا العرض انتهى الأسبوع الماضي.',
    startDate: '2024-07-01',
    endDate: '2024-07-07',
  },
];

export const mockProperties: Property[] = [
    {
        id: 1,
        title: "شقة فاخرة للبيع في كمبوند لايف بارك",
        description: "شقة بمساحة 180 متر مربع، تشطيب سوبر لوكس، 3 غرف نوم، 2 حمام، ريسبشن كبير، فيو مفتوح على حديقة.",
        images: ["https://picsum.photos/800/600?random=21", "https://picsum.photos/800/600?random=22"],
        location: { address: "كمبوند لايف بارك، هليوبوليس الجديدة" },
        type: 'sale',
        price: 2500000,
        contact: { name: "المالك", phone: "01001234567" },
        amenities: ["أمن 24 ساعة", "جراج خاص", "حديقة", "مصعد"],
        views: 1543,
        creationDate: '2024-07-18'
    },
    {
        id: 2,
        title: "فيلا للإيجار في حي الزهور",
        description: "فيلا مستقلة بمساحة 400 متر، حديقة خاصة 200 متر، حمام سباحة، 5 غرف نوم، مفروشة بالكامل.",
        images: ["https://picsum.photos/800/600?random=23", "https://picsum.photos/800/600?random=24"],
        location: { address: "الحي الثاني، فيلات، هليوبوليس الجديدة" },
        type: 'rent',
        price: 30000,
        contact: { name: "مكتب تسويق", phone: "01229876543" },
        amenities: ["حمام سباحة", "حديقة خاصة", "مفروشة بالكامل", "مطبخ مجهز"],
        views: 876,
        creationDate: '2024-07-05'
    },
    {
        id: 3,
        title: "دوبلكس للبيع بإطلالة مميزة",
        description: "دوبلكس 250 متر + روف 100 متر، موقع مميز على شارع رئيسي، نصف تشطيب، إمكانية التسهيلات في السداد.",
        images: ["https://picsum.photos/800/600?random=25", "https://picsum.photos/800/600?random=26"],
        location: { address: "الحي الثالث، هليوبوليس الجديدة" },
        type: 'sale',
        price: 3200000,
        contact: { name: "شركة التطوير العقاري", phone: "01117654321" },
        amenities: ["روف خاص", "فيو مفتوح", "قسط على سنتين"],
        views: 2041,
        creationDate: '2024-06-25'
    },
];

export const mockEmergencyContacts: EmergencyContact[] = [
    { id: 1, title: "رقم رئيس الجهاز", number: "0121234567", type: 'city' },
    { id: 2, title: "رقم مدير الامن", number: "0121234568", type: 'city' },
    { id: 3, title: "رقم خدمة العملاء", number: "0121234569", type: 'city' },
    { id: 4, title: "طوارئ كهرباء المدينة", number: "12348", type: 'city' },
    { id: 5, title: "طوارئ مياه المدينة", number: "12349", type: 'city' },
    { id: 6, title: "طوارئ غاز المدينة", number: "12350", type: 'city' },
    { id: 7, title: "طوارئ تليفونات المدينة", number: "12351", type: 'city' },
    { id: 8, title: "طلب الإسعاف", number: "123", type: 'national' },
    { id: 9, title: "أعطال الكهرباء", number: "121", type: 'national' },
    { id: 10, title: "الاستغاثة بالأمن العام", number: "115", type: 'national' },
    { id: 11, title: "الشكاوي الحكومية", number: "16528", type: 'national' },
    { id: 12, title: "الحالات الصحية الحرجة", number: "137", type: 'national' },
    { id: 13, title: "تسريب الغاز", number: "149-129", type: 'national' },
    { id: 14, title: "الإبلاغ عن جرائم المعلومات", number: "15008", type: 'national' },
    { id: 15, title: "شكاوي الاتصالات", number: "155", type: 'national' },
    { id: 16, title: "الاستغاثة بالطب الوقائي", number: "105", type: 'national' },
    { id: 17, title: "الصرف الصحي", number: "175", type: 'national' },
    { id: 18, title: "خدمات الطرق السريعة", number: "01221110000", type: 'national' },
    { id: 19, title: "إنقاذ المشردين", number: "16439", type: 'national' },
    { id: 20, title: "الخط الساخن لمكافحة الإدمان", number: "16023", type: 'national' },
    { id: 21, title: "الاستغاثة بالمطافئ", number: "180", type: 'national' },
    { id: 22, title: "الاستغاثة بشرطة النقل", number: "145", type: 'national' },
    { id: 23, title: "شرطة السياحة", number: "126", type: 'national' },
    { id: 24, title: "أعطال المياه", number: "125", type: 'national' },
    { id: 25, title: "طلب النجدة", number: "122", type: 'national' },
    { id: 26, title: "التواصل مع حماية المستهلك", number: "19588", type: 'national' },
    { id: 27, title: "الإبلاغ عن التحرش بالأطفال", number: "16000", type: 'national' },
];

export const mockServiceGuides: ServiceGuide[] = [
    {
        id: 1,
        title: "التقديم على عداد مياه",
        steps: [
            "تقديم طلب بالمركز التجاري لجهاز المدينة.",
            "سداد رسوم المعاينة والتوريد.",
            "إجراء المعاينة الفنية بواسطة الفني المختص.",
            "استلام العداد وتركيبه بعد استيفاء الشروط.",
        ],
        documents: [
            "صورة بطاقة الرقم القومي سارية.",
            "صورة عقد الملكية أو التخصيص.",
            "آخر إيصال سداد رسوم الصيانة.",
            "توكيل رسمي في حالة عدم حضور المالك.",
        ],
    },
    {
        id: 2,
        title: "التقديم على عداد كهرباء",
        steps: [
            "شراء كراسة الشروط من شركة الكهرباء.",
            "تقديم المستندات المطلوبة ودفع الرسوم.",
            "تحديد موعد للمعاينة الفنية.",
            "تركيب العداد بعد الموافقة.",
        ],
        documents: [
            "صورة بطاقة الرقم القومي.",
            "موافقة من جهاز المدينة.",
            "صورة رخصة البناء.",
        ],
    },
    {
        id: 3,
        title: "استخراج تصريح تشطيب",
        steps: [
            "تقديم طلب لإدارة التنمية بالجهاز.",
            "تحديد نوع التشطيبات (داخلية/خارجية).",
            "سداد تأمين أعمال قابل للاسترداد.",
            "الحصول على التصريح والبدء في الأعمال.",
        ],
        documents: [
            "صورة بطاقة المالك.",
            "صورة محضر استلام الوحدة.",
            "مخطط تفصيلي بالأعمال المطلوبة.",
        ],
    },
     {
        id: 4,
        title: "تصريح خروج أثاث",
        steps: [
            "التوجه لمكتب أمن الجهاز.",
            "إثبات ملكية الوحدة.",
            "تسجيل بيانات السيارة التي ستقوم بالنقل.",
            "الحصول على التصريح وتسليمه لأمن البوابة عند الخروج.",
        ],
        documents: [
            "أصل بطاقة الرقم القومي للمالك.",
            "صورة من عقد الملكية.",
            "آخر إيصال سداد صيانة.",
        ],
    },
];

export const mockUsers: AppUser[] = [
  { id: 1, name: 'أحمد محمود', email: 'ahmed.masri@example.com', password: 'password', avatar: 'https://picsum.photos/101', status: 'active', joinDate: '2023-05-12' },
  { id: 2, name: 'فاطمة الزهراء', email: 'fatima.z@example.com', password: 'password', avatar: 'https://picsum.photos/102', status: 'active', joinDate: '2023-06-20' },
  { id: 3, name: 'خالد العتيبي', email: 'khaled.a@example.com', password: 'password', avatar: 'https://picsum.photos/103', status: 'pending', joinDate: '2024-01-10' },
  { id: 4, name: 'سارة عبدالله', email: 'sara.ibrahim@example.com', password: 'password', avatar: 'https://picsum.photos/106', status: 'banned', joinDate: '2023-03-15' },
  { id: 5, name: 'محمد حسين', email: 'mohamed.h@example.com', password: 'password', avatar: 'https://picsum.photos/200/200?random=5', status: 'active', joinDate: '2023-09-01' },
  { id: 6, name: 'نور الهدى', email: 'nour.h@example.com', password: 'password', avatar: 'https://picsum.photos/200/200?random=6', status: 'pending', joinDate: '2024-02-05' },
  { id: 7, name: 'مستخدم تجريبي', email: 'test@test.com', password: 'password', avatar: 'https://picsum.photos/200/200?random=7', status: 'active', joinDate: '2024-01-01' },
];

export const mockAdmins: AdminUser[] = [
    { id: 1, name: 'المدير العام', email: 'admin@helio.com', password: 'password', avatar: 'https://picsum.photos/200/200?random=99', role: 'مدير عام' },
    { id: 2, name: 'مسؤول الخدمات', email: 'services@helio.com', password: 'password', avatar: 'https://picsum.photos/200/200?random=98', role: 'مسؤول ادارة الخدمات' },
    { id: 3, name: 'مسؤول العقارات', email: 'properties@helio.com', password: 'password', avatar: 'https://picsum.photos/200/200?random=97', role: 'مسؤول العقارات' },
    { id: 4, name: 'مسؤول الأخبار', email: 'news@helio.com', password: 'password', avatar: 'https://picsum.photos/200/200?random=96', role: 'مسؤول الاخبار والاعلانات والاشعارات' },
    { id: 5, name: 'مسؤول الباصات', email: 'transport@helio.com', password: 'password', avatar: 'https://picsum.photos/200/200?random=95', role: 'مسؤول الباصات' },
];

export const mockAuditLogs: AuditLog[] = [
    { id: 1, user: 'المدير العام', action: 'إنشاء خدمة', details: 'أضاف خدمة جديدة: مطعم ومقهى هيليو', timestamp: '2024-07-28T10:00:00Z' },
    { id: 2, user: 'مسؤول العقارات', action: 'حذف عقار', details: 'حذف عقار: شقة فاخرة للبيع في كمبوند لايف بارك', timestamp: '2024-07-28T09:30:00Z' },
    { id: 3, user: 'مسؤول الاخبار والاعلانات والاشعارات', action: 'تحديث خبر', details: 'تحديث خبر: افتتاح المرحلة الأولى من النادي', timestamp: '2024-07-27T15:20:00Z' },
    { id: 4, user: 'المدير العام', action: 'تعديل مستخدم', details: 'قام بتغيير حالة المستخدم خالد العتيبي إلى "مفعل"', timestamp: '2024-07-27T11:05:00Z' },
];

export const mockCircles: Circle[] = [
  { id: 1, name: 'الدائرة العامة', description: 'نقاشات عامة تهم جميع سكان المدينة' },
  { id: 2, name: 'دائرة الحي الخامس', description: 'خاصة بسكان وأمور الحي الخامس' },
  { id: 3, name: 'دائرة كمبوند الزهور', description: 'للتواصل بين سكان كمبوند الزهور' },
  { id: 4, name: 'دائرة لايف بارك', description: 'خاصة بسكان كمبوند لايف بارك' },
  { id: 5, name: 'دائرة الخدمات', description: 'لمناقشة جودة الخدمات وتقييمها' },
];

export const mockPosts: Post[] = [
  {
    id: 1,
    circleId: 1,
    userId: 1,
    username: 'أحمد محمود',
    avatar: 'https://picsum.photos/101',
    title: 'تجمع ملاك الحي الأول',
    content: 'السلام عليكم، أقترح أن نقوم بإنشاء مجموعة واتساب خاصة بملاك الحي الأول لمناقشة الأمور الهامة ومتابعة المستجدات. ما رأيكم؟',
    category: 'نقاش',
    date: '2024-07-28',
    likes: [2, 3, 4],
    comments: [
      { id: 101, userId: 2, username: 'فاطمة الزهراء', avatar: 'https://picsum.photos/102', content: 'فكرة ممتازة! أنا معكم.', date: '2024-07-28' },
      { id: 102, userId: 3, username: 'خالد العتيبي', avatar: 'https://picsum.photos/103', content: 'ياليت والله، راح تسهل علينا كثير.', date: '2024-07-29' },
    ],
    isPinned: true,
  },
  {
    id: 2,
    circleId: 5,
    userId: 4,
    username: 'سارة عبدالله',
    avatar: 'https://picsum.photos/106',
    title: 'سؤال عن أفضل حضانة في المدينة',
    content: 'أبحث عن أفضل حضانة للأطفال في هليوبوليس الجديدة، يا ليت أصحاب التجارب يفيدونا بآرائهم وتقييماتهم.',
    category: 'سؤال',
    date: '2024-07-27',
    likes: [1, 5],
    comments: [],
  },
  {
    id: 3,
    circleId: 1,
    userId: 5,
    username: 'محمد حسين',
    avatar: 'https://picsum.photos/200/200?random=5',
    title: 'أنشطة للأطفال',
    content: 'ما هي أفضل الأنشطة للأطفال في سن 8-12 سنة في المدينة؟ ابني يشعر بالملل وأبحث عن اقتراحات.',
    category: 'سؤال',
    date: '2024-07-26',
    likes: [2],
    comments: [
       { id: 103, userId: 1, username: 'أحمد محمود', avatar: 'https://picsum.photos/101', content: 'جرب النادي الاجتماعي الجديد، به أنشطة رياضية ممتازة.', date: '2024-07-26' },
    ]
  },
  {
    id: 4,
    circleId: 5,
    userId: 2,
    username: 'فاطمة الزهراء',
    avatar: 'https://picsum.photos/102',
    title: 'ما هو أفضل مزود خدمة إنترنت في المدينة؟',
    content: 'أفكر في الاشتراك في خدمة إنترنت جديدة وأريد أن أعرف تجاربكم مع الشركات المختلفة.',
    category: 'استطلاع رأي',
    date: '2024-07-30',
    likes: [1, 5, 3],
    comments: [],
    pollOptions: [
        { option: 'WE ( المصرية للاتصالات )', votes: [1, 5] },
        { option: 'Orange', votes: [3] },
        { option: 'Vodafone', votes: [] },
        { option: 'Etisalat', votes: [4] },
    ]
  }
];

export const mockMarketplaceItems: MarketplaceItem[] = [
    {
        id: 1,
        userId: 1,
        username: 'أحمد محمود',
        avatar: 'https://picsum.photos/101',
        title: 'لابتوب مستعمل بحالة ممتازة',
        description: 'لابتوب Dell Inspiron 15, Core i5, 8GB RAM, 256GB SSD. استخدام خفيف لمدة سنة. لا يوجد به أي خدوش.',
        images: ['https://picsum.photos/800/600?random=201', 'https://picsum.photos/800/600?random=202'],
        price: 8500,
        category: 'إلكترونيات',
        contactPhone: '01001234567',
        status: 'approved',
        creationDate: '2024-07-28',
        expirationDate: '2024-08-28',
    },
    {
        id: 2,
        userId: 2,
        username: 'فاطمة الزهراء',
        avatar: 'https://picsum.photos/102',
        title: 'أثاث غرفة معيشة للبيع',
        description: 'كنبة ٣ مقاعد وكرسيين. بحالة جيدة جداً. اللون بيج.',
        images: ['https://picsum.photos/800/600?random=203'],
        price: 5000,
        category: 'أثاث',
        contactPhone: '01119876543',
        status: 'pending',
        creationDate: '2024-07-29',
        expirationDate: '2024-08-29',
    },
    {
        id: 3,
        userId: 5,
        username: 'محمد حسين',
        avatar: 'https://picsum.photos/200/200?random=5',
        title: 'سيارة للبيع',
        description: 'هيونداي النترا 2018. عداد 80 ألف كيلو. فابريكة بالكامل.',
        images: ['https://picsum.photos/800/600?random=204'],
        price: 350000,
        category: 'سيارات',
        contactPhone: '01223344556',
        status: 'rejected',
        rejectionReason: 'الصور غير واضحة',
        creationDate: '2024-07-25',
        expirationDate: '2024-08-25',
    },
];

export const mockJobPostings: JobPosting[] = [
    {
        id: 1,
        userId: 3,
        username: 'خالد العتيبي',
        avatar: 'https://picsum.photos/103',
        title: 'مطلوب محاسب',
        companyName: 'شركة النور للتجارة',
        description: 'مطلوب محاسب خبرة من 2-4 سنوات. يجيد التعامل مع برامج المحاسبة. مقر الشركة في هليوبوليس الجديدة.',
        location: 'هليوبوليس الجديدة',
        type: 'دوام كامل',
        contactInfo: 'hr@elnour.com',
        status: 'approved',
        creationDate: '2024-07-27',
        expirationDate: '2024-08-27',
    },
    {
        id: 2,
        userId: 4,
        username: 'سارة عبدالله',
        avatar: 'https://picsum.photos/106',
        title: 'مدرس لغة إنجليزية',
        companyName: 'مركز تعليمي',
        description: 'مطلوب مدرس لغة إنجليزية للمرحلة الإعدادية. العمل بدوام جزئي مسائي.',
        location: 'هليوبوليس الجديدة',
        type: 'دوام جزئي',
        contactInfo: '01001122334',
        status: 'pending',
        creationDate: '2024-07-29',
        expirationDate: '2024-08-29',
    },
];

export const mockOffers: ExclusiveOffer[] = [
    {
        id: 1,
        serviceId: 1, // مطعم ومقهى هيليو
        title: 'خصم 20% على وجبات الغداء',
        description: 'استمتع بخصم 20% على جميع وجبات الغداء طوال أيام الأسبوع. العرض ساري من الساعة 12 ظهراً حتى 4 عصراً.',
        imageUrl: 'https://picsum.photos/800/600?random=301',
        promoCode: 'HELIO20',
        status: 'approved',
        startDate: '2024-07-01',
        endDate: '2025-12-31',
        creationDate: '2024-06-30',
    },
    {
        id: 2,
        serviceId: 3, // كافيه روز جاردن
        title: 'قطعة حلوى مجانية مع كل مشروب ساخن',
        description: 'اطلب أي مشروب ساخن واحصل على قطعة من حلوى اليوم مجاناً. العرض لا يشمل المشروبات المثلجة.',
        imageUrl: 'https://picsum.photos/800/600?random=302',
        status: 'approved',
        startDate: '2024-08-01',
        endDate: '2025-12-31',
        creationDate: '2024-07-29',
    },
    {
        id: 3,
        serviceId: 4, // مستشفى هليوبوليس المركزي
        title: 'خصم 15% على الفحص الشامل',
        description: 'حافظ على صحتك مع خصم خاص لسكان المدينة على باقة الفحص الشامل. يشمل تحاليل وصورة دم كاملة.',
        imageUrl: 'https://picsum.photos/800/600?random=305',
        status: 'approved',
        startDate: '2024-08-01',
        endDate: '2025-12-31',
        creationDate: '2024-07-30',
    },
    {
        id: 4,
        serviceId: 2, // مطعم أسماك المحيط
        title: 'وجبة طفل مجانا',
        description: 'احصل على وجبة طفل مجانية عند طلب أي وجبة رئيسية.',
        imageUrl: 'https://picsum.photos/800/600?random=306',
        status: 'rejected',
        rejectionReason: 'صورة العرض غير واضحة.',
        startDate: '2024-08-05',
        endDate: '2024-08-20',
        creationDate: '2024-08-01',
    },
    {
        id: 5,
        serviceId: 5, // جيم فيتنس برو
        title: 'شهر مجاني عند الاشتراك السنوي',
        description: 'اشترك لمدة سنة في أي من باقات الجيم واحصل على شهر إضافي مجاناً بالكامل. العرض لفترة محدودة.',
        imageUrl: 'https://picsum.photos/800/600?random=308',
        status: 'approved',
        startDate: '2024-08-01',
        endDate: '2025-12-31',
        creationDate: '2024-07-25',
    },
    {
        id: 6,
        serviceId: 6, // صالون بيوتي كوين
        title: 'خصم 30% على باقة العناية الكاملة',
        description: 'دللي نفسك مع باقة العناية الكاملة (شعر - بشرة - أظافر) واستمتعي بخصم 30% حصري لسكان المدينة.',
        imageUrl: 'https://picsum.photos/800/600?random=309',
        status: 'approved',
        startDate: '2024-08-10',
        endDate: '2025-12-31',
        creationDate: '2024-08-01',
    },
    {
        id: 7,
        serviceId: 1, // مطعم ومقهى هيليو
        title: 'حلوى مجانية مع العشاء',
        description: 'احصل على قطعة حلوى من اختيارك مجاناً عند طلب أي وجبة عشاء رئيسية بعد الساعة 7 مساءً.',
        imageUrl: 'https://picsum.photos/800/600?random=310',
        status: 'approved',
        startDate: '2024-09-01',
        endDate: '2025-12-31',
        creationDate: '2024-08-15',
    }
];

export const mockLostAndFoundItems: LostAndFoundItem[] = [
    {
        id: 1,
        userId: 1,
        username: 'أحمد محمود',
        avatar: 'https://picsum.photos/101',
        type: 'lost',
        title: 'فقدت قطتي "لوسي"',
        description: 'قطة شيرازية بيضاء، فقدت بالقرب من مول سيتي بلازا. كانت ترتدي طوقاً أحمر.',
        imageUrl: 'https://picsum.photos/800/600?random=303',
        location: 'بالقرب من مول سيتي بلازا',
        contactInfo: '01001234567',
        date: '2024-07-28',
        status: 'approved',
        creationDate: '2024-07-28',
    },
    {
        id: 2,
        userId: 2,
        username: 'فاطمة الزهراء',
        avatar: 'https://picsum.photos/102',
        type: 'found',
        title: 'وجدت مجموعة مفاتيح',
        description: 'مجموعة مفاتيح بها ميدالية على شكل سيارة. وجدتها على مقعد في الحديقة المركزية.',
        location: 'الحديقة المركزية',
        contactInfo: '01119876543',
        date: '2024-07-29',
        status: 'pending',
        creationDate: '2024-07-29',
    },
    {
        id: 3,
        userId: 5,
        username: 'محمد حسين',
        avatar: 'https://picsum.photos/200/200?random=5',
        type: 'found',
        title: 'تم العثور على محفظة رجالي',
        description: 'محفظة جلد سوداء تحتوي على بطاقات بنكية وهوية شخصية باسم "ع. س.". تم العثور عليها بجوار ماكينة الصراف الآلي.',
        location: 'أمام البنك الأهلي',
        contactInfo: '01223344556',
        date: '2024-07-30',
        status: 'approved',
        creationDate: '2024-07-30',
    },
    {
        id: 4,
        userId: 4,
        username: 'سارة عبدالله',
        avatar: 'https://picsum.photos/106',
        type: 'lost',
        title: 'فقدان هاتف آيفون 13',
        description: 'هاتف آيفون 13 أزرق اللون في غطاء شفاف. آخر مكان تواجدت فيه كان في منطقة المطاعم بمول سيتي بلازا.',
        imageUrl: 'https://picsum.photos/800/600?random=307',
        location: 'مول سيتي بلازا',
        contactInfo: 'برجاء التواصل على رقم 01001122334',
        date: '2024-08-01',
        status: 'approved',
        creationDate: '2024-08-01',
    },
    {
        id: 5,
        userId: 6,
        username: 'نور الهدى',
        avatar: 'https://picsum.photos/200/200?random=6',
        type: 'found',
        title: 'نظارة شمسية',
        description: 'وجدت نظارة شمسية حريمي على طاولة في كافيه روز جاردن.',
        location: 'كافيه روز جاردن',
        contactInfo: 'يرجى التواصل معي لاستلامها.',
        date: '2024-08-02',
        status: 'pending',
        creationDate: '2024-08-02',
    },
];

// Transportation Data
export const mockInternalSupervisor: Supervisor = { name: 'أ. محمد عبدالسلام', phone: '012-3456-7890' };
export const mockExternalSupervisor: Supervisor = { name: 'أ. حسين فهمي', phone: '015-4321-0987' };
export const mockInternalDrivers: Driver[] = [
    { id: 1, name: 'أحمد المصري', phone: '010-1111-2222', avatar: 'https://picsum.photos/200/200?random=1' },
    { id: 2, name: 'خالد عبدالله', phone: '011-2222-3333', avatar: 'https://picsum.photos/200/200?random=3' },
    { id: 3, name: 'ياسر القحطاني', phone: '015-3333-4444', avatar: 'https://picsum.photos/200/200?random=7' },
    { id: 4, name: 'سعيد العويران', phone: '012-4444-5555', avatar: 'https://picsum.photos/200/200?random=8' },
];

const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
};

const getStartOfWeek = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1) -1; // Adjust to Sunday as start of week
    return new Date(d.setDate(diff));
};

export const generateWeeklySchedule = (startDate: Date): WeeklyScheduleItem[] => {
    const schedule: WeeklyScheduleItem[] = [];
    const drivers = [
        { name: 'أحمد المصري', phone: '010-1111-2222' },
        { name: 'خالد عبدالله', phone: '011-2222-3333' },
        { name: 'ياسر القحطاني', phone: '015-3333-4444' },
        { name: 'سعيد العويران', phone: '012-4444-5555' }
    ];
    for (let i = 0; i < 7; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);
        
        let assignedDrivers: { name: string, phone: string }[] = [];
        // Simple logic to assign some drivers based on day of week
        if (i % 3 === 0) assignedDrivers.push(drivers[0]);
        if (i % 3 === 1) assignedDrivers.push(drivers[1], drivers[3]);
        if (i % 3 === 2) assignedDrivers.push(drivers[2]);
        
        schedule.push({
            date: formatDate(currentDate),
            drivers: assignedDrivers,
        });
    }
    return schedule;
};

export const mockWeeklySchedule: WeeklyScheduleItem[] = generateWeeklySchedule(getStartOfWeek(new Date()));

export const mockExternalRoutes: ExternalRoute[] = [
    { id: 1, name: 'هليوبوليس الجديدة <> ميدان رمسيس', timings: ['07:00 ص', '09:00 ص', '02:00 م', '05:00 م'], waitingPoint: 'أمام البوابة الرئيسية للمدينة' },
    { id: 2, name: 'هليوبوليس الجديدة <> التجمع الخامس', timings: ['08:00 ص', '11:00 ص', '03:00 م', '06:00 م'], waitingPoint: 'بجوار مول سيتي بلازا' },
    { id: 3, name: 'هليوبوليس الجديدة <> مدينة نصر', timings: ['07:30 ص', '10:30 ص', '01:30 م', '04:30 م'], waitingPoint: 'أمام محطة الوقود' },
];

const mockAboutCityContent: AboutCityPageContent = {
    city: {
        mainParagraphs: [
            "هليوبوليس الجديدة إحدى المدن الجديدة تقع شرق محافظة القاهرة في مصر, مساحتها 5885 فدان تم تأسيسها بموجب القرار الجمهوري رقم 193 لسنة 1995 و هي تابعة لشركة مصر الجديدة للإسكان والتعمير و تعتبر الامتداد الطبيعي لضاحية مصر الجديدة مستقبلاً.",
            "تقع المدينة على طريق القاهرة-الإسماعيلية الصحراوي شمالاً وطريق القاهرة-السويس ومدينتي جنوباً، وبمحاذاة مدينة الشروق غرباً ومدينة بدر شرقاً. ويتميز موقع المدينة بقربه من الطريق الدائري الإقليمي والذي يربطها بالمدن الجديدة ومحافظات القاهرة الكبرى."
        ],
        planning: "ينقسم تخطيط المدينة، التي تبلغ مساحتها 5888 فدان، إلى مناطق سكنية، ترفيهية، تعليمية، تجارية، إدارية، طبية، نوادي، مناطق مفتوحة ومسطحات خضراء، ومنطقة جولف. ورغم أن شركة مصر الجديدة للإسكان والتعمير لا تلجأ لسياسة بيع الأراضي، فقد بلغت مساحة الأرض المباعة بمدينة هليوبوليس الجديدة حوالي مليون و 370 ألف م²، مما حقق سيولة للمشروع وإنجازه في أقصر وقت ممكن.",
        roads: "يتم حالياً تطوير المرحلة الأولى من طريقي القاهرة-السويس والقاهرة-الإسماعيلية الصحراويين. كما سيتم ربط المدينة بالطريق الدائري (الإقليمي) وكذلك مع خط مترو الأنفاق الجديد الذي سيربط المدينة بمناطق وسط البلد ومحافظتي القاهرة والجيزة.",
        utilities: "تم إنفاق ما يزيد عن 160 مليون جنيه على المرافق بالمدينة، والتي تشمل شبكات متكاملة للكهرباء، المياه، الصرف الصحي، والتليفونات. \n\nتتغذى المدينة من محطة رفع مياه تقع في مدينة العاشر من رمضان عبر خط ناقل بطول 17 كيلومتر. وتقوم الشركة حالياً بأعمال لتقوية الخط ومحطة الرفع واستخراج التراخيص اللازمة لذلك."
    },
    company: {
        about: "شركة مصر الجديدة للإسكان والتعمير تُعد واحدة من أعرق وأقدم شركات التطوير العقاري في مصر. تأسست الشركة في عام 1906 على يد البارون إمبان، ولعبت دوراً محورياً في تطوير العديد من المشاريع السكنية والتجارية. تتميز مشاريع الشركة بالتصميم المعماري الفريد والمساحات الخضراء الواسعة، وهو ما يعكس رؤيتها في توفير حياة مريحة ومستدامة لسكانها.",
        vision: "شركة رائدة فى التطوير والاستثمار العقارى ذات قدرة تنافسية، تهدف لتوفير حياة مستدامة كريمة والمساهمة فى الحفاظ على تراث مصر الجديدة.",
        mission: "خلق اسلوب وطابع وجودة حياة فريدة وخضراء لخدمة شرائح مختلفة من المجتمع، متوافقة بيئياً وإقتصادياً وإجتماعياً وذلك من خلال استراتيجيات مبتكرة.",
        data: [
            { label: 'اسم الشركة', value: 'شركة مصر الجديدة للإسكان والتعمير' },
            { label: 'التبعية', value: 'إحدى الشركات التابعة للشركة القابضة للتشييد والتعمير - وزارة قطاع الاعمال العام' },
            { label: 'سنة التأسيس', value: '1906' },
            { label: 'غرض الشركة', value: 'القيام بكافة الاعمال المتعلقة بمشروعات الإسكان والتعمير وأنشطة التطوير العقاري.' },
            { label: 'القيد بالبورصة', value: '1995/9/27' },
        ]
    },
    board: [
        { name: 'المهندس/ محمد عبد المنعم على صالح فؤاد المنشاوى', title: 'رئيس مجلس الإدارة - غير تنفيذى', details: ['حصل على بكالوريوس هندسة – قسم هندسة مدنية – جامعة القاهرة 1985', 'وكيل مجلس إدارة غرفة التطوير العقارى بإتحاد الصناعات', 'أمين صندوق وعضو مجلس إدارة جمعية توزيع الكهرباء المصرية', 'عضو مجلس إدارة بشعبة الإستثمار العقارى', 'رئيس العلاقات الخارجية بشركة إعمار مصر للتنمية',] },
        { name: 'الدكتور مهندس / سامح السيد إبراهيم السيد حمودة', title: 'العضو منتدب و الرئيس التنفيذى', email: 'Sameh.Elsayed@hhd.com.eg', details: ['حاصل على بكالوريوس هندسة مدنية جامعه عين شمس عام 1991', 'ماجسيتير إدارة اعمال جامعة MBA', 'دكتوراة إدارة أعمال DBA', 'الرئيس التنفيذى والعضو المنتدب لشركة النصر العامة للمقاولات (حسن علام)', 'رئيس مجلس إدارة ومنصب الرئيس التنفيذى بشركة ديتاك انتجريتيد', 'Coo لشركة رؤية ااتطوير العقارى',] },
        { name: 'الأستاذ الدكتور / خالد زكريا العادلى', title: 'عضو مجلس الإدارة', email: 'k.eladli@hhd.com.eg', details: ['أستاذ التصميم العمراني ورئيس مكتب التعاون الدولي بكلية التخطيط الإقليمي والعمراني بجامعة القاهرة، محافظ الجيزة الأسبق.', 'يتمتع بخبرة دولية واسعة تزيد عن ٣٥ عاما كمخطط عمراني ومهندس أستشارى.', 'تولى منصب الرئيس الشرفي لمركز التميز العمراني بالصين الشعبية، ونائب رئيس الهيئة الدولية لمخططي المدن والأقاليم (ISOCARP) بهولندا.',] },
        { name: 'دكتورة / جيهان ممدوح محمد صالح', title: 'عضو مجلس الإدارة غير متفرغ', email: 'Gihan.Mamdouh@hhd.com.eg', details: ['مستشاراً اقتصادياً لرئيس مجلس الوزراء', 'حاصلة على بكالوريوس الاقتصاد من الجامعة الأمريكية بمصر', 'ماجيستير والدكتوراه في الاقتصاد من شيكاغو في أمريكا', 'عضو لمجلس إدارة الشركة القابضة للصناعات الغذائية لمدة ثلاثة أعوام',] },
        { name: 'الأستاذ / أحمد أشرف على كوجك', title: 'عضو مستقل', details: ['نائب وزير المالية للسياسات المالية والتطور المؤسسى', 'مسؤل التنسيق بالنيابة عن الحكومة المصرية مع صندوق النقد الدولى ومؤسسات التصنيف الإئتمانى', 'عضو مجلس ادارة البنك المركزى المصرى (ابريل 2012 - يونيو 2018)', 'اقتصادى اول بالبنك الدولى بالقاهرة (يونيو 2013 - مارس 2016)',] },
        { name: 'الأستاذة / نيفين على صبور', title: 'عضو مستقل', details: ['مساعد العضو المنتدب -- البنك العربى الافريقى الدولى', 'رئيس مجلس ادارة شركة العربى الافريقى لادارة الاصول', 'رئيس مجلس ادارة شركة SANDD للتمويل متناهى الصغر',] }
    ]
};

export const mockPublicPagesContent: PublicPagesContent = {
    home: {
        heroTitleLine1: "هليوبوليس الجديدة بين يديك",
        heroTitleLine2: "",
        heroSubtitle: "دليلك الشامل للخدمات والأخبار والمجتمع.",
        featuresSectionTitle: "كل ما تحتاجه في هليوبوليس الجديدة",
        featuresSectionSubtitle: "استكشف، تواصل، وكن على اطلاع دائم. Helio مصمم ليكون رفيقك اليومي في المدينة.",
        features: [
            { title: "دليل شامل", description: "كل الخدمات والمحلات والمرافق بين يديك، مع تقييمات حقيقية من السكان." },
            { title: "أخبار وتنبيهات", description: "لا تفوت أي جديد! كن على اطلاع بآخر مستجدات وأخبار المدينة أولاً بأول." },
            { title: "مجتمع متصل", description: "شارك برأيك وتقييماتك للخدمات وكن جزءًا من مجتمع فعال ومتعاون." }
        ],
        infoLinksSectionTitle: "معلومات تهمك"
    },
    about: {
        title: "حول تطبيق Helio",
        intro: "تطبيق \"هيليو\" هو بوابتك الرقمية الشاملة لمدينة هليوبوليس الجديدة. تم تصميم التطبيق ليكون الرفيق اليومي لكل ساكن، حيث يهدف إلى تسهيل الوصول إلى كافة الخدمات والمعلومات الحيوية داخل المدينة، وتعزيز التواصل بين السكان وإدارة المدينة.",
        vision: {
            title: "رؤيتنا",
            text: "أن نكون المنصة الرائدة التي تساهم في بناء مجتمع مترابط وذكي في هليوبوليس الجديدة، حيث يتمتع السكان بحياة أسهل وأكثر راحة من خلال التكنولوجيا."
        },
        mission: {
            title: "مهمتنا",
            text: "توفير منصة موحدة تجمع كافة الخدمات، الأخبار، والعقارات، وتسهل التواصل الفعال بين السكان، مقدمي الخدمات، وإدارة المدينة لتعزيز جودة الحياة للجميع."
        }
    },
    faq: {
        title: "الأسئلة الشائعة",
        subtitle: "Helio APP بوابتك المتكاملة لقلب هليوبوليس الجديدة النابض بالحياة",
        categories: [
            {
                category: "عن التطبيق",
                items: [
                    { q: "ما هو Helio APP؟", a: "Helio APP هو تطبيق دليلي يساعدك تكتشف كل ما في هليوبوليس الجديدة بسهولة، من مطاعم وكافيهات، إلى مراكز طبية، حضانات، جيم، محلات، وخدمات قريبة منك – وكلها مجمعة في مكان واحد." },
                    { q: "مين اللي ممكن يستخدم التطبيق؟", a: "أي حد ساكن أو بيزور هليوبوليس الجديدة وعايز يعرف الأماكن والخدمات اللي حواليه بسرعة وبدقة." },
                    { q: "هل لازم أسجل حساب؟", a: "لا، تقدر تتصفح المحتوى بدون تسجيل. لكن التسجيل بيوفر لك مزايا إضافية زي حفظ الأماكن المفضلة وتقييم الخدمات." }
                ]
            },
            {
                category: "استخدام التطبيق",
                items: [
                    { q: "إزاي ألاقي مكان معين؟", a: "استخدم خاصية البحث أو استعرض الدليل للخدمات المختلفة (مطاعم، تعليم، صحة، خدمات...)." },
                    { q: "هل ممكن أعرف تقييم الناس للمكان؟", a: "في صفحة الخدمة هتلاقي تقييم، دا تقييم فعلي من السكان والمستخدمين." },
                    { q: "هل التطبيق بيشتغل بدون إنترنت؟", a: "التطبيق يحتاج اتصال بالإنترنت لعرض أحدث البيانات." }
                ]
            },
            {
                category: "أماكن وخدمات",
                items: [
                    { q: "إزاي أبلغ عن محل جديد مش موجود؟", a: "فيه زر واتس اب ممكن تبعت لنا منه." },
                    { q: "لقيت معلومات غلط عن محل - أعمل إيه؟", a: "كلمنا على واتساب، وهنراجع البيانات فورًا." }
                ]
            },
            {
                category: "التواصل والدعم",
                items: [
                    { q: "لو عندي استفسار أو مشكلة، أتواصل مع مين؟", a: "يمكنك التواصل معنا عبر واتساب على الرقم التالي: [سيتم إضافة الرقم قريباً]." }
                ]
            },
            {
                category: "التطوير المستقبلي",
                items: [
                    { q: "هل في خطط لتطوير التطبيق؟", a: "طبعًا، التطبيق بيتطور باستمرار بناءً على اقتراحاتكم. وهدفنا نخلي Helio APP أداة يومية لكل ساكن في المدينة." }
                ]
            }
        ]
    },
    privacy: {
        title: "سياسة الخصوصية",
        lastUpdated: "29 يوليو 2024",
        sections: [
            { title: "مقدمة", content: ["نحن في \"هليو آب Helio APP\" (المشار إليه فيما بعد بـ \"التطبيق\" أو \"نحن\") نولي أهمية قصوى لخصوصية زوارنا ومستخدمينا الكرام. توضح سياسة الخصوصية هذه كيفية جمعنا واستخدامنا وحمايتنا للمعلومات الشخصية التي تقدمونها لنا عند استخدامكم لموقعنا والخدمات المرتبطة به. باستخدامك للموقع، فإنك توافق على جمع واستخدام المعلومات وفقًا لهذه السياسة."] },
            { title: "1. المعلومات التي نجمعها", content: [
                "**المعلومات الشخصية:** قد نطلب منك تقديم معلومات شخصية معينة يمكن استخدامها للاتصال بك أو التعرف عليك عند التسجيل في التطبيق (إذا توفرت هذه الميزة)، أو عند إضافة بيانات عملك إلى الدليل، أو عند التواصل معنا، أو عند الاشتراك في النشرات الإخبارية. قد تشمل هذه المعلومات، على سبيل المثال لا الحصر: الاسم، عنوان البريد الإلكتروني، رقم الهاتف، اسم النشاط التجاري وتفاصيله.",
                "**بيانات الاستخدام:** نقوم بجمع معلومات حول كيفية الوصول إلى التطبيق واستخدامه (\"بيانات الاستخدام\"). قد تتضمن بيانات الاستخدام هذه معلومات مثل عنوان بروتوكول الإنترنت الخاص بجهاز الكمبيوتر (IP Address)، نوع المتصفح، إصدار المتصفح، الصفحات التي تزورها على موقعنا، وقت وتاريخ زيارتك، الوقت المستغرق في تلك الصفحات، ومعرفات الأجهزة الفريدة وغيرها من البيانات التشخيصية.",
                "**بيانات التطبيق:** قد نستخدم ونخزن معلومات حول موقعك إذا منحتنا الإذن بذلك (\"بيانات التطبيق\"). نستخدم هذه البيانات لتوفير ميزات خدمتنا، ولتحسين وتخصيص خدمتنا (مثل عرض الخدمات القريبة منك). يمكنك تمكين أو تعطيل خدمات الموقع عند استخدامك لخدمتنا في أي وقت من خلال إعدادات جهازك.",
                "**ملفات تعريف الارتباط (Cookies) وبيانات التتبع:** نستخدم ملفات تعريف الارتباط وتقنيات تتبع مشابهة لتتبع النشاط على موقعنا والاحتفاظ بمعلومات معينة. ملفات تعريف الارتباط هي ملفات تحتوي على كمية صغيرة من البيانات التي قد تتضمن معرفًا فريدًا مجهول الهوية. يمكنك ضبط متصفحك لرفض جميع ملفات تعريف الارتباط أو للإشارة إلى وقت إرسال ملف تعريف الارتباط. ومع ذلك، إذا لم تقبل ملفات تعريف الارتباط، فقد لا تتمكن من استخدام بعض أجزاء موقعنا."
            ]},
            { title: "2. كيف نستخدم معلوماتك", content: [
                "نستخدم البيانات التي نجمعها لأغراض مختلفة:",
                { list: [
                    "لتوفير وصيانة موقعنا وخدماتنا.",
                    "لإخطارك بالتغييرات التي تطرأ على خدمتنا.",
                    "للسماح لك بالمشاركة في الميزات التفاعلية لموقعنا عندما تختار القيام بذلك (مثل التقييمات والتعليقات).",
                    "لتوفير دعم العملاء.",
                    "لجمع التحليلات أو المعلومات القيمة حتى نتمكن من تحسين موقعنا.",
                    "لمراقبة استخدام موقعنا.",
                    "للكشف عن المشكلات الفنية ومنعها ومعالجتها.",
                    "لتزويدك بالأخبار والعروض الخاصة والمعلومات العامة حول السلع والخدمات والأحداث الأخرى التي نقدمها والتي تشبه تلك التي اشتريتها بالفعل أو استفسرت عنها ما لم تكن قد اخترت عدم تلقي هذه المعلومات (في حال تطبيق نظام النشرات الإخبارية)."
                ]}
            ]},
            { title: "3. مشاركة البيانات والكشف عنها", content: [
                "**مقدمو الخدمات (الطرف الثالث):** قد نستعين بشركات وأفراد من أطراف ثالثة لتسهيل خدمتنا (\"مقدمو الخدمات\")، لتقديم الخدمة نيابة عنا، لأداء خدمات متعلقة بالخدمة أو لمساعدتنا في تحليل كيفية استخدام خدمتنا. هؤلاء الأطراف الثالثة لديهم حق الوصول إلى معلوماتك الشخصية فقط لأداء هذه المهام نيابة عنا وهم ملزمون بعدم الكشف عنها أو استخدامها لأي غرض آخر.",
                "**المتطلبات القانونية:** قد نكشف عن معلوماتك الشخصية بحسن نية إذا كان هذا الإجراء ضروريًا لـ:",
                { list: [
                    "الامتثال لالتزام قانوني.",
                    "حماية والدفاع عن حقوق أو ممتلكات \"هليو آب Helio APP\".",
                    "منع أو التحقيق في أي مخالفات محتملة تتعلق بالخدمة.",
                    "حماية السلامة الشخصية لمستخدمي الخدمة أو الجمهور.",
                    "الحماية من المسؤولية القانونية."
                ]}
            ]},
            { title: "4. أمن البيانات", content: ["أمن بياناتك مهم بالنسبة لنا، ولكن تذكر أنه لا توجد وسيلة نقل عبر الإنترنت أو طريقة تخزين إلكتروني آمنة 100%. بينما نسعى جاهدين لاستخدام وسائل مقبولة تجاريًا لحماية معلوماتك الشخصية، لا يمكننا ضمان أمنها المطلق."] },
            { title: "5. حقوقك", content: ["لديك الحق في الوصول إلى معلوماتك الشخصية التي نحتفظ بها وتحديثها أو طلب حذفها. إذا كنت ترغب في ممارسة هذه الحقوق، يرجى الاتصال بنا."] },
            { title: "6. روابط لمواقع أخرى", content: ["قد يحتوي موقعنا على روابط لمواقع أخرى لا يتم تشغيلها من قبلنا. إذا نقرت على رابط جهة خارجية، فسيتم توجيهك إلى موقع تلك الجهة الخارجية. ننصحك بشدة بمراجعة سياسة الخصوصية لكل موقع تزوره. ليس لدينا أي سيطرة ولا نتحمل أي مسؤولية عن المحتوى أو سياسات الخصوصية أو الممارسات الخاصة بأي مواقع أو خدمات تابعة لجهات خارجية."] },
            { title: "7. خصوصية الأطفال", content: ["خدمتنا لا تستهدف أي شخص دون سن 18 عامًا (\"الأطفال\"). نحن لا نجمع عن قصد معلومات تعريف شخصية من أي شخص دون سن 18 عامًا. إذا كنت والدًا أو وصيًا وتعلم أن أطفالك قد زودونا بمعلومات شخصية، فيرجى الاتصال بنا. إذا علمنا أننا جمعنا معلومات شخصية من أطفال دون التحقق من موافقة الوالدين، فإننا نتخذ خطوات لإزالة تلك المعلومات من خوادمنا."] },
            { title: "8. التغييرات على سياسة الخصوصية هذه", content: ["قد نقوم بتحديث سياسة الخصوصية الخاصة بنا من وقت لآخر. سنقوم بإعلامك بأي تغييرات عن طريق نشر سياسة الخصوصية الجديدة على هذه الصفحة. يُنصح بمراجعة سياسة الخصوصية هذه بشكل دوري لأي تغييرات. تسري التغييرات على سياسة الخصوصية هذه عند نشرها على هذه الصفحة."] },
            { title: "9. اتصل بنا", content: ["إذا كان لديك أي أسئلة حول سياسة الخصوصية هذه، يرجى الاتصال بنا:", "عبر زيارة الواتس اب: [سيتم إضافة الرابط قريباً]"] },
        ]
    },
    terms: {
        title: "سياسة الاستخدام",
        lastUpdated: "29 يوليو 2024",
        sections: [
            { title: "مقدمة", content: ["مرحبا بك في \"هليو آب Helio APP\". توضح هذه الشروط والأحكام (\"الشروط\"، \"شروط الاستخدام\") القواعد واللوائح الخاصة باستخدامك لموقعنا الإلكتروني والخدمات التي نقدمها (\"الخدمة\").", "من خلال الوصول إلى هذا التطبيق واستخدامه، فإنك تقر بأنك قرأت وفهمت ووافقت على الالتزام بهذه الشروط. إذا كنت لا توافق على أي جزء من هذه الشروط، فيجب عليك عدم استخدام خدمتنا."] },
            { title: "1. استخدام التطبيق", content: ["أنت توافق على استخدام التطبيق فقط للأغراض المشروعة ووفقًا لهذه الشروط.", "يجب ألا يقل عمرك عن 18 عامًا لاستخدام هذا التطبيق بشكل كامل أو لتقديم معلومات شخصية.", "أنت مسؤول عن ضمان أن جميع الأشخاص الذين يصلون إلى التطبيق من خلال اتصال الإنترنت الخاص بك على دراية بهذه الشروط والامتثال لها."] },
            { title: "2. الحسابات", content: ["إذا قمت بإنشاء حساب على موقعنا، فأنت مسؤول عن الحفاظ على سرية حسابك وكلمة المرور وتقييد الوصول إلى جهاز الكمبيوتر الخاص بك، وتوافق على قبول المسؤولية عن جميع الأنشطة التي تحدث تحت حسابك أو كلمة المرور الخاصة بك.", "يجب عليك إخطارنا على الفور عند علمك بأي خرق للأمن أو استخدام غير مصرح به لحسابك."] },
            { title: "3. دليل الخدمات والمعلومات", content: ["يهدف \"هليو آب Helio APP\" إلى توفير معلومات دقيقة وحديثة قدر الإمكان في دليل الخدمات. ومع ذلك، فإننا لا نضمن دقة أو اكتمال أو حداثة أي معلومات على التطبيق، بما في ذلك المعلومات المقدمة من قبل أطراف ثالثة (مثل أصحاب الأعمال).", "يتم توفير المعلومات \"كما هي\" دون أي ضمانات من أي نوع.", "أنت وحدك المسؤول عن التحقق من أي معلومات قبل الاعتماد عليها. أي اعتماد على المواد الموجودة على هذا التطبيق هو على مسؤوليتك الخاصة.", "نحتفظ بالحق في تعديل محتويات هذا التطبيق في أي وقت، ولكن ليس لدينا أي التزام بتحديث أي معلومات على موقعنا."] },
            { title: "4. المحتوى المقدم من المستخدم (User-Generated Content)", content: [
                "إذا سمح التطبيق للمستخدمين بنشر محتوى (مثل التقييمات، التعليقات، قوائم الأعمال)، فإنك تمنح \"هليو آب Helio APP\" ترخيصًا عالميًا غير حصري وخاليًا من حقوق الملكية وقابل للتحويل وقابل للترخيص من الباطن لاستخدام هذا المحتوى ونسخه وتعديله وتوزيعه ونشره وعرضه علنًا وأداءه علنًا وإنشاء أعمال مشتقة منه بأي شكل من الأشكال وفي أي وسائط أو قنوات توزيع معروفة الآن أو يتم تطويرها لاحقًا.",
                "أنت تقر وتضمن أن لديك جميع الحقوق اللازمة لتقديم هذا المحتوى وأن هذا المحتوى لا ينتهك حقوق أي طرف ثالث أو أي قوانين معمول بها.",
                "أنت توافق على عدم نشر أي محتوى:",
                { list: [
                    "غير قانوني أو تشهيري أو افترائي أو فاحش أو إباحي أو غير لائق أو بذيء أو موحٍ أو مضايق أو مهدد أو ينتهك الخصوصية أو حقوق الدعاية أو مسيء أو تحريضي أو احتيالي.",
                    "ينتهك أي براءة اختراع أو علامة تجارية أو سر تجاري أو حقوق نشر أو حقوق ملكية فكرية أخرى لأي طرف.",
                    "ينتحل شخصية أي شخص أو كيان أو يحرف انتماءك لشخص أو كيان."
                ]},
                "نحتفظ بالحق، ولكننا لسنا ملزمين، بمراقبة أو مراجعة أو إزالة أي محتوى مقدم من المستخدم وفقًا لتقديرنا الخاص."
            ]},
            { title: "5. الملكية الفكرية", content: ["التطبيق ومحتواه الأصلي (باستثناء المحتوى المقدم من المستخدمين)، والميزات والوظائف هي وستظل ملكية حصرية لـ \"هليو آب Helio APP\" ومرخصيها. الخدمة محمية بموجب حقوق النشر والعلامات التجارية والقوانين الأخرى في مصر والبلدان الأجنبية. لا يجوز استخدام علاماتنا التجارية وثيابنا التجارية فيما يتعلق بأي منتج أو خدمة دون موافقة خطية مسبقة من \"هليو آب Helio APP\"."] },
            { title: "6. السلوك المحظور", content: [
                "أنت توافق على عدم استخدام التطبيق:",
                { list: [
                    "بأي طريقة تنتهك أي قانون أو لائحة محلية أو وطنية أو دولية معمول بها.",
                    "لغرض استغلال القاصرين أو إيذائهم أو محاولة استغلالهم أو إيذائهم بأي شكل من الأشكال.",
                    "لإرسال أو استقبال أو تحميل أو تنزيل أو استخدام أو إعادة استخدام أي مادة لا تتوافق مع معايير المحتوى المنصوص عليها في هذه الشروط.",
                    "لنقل أو تدبير إرسال أي مواد إعلانية أو ترويجية غير مرغوب فيها أو غير مصرح بها أو أي شكل آخر من أشكال الالتماس المماثلة (البريد العشوائي).",
                    "لانتحال شخصية أو محاولة انتحال شخصية \"هليو آب Helio APP\" أو موظف في \"هليو آب Helio APP\" أو مستخدم آخر أو أي شخص أو كيان آخر.",
                    "للانخراط في أي سلوك آخر يقيد أو يمنع استخدام أي شخص للموقع أو التمتع به، أو الذي، كما نحدده، قد يضر بـ \"هليو آب Helio APP\" أو مستخدمي التطبيق أو يعرضهم للمسؤولية."
                ]}
            ]},
            { title: "7. إخلاء المسؤولية عن الضمانات؛ تحديد المسؤولية", content: [
                "يتم توفير التطبيق على أساس \"كما هو\" و \"كما هو متاح\". نحن لا نقدم أي تعهدات أو ضمانات من أي نوع، صريحة أو ضمنية، فيما يتعلق بتشغيل موقعنا أو المعلومات أو المحتوى أو المواد أو المنتجات المدرجة على موقعنا.",
                "إلى أقصى حد يسمح به القانون المعمول به، نخلي مسؤوليتنا عن جميع الضمانات، الصريحة أو الضمنية، بما في ذلك، على سبيل المثال لا الحصر، الضمانات الضمنية الخاصة بالتسويق والملاءمة لغرض معين وعدم الانتهاك.",
                "لن نكون مسؤولين عن أي أضرار من أي نوع تنشأ عن استخدام هذا التطبيق، بما في ذلك، على سبيل المثال لا الحصر، الأضرار المباشرة أو غير المباشرة أو العرضية أو العقابية أو التبعية."
            ]},
            { title: "8. إنهاء الخدمة", content: ["يجوز لنا إنهاء أو تعليق وصولك إلى خدمتنا على الفور، دون إشعار مسبق أو مسؤولية، لأي سبب من الأسباب، بما في ذلك على سبيل المثال لا الحصر إذا انتهكت الشروط."] },
            { title: "9. القانون الحاكم", content: ["تخضع هذه الشروط وتُفسر وفقًا لقوانين جمهورية مصر العربية، بغض النظر عن تعارضها مع أحكام القانون."] },
            { title: "10. التغييرات على الشروط", content: ["نحتفظ بالحق، وفقًا لتقديرنا الخاص، في تعديل أو استبدال هذه الشروط في أي وقت. إذا كان التعديل جوهريا، فسنحاول تقديم إشعار قبل 30 يوما على الأقل من دخول أي شروط جديدة حيز التنفيذ. ما يشكل تغييرًا جوهريًا سيتم تحديده وفقًا لتقديرنا الخاص. من خلال الاستمرار في الوصول إلى خدمتنا أو استخدامها بعد أن تصبح هذه المراجعات فعالة، فإنك توافق على الالتزام بالشروط المعدلة."] },
            { title: "11. اتصل بنا", content: ["إذا كان لديك أي أسئلة حول هذه الشروط، يرجى الاتصال بنا:", "عبر الواتس اب: [سيتم إضافة الرابط قريباً]"] },
        ]
    },
    aboutCity: mockAboutCityContent,
};