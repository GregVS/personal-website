---
draft: true
created: 2025-01-23
modified: 2025-01-23
---

Paper: [LSD-SLAM: Large-Scale Direct Monocular SLAM ](https://jakobengel.github.io/pdf/engel14eccv.pdf)
## Motivation
Feature-based visual SLAM extracts key points from the image and tracks these key points across multiple frames. These points are projected into 3D and the SLAM problem is reduced to a graph optimization problem involving poses and feature observations. In some cases, it is hard to find good features in an image due to texture-less surfaces, no corners, etc.
## Direct Approach
