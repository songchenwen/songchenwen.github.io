---
layout: post
title: 全能高效的播放器 mpv
category: Tech
---

最近 iPad 经常被女朋友带走，于是我晚上躺在床上看美剧的设备只好变成了 MacBook Pro。

OS X 上常见的视频播放器有，QuickTime，MplayerX，VLC，收费的 Movist 等，但他们却都称不上全能。我理想的播放器应该有这样几个特点：

1. 常见格式都支持。
2. 画面质量还可以，不掉帧不模糊。
3. 字幕支持全面。
4. 省电 (躺床上就不插电源了)。
5. 最好还能支持扩展脚本 (配合 [maid](/tech/2015/04/23/maid-hazel-for-hackers/) 使用)。

[mpv](http://mpv.io) 就是一个能满足上面几个需求的播放器。

mpv fork 自 Mplayer 和 Mplayer2，是现在唯一仍在活跃开发的 Mplayer 系的播放器，大部分原 Mplayer 社区的开发者都已经转到 mpv 的开发上了。可见 mpv 将会是未来播放器的主流了。

mpv 以 ffmpeg 为解码器，可以调用 OS X 平台的硬件加速解码，支持 ass 字幕，有高级 OpenGL scale 算法，还支持 lua 扩展脚本。唯一的缺点就是 UI 太简陋了，所有的设置都只能靠手动改配置文件，不过这也没关系，看视频只要视频好看就够了，播放器的界面美不美不重要。

<!-- more -->

## 安装

OS X 上用 [Homebrew](http://brew.sh) 安装 mpv 是最方便的了。

~~~ bash
brew tap mpv-player/mpv
brew install mpv
brew linkapps mpv
~~~

这样会在 Homebrew 会自动在 `/Applications` 下创建一个到 `mpv.app` 的软链。

要默认使用 mpv 播放某一类型的视频文件的话，只需要在 Finder 里选中一个视频文件，`command + i`，再打开方式处选中 `mpv.app`，并点击全部更改，就可以了。

![](/images/mpv-player/1.png)

或者说你就想直接指定所有的视频文件默认都由 mpv 打开的话，你也可以像我一样执行一段 shell 脚本来设置。

~~~ bash
EXTS=( 3GP ASF AVI FLV M4V MKV MOV MP4 MPEG MPG MPG2 MPG4 RMVB WMV )

brew install duti

for ext in ${EXTS[@]}
do
	lower=$(echo $ext | awk '{print tolower($0)}')
	duti -s io.mpv $ext all
	duti -s io.mpv $lower all
done
~~~

## 配置

mpv 的配置文件在 `~/.config/mpv/` 里。`mpv.conf` 是一些基本的配置，`input.conf` 是播放过程中一些操作快捷键的设置，`lua-settings/osc.conf`，是播放器控制 UI 自定义设置。

[这里](https://github.com/songchenwen/dotfiles/tree/master/mpv)有我目前在使用的配置文件。

我这里默认使用的 vo 是 opengl，而不是更高级的 opengl-hq。因为我发现 opengl-hq 的 scale 算法 spline36 在视网膜屏幕上会显著增加耗电量。opengl 和 opengl-hq 播放相同的文件时 CPU 用量大致相等，但 opengl-hq 的耗电量却接近 opengl 的两倍。而相比更高的 scale 精细度来说，我还是偏向于希望能周末一整天都不需要给电脑充电。

`input.conf` 里触摸板对播放进度的调节方式我也改成了双指向上或向右划为快进，向下或向左为快退，与 mpv 默认的设置正相反。这是个人习惯的问题了。

另外我的配置文件里还有四个 lua 脚本。

- `autoload.lua` 会自动将同一文件夹里文件名类似的文件加到播放列表里。
- `markfinished.lua` 会在一个文件播放到最后几分钟时自动将其标记为已完成 (与 [maid](/tech/2015/04/23/maid-hazel-for-hackers/) 配合)。
- `vo_battery.lua` 会在应用启动时判断有没有连接电源，有连接电源则开启效果更好也更耗电的 vo。
- `autosub.lua` 会绑定快捷键 `b` 自动搜索并下载当前播放视频的英文字幕。

## 使用感受

使用 mpv 播放一般 H.264 编码的视频时，会使用硬件加速解码，发热和耗电都很低，播放也很流畅，可以说体验很好。但在播放 rmvb 的视频时，只能使用软解，发热和耗电就都升上来了，这应该是所有使用 ffmpeg 做解码器的播放器都遇到的问题。还好现在 rmvb 的视频文件越来越少，偶尔下到了，就先用 ffmpeg 转码成 mp4 再播吧。

~~~ bash
ffmpeg -i input.rmvb -c:v libx264 -preset veryfast -crf 18 -c:a copy output.mp4
~~~

mpv 目前还在积极的开发着，[Github](https://github.com/mpv-player/mpv) 上每天都会有几个 Commit。相信随着开发的推进，mpv 会变得越来越全能高效。
