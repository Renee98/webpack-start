# webpack-start
学习webpack打包

# 运行我的简单案例
- git clone
- 找到项目目录，首先先 npm i  添加依赖
- npm start (开发环境)
- npm build (生产环境)


# 自己新建一个项目
## 起步
- 创建新webpack项目目录： `mkdir webpack-demo`
- 进入该目录： `cd webpack-demo`
- 创建package.json文件： `npm init -y`
- 添加webpack依赖包 `npm i webpack webpack-cli --save-dev`

## 修改package.json
```
 {
    "name": "webpack-demo",
    "version": "1.0.0",
    "description": "",
  + "private": true,
  - "main": "index.js",
    "scripts": {
      "test": "echo \"Error: no test specified\" && exit 1"
    },
    "keywords": [],
    "author": "",
    "license": "ISC",
    "devDependencies": {
      "webpack": "^4.0.1",
      "webpack-cli": "^2.0.9"
    },
    "dependencies": {}
  }
```

## 编写打包配置
- 创建项目目录和相关js文件
- 创建相关html文件
- 创建webpack.config.js编写配置
- 修改package.json配置

```
 {
    "name": "webpack-demo",
    "version": "1.0.0",
    "description": "",
  + "private": true,
  - "main": "index.js",
    "scripts": {
      "start": "webpack-dev-server",
      "test": "NODE_ENV=test webpack --config webpack.prod.config.js --color --progress --watch",
      "build": "NODE_ENV=production webpack --config webpack.prod.config.js --color --progress --watch"
    },
    "keywords": [],
    "author": "",
    "license": "ISC",
    "devDependencies": {
      "webpack": "^4.0.1",
      "webpack-cli": "^2.0.9"
    },
    "dependencies": {}
  }
```



## 具体实现以及参考资料
- webpack官网： https://webpack.js.org
- babel官网：https://babeljs.io
- node官网：https://nodejs.org
