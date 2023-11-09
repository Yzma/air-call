# Notes

- React Query Dev Tools are still enabled
  - This allows you to view/modify the cache and observe specific states, such as loading and error
- Clicking the "switches" icon in the top right hand corner will toggle if "invalid" phone calls are shown or not
  - Some activity objects from the API are incomplete. To handle this, after fetching all activities, the returned result is transformed into a separate object with additional properties. One of these properties is called 'isValid,' which returns true if the object contains all the necessary properties; otherwise, it returns false
  - Invalid phone calls are marked with an exclamation point icon to indicate that the call is invalid
- The number on the phone icon represents a real-time count of unarchived phone calls
  - After archiving/unarchiving a call, you should see the number update to reflect the change
- There is no scroll wheel by design as I'm trying to emulate what it would look like on a mobile device

TODO:
- The other pages have no functionality and are merely there for display

### Example of valid phone call:

```
  {
    direction: 'inbound',
    from: 100001,
    to: 200002,
    via: 30000003,
    duration: 10,
    is_archived: true,
    call_type: 'answered',
    id: '6393bb7b69073dc45849ca7c',
    created_at: '2022-12-09T22:49:31.911Z',
  }
```

### Example of invalid phone call:

```
  {
    duration: 0,
    is_archived: false,
    id: '639a0f0a328500b1a0fa9bf7',
    created_at: '2022-12-14T17:59:38.665Z',
  }
```

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
   parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
   },
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
