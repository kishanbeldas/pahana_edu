export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

export const USER_ROLES = {
  ADMIN: 'ADMIN',
  USER: 'USER'
};

export const BILL_STATUS = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  OVERDUE: 'OVERDUE'
};

export const ITEM_CATEGORIES = [
  'Books',
  'Stationery',
  'Electronics',
  'Accessories',
  'Software',
  'Other'
];

export const CURRENCY_SYMBOL = 'Rs.';

export const DATE_FORMAT = 'YYYY-MM-DD';

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 25, 50]
};

export const VALIDATION_RULES = {
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 50
  },
  PASSWORD: {
    MIN_LENGTH: 6,
    MAX_LENGTH: 100
  },
  CUSTOMER_NAME: {
    MAX_LENGTH: 100
  },
  ITEM_NAME: {
    MAX_LENGTH: 100
  },
  PHONE: {
    PATTERN: /^[+]?[\d\s\-()]{10,15}$/
  },
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  }
};
