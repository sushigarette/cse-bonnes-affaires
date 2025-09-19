// Utilitaire pour formater les pourcentages de réduction
// Ajoute automatiquement le "-" et le "%" si nécessaire

export const formatDiscount = (discount: string): string => {
  if (!discount) return discount;
  
  let formattedDiscount = discount.trim();
  
  // Si le discount commence par un "+", on le garde tel quel
  if (formattedDiscount.startsWith('+')) {
    // Vérifier si le % est déjà présent
    if (!formattedDiscount.endsWith('%')) {
      formattedDiscount += '%';
    }
    return formattedDiscount;
  }
  
  // Si le discount ne commence pas par "-" ou "+", on ajoute "-"
  if (!formattedDiscount.startsWith('-') && !formattedDiscount.startsWith('+')) {
    formattedDiscount = `-${formattedDiscount}`;
  }
  
  // Ajouter le % à la fin si ce n'est pas déjà présent
  if (!formattedDiscount.endsWith('%')) {
    formattedDiscount += '%';
  }
  
  return formattedDiscount;
};
