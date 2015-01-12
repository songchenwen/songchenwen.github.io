---
layout: post
title: Android相机启动加速
categories : 
- Tech
tags : 
- Android
- Camera

---
在Android上实现一个简单能用的相机其实挺容易。谷歌随便搜一搜就有很多能用的Sample。当然就像谷歌能搜到的其他代码一样，这些Sample虽然能用但离好用还很远。

这篇文章就只说说从用户点击启动按钮到用户能看到实时预览的这一小段时间内，我们所做的优化。

<!-- more -->

Android手机上良莠不齐的硬件，导致相机启动时间有长有短，很难预期。用户在使用app过程中，过长的等待会产生焦虑。我们要做的就是让用户尽量感知不到相机启动的耗时。

按照网上能搜到的一般相机Sample的说法，从启动相机到实时预览，我们需要做三件事：1.构建一个GlSurfaceView并获取它的SurfaceHolder；2.获取一个Camera device，启动它；3.将Camera device的预览设置为我们准备好的SurfaceHolder。

我们把GlSurfaceView写到xml里如下：

~~~ markup
<GlSurfaceView
	android:id="@+id/camera_preview"
	android:layout_width="match_parent"
	android:layout_height="match_parent" />
~~~

我们可以在CameraActivity的onCreate里获取到这个GlSurfaceView。可是并不是GlSurfaceView创建好了SurfaceHolder就也准备好了。我们还需要给它设置一个HolderListener来等待它生成出来的SurfaceHolder。

~~~ java
	private class SurfaceObserver implements
			SupportCamSurfaceView.SurfaceHolderLisener {

		public void onSurfaceHolderCreated(SurfaceHolder holder) {
			mSurfaceHolder = holder;
		}
	}
	vCameraPreview.setHolderListener(new SurfaceObserver());
~~~

然后我们来Open一个Camera。

~~~ java
	//代码省略掉了检测Camera个数，获取CameraId还有设置CameraPreviewSize的逻辑。那是其他部分的内容了。
	mCamera = Camera.open(mCameraId);
~~~

最后把SurfaceHolder设置给Camera就可以开启预览了。

~~~ java	
	mCamera.setPreviewTexture(mSurfaceHolder);
	mCamera.startPreview();
~~~

一般网上搜到的Sample Code会把这三步放到Activity的onCreate里顺序执行。也就是等SurfaceHolderListener获取到了SurfaceHolder再启动Camera。Camera启动完成再把它俩关联上并启动预览。我们来看一下再小米1上这个流程的耗时。
	
	获取SurfaceHolderListener    0.3秒
	启动Camera                     1秒

如果把Activity创建的时间和其它代码执行的时间都忽略的话，我们一共耗费了1.3秒。而用户对大于1秒的等待都是不耐烦的。更不用说在有的手机上Camera启动时间能够达到反人类的1.5秒以上。

很容易想到的一个优化方案就是让获取SurfaceHolder和启动Camera在两个线程里异步进行。这样应该可以使耗时在小米1上缩短到1秒左右，勉强能接受。

SurfaceHolder的获取本身就是异步的。我们只需要在Activity的onCreate里再启动一个异步线程去启动Camera。在这两个异步线程执行完成后都分别去检测另一个线程是否完成。简化的代码如下。

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

这样就算优化完了吗？让我们想想苹果是怎么做的吧。苹果很喜欢用一些过渡动画来掩饰后台加载的耗时。毕竟相机启动的这1秒时间是由硬件限制的，我们在app层面上没办法把它缩短，所以我们不如加一个动画，并在动画过程中提前启动相机，来一个苹果式的小trick。我给进入相机Activity的按钮加了一个0.5秒的反馈动画，又给相机Activity加了一个0.3秒的Pending动画，在两个动画完成后，只需再有0.2秒的时间小米1的相机就完成启动了，这对用户来说已经是完全可以接受的了。

上面的逻辑实现起来有两个问题。一个是在我们获取到CameraActivity的实例之前就要开始启动相机了，另一个是Camera启动完成后没办法调用Activity实例的checkCamera方法。所以我们只能把Camera和Activity实例分别存放到一个static变量里。写起来不复杂，只是需要注意变量的回收。在Activity的onDestroy里先把Camera release再设为null，Activity实例的引用直接设为null，这样就可以了。
	
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
