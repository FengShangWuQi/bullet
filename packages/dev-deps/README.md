<h1 align="center">
dev-deps
</h1>

### 安装

```
$ npm install @fengshangwuqi/dev-deps -D
```

### 使用

```json
{
  "scripts": {
    "clean": "rimraf dist",
    "format": "prettier --write '**/*.{js,ts,tsx,json,md}'",
    "start": "ts-node ./index.ts"
  },
  "commitlint": {
    "extends": ["@commitlint/config-conventional"]
  },
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged && pretty-quick --staged",
      "pre-push": "tsc",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  },
  "lint-staged": {
    "**/*.{js,ts,tsx}": ["eslint --fix"]
  },
  "prettier": {
    "trailingComma": "all",
    "jsxBracketSameLine": true,
    "arrowParens": "avoid"
  }
}
```
