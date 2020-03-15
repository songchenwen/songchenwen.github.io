---
layout : post
title : Android 开发中如何信任自签名 Https 证书
categories : 
  - Tech
tags : 
  - Android
  - Https
redirect_from: "/tech/2015/01/28/android-trust-self-signed-ssl-certificate/"
---

Android 4.0 之后增加了添加可信证书的 API 。但对于我们 App 开发者来说，毕竟还是要支持 4.0 之前版本的 Android 的。所以我们要想一些其它的办法来使我们的 App 信任我们自己的自签名证书。

经过在 [StackOverflow] 上的搜索后，我发现很多答案都是教给开发者直接信任任何证书就可以了。这当然算是一个误导了，因为这样做会使中间人攻击变为可能，也就失去了使用 Https 的意义了。甚至连我们自己的开发者写的代码刚开始也是复制的 [StackOverflow] 上的这种方案，还好经过 Review 我发现了这段代码的问题，于是又仔细搜索了一下，最后改成了现在所用的方案。

<!-- more -->

# 生成 `KeyStore` 文件

由于我们要用代码构造自己的 `KeyStore` 实例，所以我们要先准备好 Android 系统能导入的 `KeyStore` 文件。这里我们要用 `Bouncy Castle` 的格式来生成一个 `KeyStore` 文件。

先去下载一个 [`Bouncy Castle` 的 jar 文件](http://www.bouncycastle.org/download/bcprov-jdk15on-146.jar)。

然后下载 [这个 shell script](https://github.com/bither/bitherj/raw/master/scripts/cert2keystore_bks.sh)。

把这两个文件放在同一个目录下。再把服务器的证书公钥（`pem` 格式）也放在这个目录下，比如我们就叫它 `cacert.pem` 吧。

打开终端，cd 到这个目录里。

赋予 `cert2keystore_bks.sh` 可执行权限。

~~~ bash
chmod +x cert2keystore_bks.sh
~~~

然后执行命令生成 `KeyStore` 文件。

这里需要我们想一个密语用来加密证书，随便一个就行，因为反正我们这里存的也只是公钥，保密需求不大，而且这个密语也是要写到代码里用来读取 `KeyStore` 的。假设我们使用 `bither` 做密语。

执行如下命令。

~~~ bash
./cert2keystore_bks.sh cacert.pem bither
~~~

现在我们有了自己的 `KeyStore` 文件了 `bithertruststore.bks`。把它放到 Android 项目的 `res/raw` 里吧。

# 自定义 `TrustManager`

我们需要写一个自定义的 `TrustManager` 来给 `Https` 连接用。这个 `TrustManager` 首先要调用系统默认的 `TrustManager` 来检查 `Https` 证书。如果没有通过系统默认的检查，再用我们自己的 `KeyStore` 来进行检查。两层检查都没通过，才会认定这个证书不可信。

这段代码很简单，可以从 [这里](https://github.com/bither/bitherj/raw/master/bitherj/src/main/java/net/bither/bitherj/api/BitherTrustManager.java) 下载到。使用时只要在构造函数中传入我们自己的 `KeyStore` 就可以了。

# 生成自定义 `KeyStore` 实例

使用之前的 `KeyStore` 文件和密语来构造一个自定义的 `KeyStore` 实例出来。这样我们就可以调用构造函数生成一个我们自定义的 `TrustManager` 了。

~~~ java
KeyStore localTrustStore = KeyStore.getInstance("BKS");
InputStream input = context.getResources().openRawResource(R.raw.bithertruststore);
try {
    localTrustStore.load(input, "bither".toCharArray());
} finally {
    input.close();
}

BitherTrustManager trustManager = new BitherTrustManager(localTrustStore);
~~~

# 设为默认

现在我们已经有了一个可以信任我们的自签名证书的自定义 `TrustManager` 了。我们希望所有我们的 App 发起的 `Https` 都默认使用这个 `TrustManager`。

~~~ java
SSLContext sc = SSLContext.getInstance("SSL");
sc.init(null, new TrustManager[]{trustManager}, new java.security.SecureRandom());
HttpsURLConnection.setDefaultSSLSocketFactory(sc.getSocketFactory());
~~~

# 结语

现在我们就可以用自签名的证书来为 Android App 提供 `Https` 服务了。

真的不要再用 [StackOverflow] 上那些信任任何证书的解决方案了。

[StackOverflow]: http://stackoverflow.com