# AtlasFramework Addon Template Generator
A CLI tool for generating a fully working [AtlasFramework](https://github.com/8char/AtlasFramework/) addons with a preconfigured lauxconfig.json and example code for integrating your addon with [AtlasFramework](https://github.com/8char/AtlasFramework/). [Laux](https://github.com/8char/laux-compiler) is a superset of Lua that provides additional features such as classes, modules, and improved error handling.

```bash
npm create atlas-addon@latest
```

...and follow the prompts.

## API

You can also use the `create-atlas-adddon` programmatically:

```js
import { create } from 'create-atlas-addon';

await create("my-app", {
	name: "my-app",
	template: "skeleton",
	fancy_name: "My App",
	underscore_name: "my_app",
	global: "MyApp",
	acronym: "MyApp"
});