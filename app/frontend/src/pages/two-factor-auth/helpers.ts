export function formatPhoneNumber(phoneNumber: string): string {
  if (phoneNumber.startsWith("+")) {
    phoneNumber = phoneNumber.replace(/\+|\s/g, "");
    return phoneNumber.replace(/(\d{2})(\d{2})(\d{5})(\d{4})/, "+$1 $2 $3-$4");
  } else {
    phoneNumber = phoneNumber.replace(/\D/g, "");
    return phoneNumber.replace(/(\d{2})(\d{4,5})(\d{4})/, "($1) $2-$3");
  }
}

export function censorPhoneNumber(phone: string): string {
  const countryCodeRegex = /^\+\d{2}\s?/;
  const cleanedPhone = phone.replace(countryCodeRegex, "");

  const dashIndex = cleanedPhone.lastIndexOf("-");

  if (dashIndex !== -1) {
    const numbersAfterDash = cleanedPhone
      .substring(dashIndex + 1)
      .replace(/\D/g, "");
    const numbersBeforeDash = cleanedPhone
      .substring(0, dashIndex)
      .replace(/\D/g, "");
    const censoredPart = "*".repeat(numbersBeforeDash.length);
    return `${censoredPart}-${numbersAfterDash}`;
  } else {
    return cleanedPhone;
  }
}

