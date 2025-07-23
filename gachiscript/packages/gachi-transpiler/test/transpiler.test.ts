import { GachiTranspiler, TranspilerOptions } from '../src/transpiler';

describe('GachiTranspiler', () => {
  let transpiler: GachiTranspiler;

  beforeEach(() => {
    transpiler = new GachiTranspiler();
  });

  describe('Basic JS to Gachi transformation', () => {
    test('should transform simple function declaration', () => {
      const input = `function greet(name) {
  return "Hello " + name;
}`;
      
      const result = transpiler.jsToGachi(input);
      
      expect(result.code).toContain('performance greet');
      expect(result.code).toContain('climax');
      expect(result.diagnostics.length).toBe(0);
    });

    test('should transform variable declarations', () => {
      const input = `const name = "Billy";
let age = 25;
var location = "Gym";`;
      
      const result = transpiler.jsToGachi(input);
      
      expect(result.code).toContain('tight name');
      expect(result.code).toContain('loose age');
      expect(result.code).toContain('sloppy location');
    });

    test('should transform control flow statements', () => {
      const input = `if (condition) {
  console.log("true");
} else {
  console.log("false");
}`;
      
      const result = transpiler.jsToGachi(input);
      
      expect(result.code).toContain('whenHard');
      expect(result.code).toContain('whenSoft');
      expect(result.code).toContain('openGym');
      expect(result.code).toContain('closeGym');
    });

    test('should transform operators', () => {
      const input = `if (a === b && c !== d) {
  return true;
}`;
      
      const result = transpiler.jsToGachi(input);
      
      expect(result.code).toContain('deeplyMatches');
      expect(result.code).toContain('and');
      expect(result.code).toContain('deeplyDiffers');
    });

    test('should transform arrow functions', () => {
      const input = `const add = (a, b) => a + b;`;
      
      const result = transpiler.jsToGachi(input);
      
      expect(result.code).toContain('tight');
      expect(result.code).toContain('becomes');
    });
  });

  describe('TypeScript specific transformations', () => {
    test('should transform interfaces', () => {
      const input = `interface User {
  name: string;
  age: number;
}`;
      
      const result = transpiler.jsToGachi(input);
      
      expect(result.code).toContain('contract User');
      expect(result.code).toContain('rope');
      expect(result.code).toContain('count');
    });

    test('should transform type aliases', () => {
      const input = `type Status = "active" | "inactive";`;
      
      const result = transpiler.jsToGachi(input);
      
      expect(result.code).toContain('flavor Status');
    });

    test('should transform class declarations', () => {
      const input = `class Athlete extends Person {
  private name: string;
  
  constructor(name: string) {
    super();
    this.name = name;
  }
  
  public train(): void {
    console.log("Training hard!");
  }
}`;
      
      const result = transpiler.jsToGachi(input);
      
      expect(result.code).toContain('gymClass Athlete stretches Person');
      expect(result.code).toContain('secret name');
      expect(result.code).toContain('builder');
      expect(result.code).toContain('daddy');
      expect(result.code).toContain('self');
      expect(result.code).toContain('open train');
      expect(result.code).toContain('nothing');
    });
  });

  describe('Framework-specific transformations', () => {
    test('should transform React components', () => {
      const reactTranspiler = new GachiTranspiler({ framework: 'react' });
      
      const input = `import React, { useState, useEffect } from 'react';

function MyComponent(props) {
  const [state, setState] = useState(0);
  
  useEffect(() => {
    console.log('Component mounted');
  }, []);
  
  return <div>{props.children}</div>;
}`;
      
      const result = reactTranspiler.jsToGachi(input);
      
      expect(result.code).toContain('summon Gachi');
      expect(result.code).toContain('holdState');
      expect(result.code).toContain('onAction');
      expect(result.code).toContain('performance MyPerformer');
      expect(result.code).toContain('gifts');
    });

    test('should transform Angular components', () => {
      const angularTranspiler = new GachiTranspiler({ framework: 'angular' });
      
      const input = `@Component({
  selector: 'app-hero',
  template: '<h1>{{title}}</h1>'
})
export class HeroComponent implements OnInit {
  @Input() title: string;
  
  ngOnInit() {
    console.log('Component initialized');
  }
}`;
      
      const result = angularTranspiler.jsToGachi(input);
      
      expect(result.code).toContain('@Performer');
      expect(result.code).toContain('share gymClass HeroPerformer performs OnStart');
      expect(result.code).toContain('@Receive title');
      expect(result.code).toContain('onStart');
    });

    test('should transform Vue components', () => {
      const vueTranspiler = new GachiTranspiler({ framework: 'vue' });
      
      const input = `export default {
  data() {
    return {
      message: 'Hello Vue!'
    };
  },
  computed: {
    reversedMessage() {
      return this.message.split('').reverse().join('');
    }
  },
  methods: {
    greet() {
      alert('Hello!');
    }
  }
}`;
      
      const result = vueTranspiler.jsToGachi(input);
      
      expect(result.code).toContain('info');
      expect(result.code).toContain('calculated');
      expect(result.code).toContain('actions');
      expect(result.code).toContain('self');
    });
  });

  describe('Gachi to JS transformation', () => {
    test('should reverse transform simple function', () => {
      const gachiInput = `performance greet(name) openGym
  climax "Hello " plus name;
closeGym`;
      
      const result = transpiler.gachiToJs(gachiInput);
      
      expect(result.code).toContain('function greet');
      expect(result.code).toContain('return');
      expect(result.code).toContain('{');
      expect(result.code).toContain('}');
      expect(result.code).toContain('+');
    });

    test('should reverse transform variable declarations', () => {
      const gachiInput = `tight name becomes "Billy";
loose age becomes 25;
sloppy location becomes "Gym";`;
      
      const result = transpiler.gachiToJs(gachiInput);
      
      expect(result.code).toContain('const name =');
      expect(result.code).toContain('let age =');
      expect(result.code).toContain('var location =');
    });

    test('should reverse transform control flow', () => {
      const gachiInput = `whenHard condition openGym
  console.log("true");
closeGym whenSoft openGym
  console.log("false");
closeGym`;
      
      const result = transpiler.gachiToJs(gachiInput);
      
      expect(result.code).toContain('if (condition) {');
      expect(result.code).toContain('} else {');
    });
  });

  describe('Bidirectional transformation integrity', () => {
    test('should maintain integrity through round-trip transformation', () => {
      const originalCode = `function calculateSum(a: number, b: number): number {
  if (a > 0 && b > 0) {
    return a + b;
  } else {
    return 0;
  }
}

const result = calculateSum(5, 10);
console.log(result);`;

      // JS → Gachi → JS
      const gachiResult = transpiler.jsToGachi(originalCode);
      const backToJsResult = transpiler.gachiToJs(gachiResult.code);
      
      // Should contain the same semantic elements
      expect(backToJsResult.code).toContain('function calculateSum');
      expect(backToJsResult.code).toContain('if (');
      expect(backToJsResult.code).toContain('return');
      expect(backToJsResult.code).toContain('const result');
    });
  });

  describe('Error handling', () => {
    test('should handle malformed JavaScript gracefully', () => {
      const malformedInput = `function ( {
  return "incomplete`;
      
      const result = transpiler.jsToGachi(malformedInput);
      
      // Should still attempt to process what it can
      expect(result.code).toBeDefined();
      expect(result.diagnostics.length).toBeGreaterThan(0);
    });

    test('should provide helpful diagnostics', () => {
      const input = `function test() {
  // This will cause a transformation warning
  unknownKeyword();
}`;
      
      const result = transpiler.jsToGachi(input);
      
      expect(result.diagnostics).toBeDefined();
      expect(Array.isArray(result.diagnostics)).toBe(true);
    });
  });

  describe('Options and configuration', () => {
    test('should respect framework option', () => {
      const reactTranspiler = new GachiTranspiler({ framework: 'react' });
      const angularTranspiler = new GachiTranspiler({ framework: 'angular' });
      
      expect(reactTranspiler.getOptions().framework).toBe('react');
      expect(angularTranspiler.getOptions().framework).toBe('angular');
    });

    test('should allow updating options', () => {
      transpiler.setOptions({ framework: 'vue', strict: true });
      
      const options = transpiler.getOptions();
      expect(options.framework).toBe('vue');
      expect(options.strict).toBe(true);
    });
  });

  describe('Special syntax handling', () => {
    test('should handle async/await', () => {
      const input = `async function fetchData() {
  const response = await fetch('/api/data');
  return response.json();
}`;
      
      const result = transpiler.jsToGachi(input);
      
      expect(result.code).toContain('steamy performance');
      expect(result.code).toContain('anticipate');
    });

    test('should handle promises', () => {
      const input = `const promise = new Promise((resolve, reject) => {
  setTimeout(() => resolve('Done'), 1000);
})
.then(result => console.log(result))
.catch(error => console.error(error))
.finally(() => console.log('Cleanup'));`;
      
      const result = transpiler.jsToGachi(input);
      
      expect(result.code).toContain('Commitment');
      expect(result.code).toContain('fulfill');
      expect(result.code).toContain('deny');
      expect(result.code).toContain('afterwards');
      expect(result.code).toContain('rescue');
      expect(result.code).toContain('regardless');
    });

    test('should handle array methods', () => {
      const input = `const numbers = [1, 2, 3, 4, 5];
const doubled = numbers
  .map(x => x * 2)
  .filter(x => x > 5)
  .reduce((sum, x) => sum + x, 0);`;
      
      const result = transpiler.jsToGachi(input);
      
      expect(result.code).toContain('transform');
      expect(result.code).toContain('select');
      expect(result.code).toContain('compress');
    });

    test('should handle destructuring', () => {
      const input = `const { name, age } = user;
const [first, second, ...rest] = items;`;
      
      const result = transpiler.jsToGachi(input);
      
      expect(result.code).toContain('tight');
      expect(result.code).toContain('spread');
    });
  });

  describe('Comments and formatting preservation', () => {
    test('should preserve comments when option is enabled', () => {
      const transpilerWithComments = new GachiTranspiler({ preserveComments: true });
      
      const input = `// This is a comment
function test() {
  /* Block comment */
  return "value";
}`;
      
      const result = transpilerWithComments.jsToGachi(input);
      
      // Comments should be preserved
      expect(result.code).toContain('// This is a comment');
      expect(result.code).toContain('/* Block comment */');
    });
  });
});