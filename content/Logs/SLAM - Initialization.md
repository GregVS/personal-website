---
title: "SLAM: Initialization"
---
In the [[SLAM - Key Points & Descriptors|previous log]] I covered the key point and descriptor algorithms. The next step is using this data to initialization the SLAM process. The initialization step involves computing the first 3D map points and computing the first two pose estimates, using something like [[The Essential & Fundamental Matrix|essential matrix transform]].

It's only necessary to use two frames to do the initialization, although I might explore using additional frames if necessary. Clearly, it is important to select two frames that are very good for triangulating points. We can evaluate the frames by checking that they are sufficient correspondences between the two images and that the correspondences experience sufficient parallax (difference in pixel location). We can also ensure that we have enough inliers -- points with low reprojection error.

# Demonstration
I wrote a small test case for visualizing the initialization step. The green circles in the bottom image below are the key points which are matched with the previous frame. The thin black lines represent the path from their location in the previous frame. The lines indicate the key points have moved left in the screen, meaning our camera has also moved left. It has also moved forwards. The pose estimated from the essential matrix of these points is visualized by the two blue triangles.

![[Pasted image 20250108232143.png]]

Below, I've shown the same frame with unfiltered key points. Red means it couldn't find those points in the previous frame, blue means it found the points, but considered them outliers, and green means it found them and considered them inliers. Inliers/outliers are identified based on how well their positional change in the image can be explained by the estimated change in pose.

![[Pasted image 20250108232839.png]]