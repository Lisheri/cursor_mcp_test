# 视频上传系统

基于Nuxt 3的视频和图片上传系统，支持大文件上传、上传进度显示、失败重试等功能。

## 功能特性

- 视频和图片上传
- 文件上传进度实时显示
- 上传失败后可重试
- 支持文件列表管理和删除
- 多环境配置支持
- HTTP/2支持和自签名证书
- 响应式设计，兼容移动端

## 环境要求

- Node.js 18+
- pnpm 8+

## 安装依赖

```bash
pnpm install
```

## 开发运行

### 开发环境
```bash
pnpm dev:development
```

### 测试环境
```bash
pnpm dev:test
```

### 灰度环境
```bash
pnpm dev:staging
```

### 生产环境
```bash
pnpm dev:production
```

## 构建生产版本

```bash
pnpm build
```

## 部署

```bash
pnpm preview
```

## 项目结构

```
├── assets/               # 静态资源文件
├── components/           # Vue组件
├── composables/          # 组合式API
├── layouts/              # 布局组件
├── pages/                # 页面组件
├── plugins/              # 插件
├── public/               # 公共静态资源
├── server/               # 服务器API
├── utils/                # 工具函数
├── .env                  # 环境变量
├── .env.development      # 开发环境变量
├── .env.test             # 测试环境变量
├── .env.staging          # 灰度环境变量
├── .env.production       # 生产环境变量
├── nuxt.config.ts        # Nuxt配置
├── package.json          # 项目依赖
└── tsconfig.json         # TypeScript配置
``` 