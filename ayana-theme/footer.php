<?php 
$lang = ayana_get_lang();
$is_ar = $lang === 'ar';
?>
    <!-- Contact Section -->
    <section id="contact" class="relative py-24 bg-stone-950 text-white overflow-hidden">
        <!-- Glowing blur effect in corner -->
        <div class="absolute -top-[30%] -end-[10%] w-[50%] h-[80%] bg-brand-main/20 rounded-full blur-[120px] pointer-events-none"></div>

        <div class="container mx-auto px-4 md:px-8 relative z-10">
            <div class="grid lg:grid-cols-2 gap-16">
                <!-- Contact Info -->
                <div>
                    <h2 class="text-sm font-bold text-brand-light tracking-widest uppercase mb-3"><?php ayana_t('Get In Touch', 'تواصل معنا'); ?></h2>
                    <h3 class="text-4xl md:text-5xl font-bold mb-8 text-white"><?php ayana_t('Ready to start your next mega-project?', 'هل أنت مستعد لبدء مشروعك الضخم القادم؟'); ?></h3>
                    <p class="text-stone-400 text-lg mb-12 max-w-md">
                        <?php ayana_t('Reach out to our leadership and technical teams to explore how Ayana can elevate your architectural vision.', 'تواصل مع فريق القيادة والفرق الفنية لدينا لاستكشاف كيف يمكن لأيانة الارتقاء برؤيتك المعمارية.'); ?>
                    </p>

                    <div class="space-y-8">
                        <div class="flex items-start gap-4">
                            <div class="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-brand-light flex-shrink-0 border border-white/10">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            </div>
                            <div>
                                <h5 class="font-bold text-lg mb-1"><?php ayana_t('Headquarters', 'المقر الرئيسي'); ?></h5>
                                <p class="text-stone-400"><?php ayana_t('Eastern Region, Al-Khobar, KSA', 'المنطقة الشرقية، الخبر، المملكة العربية السعودية'); ?></p>
                            </div>
                        </div>

                        <div class="flex items-start gap-4">
                            <div class="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-brand-light flex-shrink-0 border border-white/10">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                            </div>
                            <div>
                                <h5 class="font-bold text-lg mb-1"><?php ayana_t('General Manager', 'المدير العام'); ?></h5>
                                <p class="text-stone-300 font-medium"><?php ayana_t('Eng. Ahmed Al Mwafi', 'م. أحمد الموافي'); ?></p>
                                <a href="tel:+966542471976" class="text-brand-light hover:text-white transition-colors" dir="ltr">+966 54 247 1976</a>
                            </div>
                        </div>

                        <div class="flex items-start gap-4">
                            <div class="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-brand-light flex-shrink-0 border border-white/10">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                            </div>
                            <div>
                                <h5 class="font-bold text-lg mb-1"><?php ayana_t('Regional Technical Manager', 'المدير الفني الإقليمي'); ?></h5>
                                <p class="text-stone-300 font-medium"><?php ayana_t('Eng. Ahmed Yousef Al-Riashi', 'م. أحمد يوسف الرياشي'); ?></p>
                                <div class="flex flex-col">
                                    <a href="mailto:ahmed.yousef@decoland-eg.com" class="text-brand-light hover:text-white transition-colors">ahmed.yousef@decoland-eg.com</a>
                                    <a href="tel:+966541521745" class="text-brand-light hover:text-white transition-colors" dir="ltr">+966 54 152 1745</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Contact Form -->
                <div class="bg-stone-900 p-8 md:p-10 rounded-3xl border border-white/10 shadow-2xl relative">
                    <form class="space-y-6">
                        <div>
                            <label class="block text-sm font-medium text-stone-300 mb-2"><?php ayana_t('Full Name', 'الاسم الكامل'); ?></label>
                            <input type="text" class="w-full px-5 py-4 bg-stone-950/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-brand-main focus:ring-1 focus:ring-brand-main transition-colors" placeholder="<?php ayana_t('John Doe', 'أحمد محمد'); ?>">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-stone-300 mb-2"><?php ayana_t('Email Address', 'البريد الإلكتروني'); ?></label>
                            <input type="email" class="w-full px-5 py-4 bg-stone-950/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-brand-main focus:ring-1 focus:ring-brand-main transition-colors" placeholder="email@example.com">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-stone-300 mb-2"><?php ayana_t('Message', 'الرسالة'); ?></label>
                            <textarea rows="4" class="w-full px-5 py-4 bg-stone-950/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-brand-main focus:ring-1 focus:ring-brand-main transition-colors" placeholder="<?php ayana_t('How can we help you?', 'كيف يمكننا مساعدتك؟'); ?>"></textarea>
                        </div>
                        <button type="button" class="w-full py-4 bg-brand-main hover:bg-brand-light text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-brand-main/20">
                            <?php ayana_t('Send Message', 'إرسال الرسالة'); ?>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer Margin & Copyright -->
    <footer class="bg-stone-950 border-t border-white/5 py-8 text-center text-stone-400 text-sm">
        <div class="container mx-auto px-4">
            <div class="flex flex-col md:flex-row justify-between items-center gap-4">
                <p>&copy; 2026 Ayana Innovative Green Solutions. <?php ayana_t('All rights reserved.', 'جميع الحقوق محفوظة.'); ?></p>
                <div class="flex gap-6 text-xs text-stone-500">
                    <span>CR: 1010988914</span>
                    <span>VAT: 312086946500003</span>
                </div>
            </div>
        </div>
    </footer>

    <?php wp_footer(); ?>
</body>
</html>
