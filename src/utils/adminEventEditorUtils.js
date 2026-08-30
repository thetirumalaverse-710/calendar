export const getTodayIST = () =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());

export const getInitialImages = (evt) => {
  if (
    evt &&
    evt.images &&
    Array.isArray(evt.images) &&
    evt.images.length > 0
  ) {
    const mapped = evt.images
      .map(img =>
        typeof img === 'string'
          ? { url: img, caption: '' }
          : {
              url: img?.url || '',
              caption: img?.caption || ''
            }
      )
      .filter(img => img.url && img.url.trim() !== '');

    if (mapped.length > 0) {
      return mapped;
    }
  }

  if (evt && evt.imageUrl) {
    return [
      {
        url: evt.imageUrl,
        caption: evt.title || ''
      }
    ];
  }

  return [{ url: '', caption: '' }];
};

export const getEmptyEventForm = () => ({
  title: '',
  titleTe: '',
  templeId: 'tirumala-main',
  startDate: getTodayIST(),
  endDate: getTodayIST(),
  category: 'brahmotsavam',
  vahanam: '',
  description: '',
  descriptionTe: '',
  imageUrl: '',
  images: [{ url: '', caption: '' }]
});
