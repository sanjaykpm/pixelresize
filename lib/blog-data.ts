export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  author: string;
  authorBio: string;
  featured: boolean;
  content: string[];
};

export const BLOG_CATEGORIES = [
  'All',
  'Guides',
  'Tutorials',
  'Web Performance',
  'Technology',
  'Design',
];

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'png-vs-jpeg-vs-webp',
    title: 'PNG vs JPEG vs WEBP: Which Format Should You Use?',
    excerpt: 'A practical guide to choosing the right image format for your needs, with real-world examples and file size comparisons.',
    date: '2025-01-15',
    readTime: '8 min',
    category: 'Guides',
    tags: ['png', 'jpeg', 'webp', 'image formats', 'optimization'],
    author: 'Sarah Chen',
    authorBio: 'Frontend engineer and image optimization specialist with 10 years of experience building performant web applications.',
    featured: true,
    content: [
      'Choosing the right image format can dramatically affect your website performance, file sizes, and visual quality. In this guide, we break down the three most popular formats and when to use each.',
      'PNG (Portable Network Graphics) is a lossless format that supports transparency. It is ideal for logos, icons, screenshots, and any image with sharp edges or text. The downside is larger file sizes compared to compressed formats.',
      'JPEG (Joint Photographic Experts Group) is a lossy format best suited for photographs and complex images with many colors. It does not support transparency, but achieves much smaller file sizes than PNG.',
      'WEBP is a modern format developed by Google that supports both lossy and lossless compression, plus transparency. It typically produces files 25-35% smaller than equivalent JPEGs or PNGs. It is now supported by all modern browsers.',
      'As a general rule: use PNG for graphics with transparency, JPEG for photographs, and WEBP when you want the best of both worlds with smaller file sizes.',
      'AVIF is the newest format, offering even better compression than WEBP. However, browser support is still catching up. For maximum compatibility, provide WEBP as your primary format with JPEG or PNG fallbacks.',
    ],
  },
  {
    slug: 'how-to-compress-images-without-losing-quality',
    title: 'How to Compress Images Without Losing Quality',
    excerpt: 'Learn the techniques behind lossless and lossy compression, and how to find the perfect balance between file size and quality.',
    date: '2025-01-10',
    readTime: '6 min',
    category: 'Tutorials',
    tags: ['compression', 'optimization', 'file size', 'quality'],
    author: 'Marcus Webb',
    authorBio: 'E-commerce developer focused on performance optimization and Core Web Vitals.',
    featured: true,
    content: [
      'Image compression is one of the most effective ways to improve website performance. A typical web page can be 60% smaller just by optimizing images.',
      'Lossless compression reduces file size without removing any data. The image looks exactly the same as the original. PNG uses lossless compression, making it ideal for graphics that need pixel-perfect quality.',
      'Lossy compression achieves much smaller file sizes by discarding data that the human eye is less likely to notice. JPEG and WEBP use lossy compression. The key is finding the right quality level.',
      'For most photographs, a quality setting of 75-85% produces visually identical results to the original while reducing file size by 50-70%. Going below 70% starts to introduce visible artifacts.',
      'When compressing, always check the result at 100% zoom. Compression artifacts are most visible in areas with smooth gradients, like skies or skin tones.',
      'PixelResize lets you adjust compression quality with a live preview, so you can find the perfect balance for each image without guessing.',
    ],
  },
  {
    slug: 'image-resize-best-practices',
    title: 'Image Resize Best Practices for the Web',
    excerpt: 'Optimize your images for the web with these resizing best practices that improve load times and Core Web Vitals.',
    date: '2025-01-05',
    readTime: '5 min',
    category: 'Web Performance',
    tags: ['resize', 'web performance', 'core web vitals', 'optimization'],
    author: 'Priya Sharma',
    authorBio: 'Performance engineer and web vitals advocate.',
    featured: false,
    content: [
      'Resizing images to the correct dimensions is the single most impactful optimization you can make. Serving a 4000px wide image when your layout only needs 800px wastes bandwidth and slows down your page.',
      'The golden rule: never serve an image larger than its display size. If your content area is 800px wide on desktop, your images should be at most 1600px wide (for 2x retina displays).',
      'For responsive websites, use the srcset attribute to serve different image sizes at different breakpoints. This ensures mobile users get smaller images while desktop users get full quality.',
      'When resizing, always maintain the aspect ratio to avoid distortion. PixelResize locks the aspect ratio by default, so you can change width or height without stretching the image.',
      'For thumbnails and small UI elements, resize to the exact display size. For larger hero images, consider using 1.5x or 2x the display size for sharpness on high-DPI screens.',
    ],
  },
  {
    slug: 'understanding-aspect-ratios',
    title: 'Understanding Aspect Ratios for Social Media',
    excerpt: 'A complete reference for the correct aspect ratios across Instagram, YouTube, LinkedIn, Facebook, and more.',
    date: '2024-12-28',
    readTime: '7 min',
    category: 'Guides',
    tags: ['aspect ratio', 'social media', 'instagram', 'youtube'],
    author: 'Sarah Chen',
    authorBio: 'Frontend engineer and image optimization specialist with 10 years of experience building performant web applications.',
    featured: false,
    content: [
      'Every social media platform has specific aspect ratio requirements. Using the wrong ratio can result in cropped, stretched, or poorly displayed images.',
      'Instagram supports several ratios: 1:1 for square posts (1080×1080), 4:5 for portrait posts (1080×1350), and 9:16 for stories and reels (1080×1920).',
      'YouTube thumbnails should be 16:9 (1280×720). YouTube Shorts use 9:16 (1080×1920). Using the correct ratio ensures your thumbnail fills the player without black bars.',
      'LinkedIn banner images should be 1584×396 (4:1), while LinkedIn post images work best at 1200×627 (1.91:1).',
      'Facebook cover photos are 820×312, but display differently on mobile. Facebook posts work well at 1200×630.',
      'PixelResize includes built-in presets for all these platforms, so you can crop and resize to the exact dimensions each platform requires.',
    ],
  },
  {
    slug: 'why-browser-based-image-processing',
    title: 'Why Browser-Based Image Processing Is the Future',
    excerpt: 'Discover the privacy, speed, and cost benefits of processing images locally in the browser versus server-side.',
    date: '2024-12-20',
    readTime: '4 min',
    category: 'Technology',
    tags: ['browser', 'privacy', 'canvas api', 'client-side'],
    author: 'Marcus Webb',
    authorBio: 'E-commerce developer focused on performance optimization and Core Web Vitals.',
    featured: false,
    content: [
      'Traditional image processing tools upload your images to a server, process them, and send the result back. This approach has three major problems: privacy concerns, upload/download time, and server costs.',
      'Browser-based processing using the Canvas API solves all three. Your images never leave your device, processing is instant (no network round-trip), and there are no server costs to pass on to users.',
      'The Canvas API provides powerful image manipulation capabilities: resize, crop, rotate, flip, filter, and export to multiple formats. Modern browsers handle even large images with ease.',
      'Privacy is the biggest advantage. When you upload a photo to a server, you lose control over it. Browser-based tools like PixelResize ensure your personal photos stay personal.',
      'Speed is the second advantage. Without upload time, processing starts instantly. A 10MB image that would take 30 seconds to upload processes in milliseconds locally.',
    ],
  },
  {
    slug: 'watermarking-images-for-copyright-protection',
    title: 'Watermarking Images for Copyright Protection',
    excerpt: 'How to add effective watermarks to your images to protect your intellectual property online.',
    date: '2024-12-15',
    readTime: '5 min',
    category: 'Tutorials',
    tags: ['watermark', 'copyright', 'protection', 'branding'],
    author: 'Priya Sharma',
    authorBio: 'Performance engineer and web vitals advocate.',
    featured: false,
    content: [
      'Watermarking is the process of adding a visible mark to an image to identify its owner and discourage unauthorized use. It is essential for photographers, designers, and content creators.',
      'A good watermark should be visible enough to deter theft but not so prominent that it ruins the viewing experience. Opacity between 30-60% is usually the sweet spot.',
      'Text watermarks are the most common. Use your name, brand, or website URL. Choose a font size that is readable but not overwhelming, and position it in a corner or across the center.',
      'Image watermarks (logos) look more professional but require a PNG with transparency. Position your logo in a corner with adequate padding from the edges.',
      'For maximum protection, consider a diagonal watermark across the center of the image. This is harder to crop out than a corner watermark.',
      'PixelResize supports both text and image watermarks with full control over opacity, rotation, position, and scale.',
    ],
  },
];
