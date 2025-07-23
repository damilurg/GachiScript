import { GACHI_PHRASES } from './gachi-phrases';

/**
 * Core syntax mapping from JS/TS to GachiScript
 * Maps language constructs to appropriate Gachi culture phrases
 */
export const JS_TO_GACHI_MAPPING = {
  // Variable declarations
  'const': 'tight',
  'let': 'loose', 
  'var': 'sloppy',
  
  // Types and interfaces
  'interface': 'contract',
  'type': 'flavor',
  'enum': 'menu',
  'class': 'gymClass',
  'extends': 'stretches',
  'implements': 'performs',
  'abstract': 'fantasy',
  
  // Functions and methods
  'function': 'performance',
  'async': 'steamy',
  'await': 'anticipate',
  'return': 'climax',
  'yield': 'surrender',
  'constructor': 'builder',
  'getter': 'taker',
  'setter': 'giver',
  
  // Control flow
  'if': 'whenHard',
  'else': 'whenSoft',
  'switch': 'choose',
  'case': 'position',
  'default': 'vanilla',
  'for': 'pump',
  'while': 'endure',
  'do': 'perform',
  'break': 'release',
  'continue': 'persist',
  
  // Operators
  '=': 'becomes',
  '==': 'matches',
  '===': 'deeplyMatches',
  '!=': 'differs',
  '!==': 'deeplyDiffers',
  '+': 'plus',
  '-': 'minus',
  '*': 'multiply',
  '/': 'divide',
  '%': 'remainder',
  '**': 'power',
  '++': 'increment',
  '--': 'decrement',
  '+=': 'addTo',
  '-=': 'subtractFrom',
  '*=': 'multiplyBy',
  '/=': 'divideBy',
  '%=': 'remainderBy',
  '&&': 'and',
  '||': 'or',
  '!': 'not',
  '&': 'bitwiseAnd',
  '|': 'bitwiseOr',
  '^': 'bitwiseXor',
  '~': 'bitwiseNot',
  '<<': 'leftShift',
  '>>': 'rightShift',
  '>>>': 'unsignedRightShift',
  '<': 'smaller',
  '>': 'bigger',
  '<=': 'smallerOrEqual',
  '>=': 'biggerOrEqual',
  '?': 'maybe',
  ':': 'otherwise',
  
  // Brackets and delimiters
  '{': 'openGym',
  '}': 'closeGym',
  '(': 'grab',
  ')': 'release',
  '[': 'enter',
  ']': 'exit',
  ';': 'rest',
  ',': 'next',
  '.': 'into',
  '...': 'spread',
  '=>': 'becomes',
  
  // Keywords
  'new': 'fresh',
  'delete': 'destroy',
  'typeof': 'whatKind',
  'instanceof': 'isA',
  'in': 'inside',
  'of': 'from',
  'this': 'self',
  'super': 'daddy',
  'static': 'fixed',
  'final': 'finished',
  'private': 'secret',
  'protected': 'guarded',
  'public': 'open',
  'readonly': 'watchOnly',
  
  // Exceptions and errors
  'try': 'attempt',
  'catch': 'handle',
  'finally': 'cleanup',
  'throw': 'reject',
  'error': 'pain',
  
  // Modules and imports
  'import': 'summon',
  'export': 'share',
  'from': 'via',
  'as': 'nicknamed',
  'default': 'main',
  'module': 'package',
  'require': 'demand',
  
  // Promises and async
  'Promise': 'Commitment',
  'resolve': 'fulfill',
  'reject': 'deny',
  'then': 'afterwards',
  'catch': 'rescue',
  'finally': 'regardless',
  
  // Array and object methods
  'push': 'insert',
  'pop': 'extract',
  'shift': 'pullOut',
  'unshift': 'pushIn',
  'splice': 'cut',
  'slice': 'portion',
  'concat': 'join',
  'map': 'transform',
  'filter': 'select',
  'reduce': 'compress',
  'forEach': 'eachOne',
  'find': 'locate',
  'findIndex': 'locatePosition',
  'includes': 'contains',
  'indexOf': 'positionOf',
  'join': 'combine',
  'split': 'separate',
  'reverse': 'flip',
  'sort': 'arrange',
  
  // Common types
  'string': 'rope',
  'number': 'count',
  'boolean': 'choice',
  'object': 'thing',
  'array': 'list',
  'null': 'empty',
  'undefined': 'missing',
  'void': 'nothing',
  'any': 'anything',
  'unknown': 'mystery',
  'never': 'impossible',
  
  // Common values
  'true': 'yes',
  'false': 'no',
  'NaN': 'confused',
  'Infinity': 'endless',
  
  // DOM and Web APIs (for frontend development)
  'document': 'page',
  'window': 'viewport',
  'element': 'piece',
  'addEventListener': 'listenFor',
  'removeEventListener': 'stopListening',
  'querySelector': 'findOne',
  'querySelectorAll': 'findAll',
  'getElementById': 'findById',
  'createElement': 'makeElement',
  'appendChild': 'attachChild',
  'removeChild': 'detachChild',
  'innerHTML': 'innerContent',
  'textContent': 'textOnly',
  'style': 'looks',
  'className': 'cssClass',
  'setAttribute': 'setProperty',
  'getAttribute': 'getProperty',
  'removeAttribute': 'removeProperty',
  
  // React specific
  'React': 'Gachi',
  'Component': 'Performer',
  'useState': 'holdState',
  'useEffect': 'onAction',
  'useContext': 'useBackground',
  'useReducer': 'useCompressor',
  'useMemo': 'remember',
  'useCallback': 'rememberAction',
  'useRef': 'grabRef',
  'props': 'gifts',
  'state': 'condition',
  'render': 'show',
  'componentDidMount': 'afterMount',
  'componentWillUnmount': 'beforeUnmount',
  
  // Angular specific
  '@Component': '@Performer',
  '@Injectable': '@Useful',
  '@Input': '@Receive',
  '@Output': '@Send',
  '@ViewChild': '@SeeChild',
  '@HostListener': '@ListenHost',
  'ngOnInit': 'onStart',
  'ngOnDestroy': 'onEnd',
  'ngOnChanges': 'onChange',
  'ngAfterViewInit': 'afterViewStart',
  
  // Vue specific
  'Vue': 'GachiView',
  'data': 'info',
  'computed': 'calculated',
  'methods': 'actions',
  'watch': 'observe',
  'mounted': 'attached',
  'destroyed': 'removed',
  'created': 'born',
  
  // Node.js specific
  'require': 'demand',
  'module': 'package',
  'exports': 'shares',
  'process': 'system',
  'Buffer': 'Storage',
  'fs': 'files',
  'path': 'route',
  'http': 'web',
  'https': 'secureWeb',
  'url': 'address',
  'querystring': 'params',
  
  // Testing related
  'describe': 'describeHole',
  'it': 'itMuscle',
  'test': 'probe',
  'expect': 'anticipate',
  'toBe': 'becomes',
  'toEqual': 'matches',
  'toBeNull': 'isEmpty',
  'toBeUndefined': 'isMissing',
  'toBeTruthy': 'isTight',
  'toBeFalsy': 'isLoose',
  'toContain': 'holds',
  'toThrow': 'explodes',
  'beforeEach': 'beforeEachRound',
  'afterEach': 'afterEachRound',
  'beforeAll': 'beforeShow',
  'afterAll': 'afterShow',
  
  // Common programming concepts
  'algorithm': 'routine',
  'variable': 'holder',
  'parameter': 'input',
  'argument': 'value',
  'callback': 'response',
  'promise': 'commitment',
  'iterator': 'walker',
  'generator': 'producer',
  'closure': 'capture',
  'scope': 'reach',
  'hoisting': 'lifting',
  'prototype': 'template',
  'inheritance': 'legacy',
  'polymorphism': 'flexibility',
  'encapsulation': 'wrapping',
  'abstraction': 'simplification'
} as const;

/**
 * Reverse mapping for GachiScript to JS/TS conversion
 */
export const GACHI_TO_JS_MAPPING = Object.fromEntries(
  Object.entries(JS_TO_GACHI_MAPPING).map(([js, gachi]) => [gachi, js])
) as Record<string, string>;

export type JSKeyword = keyof typeof JS_TO_GACHI_MAPPING;
export type GachiKeyword = typeof JS_TO_GACHI_MAPPING[JSKeyword];