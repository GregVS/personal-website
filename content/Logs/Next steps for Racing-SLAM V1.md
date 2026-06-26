---
created: 2025-01-13
modified: 2025-01-23
---
After some improvements, I've gotten my SLAM algorithm to work decently on racing footage around Okayama circuit. Here's the reference video that I'm trying to map and localize:

![[okayama-lap.mp4]]
# Visual SLAM Challenges
There are number of complexities that make visual SLAM hard. 
1. **Lack of texture.** There are very few easily identifiable patches on the road surface for feature tracking -- it's mostly gray.
2. **Repeating patterns**. The areas that are identifiable, such as the red and white curbing or the white and blue barriers, have repeating patterns that can confuse the feature matching algorithm. This is largely because feature matching operates on small pixel patches, without considering context. When it sees a red rectangle, it's not sure if it's the same one that it passed earlier, or a different one.
3. **Few nearby objects.** This video was intentionally recorded at a very high FOV (120 degrees), since it didn't work at 70 degrees FOV. At lower FOVs, the left and right sides of the footage is not visible and the only visible points are the road and the objects in the distance. The lack of nearby objects means many features will have very low parallax (movement between frames) and it is hard to estimate their 3D position.

These 3 challenges make estimating relative motion difficult and cause the SLAM to fail in many cases. I will note that these challenges are relatively specific to the footage I'm working with. I could pick another video, but that defeats the purpose of the project.
### Example
![[slam-correspondences.png]]
 Two consecutive frames are shown with color-coded correspondences. The correspondences were computed by matching ORB descriptors. Clearly, there are many correspondences that do not actually correspond to the same point in the image. This is evident when you look at the gray barrier on the left. Poor feature matching across images means that it is very hard to get a reliable SLAM.
# Implementation Challenges
One of the core challenges is performance. I want to be able to process real-time or near real-time input, but the current implementation is very slow. There are a couple key areas of the implementation that I want to improve.
1. **Bundle adjustment performance**. Currently, local bundle adjustment is performed after every frame. This should probably be changed so that it's only performed when needed. I'll have to figure out some way to decide when that is.
2. **Feature correspondence.** This is largely tied to the main challenges I mentioned about Visual SLAM. It needs to be done more accurately and I need to find a way to get it to work well with repeating patterns. But it also has to be very fast.
3. **Local tracking.** From frame to frame, there needs to be a reliable and quick way to match up the map with the video frame. Currently, I'm using the [[The Essential & Fundamental Matrix|essential matrix]] to estimate the relative motion between frames, but I'd like to remove that step.