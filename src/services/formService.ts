interface FormData {
  name: string;
  email: string;
  message: string;
  reason: string;
}

export const submitToGoogleForm = async (data: FormData) => {
  try {
    // Your Google Form URL
    const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSeH8JhWP41FW02JcISWoFPEBEprApYkdWxuuUYzqel-WvbgUQ/formResponse';
    
    // Map your form fields to Google Form fields
    const formData = new URLSearchParams({
      'entry.1842879221': data.name,     // Full Name
      'entry.534710258': data.email,     // Email Address
      'entry.1686697088': data.message,  // Message
      'entry.1658962561': data.reason    // Reason for Contact
    });

    const response = await fetch(GOOGLE_FORM_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData
    });

    return true;
  } catch (error) {
    console.error('Form submission error:', error);
    return false;
  }
}