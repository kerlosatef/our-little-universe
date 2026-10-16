<?php
// Theme Setup
function ayana_theme_setup() {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
}
add_action('after_setup_theme', 'ayana_theme_setup');

// Enqueue styles and scripts
function ayana_enqueue_scripts() {
    // Tailwind CSS via CDN
    wp_enqueue_script('tailwindcss-cdn', 'https://cdn.tailwindcss.com', array(), '3.4.0', false);

    // Google Fonts (Cairo for Arabic, Inter for English)
    wp_enqueue_style('ayana-google-fonts', 'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&family=Inter:wght@400;500;600;700&display=swap', false);

    // Main Theme stylesheet (style.css)
    wp_enqueue_style('ayana-style', get_stylesheet_uri(), array(), wp_get_theme()->get('Version'));
}
add_action('wp_enqueue_scripts', 'ayana_enqueue_scripts');

function ayana_add_tailwind_config() {
    // Inject Tailwind Configuration in the head
    ?>
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              brand: {
                main: '#54b032',
                light: '#7ed957',
                dark: '#3a7d22',
              },
              stone: {
                950: '#1c1917',
                900: '#292524',
                100: '#f5f5f4',
                50: '#fafaf9',
              }
            },
            fontFamily: {
              sans: ['Inter', 'sans-serif'],
              arabic: ['Cairo', 'sans-serif'],
            }
          }
        }
      }
    </script>
    <style>
      :root {
         scroll-behavior: smooth;
      }
      html[dir="rtl"] {
          font-family: 'Cairo', sans-serif;
      }
      html[dir="ltr"] {
          font-family: 'Inter', sans-serif;
      }
    </style>
    <?php
}
add_action('wp_head', 'ayana_add_tailwind_config', 20);

function ayana_get_lang() {
    return isset($_GET['lang']) && $_GET['lang'] === 'ar' ? 'ar' : 'en';
}

function ayana_t($en_str, $ar_str) {
    echo ayana_get_lang() === 'ar' ? $ar_str : $en_str;
}
