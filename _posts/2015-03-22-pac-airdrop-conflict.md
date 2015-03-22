---
layout: post
published: true
title: 修改自动代理设置使 AirDrop 可用
category: Tech
---

![](/images/pac-airdrop-conflict/1.png)

OS X 的 AirDrop 功能在近距离传文件又快又方便，比 QQ 好用得多。但却经常抽风，或者是打开 AirDrop 却不显示对方的设备，或者是刚一传文件直接就显示传输失败，实在是让人沮丧。

不显示对方的设备这个问题，基本上都可以通过 AirDrop 界面下面的 `看不到要找的人 -> 搜索旧款 Mac` 来解决。而传输失败的问题，苹果就没有给出一个好的解决方案了。

<!-- more -->

经过我的测试，发现传输失败的问题是与系统代理的设置相关的。对于墙内的人来说，代理可以说是必需品，所以也难怪我们总是会觉得 AirDrop 不好用了。

- 当全局代理的时候，AirDrop 会传输失败。
- 当自动代理白名单模式时，AirDrop 会传输失败
- 当自动代理黑名单模式时，AirDrop 可以传输成功

通过以上现象，我推测 AirDrop 是通过蓝牙发现设备，然后通过 `http` 协议传输文件的，这中间要经过系统的代理设置。

于是打开 `console.app` 进一步跟踪 log，我发现 AirDrop 在发送文件时会去请求一个 `.local` 后缀的域名。比如我要给设备名为 `iPhone` 的设备传文件，就会出现这样的 log。

~~~
15/3/22 上午9:16:24.467 sharingd[331]: 09:16:24.466 : Sending to 3bd06cf0e962 at [iPhone.local]:8770
~~~

现在问题就好解决了，只需要编辑自动代理设置，把 `.local` 加到白名单里，以后使用 AirDrop 就不会再出现传输失败的提示了。