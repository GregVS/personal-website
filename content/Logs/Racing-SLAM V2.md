---
created: 2026-07-30
modified: 2026-08-04
---

[[Racing-SLAM V1]] was capable of localization and mapping relatively simple environments, but struggled with tracking rotation and scale over time. V2 aims to fix that through a series of algorithmic improvements. It also introduces an evaluation harness that allows comparison of other SLAM algorithms and provides a rigorous way to test changes.

# Feature Tracking

V1 used Harris corner detection (GFTT) and ORB descriptors to identify and match features between consecutive frames. This technique struggled on the racing footage due to repeated textures (like fences, barriers, or curbs) and often led to a low match rate across frames. I migrated to [KLT (Kanade-Lucas-Tomasi)](https://en.wikipedia.org/wiki/Kanade%E2%80%93Lucas%E2%80%93Tomasi_feature_tracker) which uses optical flow to measure how pixels in the image move between frames. In V2, features are still initially seeded the same way as in V1 using GFTT/ORB descriptors, but are then matched to the next frame using optical flow rather than independently detecting new features and trying to match with those. The result is substaintially higher match rates between frames, with frame-to-frame correspondence matching rate going from ~40-60% to 70-90%.

![KLT tracking shows significantly higher corresponding match rates between consecutive frames.](images/racing-slam-v2/match-rate-graphs.png)
![Shown above, KLT tracking also produces more accurate correspondence matching.](images/racing-slam-v2/matches_limerock_corner.png)
