# Setup

```bash
$ git clone https://github.com/FallenDeity/Typescript-Boilerplate
$ cd Typescript-Boilerplate
$ npm install
```

# Build

```bash
$ npm run build 
```

Internally calls for webpack to build the project.

# Test

```bash
$ npm run test
```

Internally calls for mocha to run the tests.

# Run

```bash
$ npm run build-and-run
```

Internally calls for webpack to build the project and then runs the built project.

# Others

- `npm run lint` - Runs eslint on the project.
- `npm run lint:fix` - Runs eslint on the project and fixes the errors.
- `npm run prettier` - Runs prettier on the project.
- `npm run prettier:fix` - Runs prettier on the project and fixes the errors.

> **Note**  
> Few more commands are available in `package.json` under `scripts` section.