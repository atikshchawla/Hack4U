/**
 * Validation result interface
 */
interface ValidationResult {
  isValid: boolean;
  errors?: Record<string, string>;
  cleanedLinks: {
    githubLink?: string | null;
    figmaLink?: string | null;
    pptLink?: string | null;
    otherLinks?: string | null;
  };
}

/**
 * Validate and clean submission links
 */
export function validateSubmissionLinks(links: {
  githubLink?: string | null;
  figmaLink?: string | null;
  pptLink?: string | null;
  otherLinks?: string | null;
}): ValidationResult {
  const errors: Record<string, string> = {};
  const cleanedLinks: ValidationResult["cleanedLinks"] = {};

  // GitHub link validation
  if (links.githubLink) {
    const trimmed = links.githubLink.trim();
    if (trimmed) {
      if (!isValidUrl(trimmed)) {
        errors.githubLink = "Invalid GitHub URL";
      } else if (!trimmed.includes("github.com")) {
        errors.githubLink = "URL must be a GitHub link";
      } else {
        cleanedLinks.githubLink = trimmed;
      }
    } else {
      cleanedLinks.githubLink = null;
    }
  } else {
    cleanedLinks.githubLink = null;
  }

  // Figma link validation
  if (links.figmaLink) {
    const trimmed = links.figmaLink.trim();
    if (trimmed) {
      if (!isValidUrl(trimmed)) {
        errors.figmaLink = "Invalid Figma URL";
      } else if (!trimmed.includes("figma.com")) {
        errors.figmaLink = "URL must be a Figma link";
      } else {
        cleanedLinks.figmaLink = trimmed;
      }
    } else {
      cleanedLinks.figmaLink = null;
    }
  } else {
    cleanedLinks.figmaLink = null;
  }

  // PPT link validation (Google Slides, PowerPoint Online, etc.)
  if (links.pptLink) {
    const trimmed = links.pptLink.trim();
    if (trimmed) {
      if (!isValidUrl(trimmed)) {
        errors.pptLink = "Invalid presentation URL";
      } else {
        cleanedLinks.pptLink = trimmed;
      }
    } else {
      cleanedLinks.pptLink = null;
    }
  } else {
    cleanedLinks.pptLink = null;
  }

  // Other links validation
  if (links.otherLinks) {
    const trimmed = links.otherLinks.trim();
    if (trimmed) {
      // Allow multiple URLs separated by newlines or commas
      const urls = trimmed.split(/[\n,]+/).map((url) => url.trim()).filter(Boolean);
      const invalidUrls = urls.filter((url) => !isValidUrl(url));
      
      if (invalidUrls.length > 0) {
        errors.otherLinks = `Invalid URLs: ${invalidUrls.join(", ")}`;
      } else {
        cleanedLinks.otherLinks = urls.join("\n");
      }
    } else {
      cleanedLinks.otherLinks = null;
    }
  } else {
    cleanedLinks.otherLinks = null;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors: Object.keys(errors).length > 0 ? errors : undefined,
    cleanedLinks,
  };
}

/**
 * Check if a string is a valid URL
 */
function isValidUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate VIT email domain
 */
export function isVITEmail(email: string): boolean {
  return email.toLowerCase().endsWith("@vitstudent.ac.in");
}
