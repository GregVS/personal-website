I recently read [Probabilistic Robotics by Sebastian Thrun](http://www.probabilistic-robotics.org/). I've known about Thrun for quite some time; I remember watching his videos and reading his papers back in middle school when I built an autonomous toy car. It's fair to say he's at least partially inspired my interest in robotics. If you haven't read it, the core focus is on localization and mapping. Put them together and you get SLAM (Simultaneous Localization and Mapping). Big idea: take some sensor data and figure out what your world looks like and where you are in that world.

I'm building monocular visual SLAM because it's cool and because I don't have two cameras. I've taken some inspiration from [ORB SLAM](https://github.com/UZ-SLAMLab/ORB_SLAM3), but it won't be quite the same, since this is an exercise in building from first principles. [Source code here](https://github.com/GregVS/Video-SLAM).

# Overview
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
SLAM V1 is complete. It's quite brittle and not real-time but it works well for relatively simple trajectories. Here's a pic showing the trajectory down a highway with trees on either side: ![[slam-progress-1.png|500]]

I'll be writing logs as I work on V2:
- [[SLAM - Key Points & Descriptors]]
- [[SLAM - Initial Pose Estimates]]