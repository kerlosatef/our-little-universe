<?php
get_header(); 
$lang = ayana_get_lang();
$is_ar = $lang === 'ar';
?>

<main id="home">
    <!-- Hero Section -->
    <section class="relative min-h-screen flex items-center pt-24 overflow-hidden">
        <div class="absolute inset-0 z-0">
            <img src="https://images.unsplash.com/photo-1598902108854-10e335adac99?auto=format&fit=crop&q=80&w=2000" alt="Ayana Landscaping" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-stone-900/60 bg-gradient-to-t from-stone-950 via-stone-900/50 to-transparent"></div>
        </div>
        
        <div class="container mx-auto px-4 md:px-8 relative z-10 text-white">
            <div class="max-w-4xl mx-auto text-center <?php echo $is_ar ? 'text-right md:text-center' : ''; ?>">
                <h1 class="text-5xl md:text-7xl font-bold mb-6 leading-tight drop-shadow-lg">
                    <?php ayana_t('Architectural Excellence via ', 'التميز المعماري عبر '); ?>
                    <span class="text-brand-light"><?php ayana_t('Innovative Green Solutions', 'حلول خضراء مبتكرة'); ?></span>
                </h1>
                <p class="text-xl md:text-2xl text-stone-100 mb-12 max-w-3xl mx-auto font-light leading-relaxed drop-shadow">
                    <?php ayana_t('Ayana, your trusted partner in Saudi Arabia for supplying and executing the finest marble, granite, and landscaping solutions for mega and residential projects.', 'أيانة، شريكك الموثوق في المملكة العربية السعودية لتوريد وتنفيذ أجود أنواع الرخام والجرانيت وحلول تنسيق الحدائق للمشاريع الضخمة والسكنية.'); ?>
                </p>
                <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <a href="#about" class="px-8 py-4 bg-brand-main hover:bg-brand-light text-white rounded-xl font-semibold text-lg transition-all duration-300 transform hover:-translate-y-1 shadow-lg shadow-brand-main/30">
                        <?php ayana_t('Discover More', 'اكتشف المزيد'); ?>
                    </a>
                    <a href="#contact" class="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-xl font-semibold text-lg transition-all duration-300 transform hover:-translate-y-1">
                        <?php ayana_t('Contact Us', 'تواصل معنا'); ?>
                    </a>
                </div>
            </div>
        </div>
    </section>

    <!-- About Section -->
    <section id="about" class="py-24 bg-stone-50">
        <div class="container mx-auto px-4 md:px-8">
            <div class="grid lg:grid-cols-2 gap-16 items-center">
                <div class="relative">
                    <div class="absolute -top-12 -start-12 w-48 h-48 bg-brand-light/10 rounded-full blur-3xl"></div>
                    <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200" alt="About Ayana" class="rounded-3xl shadow-2xl relative z-10 object-cover aspect-square" />
                    <div class="absolute -bottom-8 -end-8 bg-white p-6 rounded-2xl shadow-xl z-20 max-w-xs">
                        <div class="text-brand-main text-4xl font-bold mb-2">15+</div>
                        <div class="text-stone-600 font-medium"><?php ayana_t('Years of Architectural Excellence', 'عاماً من التميز المعماري'); ?></div>
                    </div>
                </div>
                <div>
                    <h2 class="text-sm font-bold text-brand-main tracking-widest uppercase mb-3"><?php ayana_t('About Ayana', 'من نحن'); ?></h2>
                    <h3 class="text-4xl md:text-5xl font-bold text-stone-900 mb-6 leading-tight">
                        <?php ayana_t('Building the Kingdom\'s Future.', 'بناء مستقبل المملكة.'); ?>
                    </h3>
                    <p class="text-lg text-stone-600 mb-8 leading-relaxed">
                        <?php ayana_t('Headquartered in Al-Khobar, KSA, Ayana is a specialized provider of premium marble, granite, and natural stone works. We have proudly participated in national mega-projects that shape the future, including Diriyah Gate and King Abdullah Financial District (KAFD).', 'يقع المقر الرئيسي لأيانة في مدينة الخبر بالمملكة العربية السعودية، وهي مزود متخصص لأعمال الرخام والجرانيت والحجر الطبيعي الفاخر. لقد شاركنا بفخر في مشاريع وطنية ضخمة ترسم معالم المستقبل، بما في ذلك بوابة الدرعية ومركز الملك عبدالله المالي.'); ?>
                    </p>
                    
                    <div class="grid sm:grid-cols-2 gap-6">
                        <div class="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 hover:shadow-md transition-shadow">
                            <div class="w-12 h-12 bg-brand-light/20 rounded-xl flex items-center justify-center text-brand-dark mb-4">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                            </div>
                            <h4 class="text-xl font-bold text-stone-900 mb-2"><?php ayana_t('Our Vision', 'رؤيتنا'); ?></h4>
                            <p class="text-stone-600 text-sm"><?php ayana_t('To achieve architectural excellence and become the leading provider across the Kingdom.', 'تحقيق التميز المعماري لنصبح المزود الرائد في جميع أنحاء المملكة.'); ?></p>
                        </div>
                        <div class="bg-brand-dark text-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                            <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white mb-4">
                               <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                            </div>
                            <h4 class="text-xl font-bold mb-2"><?php ayana_t('Our Mission', 'مهمتنا'); ?></h4>
                            <p class="text-white/80 text-sm"><?php ayana_t('Delivering end-to-end stone and construction solutions through strategic partnerships.', 'تقديم حلول حجرية وإنشائية متكاملة من خلال شراكات استراتيجية.'); ?></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Scope of Work & Products -->
    <section id="solutions" class="py-24 bg-white">
        <div class="container mx-auto px-4 md:px-8">
            <div class="text-center max-w-3xl mx-auto mb-16">
                <h2 class="text-sm font-bold text-brand-main tracking-widest uppercase mb-3"><?php ayana_t('Our Solutions', 'حلولنا'); ?></h2>
                <h3 class="text-4xl font-bold text-stone-900 mb-6"><?php ayana_t('Scope of Work & Products', 'نطاق العمل والمنتجات'); ?></h3>
                <p class="text-stone-600 text-lg"><?php ayana_t('Comprehensive architectural and landscaping solutions tailored for premium and mega-projects.', 'حلول معمارية وتنسيق حدائق شاملة مصممة خصيصًا للمشاريع الفاخرة والضخمة.'); ?></p>
            </div>

            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <?php 
                $cards = [
                    [
                        'en' => 'Hardscape Works', 
                        'ar' => 'أعمال الهاردسكيب', 
                        'den' => 'Acrylic flooring, stone paving, stamped concrete, marble & granite.',
                        'dar' => 'أرضيات أكريليك، رصف حجري، خرسانة مطبوعة، رخام وجرانيت.'
                    ],
                    [
                        'en' => 'Stabilization Systems', 
                        'ar' => 'أنظمة التثبيت', 
                        'den' => 'Premium Gravel Fix, Grass Fix, and Equest Fix systems.',
                        'dar' => 'أنظمة التثبيت المتميزة للحصى والعشب (Gravel Fix, Grass Fix, Equest Fix).'
                    ],
                    [
                        'en' => 'Edging & Joint Systems', 
                        'ar' => 'أنظمة الحواف والفواصل', 
                        'den' => 'Aluminum edges, HDPE edges, LED edges, expansion joints.',
                        'dar' => 'حواف ألمنيوم، حواف بلاستيكية عالية الجودة، حواف مضيئة، وفواصل تمدد.'
                    ],
                    [
                        'en' => 'Erosion Control & Drainage', 
                        'ar' => 'مكافحة التآكل والصرف', 
                        'den' => 'Geocell structures and Geotextile materials for robust drainage.',
                        'dar' => 'هياكل جيوسيل (Geocell) ومواد التكسية الأرضية (Geotextile) لصرف قوي.'
                    ],
                    [
                        'en' => 'Plant Care & Safety', 
                        'ar' => 'العناية بالنباتات والسلامة', 
                        'den' => 'Flex Base for playgrounds, Water Ups sub-irrigation systems.',
                        'dar' => 'قواعد مرنة (Flex Base) للملاعب، وأنظمة الري تحت السطحي (Water Ups).'
                    ],
                    [
                        'en' => 'Decoration & Natural Stone', 
                        'ar' => 'الديكور والحجر الطبيعي', 
                        'den' => 'Custom Gabions, decorative pebbles, premium Riyadh stone.',
                        'dar' => 'أقفاص الجابيون (Gabions) المخصصة، حصى الديكور، حجر الرياض الفاخر.'
                    ]
                ];
                foreach ($cards as $i => $card): ?>
                    <div class="group bg-stone-50 rounded-2xl p-8 border border-stone-100 hover:border-brand-main/30 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                        <div class="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center text-brand-main mb-6 group-hover:scale-110 transition-transform">
                            <span class="text-2xl font-bold"><?php echo $i + 1; ?></span>
                        </div>
                        <h4 class="text-xl font-bold text-stone-900 mb-3 group-hover:text-brand-main transition-colors">
                            <?php ayana_t($card['en'], $card['ar']); ?>
                        </h4>
                        <p class="text-stone-600 leading-relaxed">
                            <?php ayana_t($card['den'], $card['dar']); ?>
                        </p>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </section>

    <!-- Prominent Projects -->
    <section id="projects" class="py-24 bg-stone-100">
        <div class="container mx-auto px-4 md:px-8">
            <div class="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                <div class="max-w-2xl">
                    <h2 class="text-sm font-bold text-brand-main tracking-widest uppercase mb-3"><?php ayana_t('Portfolio', 'أعمالنا'); ?></h2>
                    <h3 class="text-4xl font-bold text-stone-900"><?php ayana_t('Prominent Projects', 'مشاريع بارزة'); ?></h3>
                </div>
                <a href="#contact" class="hidden md:inline-flex px-6 py-3 border-2 border-stone-300 hover:border-brand-main text-stone-700 hover:text-brand-main rounded-xl font-bold transition-colors">
                    <?php ayana_t('Start a Project', 'ابدأ مشروعاً'); ?>
                </a>
            </div>

            <div class="grid md:grid-cols-3 gap-6 mb-16">
                <?php
                $projects = [
                    [
                        'en' => 'King Abdullah Financial District (KAFD)',
                        'ar' => 'مركز الملك عبدالله المالي (KAFD)',
                        'locen' => 'Riyadh', 'locar' => 'الرياض',
                        'descen' => 'Supply and installation of luxury marble.',
                        'descar' => 'توريد وتركيب الرخام الفاخر.',
                        'img' => 'https://images.unsplash.com/photo-1541888062963-4414ee494056?auto=format&fit=crop&q=80&w=800'
                    ],
                    [
                        'en' => 'Diriyah Gate Development',
                        'ar' => 'مشروع تطوير بوابة الدرعية',
                        'locen' => 'Riyadh', 'locar' => 'الرياض',
                        'descen' => 'Natural stone cladding & heritage treatments.',
                        'descar' => 'تكسية بالحجر الطبيعي ومعالجات تراثية.',
                        'img' => 'https://images.unsplash.com/photo-1582298538104-fe2e74c27f59?auto=format&fit=crop&q=80&w=800'
                    ],
                    [
                        'en' => 'Ritz-Carlton Hotel Villas',
                        'ar' => 'فلل فندق الريتز كارلتون',
                        'locen' => 'Riyadh', 'locar' => 'الرياض',
                        'descen' => 'Riyadh stone cladding and premium landscaping.',
                        'descar' => 'تكسية بحجر الرياض وتنسيق حدائق فاخر.',
                        'img' => 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800'
                    ]
                ];
                foreach ($projects as $proj): ?>
                    <div class="relative group rounded-2xl overflow-hidden shadow-lg h-96">
                        <img src="<?php echo $proj['img']; ?>" alt="<?php ayana_t($proj['en'], $proj['ar']); ?>" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div class="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/60 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                        <div class="absolute inset-0 p-8 flex flex-col justify-end transform translate-y-4 group-hover:translate-y-0 transition-transform">
                            <span class="inline-block px-3 py-1 bg-brand-main/20 backdrop-blur-md text-brand-light text-xs font-bold uppercase rounded-full mb-3 w-max"><?php ayana_t($proj['locen'], $proj['locar']); ?></span>
                            <h4 class="text-2xl font-bold text-white mb-2"><?php ayana_t($proj['en'], $proj['ar']); ?></h4>
                            <p class="text-stone-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100"><?php ayana_t($proj['descen'], $proj['descar']); ?></p>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>

            <div class="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-stone-100">
                <h4 class="text-xl font-bold text-stone-900 mb-6 flex items-center gap-3">
                    <span class="w-2 h-8 bg-brand-main rounded-full block"></span>
                    <?php ayana_t('Other Notable Projects', 'مشاريع بارزة أخرى'); ?>
                </h4>
                <ul class="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <?php
                    $others = [
                        ['en' => 'Al-Hadithi Mall (Al-Kharj)', 'ar' => 'مول الحديثي (الخرج)'],
                        ['en' => 'Aknan Al-Sharq', 'ar' => 'أكنان الشرق'],
                        ['en' => 'Astra Industrial Group', 'ar' => 'مجموعة أسترا الصناعية'],
                        ['en' => 'Tuwaiq Oasis', 'ar' => 'واحة طويق'],
                    ];
                    foreach ($others as $item): ?>
                        <li class="flex items-center gap-3 text-stone-600 font-medium">
                            <svg class="w-5 h-5 text-brand-main flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                            <?php ayana_t($item['en'], $item['ar']); ?>
                        </li>
                    <?php endforeach; ?>
                </ul>
            </div>
        </div>
    </section>
</main>
<?php get_footer(); ?>
