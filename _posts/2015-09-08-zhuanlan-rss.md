---
layout: post
title: 知乎专栏 RSS 输出
category: Tech
tags: [Nodejs, RSS]
---
<figure>
  <a href="/images/zhuanlan-rss/1.jpg"><img style="width:60%" src="/images/zhuanlan-rss/1.thumb.jpg"></a>
</figure>

知乎专栏的文章质量很高，可惜没有 RSS 输出，没办法整合到我常用的阅读器里。

于是我业余时间自己写了一个[知乎专栏的 RSS 输出](http://zhuanlan-rss.songchenwen.com/)，并且自带聚合功能，可以在一个 Feed 里聚合所有自己喜欢的专栏的内容。

<!-- more -->

知乎专栏 RSS 的入口是 [zhuanlan-rss.songchenwen.com](http://zhuanlan-rss.songchenwen.com/)。

只需要输入想要订阅的专栏 ID，订阅多个专栏就用逗号分隔，然后点`输出 RSS`，就可以得到一个订阅地址。

其实直接访问 `zhuanlan-rss.songchenwen.com/rss/{ids}`，把 `{ids}` 换成逗号分隔的专栏 ID，就是对应的 RSS 输出了。

[这里是我订阅的专栏聚合](http://zhuanlan-rss.songchenwen.com/rss/yeka52,maboyong,datouma,gaizhilizcw,tianhao,qinnan,lianghuan,talich,loveletter,zenithdie,Glasschurch,nosensedigit,oldplusnew,negative2,taosay,DKLearnsPop,mactalk,lswlsw,rosicky311,zhimovie,liangbianyao,bianzhongqingnianxingdongzhinan,phos-study,wontfallinyourlap,24frames,wuliang8910)。

这个项目是用 Nodejs 写的，Redis 做缓存，部署在 [Heroku](https://heroku.com) 上。访问速度还可以。访问过的专栏 ID 会留有缓存，没访问过的会实时从知乎的 API 取。通过定时 Stream Data 来防止 Heroku 的 Route 超时。

这是我第一次用 Redis，刚开始写的时候，弄了一堆 `GET`，`SET`，[Newsblur](http://newsblur.com) 去取的时候总是报内部错误。后来发现居然还可以 `MGET`，`MSET`，于是速度提高了不少，[Newsblur](http://newsblur.com) 也不报错了。

后面打算有空了给 [Lovebizhi Collector](/tech/2015/06/07/lovebizhi-collector/) 再加个 UI 。

[Stop bullshit. Show me the code.](https://github.com/songchenwen/zhuanlan-rss/)
