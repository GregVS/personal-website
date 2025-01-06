---
title: "SLAM V2: Better Pose Estimates"
---
During every frame in SLAM, we need to propose an initial estimate for the camera position. Here's how it's done in V1:
	Keypoints are extracted for every frame and are matched against the previous frame. The correspondences are then refined using RANSAC and the [[The Essential & Fundamental Matrix|Essential Matrix]] transform. Effectively, this performs many many iterations to estimate an essential matrix that fits the largest number of points. This is necessary because many of the correspondences could be incorrect, and since the essential matrix is computed from (~8) data points, inconsistencies will affect the estimate. Unfortunately **this is slow**.

We'll need a better way to propose estimates. The estimates only need to be good enough to find correspondences between the map and the image.

- *Option 1*: Compute a velocity from the previous two frames and extrapolate it to the new frame. For cases like driving, this should work fairly well. If the camera is handheld, this would be less reliable. 
- *Option 2*: Assume that we haven't moved (static).
- *Option 3:* Do what we did before and compute an essential matrix to estimate the change in position.

These choices all seem compatible with one another. So I'm thinking, let's just do them all! We can try the velocity approach first, then if there aren't enough correspondences, we try the static model, and if that still doesn't work, we use the essential matrix. This should keep our pose estimates very fast in most cases. However it does require a good way to compute correspondences between image key points and existing 3D map points. 