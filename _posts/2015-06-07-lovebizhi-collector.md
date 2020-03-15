---
layout: post
title: 自动下载并更换 OS X 壁纸
category: Tech
tags: [Nodejs, OSX]
imagefeature: lovebizhi-collector/feature.jpg
image: 
  thumb: lovebizhi-collector/thumb.jpg
redirect_from: "/tech/2015/06/07/lovebizhi-collector/"
---
<figure>
  <a href="/images/lovebizhi-collector/1.jpg"><img style="width:40%" src="/images/lovebizhi-collector/1.thumb.jpg"></a>
</figure>

虽然在工作中很少能看到壁纸，但我还是希望我的壁纸能经常变一变，这样当四指划开显示桌面时，说不定还能给自己一个惊喜。

OS X 上是有一些自动设置壁纸的 App 的，比如 [Behance](https://www.behance.net/apps), [Kuvva](https://www.kuvva.com)。但是这些 App，要么壁纸资源太少，要么不能自动下载。总还不能满足我的需求。找来找去还是 [爱壁纸](https://www.lovebizhi.com) 上的壁纸资源最合我意。于是我就写了一个简单的 [Nodejs 脚本](https://github.com/songchenwen/lovebizhi-collector)，根据爱壁纸的 API 来收集，并调用 `Apple Script` 自动更换 OS X 的壁纸。

<!-- more -->

## 安装

既然是一个 Nodejs 脚本，那么首先就要安装好 Nodejs 才行。使用 [Homebrew](http://brew.sh) 安装 Nodejs 很简单。

~~~ bash
brew install node
~~~

然后只需要找一个目录把[这个脚本](https://github.com/songchenwen/lovebizhi-collector)克隆到本地就可以了。当然还需要想好把下载好的壁纸保存在哪个目录下。比如我保存在了 `~/Pictures/wallpapers/`。

我已经准备好了用来安装的脚本。只需要替换上你用来存储壁纸的路径，运行下面的脚本就可以了。

~~~ bash
OUTPATH="/path/to/your/folder/for/wallpapers"
mkdir lovebizhi-collecor
cd lovebizhi-collecor
git clone "https://github.com/songchenwen/lovebizhi-collector.git" .
npm install
touch config
echo "OUTPATH=\"$OUTPATH\"" > config
~~~

## 使用

项目里有两个已经准备好的 Shell 脚本 `run.sh` 和 `add_launch_agent.sh`。分别是用来运行和添加自动启动项目的。

### 更新壁纸

~~~ bash
sh run.sh
~~~

### 自动启动

OS X 的自动启动依赖于 `LaunchAgents`。打开 `~/Library/LaunchAgents/` 就能看到一些 `.plist` 文件，这些就是用来描述自动启动项目的。我们在这里添加一个 `.plist` 文件来调用 `run.sh` 就可以自动运行了。

我已经写好了添加的脚本。

~~~ bash
sh add_launch_agent.sh
~~~

## 设置

在 `index.js` 里面有一些关于要获取什么样的壁纸的配置。可以根据自己的喜好来更改这些配置。

~~~ javascript
var categories = [API.categories.landscape, API.categories.plant]; // 壁纸类别
var screenWidth = 2560; // 屏幕分辨率
var screenHeight = 1600;
var maxFileCount = 100; // 最多保留在本地的壁纸数
~~~

其中壁纸类别有如下这些：

- `API.categories.moviestar` 明星
- `API.categories.landscape` 风景
- `API.categories.beauty` 美女
- `API.categories.plant` 植物
- `API.categories.animal` 动物
- `API.categories.game` 游戏
- `API.categories.cartoon` 卡通
- `API.categories.festival` 节日
- `API.categories.car` 汽车
- `API.categories.food` 美食
- `API.categories.sport` 运动
