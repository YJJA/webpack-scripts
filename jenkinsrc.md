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
node tools/build front admin sso
node tools/configuration front admin sso --env develop
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
pm2 delete cloudcut-admin  cloudcut-front  cloudcut-sso
cd cloudcut-web/admin && yarn  && pm2 start ecosystem.json
cd ../front && yarn   && pm2 start ecosystem.json
cd ../sso && yarn  && pm2 start ecosystem.json
pm2 ls
```
