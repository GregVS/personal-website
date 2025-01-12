---
draft: true
---
The visual SLAM algorithm starts with an image. The first step is to take an image frame and generate key points and descriptors (AKA "features"). By doing this, we'll be able to identify which 3D map points correspond to points in our image, and talk about which points in the previous frame correspond to which points in the current frame.

*Note: it's possible to do V-SLAM without features by inspecting the correlation between images, however, I won't be describing that approach.*

![[feature-extraction-slam.png]]
*Feature extraction for a single frame in my implementation of SLAM V1*
## Classical Algorithms
There are a variety of key point generation algorithms to choose from: FAST, Harris, Shi-Tomasi, etc. These are relatively old approaches, mostly from the '90s. Some of them were developed with the aid of machine learning, but the machine learning model was then translated into actual code, instead of being used directly for inference. They are still relevant because they are fast. And fast is important when building SLAM.
## Deep Learning
There are some neat deep learning options; [SuperPoint](https://arxiv.org/abs/1712.07629) and [SuperGlue](https://arxiv.org/abs/1911.11763) are two interesting approaches. SuperPoint is simply a convolutional neural network that picks key points, and it is actually quite fast (on the GPU). But for the most part, the speed tradeoff and more expensive hardware requirements don't seem to be worth the marginal (if any) improvement in quality. I'd have to investigate this further if I get time.
## Descriptors
How do we know whether two key points in two different images correspond to the same thing? For this, we use algorithms that compute descriptors for an image patch; SIFT, SURF, and BRIEF are a few popular ones. For each key point, the algorithm creates a short description of various qualities about the pixels in the patch. This might include things like intensity, light angles, corner sharpness, etc. We can then use these descriptors to compare how similar any two key points are.
## My choices
For SLAM V2, speed is important, so I will likely be using BRIEF descriptors, since they are very fast to compute. I might use ORB for generating key points, otherwise I'll use Shi-Tomasi (labeled as [goodFeaturesToTrack](https://docs.opencv.org/4.x/d4/d8c/tutorial_py_shi_tomasi.html) in OpenCV). I found [this paper](https://arxiv.org/abs/2007.10000) to be very helpful for deciding what algorithms to choose.