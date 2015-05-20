---
layout: post
title: 比 Hazel 更便宜强大的 Maid 
category: Tech
---

桌面又成乱糟糟一片图标了，下载里也有数不清的文件。每次整理都很让人焦虑。相信以 OS X 为日常操作系统的人都会有这样的感触。当然其实 Windows 或者 Linux 也一样，收集文件并整理是每个人 IT 生活的一部分。

## [Maid]

OS X 上有一款很有名的帮助我们整理文件的工具 [Hazel]。[Hazel] 能让用户可视化地创建一系列规则，它会根据规则去监视文件夹，自动整理。但图形界面写规则毕竟限制较多，复杂的脚本规则在 [Hazel] 里编辑起来又不那么方便。何况 [Hazel] $29 的价格，多少还是有点贵呢。

于是今天的主角 [Maid] 应运而生。[Maid] 是一个 Ruby Gem。规则也是用 Ruby 写的，常用的工具方法被封装成了 DSL。[Maid] 的使用门槛比 [Hazel] 要高一些，但使用起来灵活性却要高的多了。关键是 [Maid] 是开源且免费的。

<!-- more -->

## 安装

[Maid] 只是一个 Ruby Gem，所以基本上能装 Ruby 的类 Unix 系统都可用。

OS X 上还是推荐使用 [rvm] 来管理 Ruby 版本。如果系统中还没装过 [rvm] 的话，先安装 [rvm]。

~~~ bash
gpg --keyserver hkp://keys.gnupg.net --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3
\curl -sSL https://get.rvm.io | bash -s stable --ruby
rvm install 2.1
rvm use 2.1
~~~

然后就可以用 Gem 来安装 [Maid] 了。

~~~ bash
gem install maid
~~~

## 使用

要让 [Maid] 工作只需要执行 `maid` 命令就可以了。

- `maid clean -n` 测试执行 [Maid]，只列出将要做的操作，但不真正执行。
- `maid clean -f` 真正执行 [Maid]。
- `maid daemon` 使 [Maid] 持续运行。配合 `watch` 和 `repeat` 使用。

## 规则

使用 [Maid] 必须先创建规则。[Maid] 的规则存储在 `~/.maid/rules.rb` 里。

可以先让 [Maid] 生成一份示例规则给我们看看 `maid sample`。

`Sample Rules` 里主要是做了一些简单的文件清理工作。

比如 OS X 的系统截图默认会保存在桌面。我们让 [Maid] 把一周没用过的截图从桌面移到归档文件夹中。

~~~ ruby
  rule 'Misc Screenshots' do
    dir('~/Desktop/Screen shot *').each do |path|
      if 1.week.since?(accessed_at(path))
        move(path, '~/Documents/Misc Screenshots/')
      end
    end
  end
~~~

这是 `Sample Rules` 的做法，我自己的做法是桌面上很久不用的文件，就直接放废纸篓了。

## 自动运行

如果每次都需要手动执行 `maid clean -f` 才能整理文件的话，显然 [Maid] 达不到 [Hazel] 的方便程度，也无法满足我们的需求。所以我们需要 `maid daemon`。

在 `daemon` 模式，[Maid] 会持续运行，并执行标明了 `watch` 或 `repeat` 的规则。

- `watch` 会让 [Maid] 去监视一个文件夹，如果这个文件夹内的文件有了变化，那这个 `watch` 内的规则会被执行。
- `repeat` 会让 [Maid] 以一个固定的时间间隔去执行一些规则。

比如下面这些规则会把新下载的视频文件移动到影片文件夹里，并每天自动帮我做一些常规升级。

~~~ ruby
watch '~/Downloads' do
	rule 'Movie in Downloads' do
		where_content_type(dir_safe('~/Downloads/*'), ['video', 'public.movie']).each do |path|
			move(path, '~/Movies/') if duration_s(path) > 15 * 60
		end
	end
end

repeat '1d' do
	rule 'Update System' do
		pid = Process.spawn("brew update;brew upgrade")
		Process.detach pid
		pid = Process.spawn("npm update -g")
		Process.detach pid
		pid = Process.spawn("gem update")
		Process.detach pid
	end
end
~~~

## 开机自动启动

`maid daemon` 已经能自动为我们整理文件了。但是我们总不能每次开机都自己打开终端输入一遍命令吧。所以我们需要让 [Maid] 能开机自动启动。

OS X 上自动启动要依赖 `LaunchAgents`，操作 `LaunchAgents` 的终端命令是 `launchctl`，不过这命令各种晦涩难懂，不如安装一个叫 `lunchy` 的 Gem 来简化操作。`gem install lunchy`

先创建一个 Shell 脚本 `run.sh` 来帮我们执行 `maid daemon`。其中需要用到 ruby 和 maid 的绝对路径，可以通过 `which ruby`， `which maid` 得到。

~~~ bash
#!/bin/sh
export LC_ALL=en_US.UTF-8
export LANG=en_US.UTF-8
/path/to/ruby /path/to/maid daemon
~~~

然后再在 `~/Library/LaunchAgents` 里创建对应的 `plist` 文件就可以了。比如 `com.songchenwen.maid.plist`。

~~~ xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>Label</key>
	<string>com.songchenwen.maid.plist</string>
	<key>Program</key>
	<string>/path/to/run.sh</string>
	<key>RunAtLoad</key>
	<true/>
	<key>KeepAlive</key>
	<true/>
	<key>EnvironmentVariables</key>
	<dict>
		<key>PATH</key>
		<string>/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin</string>
	</dict>
</dict>
</plist>
~~~

使用 `lunchy` 载入 [Maid]。在终端里执行 `lunchy start maid`。打开 `console.app` 看看有没有报错，如果没有的话，就说明 [Maid] 已经能自动运行了。

## 文件标记

[Hazel] 集成了 OS X 的文件标记功能，对于整理文件来说，这个功能很实用。

但 [Maid] 当前的稳定版 0.7.0 并未支持这个功能。

不过 [Maid] 的作者 [Benjamin Oakes](https://github.com/benjaminoakes) 已经让我提交了一个 [Pull Request](https://github.com/benjaminoakes/maid/pull/146)。现在最新的测试版 0.8.0.alpha.2 已经支持这个功能了。

文件标记功能依赖于 [Tag](https://github.com/jdberry/tag)。需要用户手动安装 `brew install tag`。

对于像我一样还在使用 0.7.0 稳定版 [Maid] 的用户，可以在 `rules.rb` 里添加以下方法来使用文件标记功能。

~~~ ruby
def tags(path)
	path = sh_escape(expand(path))
	raw = cmd("tag -lN #{path}")
	raw.strip.split(',')
end

def has_tags?(path)
	ts = tags(path)
	ts && ts.count > 0
end

def contains_tag?(path, tag)
	path = expand(path)
	ts = tags(path)
	ts.include? tag
end

def add_tag(path, tag)
	path = expand(path)
	ts = Array(tag).join(",")
	log "add tags #{ts} to #{path}"
	cmd("tag -a #{ts} #{sh_escape(path)}")
end

def remove_tag(path, tag)
	path = expand(path)
	ts = Array(tag).join(",")
	puts "remove tags #{ts} from #{path}"
	log "remove tags #{ts} from #{path}"
	`tag -r "#{ts}" "#{path}"`
end

def set_tag(path, tag)
	path = expand(path)
	ts = Array(tag).join(",")
	puts "set tags #{ts} to #{path}"
	log "set tags #{ts} to #{path}"
	`tag -s "#{ts}" "#{path}"`
end
~~~

## 电池优化

如果你也像我一样用 `watch` 监视了下载文件夹的话，那你应该也会遇到这个问题。

当 Macbook 由电池供电的时候，如果用迅雷或 Aria2 之类的下载工具下载文件，耗电量会大量增加，电池可用时间会迅速减少。打开 `Activiy Monitor.app` 会发现 `ruby` 进程成了耗电大户。

这是因为被 `watch` 的文件夹中每次出现文件改动，都会触发 [Maid] 的规则。如果规则比较多的话，就会大量消耗 CPU 资源。

[Maid] 的文件夹监视功能是使用 [Listen] 来实现的。根据[这个文件](https://github.com/benjaminoakes/maid/blob/master/lib/maid/watch.rb)里的写法，我们其实可以给 [Listen] 传递配置参数，而且 [Listen] 也会给我们的规则回传文件变化的列表。那么我们就可以通过自己的规则来使 [Maid] 更省电了。

~~~ ruby
watch('~/Downloads', {wait_for_delay: 10, ignore: [/\.crdownload$/, /\.download$/, /\.aria2$/, /\.td$/, /\.td.cfg$/]}) do
	rule 'Downloads Change' do |modified, added, removed|
		if added.any?()
			# add tags or move files
		end
	end
end
~~~

上面这段 `watch` 规则的触发间隔不会低于10秒，忽略了正在下载的文件的变化，并且只有当出现新增文件的时候才去执行规则。当对 `watch` 做了这样的优化之后，[Maid] 的耗电量就显著减少了。

## 我的规则

[这里](https://github.com/songchenwen/dotfiles/blob/master/maid_rules/rules.rb)是我目前使用的 [Maid] 规则。也欢迎大家也贴出自己使用的规则来一起交流。

[Maid]:https://github.com/benjaminoakes/maid
[Listen]:https://github.com/guard/listen
[rvm]:https://rvm.io
[Hazel]:http://www.noodlesoft.com/hazel.php
