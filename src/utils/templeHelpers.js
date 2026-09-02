// Helper function to format temple filter labels with location distinction
export const getTempleFilterLabel = (temple, lang) => {
  if (!temple) return '';
  if (lang === 'te') {
    return temple.teluguName || temple.nameTe || temple.name;
  }

  const shortLocations = {
    'tirumala-main': 'Tirumala',
    'tiruchanur': 'Tiruchanur',
    'govindaraja': 'Tirupati',
    'kapileswara': 'Kapila Theertham',
    'srinivasa-mangapuram': 'Srinivasa Mangapuram',
    'narayanavanam': 'Narayanavanam',
    'kodandarama': 'Tirupati',
    'appalayagunta': 'Appalayagunta',
  };

  const shortLoc = shortLocations[temple.id] || (temple.location ? temple.location.split('(')[0].split(',')[0].trim() : '');

  let baseName = temple.name;
  if (temple.id === 'kapileswara') baseName = 'Sri Kapileswara Swamy Temple';
  if (temple.id === 'appalayagunta') baseName = 'Sri Prasanna Venkateswara Swamy Temple';

  return shortLoc ? `${baseName} — ${shortLoc}` : baseName;
};
