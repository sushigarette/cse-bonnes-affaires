import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Convertit les retours à la ligne en balises HTML <br>
 * @param text - Le texte à convertir
 * @returns Le texte avec les retours à la ligne convertis en <br>
 */
export function formatTextWithLineBreaks(text: string): string {
  if (!text) return '';
  
  // Si le texte contient déjà des balises HTML, on le retourne tel quel
  if (text.includes('<') && text.includes('>')) {
    return text;
  }
  
  // Sinon, on convertit les retours à la ligne en <br>
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join('<br>');
}
