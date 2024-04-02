export const mockParsedXmlRecords = [
  {
    $: {reference: '167188'},
    accountNumber: ['NL90ABNA0585647886'],
    description: ['Flowers for Richard Bakker'],
    startBalance: ['94.9'],
    mutation: ['+14.63'],
    endBalance: ['109.53'],
  },
  {
    $: {reference: '131254'},
    accountNumber: ['NL93ABNA0585619023'],
    description: ['Candy from Vincent de Vries'],
    startBalance: ['5429'],
    mutation: ['-939'],
    endBalance: ['6368'],
  },
  {
    $: {reference: '101339'},
    accountNumber: ['NL27SNSB0917829871'],
    description: ['Tickets from Rik King'],
    startBalance: ['84.46'],
    mutation: ['+40.45'],
    endBalance: ['124.91'],
  },
  {
    $: {reference: '119582'},
    accountNumber: ['NL32RABO0195610843'],
    description: ['Subscription from Vincent de Vries'],
    startBalance: ['38.86'],
    mutation: ['+28.77'],
    endBalance: ['67.63'],
  },
  {
    $: {reference: '180148'},
    accountNumber: ['NL32RABO0195610843'],
    description: ['Candy for Rik de Vries'],
    startBalance: ['51.01'],
    mutation: ['-25.59'],
    endBalance: ['25.42'],
  },
  {
    $: {reference: '152977'},
    accountNumber: ['NL69ABNA0433647324'],
    description: ['Flowers from Richard Bakker'],
    startBalance: ['62.17'],
    mutation: ['+20.55'],
    endBalance: ['82.72'],
  },
  {
    $: {reference: '167188'},
    accountNumber: ['NL91RABO0315273637'],
    description: ['Subscription for Jan Theuß'],
    startBalance: ['10.1'],
    mutation: ['-0.3'],
    endBalance: ['9.8'],
  },
  {
    $: {reference: '167188'},
    accountNumber: ['NL43AEGO0773393871'],
    description: ['Clothes from Rik Theuß'],
    startBalance: ['21.54'],
    mutation: ['-17.57'],
    endBalance: ['3.97'],
  },
  {
    $: {reference: '192480'},
    accountNumber: ['NL43AEGO0773393871'],
    description: ['Subscription for Erik de Vries'],
    startBalance: ['3980'],
    mutation: ['+1000'],
    endBalance: ['4981'],
  },
  {
    $: {reference: '154771'},
    accountNumber: ['NL90ABNA0585647886'],
    description: ['Flowers for Jan Theuß'],
    startBalance: ['75.39'],
    mutation: ['-32.75'],
    endBalance: ['45.64'],
  },
];

export const mockParsedCsvRecords = [
  [
    '183398',
    'NL56RABO0149876948',
    'Clothes from Richard de Vries',
    '33.34',
    '+5.55',
    '38.89',
  ],
  [
    '112806',
    'NL27SNSB0917829871',
    'Subscription from Jan Dekker',
    '28.95',
    '-19.44',
    '9.51',
  ],
  [
    '110784',
    'NL93ABNA0585619023',
    'Subscription from Richard Bakker',
    '13.89',
    '-46.18',
    '-32.29',
  ],
  [
    '137758',
    'NL93ABNA0585619023',
    'Tickets for Dani�l King',
    '97.56',
    '+46.41',
    '143.97',
  ],
  [
    '112806',
    'NL43AEGO0773393871',
    'Subscription from Dani�l Theu�',
    '102.33',
    '+11.49',
    '113.82',
  ],
  [
    '112806',
    'NL74ABNA0248990274',
    'Subscription for Rik Dekker',
    '48.2',
    '-4.25',
    '43.95',
  ],
  [
    '118757',
    'NL32RABO0195610843',
    'Candy for Willem King',
    '98.99',
    '-7.85',
    '91.14',
  ],
  [
    '146294',
    'NL90ABNA0585647886',
    'Tickets for Vincent Dekker',
    '13.62',
    '-15.08',
    '-1.46',
  ],
  [
    '128470',
    'NL91RABO0315273637',
    'Tickets for Erik Dekker',
    '53.31',
    '-15.85',
    '37.46',
  ],
  [
    '141007',
    'NL32RABO0195610843',
    'Tickets for Richard de Vries',
    '66.35',
    '+44.27',
    '110.62',
  ],
];

export const mockFailedCsvRecrods = [
  ['112806', 'Subscription from Jan Dekker', 'Duplicate reference'],
  ['112806', 'Subscription from Dani�l Theu�', 'Duplicate reference'],
  ['112806', 'Subscription for Rik Dekker', 'Duplicate reference'],
];

export const mockFailedXmlRecrods = [
  ['131254', 'Candy from Vincent de Vries', 'End balance validation failed'],
  ['167188', 'Flowers for Richard Bakker', 'Duplicate reference'],
  ['167188', 'Subscription for Jan Theuß', 'Duplicate reference'],
  ['167188', 'Clothes from Rik Theuß', 'Duplicate reference'],
  ['192480', 'Subscription for Erik de Vries', 'End balance validation failed'],
  ['154771', 'Flowers for Jan Theuß', 'End balance validation failed'],
];

export const mockParsedInvalidXmlRecords = [
  {
    $: {reference: '131254'},
    accountNumber: ['NL90ABNA0585647886'],
    description: ['Flowers for Richard Bakker'],
    startBalance: ['94.9'],
    mutation: ['+14.63'],
    endBalance: ['129.53'],
  },
  {
    $: {reference: '131254'},
    accountNumber: ['NL93ABNA0585619023'],
    description: ['Candy from Vincent de Vries'],
    startBalance: ['5429'],
    mutation: ['-939'],
    endBalance: ['6368'],
  },
];

export const mockFailedInvalidXmlRecords = [
  ['131254', 'Flowers for Richard Bakker', 'End balance validation failed'],
  ['131254', 'Candy from Vincent de Vries', 'End balance validation failed'],
];

export const mockParsedInvalidCsvRecords = [
  [
    '183398',
    'NL56RABO0149876948',
    'Clothes from Richard de Vries',
    '33.34',
    '+5.55',
    '21.89',
  ],
  [
    '183398',
    'NL27SNSB0917829871',
    'Subscription from Jan Dekker',
    '28.95',
    '-19.44',
    '21.51',
  ],
];

export const mockFailedInvalidCsvRecords = [
  ['183398', 'Clothes from Richard de Vries', 'End balance validation failed'],
  ['183398', 'Subscription from Jan Dekker', 'End balance validation failed'],
];
