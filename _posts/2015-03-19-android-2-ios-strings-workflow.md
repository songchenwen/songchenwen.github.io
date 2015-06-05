---
layout: post
published: true
title: 将安卓的多语言文件转为 iOS 格式的 Workflow
category: Tech
tags: [Android, iOS, Afred]
---

抽空写了一个将 Android 的 `strings.xml` 文件转为 iOS 的 `Localizable.strings` 格式的小脚本。而且把它封装撑了一个 [Alfred Workflow](https://github.com/songchenwen/Android2iOSStringsWorkflow)。

使用时只要复制想要转换的 `strings.xml` 的内容，然后调出 Alfred 输入 `a2x`，再在对应的 `Localizable.strings` 文件里粘贴就行了。

<!-- more -->

所执行的其实就是一个 awk 脚本。

~~~ bash
awk '
BEGIN{
	FS = "^ *<string *| *>|<\/string> *$|^ *<!-- *| *--> *$";
}
{
	if (/<string.*name\=\".*\".*>.*<\/string> *$/){
		match($2, /name *\= *\"[^ ]+\"/)
		name = substr($2, RSTART + 5, RLENGTH - 5)	
		print name " \= \"" $3 "\";"
	}
	else if(/<!--.*-->/)
		print "// "$2;
	else if(/^ *$/)
		print ""
}'
~~~

所以如果不想用 Alfred 的话，也可以直接执行这个脚本。

比如在 OS X 上，`pbcopy` 和 `pbpaste` 是复制和粘贴的命令，把它们通过管道连接起来，就可以实现自动转换剪贴板内容的功能了。

~~~ bash
pbpaste | awk '
BEGIN{
	FS = "^ *<string *| *>|<\/string> *$|^ *<!-- *| *--> *$";
}
{
	if (/<string.*name\=\".*\".*>.*<\/string> *$/){
		match($2, /name *\= *\"[^ ]+\"/)
		name = substr($2, RSTART + 5, RLENGTH - 5)	
		print name " \= \"" $3 "\";"
	}
	else if(/<!--.*-->/)
		print "// "$2;
	else if(/^ *$/)
		print ""
}' | pbcopy
~~~
