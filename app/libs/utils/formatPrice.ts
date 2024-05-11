export function formatPrice(price: number) {
  const isWholeNumber = price % 1 === 0;

  const options: Intl.NumberFormatOptions = {
    currency: "ngn",
    style: "currency",
    minimumFractionDigits: isWholeNumber ? 0 : 2,
    maximumFractionDigits: isWholeNumber ? 0 : 2,
  };

  return new Intl.NumberFormat("en-ng", options).format(price);
}
