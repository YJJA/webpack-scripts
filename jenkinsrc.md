#项目名称
```
React Build
```

#源码管理

##Git
```
```

# 构建环境

## Inject environment variables to the build process

### Properties Content
```
PATH=$PATH:/var/lib/jenkins/tools/jenkins.plugins.nodejs.tools.NodeJSInstallation/recent_node/bin/
```

## Provide Node & npm bin/ folder to PATH

### NodeJS Installation
```
node 8.6
```

# 构建

## Execute shell
```
npm -v
node -v
npm install
node scripts/build front admin sso
node scripts/configuration front admin sso --env develop
```

# 构建后操作

## Send build artifacts over SSH

### Name
```
develop
```

### Transfers

#### Source files
```
build/**
```

#### Remove prefix
```
build
```

#### Remote directory
```
react-web
```

#### Exec command
```
node -v
npm -v
yarn -v
pm2 -v

pm2 ls
```
