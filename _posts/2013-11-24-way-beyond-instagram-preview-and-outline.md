---
layout: post
title: 超越Instagram之路
categories : [Tech]
tags : [Android, Camera, Instagram]
imagefeature : way-beyond-instagram-preview-and-outline/1.jpg
---

在过去一年多的时间里，我和团队受Instagram的激励一起做了一个图片分享社区。所以同时我也对iOS和Android上的相机开发做了很多研究。我们认为我们产品里的相机在很多方面达到了与Instagram类似的标准，甚至有些方面要更优于它。

<!-- more -->

在上周写了一篇关于Android相机启动优化的文章后。我重新考虑了技术文章应有的写法。对于一个较复杂的工程来说，只提取出一小部分主题来写，读者看来就像管中窥豹，恐怕很难获得提升。所以我决定把自己过去一年多里关于iOS和Android平台相机应用的努力，通过一系列的文章，总结记录下来。我会尽量做到循序渐进，也希望能给看到的人带来帮助。

<figure class="half">
	<a href="/images/way-beyond-instagram-preview-and-outline/1.jpg"><img src="/images/way-beyond-instagram-preview-and-outline/1.jpg"></a>
	<a href="/images/way-beyond-instagram-preview-and-outline/2.jpg"><img src="/images/way-beyond-instagram-preview-and-outline/2.jpg"></a>
</figure>

上面是在我计划的这一系列文章之后所能实现的工程预览。包括一个拍照界面和一个分享界面。最终结果可能会有差异，但不会差很多。

这些文章中将会以Android平台相机的开发为主，iOS平台的代码逻辑类似，这样做主要是由于iOS平台有GPUImage这样优秀的开源框架，为我们省掉了很多工作，当然同时也让我们无法更清晰的看到一些细节上我们本该注意到的逻辑。

随后的文章中将会涉及到的内容包括以下这几点：

1.开启相机并能实时预览

2.拍摄照片与保存图片

3.Android平台不同相机的兼容和配置

4.相机的对焦功能

5.相机的闪光灯功能

6.前后摄像头的切换

7.从相机界面到分享界面的平滑过渡

8.利用OpenGl ES实现图片滤镜的原理

9.利用OpenGl ES实现图片滤镜和实时滤镜

10.利用OpenGl ES实现可调节的移轴效果

其中关于图片滤镜的部分可能会用几篇文章来分别介绍。

另外Instagram的最新版中已经去除了对实时滤镜的支持。他们自己把这描述为有利于用户体验的改进。我倒是觉得这是他们利用iOS SDK中的UIImagePickerController重写相机所带来的副作用，这确实是降低应用内存占用的好办法，但我不认为去掉滤镜的实时预览功能是一种改进，毕竟所见即所得式的拍照能够帮助用户生产更优秀的照片。