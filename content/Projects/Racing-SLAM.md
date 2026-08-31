---
created: 2025-01-03
modified: 2026-08-25
---

> [!INFO]
> Read about the implementation [[Logs/Racing-SLAM V2.md|here]].
> Or view [on GitHub](https://github.com/GregVS/Racing-SLAM).

Racing SLAM is a monocular-inertial Simultaneous Localization and Mapping algorithm used in robotics to build a map of the environment while also tracking the robot's position within that environment. The project applies the concept to high speed racing situations.

# Demo

The green points on the image show the motion of objects in the scene which is used to produce an initial estimate of the car's motion. The estimated trajectory is shown on the right along with the reconstructed 3D points clouds (visualized top-down). Note that the light gray path is the ground truth, displayed for reference only, and not visible to algorithm.

![](https://youtu.be/W3U7pxzdO_k)

# Benchmarks

I used two benchmarks:

1. [EuRoC](https://projects.asl.ethz.ch/datasets/euroc-mav/) - a popular visual-inertial public dataset featuring various scenes taken from MAV (micro aerial vehicle).
2. Custom iRacing Dataset - my own laps in the iRacing simulator at various tracks. I translated iRacing's native telemetry export into ground truth trajectories, and used the included IMU sensor data with randomized bias and noise, according to the BMI088 datasheet.

## Results

Comparisons between Racing SLAM and [ORB-SLAM3](https://arxiv.org/abs/2007.11898) on EuRoC sequences. Results show ATE RMSE in meters. Visual-inertial (VI) configurations report ATE after a SE(3) transform, while monocular-only configurations use a SIM(3) transform.

On EuRoC, Racing-SLAM performs similar to ORB-SLAM3, but struggles on V203.

| EuRoC Seq | Racing-SLAM (VI) | ORB-SLAM3 (VI) |
| --------- | ---------------- | -------------- |
| MH01      | **0.033**        | 0.062          |
| MH02      | **0.024**        | 0.037          |
| MH03      | **0.031**        | 0.046          |
| MH04      | 0.091            | **0.075**      |
| MH05      | 0.062            | **0.057**      |
| V101      | **0.039**        | 0.049          |
| V102      | 0.026            | **0.015**      |
| V103      | 0.044            | **0.037**      |
| V201      | **0.033**        | 0.042          |
| V202      | 0.032            | **0.021**      |
| V203      | 0.256            | **0.027**      |

On racing sequences, ORB-SLAM3 had high failure rates and nearly all runs were catastrophic.
RMSE numbers here are larger than EuRoC since the trajectories span 5-10 kilometers.

| iRacing Seq  | Racing-SLAM (VI) | ORB-SLAM3 (VI) | ORB-SLAM3 (mono) |
| ------------ | ---------------- | -------------- | ---------------- |
| Lime Rock    | 2.02             | DNF            | 27.58            |
| Road Atlanta | 2.76             | 1709.11        | 44.92            |
| Ledenon      | 11.45            | 2839.25        | 133.47           |

_I plan to include additional benchmarks soon._

# Features

These are the core components of the system:

- Lucas-Kanade optical flow for frame-to-frame feature tracking
- ORB descriptors for map matching and loop recognition
- Local bundle adjustment
- DBOW2 place recognition
- Loop closure with pose graph optimization and global bundle adjustment
- IMU support with preintegration and VINS-style initialization
- Continuous IMU scale and gravity refinement

# Inspiration

I had recently read [Probabilistic Robotics by Sebastian Thrun](http://www.probabilistic-robotics.org/). I've known about Thrun for quite some time; I remember watching his videos and reading his papers back in middle school when I built an autonomous toy car. It's fair to say he's at least partially inspired my interest in robotics.

# Logs

Read about my progress:

<!-- - [[Racing-SLAM V2]] -->

- [[Racing-SLAM V1]] (monocular-only version without loop closure)
- [[Next steps for Racing-SLAM V1]]
