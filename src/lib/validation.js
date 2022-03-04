import { body } from 'express-validator';
import xss from 'xss';

export const users = [
  body('name')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Nafn má ekki vera tómt'),
  body('name')
    .isLength({ max: 64 })
    .withMessage('Nafn má að hámarki vera 64 stafir'),
  body('username')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Auðkenni má ekki vera tómt'),
  body('username')
    .isLength({ max: 64 })
    .withMessage('Auðkenni má að hámarki vera 64 stafi'),
  body('password')
    .isLength({ min: 1})
    .withMessage('Lykilorð má ekki vera tómt'),
  body('password')
    .isLength({ max: 64 })
    .withMessage('Lykilorð má að hámarki vera 256 stafi')
];

export const event = [
  body('name')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Nafn á viðburði má ekki vera tómt'),
  body('name')
    .isLength({ max: 64 })
    .withMessage('Nafn á viðburði má að hámarki vera 64 stafir'),
];

export const xssSanitization = [
    body('name').customSanitizer((v) => xss(v)),
    body('username').customSanitizer((v) => xss(v)),
    body('description').customSanitizer((v) => xss(v)),
    body('comment').customSanitizer((v) => xss(v)),
  ];

export const sanitization = [
    body('name').trim().escape(),
    body('username').trim().escape(),
    body('description').trim().escape(),
    body('comment').trim().escape(),
  ];
