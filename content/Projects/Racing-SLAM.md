---
created: 2025-01-03
modified: 2026-07-30
---


> [!INFO]
> Read about the implementation [[Logs/Racing-SLAM V2.md|here]].
> Or view [on GitHub](https://github.com/GregVS/Racing-SLAM).

Racing SLAM is a single camera (monocular) Simultaneous Localization and Mapping algorithm used in robotics to build a map of the environment while also tracking the robot's position within that environment. The project applies the concept to racing environments, using sim-racing games to produce a realistic sandbox environment.

# Demo

The green points on the image show the motion of objects in the scene which is used to produce an initial estimate of the car's motion. The estimated trajectory is shown on the right along with the reconstructed 3D points clouds (visualized top-down). Note that the light gray path is the ground truth, displayed for reference only, and not visible to algorithm.

![](https://youtu.be/W3U7pxzdO_k)

# Benchmarks

While SLAM can be evaluated visually, numerical evaluation provides an objective metric to guide iteration, and provides a way to compare my algorithm's performance to other open-source implementations. I used two benchmarks:

1. [KITTI](https://www.cvlibs.net/datasets/kitti/eval_odometry.php) - a popular public dataset featuring low-speed driving scenes. Provides video feed and ground truth poses (translation + rotation) for every frame.
2. Custom iRacing Dataset - my own laps in the iRacing simulator at various tracks. I wrote a scripts to translate iRacing's native telemetry export into the same ground truth format as KITTI.

## Results

Comparisons between Racing SLAM (v2) and [ORB-SLAM3](https://arxiv.org/abs/2007.11898) (monocular).
Results are expressed as % Average Translation Error. Racing SLAM performs worse on KITTI, but significantly better on racing footage.

| seq                    | ORB-SLAM3               | Racing-SLAM |
| ---------------------- | ----------------------- | ----------- |
| KITTI 03               | 1.01                    | 2.16        |
| KIITI 04               | 1.19                    | 3.18        |
| KITTI 06               | 8.23                    | 11.65       |
| KITTI 07               | 2.55                    | 11.35       |
| iRacing Lime Rock Park | 4.18 (3/5 runs failed)  | 0.15        |
| iRacing Road Atlanta   | 13.03 (4/5 runs failed) | 0.21        |

# Inspiration

I had recently read [Probabilistic Robotics by Sebastian Thrun](http://www.probabilistic-robotics.org/). I've known about Thrun for quite some time; I remember watching his videos and reading his papers back in middle school when I built an autonomous toy car. It's fair to say he's at least partially inspired my interest in robotics. If you haven't read it, the core focus is on localization and mapping. Put them together and you get SLAM (Simultaneous Localization and Mapping). Big idea: take some sensor data and figure out what your world looks like and where you are in that world.

## Logs

Read about my progress:

- [[Racing-SLAM V2]]
- [[Racing-SLAM V1]]
- [[Next steps for Racing-SLAM V1]]
