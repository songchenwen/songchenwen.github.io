---
layout: post
title: 测试 FaceTime Audio Enabler
category: Tech
tags: [iOS, 越狱, FaceTimeAudioEnabler]
image: 
  thumb: facetime-audio-enabler-test/1.jpg
---

长话短说。

FaceTime Audio Enabler 是我大概两年前开发的一款 iOS 越狱插件，用来打开国行 iPhone 的 FaceTime Audio 功能。

但 iOS9 越狱发布后，由于苹果改了 32 位应用在 64 位 CPU 上的内存 pagesize，所以 FaceTime Audio Enabler 会使一些设备上的一些旧应用崩溃。

<!-- more -->

我本身是已经有一年多没有越狱过了。这次为了测试，才又尝试着越狱的。我的 iPad 越狱成功了，但 iPad 本来就可以使用 FaceTime Audio，而且也不是 64 位设备。我的 iPhone 5s 却怎么也越不成功，试了很多次，恢复系统又试了很多次，还是不行。于是我放弃了，恢复备份吧。

![](/images/facetime-audio-enabler-test/1.jpg)

现在只能请各位机友来做小白鼠帮我测试了。

参与测试完全出于用户自愿哦，测试过程中产生的任何损失，包括设备爆炸等，我是概不负责的。

测试的方法如下:

1. 如果安装过旧版先卸载掉，卸载后运行一下以前崩溃的应用，看看是不是正常了。
2. 在 Cydia 里添加源 http://cydia.myrepospace.com/songchenwen/
3. 这个源里只有一个 FaceTimeAudioEnabler for iOS9， 装上它。
4. 进行测试，看看 FaceTime Audio 有没有成功开启。
5. 试试以前崩溃的应用，比如 QQ国际版，Reeder 2 之类的，看还崩溃吗。
6. 把测试结果连同设备型号和 iOS 版本一起评论到这篇文章下面。


当前测试进度:

CPU   |  系统  | FaceTime Audio   |  32 位 App
:------:|:-------:|:-------------:|:---------:
64bit |  iOS 9 |   成功启用  |  不崩溃
64bit |  iOS 8 |   成功启用  |   不崩溃
32bit |  iOS 9 |   待测     |   不崩溃
32bit |  iOS 8 |   待测     |   待测 

待测试的差不多了的时候，我会把它再提交到 BigBoss 上的。

如果有机友希望进度快一些的话，可以考虑帮我从论坛里多找些人来测试。

当然如果有人愿意捐赠给我一个 6s 做测试的话，那我一定分分钟就把新版本搞定了。捐赠方式见下方，扫码支付很方便，一块两块都不嫌少哦。
