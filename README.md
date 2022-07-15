# lai-cmd

This is a command-line interface based on npx for generating my web development environment.

English｜[繁體中文](https://github.com/LaiJunBin/lai-cmd/blob/main/README-zh-tw.md#lai-cmd)

## Usage:

```
$ npx lai-cmd init <source>
```

`<source>` currently support the following:

Source           | Description  |
--------------|-----|
js    | Init eslint and prettier and vscode jsconfig file. |
react-tailwindcss    | Install and config tailwind for react project. |
react    | Execute init js and react-tailwindcss and set @babel/preset-react. |
vue-tailwindcss    | Install and config tailwind for vue3 project. |
vue    | Init eslint and prettier and execute vue-tailwindcss cmd. |