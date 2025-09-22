import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formate le texte pour un affichage correct des retours à la ligne et paragraphes
 * @param text - Le texte à convertir
 * @returns Le texte formaté avec les retours à la ligne et paragraphes corrects
 */
export function formatTextWithLineBreaks(text: string): string {
  if (!text) return '';
  
  // Si le texte contient déjà des balises HTML (éditeur riche), on le retourne tel quel
  if (text.includes('<') && text.includes('>')) {
    return text;
  }
  
  // Sinon, on convertit les retours à la ligne en paragraphes HTML avec des styles
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map(line => `<p style="margin-bottom: 1rem; line-height: 1.6;">${line}</p>`)
    .join('');
}
