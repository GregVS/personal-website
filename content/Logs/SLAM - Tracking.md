---
draft: true
---
[[SLAM - Initialization|Previously]], I implemented the initialization stage for Racing-SLAM. The output of this phase is demonstrated below. It consists of 2 pose estimates and a set of 3D triangulated map points.

![[Pasted image 20250109192209.png|600]]

Now that our map is initialized, we need to track where the camera moves in future frames. The steps are:
1. Find correspondences between image features and map points.
2. Compute the optimal pose estimate that minimizes the reprojection error.
3. Triangulate image features that weren't matched to map points, by using previous frames.
4. Adjust the map to minimize overall error (will be addressed later - AKA bundle adjustment).