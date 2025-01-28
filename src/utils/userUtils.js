export function getNameFromEmail(email) {
  const emailMap = {
    'claytonmalott@gmail.com': 'Clay',
    'finn@pivot.net': 'Finn',
    'ryder@pivot.net': 'Ryder'
  };
  return emailMap[email] || 'Open Task';
} 