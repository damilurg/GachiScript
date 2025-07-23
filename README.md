# 🔥 GachiScript Platform 🔥

**RIGHT VERSION!** - The ultimate TypeScript/JavaScript syntactic overlay inspired by Billy Herrington and Gachi culture.

```gachi
// DEEP DARK FANTASY
tight dungeonMaster = fresh DungeonMaster();
dungeonMaster.capture('Billy').then(prisoner => {
  logger.log('RIGHT VERSION! CAPTURED!');
});
```

## 🏰 What is GachiScript?

GachiScript is a complete platform that transforms your regular TypeScript/JavaScript into the legendary language of the leather club. It's not just a meme - it's a fully functional development ecosystem with:

- 🔥 **Complete syntax transformation** (JS/TS ↔ GachiScript)
- 🏰 **Full IDE support** with VSCode extension
- 💪 **Testing framework** (GachiTest - Jest wrapper)
- ⚛️ **Framework integration** (React, Angular, Vue)
- 🎭 **Build tools and CLI**

## 📦 Platform Components

### 1. 📖 Gachi Dictionary (`@gachiscript/dictionary`)
The core syntax mapping engine that transforms between JavaScript and GachiScript.

```bash
npm install @gachiscript/dictionary
```

```typescript
import { gachiTransformer } from '@gachiscript/dictionary';

// Transform JS to GachiScript
gachiTransformer.jsToGachi('const name = "Billy"'); 
// → 'tight name = "Billy"'

// Transform back to JS
gachiTransformer.gachiToJs('tight name = "Billy"'); 
// → 'const name = "Billy"'
```

### 2. 🔄 Gachi Transpiler (`@gachiscript/transpiler`)
Advanced AST-based transpiler with framework support.

```bash
npm install @gachiscript/transpiler
```

```typescript
import { gachiTranspiler } from '@gachiscript/transpiler';

const result = gachiTranspiler.jsToGachi(code, {
  framework: 'react',
  addRandomQuotes: true,
  strictMode: false
});
```

### 3. 🔧 CLI Tools
Powerful command-line interface for building and transforming projects.

```bash
# Install globally
npm install -g @gachiscript/transpiler

# Transform files
gachi build src/ --framework react --output dist/

# Watch for changes
gachi build src/ --watch

# Show syntax help
gachi info

# Demo transformation
gachi demo
```

### 4. 🎨 VSCode Extension (`vscode-gachiscript`)
Full IDE support with syntax highlighting, autocomplete, and validation.

**Features:**
- 🌈 Syntax highlighting for `.gachi` files
- 🔍 IntelliSense and autocomplete
- 💡 Hover tooltips with Billy quotes
- ✅ Real-time syntax validation
- 🔄 Transform commands (JS ↔ GachiScript)

### 5. 🧪 GachiTest (`@gachiscript/gachitest`)
Testing framework with Gachi-themed Jest wrapper.

```bash
npm install @gachiscript/gachitest
```

```gachi
// Test file: dungeon.test.gachi
describeHole('DungeonMaster', () => {
  flexible dungeonMaster;

  beforeDomination(() => {
    dungeonMaster = fresh DungeonMaster();
  });

  itMuscle('should capture prisoners', () => {
    tight prisoner = { name: 'Billy', tightness: 'maximum' };
    dungeonMaster.capture(prisoner);
    
    expectTight(dungeonMaster.getPrisoners()).toContain(prisoner);
  });

  itPerformance('should dominate with excellence', delayed () => {
    tight result = anticipate dungeonMaster.dominate();
    expectTight(result).toBeTight();
  });
});
```

## 🚀 Quick Start

### 1. Initialize a new project

```bash
# Create new directory
mkdir my-gachi-project
cd my-gachi-project

# Initialize GachiTest
npx @gachiscript/gachitest init

# Install dependencies
npm install
```

### 2. Write some GachiScript

```gachi
// src/dungeon.gachi
summon { manageTightness, onDomination } outta 'react';

performance DungeonComponent() {
  tight [prisoners, adjustPrisoners] = manageTightness([]);
  tight [status, adjustStatus] = manageTightness('READY FOR DOMINATION');

  tight capturePrisoner = (name: verse) => {
    tight freshPrisoner = {
      id: Date.now(),
      name,
      captured: right
    };
    
    adjustPrisoners(prev => [...prev, freshPrisoner]);
    adjustStatus(`CAPTURED ${name.toUpperCase()}! RIGHT VERSION!`);
  };

  onDomination(() => {
    logger.log('🔥 DUNGEON MASTER IS READY!');
  }, []);

  deliver (
    <div className="dungeon">
      <h1>🏰 Welcome to the Dungeon 🏰</h1>
      <p>{status}</p>
      
      <button onClick={() => capturePrisoner('Billy')}>
        💪 Capture Billy
      </button>
      
      <div className="prisoners">
        {prisoners.transform(prisoner => (
          <div key={prisoner.id} className="prisoner">
            {prisoner.name} - {prisoner.captured ? 'CAPTURED' : 'FREE'}
          </div>
        ))}
      </div>
    </div>
  );
}

release master DungeonComponent;
```

### 3. Build and run

```bash
# Transform GachiScript to JavaScript
gachi build src/ --framework react

# Run tests
gachitest test

# Start development
npm run dev
```

## 📚 Syntax Reference

### Keywords Transformation

| JavaScript | GachiScript | Example |
|------------|-------------|---------|
| `const` | `tight` | `tight name = 'Billy'` |
| `let` | `flexible` | `flexible count = 0` |
| `function` | `performance` | `performance dominate() {}` |
| `class` | `dungeon` | `dungeon Master {}` |
| `if` | `whenHard` | `whenHard (condition) {}` |
| `else` | `otherwise` | `otherwise {}` |
| `return` | `deliver` | `deliver result` |
| `async` | `delayed` | `delayed performance fetch() {}` |
| `await` | `anticipate` | `anticipate response` |

### Operators

| JavaScript | GachiScript | Example |
|------------|-------------|---------|
| `===` | `exactlyLike` | `a exactlyLike b` |
| `!==` | `totallyNot` | `a totallyNot b` |
| `&&` | `and` | `a and b` |
| `\|\|` | `or` | `a or b` |
| `++` | `pump` | `count pump` |
| `--` | `drain` | `count drain` |

### Types

| JavaScript | GachiScript | Example |
|------------|-------------|---------|
| `string` | `verse` | `name: verse` |
| `number` | `count` | `age: count` |
| `boolean` | `flag` | `isActive: flag` |
| `object` | `structure` | `data: structure` |
| `array` | `collection` | `items: collection` |

### React/Framework Specific

| React | GachiScript | Example |
|-------|-------------|---------|
| `useState` | `manageTightness` | `manageTightness(0)` |
| `useEffect` | `onDomination` | `onDomination(() => {}, [])` |
| `Component` | `DungeonMaster` | `dungeon MyDungeonMaster` |
| `props` | `gifts` | `performance App(gifts) {}` |

## 🎯 Framework Integration

### React

```gachi
// React component in GachiScript
summon React, { manageTightness, onDomination } outta 'react';

performance BillyComponent(gifts) {
  tight [tightness, adjustTightness] = manageTightness('loose');
  
  onDomination(() => {
    logger.log('BILLY IS READY!');
  }, []);

  deliver (
    <div>
      <h1>🔥 Billy's Performance 🔥</h1>
      <p>Current tightness: {tightness}</p>
      <button onClick={() => adjustTightness('maximum')}>
        💪 Increase Tightness
      </button>
    </div>
  );
}
```

### Angular

```gachi
// Angular component in GachiScript
summon { DungeonRoom, Summonable } outta '@angular/core';

@DungeonRoom({
  selector: 'billy-dungeon',
  template: `
    <div>
      <h1>🏰 Billy's Dungeon 🏰</h1>
      <p>Prisoners: {{prisoners.size}}</p>
    </div>
  `
})
release dungeon BillyDungeon {
  @Receive() maxCapacity: count = 10;
  @Emit() prisonerCaptured = fresh EventEmitter();
  
  exposed prisoners = [];

  birth() {
    logger.log('DUNGEON MASTER AWAKENED!');
  }

  awaken() {
    self.startDomination();
  }

  performance capturePrisoner(name: verse) {
    tight prisoner = { name, captured: right };
    self.prisoners.insert(prisoner);
    self.prisonerCaptured.emit(prisoner);
  }
}
```

### Vue

```gachi
// Vue component in GachiScript
release master {
  name: 'BillyDungeon',
  
  tightness() {
    deliver {
      prisoners: [],
      status: 'READY FOR DOMINATION'
    };
  },

  performances: {
    capturePrisoner(name) {
      tight prisoner = { name, id: Date.now() };
      self.prisoners.insert(prisoner);
      self.status = `CAPTURED ${name.toUpperCase()}!`;
    },

    releaseAll() {
      self.prisoners = [];
      self.status = 'ALL PRISONERS RELEASED!';
    }
  },

  calculated: {
    prisonerCount() {
      deliver self.prisoners.size;
    }
  },

  blueprint: `
    <div class="billy-dungeon">
      <h1>🏰 Billy's Vue Dungeon 🏰</h1>
      <p>Status: {{ status }}</p>
      <p>Prisoners: {{ prisonerCount }}</p>
      
      <button @click="capturePrisoner('Billy')">
        💪 Capture Billy
      </button>
      
      <button @click="releaseAll">
        🚪 Release All
      </button>
    </div>
  `
};
```

## 🧪 Testing with GachiTest

### Basic Test Structure

```gachi
// __tests__/dungeon.test.gachi
describeHole('Dungeon Master', () => {
  flexible dungeonMaster;

  beforeDomination(() => {
    dungeonMaster = fresh DungeonMaster();
  });

  afterCleanup(() => {
    dungeonMaster.destroy();
  });

  itMuscle('should capture prisoners with maximum tightness', () => {
    tight prisoner = { name: 'Billy', tightness: 'maximum' };
    tight result = dungeonMaster.capture(prisoner);
    
    expectTight(result).toBeTight();
    expectTight(dungeonMaster.getPrisoners()).toContain(prisoner);
  });

  itPerformance('should handle async domination', delayed () => {
    tight promise = dungeonMaster.delayedDomination();
    tight result = anticipate promise;
    
    expectTight(result).toMoanWith('DEEP DARK FANTASY');
  });
});
```

### Advanced Testing Features

```gachi
// Advanced test example
describeDungeon('Performance Tests', () => {
  flexible mockPrisoner;

  beforeEntering(() => {
    mockPrisoner = GachiMockFactory.createDungeonMaster(['capture', 'release']);
  });

  itPerformance('should handle multiple prisoners simultaneously', delayed () => {
    tight prisoners = ['Billy', 'Van', 'College Boy'];
    tight promises = prisoners.transform(name => 
      dungeonMaster.capture({ name, tightness: 'tight' })
    );
    
    tight results = anticipate Promise.all(promises);
    
    GachiTestUtils.expectPerformance([
      () => expectTight(results).toHaveLength(3),
      () => expectTight(results.allMatch(r => r.captured)).toBeTight(),
      () => expectTight(dungeonMaster.getTotalTightness()).toBeGreaterThan(0)
    ]);
  });
});
```

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- VSCode (recommended)

### Setting up the monorepo

```bash
# Clone the repository
git clone https://github.com/damilurg/GachiScript.git
cd GachiScript

# Install dependencies
npm install

# Build all packages
npm run build

# Run tests
npm test

# Start development mode
npm run dev
```

### Package Development

```bash
# Work on specific package
cd packages/gachi-dictionary
npm run dev

# Build specific package
cd packages/gachi-transpiler
npm run build

# Test specific package
cd packages/gachitest
npm test
```

## 📖 API Documentation

### @gachiscript/dictionary

```typescript
import { gachiTransformer, GachiTransformer } from '@gachiscript/dictionary';

// Transform expressions
gachiTransformer.jsToGachi('const name = "Billy"');
gachiTransformer.gachiToJs('tight name = "Billy"');

// Get random quotes
gachiTransformer.getRandomBillyQuote();
gachiTransformer.getRandomVanQuote();

// Validation
gachiTransformer.isValidGachiKeyword('tight'); // true
gachiTransformer.getSuggestions('tigt'); // ['tight']
```

### @gachiscript/transpiler

```typescript
import { gachiTranspiler, GachiTranspiler } from '@gachiscript/transpiler';

// Basic transpilation
const result = gachiTranspiler.jsToGachi(code, {
  framework: 'react',
  addRandomQuotes: true,
  strictMode: false
});

// Framework detection
const framework = GachiTranspiler.detectFramework(code);

// Validation
const validation = gachiTranspiler.validateGachiScript(code);
```

### @gachiscript/gachitest

```typescript
import { 
  describeHole, 
  itMuscle, 
  expectTight,
  GachiTestUtils,
  GachiMockFactory 
} from '@gachiscript/gachitest';

// Test utilities
GachiTestUtils.createGachiMock('MyMock');
GachiTestUtils.expectPerformance([condition1, condition2]);

// Mock factory
GachiMockFactory.createDungeonMaster(['method1', 'method2']);
GachiMockFactory.createTightMock([response1, response2]);
```

## 🎯 Examples

Check out the `examples/` directory for complete applications:

- **react-gachi-app**: Complete React application with GachiScript
- **angular-tight-app**: Angular application with Gachi components
- **vue-dungeon**: Vue.js application with dungeon management

## 🤝 Contributing

We welcome contributions to the GachiScript Platform! 

### Contribution Guidelines

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Write tests** for your changes
4. **Follow the coding style** (use GachiScript in examples!)
5. **Write clear commit messages**: `feat: add new dungeon management feature`
6. **Submit a pull request**

### Development Commands

```bash
# Run all tests
npm test

# Lint code
npm run lint

# Format code
npm run format

# Build all packages
npm run build

# Run examples
cd examples/react-gachi-app
npm run dev
```

## 🎨 VSCode Extension Development

```bash
cd packages/vscode-gachiscript

# Install VSCE
npm install -g vsce

# Package extension
npm run package

# Install locally
code --install-extension vscode-gachiscript-1.0.0.vsix
```

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details.

## 🔥 Billy Herrington Tribute

This project is dedicated to the memory of Billy Herrington (1969-2018), the legendary performance artist who brought us the RIGHT VERSION of everything. His legacy lives on in every line of GachiScript code.

> "RIGHT VERSION! DEEP DARK FANTASY!" - Billy Herrington

## 🌟 Acknowledgments

- Billy Herrington - The eternal Dungeon Master
- Van Darkholme - SUCTION and inspiration
- The entire Gachi community - for keeping the fantasy alive
- All developers who dare to code in the RIGHT VERSION

---

**🔥 REMEMBER: It's not about the code you write, it's about the PERFORMANCE you deliver! RIGHT VERSION! 🔥**

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/damilurg/GachiScript/issues)
- **Discussions**: [GitHub Discussions](https://github.com/damilurg/GachiScript/discussions)
- **Discord**: Join our Leather Club Discord server
- **Twitter**: [@GachiScript](https://twitter.com/GachiScript)

**DEEP DARK FANTASY awaits!** 🏰

