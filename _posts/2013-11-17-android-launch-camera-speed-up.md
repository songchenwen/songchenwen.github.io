---
layout: post
title: Android相机启动加速
categories : 
- Tech
tags : 
- Android
- Camera

---
在 Android 上实现一个简单能用的相机其实挺容易。谷歌随便搜一搜就有很多能用的 Sample。当然就像谷歌能搜到的其他代码一样，这些 Sample 虽然能用但离好用还很远。

这篇文章就只说说从用户点击启动按钮到用户能看到实时预览的这一小段时间内，我们所做的优化。

<!-- more -->

Android 手机上良莠不齐的硬件，导致相机启动时间有长有短，很难预期。用户在使用 APP 过程中，过长的等待会产生焦虑。我们要做的就是让用户尽量感知不到相机启动的耗时。

按照网上能搜到的一般相机Sample的说法，从启动相机到实时预览，我们需要做三件事：1. 构建一个 GlSurfaceView 并获取它的 SurfaceHolder；2. 获取一个 Camera Device，启动它；3. 将 Camera Device的预览设置为我们准备好的 SurfaceHolder。

我们把 GlSurfaceView 写到 xml 里如下：

~~~ xml
<GlSurfaceView
	android:id="@+id/camera_preview"
	android:layout_width="match_parent"
	android:layout_height="match_parent" />
~~~

我们可以在 CameraActivity 的 onCreate 里获取到这个 GlSurfaceView。可是并不是 GlSurfaceView 创建好了 SurfaceHolder 就也准备好了。我们还需要给它设置一个 HolderListener 来等待它生成出来的 SurfaceHolder。

~~~ java
	private class SurfaceObserver implements
			SupportCamSurfaceView.SurfaceHolderLisener {

		public void onSurfaceHolderCreated(SurfaceHolder holder) {
			mSurfaceHolder = holder;
		}
	}
	vCameraPreview.setHolderListener(new SurfaceObserver());
~~~

然后我们来打开一个 Camera。

~~~ java
	//代码省略掉了检测Camera个数，获取CameraId还有设置CameraPreviewSize的逻辑。那是其他部分的内容了。
	mCamera = Camera.open(mCameraId);
~~~

最后把 SurfaceHolder 设置给 Camera 就可以开启预览了。

~~~ java	
	mCamera.setPreviewTexture(mSurfaceHolder);
	mCamera.startPreview();
~~~

一般网上搜到的 Sample Code 会把这三步放到 Activity 的 onCreate 里顺序执行。也就是等 SurfaceHolderListener 获取到了 SurfaceHolder 再启动 Camera。Camera 启动完成再把它俩关联上并启动预览。我们来看一下在 小米1 上这个流程的耗时。
	
	获取 SurfaceHolderListener    0.3秒
	启动 Camera                     1秒

如果把 Activity 创建的时间和其它代码执行的时间都忽略的话，我们一共耗费了 1.3 秒。而用户对大于 1 秒 的等待都是不耐烦的。更不用说在有的手机上Camera启动时间能够达到反人类的 1.5 秒 以上。

很容易想到的一个优化方案就是让获取 SurfaceHolder 和启动 Camera 在两个线程里异步进行。这样应该可以使耗时在 小米1 上缩短到 1秒 左右，勉强能接受。

SurfaceHolder 的获取本身就是异步的。我们只需要在 Activity 的 onCreate 里再启动一个异步线程去启动 Camera 。在这两个异步线程执行完成后都分别去检测另一个线程是否完成。简化的代码如下。

~~~ java
	public void onCreate(Bundle savedInstanceState){
		super.onCreate(savedInstanceState);
		vCameraPreview.setHolderListener(new SurfaceObserver());
		new Handler().post(new Runnable(){
			public void run(){
				mCamera = Camera.open(mCameraId);
				checkCamera();
			}		
		});	
	}
	
	private class SurfaceObserver implements
			SupportCamSurfaceView.SurfaceHolderLisener {

		public void onSurfaceHolderCreated(SurfaceHolder holder) {
			mSurfaceHolder = holder;
			checkCamera();
		}
	}

	private void checkCamera(){
		if(mSurfaceHolder != null && mCamera != null{
			mCamera.setPreviewTexture(mSurfaceHolder);
			mCamera.startPreview();
		}
	}
~~~

这样就算优化完了吗？让我们想想苹果是怎么做的吧。苹果很喜欢用一些过渡动画来掩饰后台加载的耗时。毕竟相机启动的这1秒时间是由硬件限制的，我们在 APP 层面上没办法把它缩短，所以我们不如加一个动画，并在动画过程中提前启动相机，来一个苹果式的小 trick。我给进入相机 Activity 的按钮加了一个 0.5 秒 的反馈动画，又给相机 Activity 加了一个 0.3 秒 的 Pending 动画，在两个动画完成后，只需再有 0.2 秒 的时间 小米1 的相机就完成启动了，这对用户来说已经是完全可以接受的了。

上面的逻辑实现起来有两个问题。一个是在我们获取到 CameraActivity 的实例之前就要开始启动相机了，另一个是 Camera 启动完成后没办法调用 Activity 实例的 checkCamera 方法。所以我们只能把 Camera 和 Activity 实例分别存放到一个 static 变量里。写起来不复杂，只是需要注意变量的回收。在 Activity 的 onDestroy 里先把 Camera release 再设为 null，Activity 实例的引用直接设为 null，这样就可以了。
	
~~~ java
	static Camera mCamera;	
	static CameraActivity instance;	

	public void onCreate(Bundle savedInstanceState){
		super.onCreate(savedInstanceState);
		instance = this;
		vCameraPreview.setHolderListener(new SurfaceObserver());
	}

	public static void openCamera{
		new Handler().post(new Runnable(){
			public void run(){
				mCamera = Camera.open(mCameraId);
				if(instance != null){
					instance.checkCamera();
				}
			}		
		});	
	}
	
	private class SurfaceObserver implements
			SupportCamSurfaceView.SurfaceHolderLisener {

		public void onSurfaceHolderCreated(SurfaceHolder holder) {
			mSurfaceHolder = holder;
			checkCamera();
		}
	}

	private void checkCamera(){
		if(mSurfaceHolder != null && mCamera != null{
			mCamera.setPreviewTexture(mSurfaceHolder);
			mCamera.startPreview();
		}
	}
~~~
