<?php
  $current_lang = ayana_get_lang();
  $dir = $current_lang === 'ar' ? 'rtl' : 'ltr';
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?> dir="<?php echo esc_attr($dir); ?>" lang="<?php echo esc_attr($current_lang); ?>" class="scroll-smooth">
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <?php wp_head(); ?>
</head>
<body <?php body_class('bg-stone-50 text-stone-900 ' . ($current_lang === 'ar' ? 'font-arabic' : 'font-sans')); ?>>
    
    <header class="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200/50 shadow-sm transition-all duration-300">
        <div class="container mx-auto px-4 md:px-8">
            <div class="flex items-center justify-between py-4">
                <a href="<?php echo esc_url(home_url('/')); ?>" class="flex items-center gap-2 group">
                    <div class="flex flex-col">
                        <span class="text-2xl font-bold tracking-tight text-brand-dark group-hover:text-brand-main transition-colors">
                            AYANA
                        </span>
                        <span class="text-[10px] text-stone-500 uppercase tracking-widest">
                            <?php ayana_t('Innovation Green Solution', 'حلول خضراء مبتكرة'); ?>
                        </span>
                    </div>
                </a>
                
                <nav class="hidden md:flex items-center gap-8 font-medium">
                    <a href="#home" class="hover:text-brand-main transition-colors"><?php ayana_t('Home', 'الرئيسية'); ?></a>
                    <a href="#about" class="hover:text-brand-main transition-colors"><?php ayana_t('About Us', 'من نحن'); ?></a>
                    <a href="#solutions" class="hover:text-brand-main transition-colors"><?php ayana_t('Products & Solutions', 'المنتجات والحلول'); ?></a>
                    <a href="#projects" class="hover:text-brand-main transition-colors"><?php ayana_t('Projects', 'مشاريعنا'); ?></a>
                    <a href="#contact" class="hover:text-brand-main transition-colors"><?php ayana_t('Contact', 'اتصل بنا'); ?></a>
                </nav>

                <div class="flex items-center gap-4">
                    <a href="?lang=<?php echo $current_lang === 'en' ? 'ar' : 'en'; ?>" class="px-3 py-1 rounded-full bg-stone-100 hover:bg-stone-200 text-sm font-semibold transition-colors border border-stone-200">
                        <?php echo $current_lang === 'en' ? 'عربي' : 'EN'; ?>
                    </a>
                </div>
            </div>
        </div>
    </header>
