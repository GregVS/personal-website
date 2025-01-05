I recently read [Probabilistic Robotics by Sebastian Thrun](http://www.probabilistic-robotics.org/). I've known about Thrun for quite some time; I remember watching his videos and reading his papers back in middle school when I built an autonomous toy car. It's fair to say he's at least partially inspired my interest in robotics. If you haven't read it, the core focus is on localization and mapping. Put them together and you get SLAM (Simultaneous Localization and Mapping). Big idea: take some sensor data and figure out what your world looks like and where you are in that world.

I'm going to build a monocular visual SLAM because it's cool and because I don't have two cameras. I've taken some inspiration from [ORB SLAM](https://github.com/UZ-SLAMLab/ORB_SLAM3), and have some fun ideas for extensions. [Source code here](https://github.com/GregVS/Video-SLAM).

# Making SLAM
Some of the general goals/features:
- [ ] Feature extraction (we're making sparse SLAM)
- [ ] Matching and pose estimation using essential matrix transforms
- [ ] 3D point cloud construction (triangulation and matching)
- [ ] Local/global bundle adjustment (optimizing poses and 3D feature locations)
- [ ] Map point culling
- [ ] Loop closure (recognizing re-visited places)

There are some cool applications I'm thinking about. I don't intend to implement these until I have a really good SLAM.
- [ ] Extend the sparse point cloud to a dense 3D reconstruction
- [ ] Augmented reality:
	- [ ] Identifying flat surfaces in the 3D space
	- [ ]  Overlay 3D objects in the virtual world onto the video feed
	- [ ] Occlusion: being able to have the 3D objects hide behind parts of the video

# Progress
**(Jan 3, 2025)**\
SLAM is happening and it mostly works. I had too many issues trying to use g2o for graph optimization so I gave up and switched to Ceres. Ceres seems much better structured and the auto-diff support is nice. Here's a pic showing the trajectory down a highway with trees on either side:

![[slam-progress-1.png|500]]

**(Jan 4, 2025)**\
SLAM V1 done. It works decently well, provided you get lucky with initialization. It has most of the necessary components of any SLAM algorithm. Now it's time to make some real good SLAM. I'll be revisiting each of the core components and improving them to make the algorithm more robust and learn more deeply about each part. The goal for V2 is to be able to process a video of a car racing around a track (I'm probably going to screen record iRacing footage) and build a complete map of the track. V1 is not robust enough for this and it gets slower the longer it runs. *Objective #1: robust, accurate map initialization.*