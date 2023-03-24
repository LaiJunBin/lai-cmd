# lai-cmd

這是一個用於生成我的網頁開發環境的CLI，他基於 npx。

[English](https://github.com/LaiJunBin/lai-cmd#lai-cmd)｜繁體中文

## 使用方式:

```
$ npx lai-cmd init <source>
```

`<source>` 目前支援以下參數:

Source           | 描述  |
--------------|-----|
js    | 初始化 eslint, prettier, jsconfig(for vscode) |
react-tailwindcss    | 在 react 專案 安裝和設定 tailwindcss |
react    | 執行 init js 與 init react-tailwindcss 並設定 @babel/preset-react |
vue-tailwindcss    | 在 vue 專案 安裝和設定 tailwindcss |
vue    | 初始化 eslint, prettier 與 init vue-tailwindcss |
svelte-tailwindcss    | 在 svelte 專案 安裝和設定 tailwindcss |
svelte    | 初始化 eslint, prettier, tailwindcss 與建立簡單的 vscode settings |