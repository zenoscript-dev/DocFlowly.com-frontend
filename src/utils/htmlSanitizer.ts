/**
 * HTML Sanitizer Utility
 * Removes potentially dangerous HTML elements and attributes
 * Prevents XSS attacks and server crashes from malicious scripts
 */

// Allowed HTML tags for rich text content
const ALLOWED_TAGS = [
  'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'strike', 'del',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li',
  'blockquote', 'pre', 'code',
  'div', 'span',
  'a', 'img',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'section', 'article', 'header', 'footer', 'main'
];

// Allowed attributes for specific tags
const ALLOWED_ATTRIBUTES: Record<string, string[]> = {
  'a': ['href', 'title', 'target'],
  'img': ['src', 'alt', 'title', 'width', 'height'],
  'div': ['class', 'id'],
  'span': ['class', 'id'],
  'p': ['class', 'id'],
  'h1': ['class', 'id'],
  'h2': ['class', 'id'],
  'h3': ['class', 'id'],
  'h4': ['class', 'id'],
  'h5': ['class', 'id'],
  'h6': ['class', 'id'],
  'ul': ['class', 'id'],
  'ol': ['class', 'id'],
  'li': ['class', 'id'],
  'table': ['class', 'id'],
  'thead': ['class', 'id'],
  'tbody': ['class', 'id'],
  'tr': ['class', 'id'],
  'th': ['class', 'id'],
  'td': ['class', 'id'],
  'section': ['class', 'id'],
  'article': ['class', 'id'],
  'header': ['class', 'id'],
  'footer': ['class', 'id'],
  'main': ['class', 'id']
};

// Dangerous tags that should be completely removed
const DANGEROUS_TAGS = [
  'script', 'iframe', 'object', 'embed', 'form', 'input', 'textarea',
  'button', 'select', 'option', 'style', 'link', 'meta', 'base',
  'applet', 'frame', 'frameset', 'noframes', 'noscript'
];

// Dangerous attributes that should be removed
const DANGEROUS_ATTRIBUTES = [
  'onload', 'onerror', 'onclick', 'onmouseover', 'onfocus', 'onblur',
  'onchange', 'onsubmit', 'onreset', 'onselect', 'onkeydown', 'onkeyup',
  'onkeypress', 'onmousedown', 'onmouseup', 'onmousemove', 'onmouseout',
  'style', 'javascript:', 'vbscript:', 'data:', 'vb:'
];

/**
 * Sanitizes HTML content by removing dangerous elements and attributes
 * @param html - The HTML string to sanitize
 * @returns Sanitized HTML string
 */
export function sanitizeHTML(html: string): string {
  if (!html || typeof html !== 'string' || html.trim().length === 0) {
    return '';
  }

  try {
    // Create a temporary DOM element to parse HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Check if parsing was successful and body exists
    if (!doc || !doc.body) {
      console.warn('Failed to parse HTML string or body is null');
      // Fallback: return the original HTML with basic cleaning
      return html.replace(/<script[^>]*>.*?<\/script>/gi, '')
                 .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
                 .replace(/javascript:/gi, '')
                 .replace(/vbscript:/gi, '')
                 .replace(/on\w+\s*=/gi, '')
                 .trim();
    }
    
    // Remove dangerous tags completely
    DANGEROUS_TAGS.forEach(tagName => {
      const elements = doc.querySelectorAll(tagName);
      elements.forEach(element => element.remove());
    });

    // Process all remaining elements
    const allElements = doc.querySelectorAll('*');
    allElements.forEach(element => {
      const tagName = element.tagName.toLowerCase();
      
      // Remove elements that are not in allowed tags
      if (!ALLOWED_TAGS.includes(tagName)) {
        element.remove();
        return;
      }

      // Remove dangerous attributes
      const attributes = Array.from(element.attributes);
      attributes.forEach(attr => {
        const attrName = attr.name.toLowerCase();
        const attrValue = attr.value.toLowerCase();
        
        // Remove dangerous attributes
        if (DANGEROUS_ATTRIBUTES.some(dangerous => 
          attrName.includes(dangerous) || attrValue.includes(dangerous)
        )) {
          element.removeAttribute(attr.name);
          return;
        }

        // Remove attributes not allowed for this tag
        const allowedAttrs = ALLOWED_ATTRIBUTES[tagName] || [];
        if (!allowedAttrs.includes(attrName)) {
          element.removeAttribute(attr.name);
        }
      });

      // Sanitize href attributes for links
      if (tagName === 'a' && element.hasAttribute('href')) {
        const href = element.getAttribute('href');
        if (href && (href.startsWith('javascript:') || href.startsWith('vbscript:') || href.startsWith('data:'))) {
          element.removeAttribute('href');
        }
      }

      // Sanitize src attributes for images
      if (tagName === 'img' && element.hasAttribute('src')) {
        const src = element.getAttribute('src');
        if (src && (src.startsWith('javascript:') || src.startsWith('vbscript:') || src.startsWith('data:'))) {
          element.removeAttribute('src');
        }
      }
    });

    // Get the sanitized HTML - handle case where body might be null
    const sanitizedHTML = doc.body ? doc.body.innerHTML : '';
    
    
    // Additional regex-based cleaning for any remaining dangerous content
    const finalHTML = sanitizedHTML
      .replace(/<script[^>]*>.*?<\/script>/gi, '') // Remove any remaining script tags
      .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '') // Remove iframe tags
      .replace(/javascript:/gi, '') // Remove javascript: protocols
      .replace(/vbscript:/gi, '') // Remove vbscript: protocols
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .replace(/style\s*=\s*["'][^"']*["']/gi, '') // Remove style attributes
      .trim();
    
    
    // If sanitization resulted in empty content, but original had content, use fallback
    if (finalHTML.length === 0 && html.length > 0) {
      console.warn('Sanitization resulted in empty content, using fallback cleaning');
      return html.replace(/<script[^>]*>.*?<\/script>/gi, '')
                 .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
                 .replace(/javascript:/gi, '')
                 .replace(/vbscript:/gi, '')
                 .replace(/on\w+\s*=/gi, '')
                 .replace(/style\s*=\s*["'][^"']*["']/gi, '')
                 .trim();
    }
    
    return finalHTML;

  } catch (error) {
    console.error('HTML sanitization error:', error);
    // Fallback: return the original HTML with basic cleaning if sanitization fails
    try {
      return html.replace(/<script[^>]*>.*?<\/script>/gi, '')
                 .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
                 .replace(/javascript:/gi, '')
                 .replace(/vbscript:/gi, '')
                 .replace(/on\w+\s*=/gi, '')
                 .replace(/style\s*=\s*["'][^"']*["']/gi, '')
                 .trim();
    } catch (fallbackError) {
      console.error('Fallback sanitization also failed:', fallbackError);
      return '';
    }
  }
}

/**
 * Validates if HTML content is safe (contains no dangerous elements)
 * @param html - The HTML string to validate
 * @returns true if safe, false if contains dangerous content
 */
export function isHTMLSafe(html: string): boolean {
  if (!html || typeof html !== 'string') {
    return true;
  }

  const lowerHTML = html.toLowerCase();
  
  // Check for dangerous tags
  const hasDangerousTags = DANGEROUS_TAGS.some(tag => 
    lowerHTML.includes(`<${tag}`) || lowerHTML.includes(`<${tag}>`)
  );
  
  // Check for dangerous attributes
  const hasDangerousAttributes = DANGEROUS_ATTRIBUTES.some(attr => 
    lowerHTML.includes(attr)
  );
  
  // Check for dangerous protocols
  const hasDangerousProtocols = /javascript:|vbscript:|data:/i.test(html);
  
  return !hasDangerousTags && !hasDangerousAttributes && !hasDangerousProtocols;
}

/**
 * Sanitizes HTML content and logs security warnings
 * @param html - The HTML string to sanitize
 * @param context - Context for logging (e.g., 'jobDescription')
 * @returns Sanitized HTML string
 */
export function sanitizeHTMLWithLogging(html: string, context: string = 'content'): string {
  if (!html || typeof html !== 'string') {
    return '';
  }

  const originalHTML = html;
  const sanitizedHTML = sanitizeHTML(html);
  
  // Log if content was modified during sanitization
  if (originalHTML !== sanitizedHTML) {
    console.warn(`Security: Sanitized potentially dangerous content in ${context}`);
    console.warn('Original length:', originalHTML.length);
    console.warn('Sanitized length:', sanitizedHTML.length);
  }
  
  return sanitizedHTML;
}
