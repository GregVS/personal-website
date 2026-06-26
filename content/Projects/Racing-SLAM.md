---
created: 2025-01-03
modified: 2025-11-11
---
# Inspiration
I recently read [Probabilistic Robotics by Sebastian Thrun](http://www.probabilistic-robotics.org/). I've known about Thrun for quite some time; I remember watching his videos and reading his papers back in middle school when I built an autonomous toy car. It's fair to say he's at least partially inspired my interest in robotics. If you haven't read it, the core focus is on localization and mapping. Put them together and you get SLAM (Simultaneous Localization and Mapping). Big idea: take some sensor data and figure out what your world looks like and where you are in that world.
# The Project
I'm building monocular visual SLAM for racing. I've taken some inspiration from [ORB SLAM](https://github.com/UZ-SLAMLab/ORB_SLAM3), but it won't be quite the same, since this is an exercise in building from first principles. My source code will be available [on GitHub](https://github.com/GregVS/Racing-SLAM).

## Overview
Some of the general goals/features:
- Feature extraction (we're making sparse SLAM)
- Matching and pose estimation using essential matrix transforms
- 3D point cloud construction (triangulation and matching)
- Local/global bundle adjustment (optimizing poses and 3D feature locations)
- Map point culling
- Loop closure (recognizing re-visited places)

There are some cool applications I'm thinking about. I don't intend to implement these until I have a really good SLAM.
- Extend the sparse point cloud to a dense 3D reconstruction
- Augmented reality:
	- Identifying flat surfaces in the 3D space
	- Overlay 3D objects in the virtual world onto the video feed
	- Occlusion: being able to have the 3D objects hide behind parts of the video

## Demo
Here's a demo of the project. This demo shows part of a lap around the beautiful Okayama circuit. The blue triangles represent the positional estimates of the car (which pretty accurately represent the racing line). The dots represent reference features in the images that the program uses to determine the car's location relative to its surrounding. The points are color coded based on their color in the image, so you'll notice that big groups of trees around the circuit are green, while the gray dots represent barriers and fences. Note: the demo is sped up.

![[okayama-demo.mp4]]

## Logs
Read about my progress:
- [[Racing-SLAM V1]]
- [[Next steps for Racing-SLAM V1]]