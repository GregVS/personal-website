---
created: 2025-01-04
modified: 2025-01-04
---
[Neural radiance fields](https://arxiv.org/abs/2003.08934) are neural networks designed to interpolate between views of a scene. A fully connected MLP is used to learn a 3D, color representation of a scene from 2D images.

- The inputs to the network are 3D scene coordinates, a viewing angle and direction (two angles). 
- The outputs are RGB values and a volume density.
![[nerf.png]]
The network is trained on a single scene and only requires images and known camera poses. The inputs are first transformed using positional encoding, according to [[Fourier Features for NNs]], but with fixed (non-random) frequencies. A scene is composited by sampling along camera rays at various determined depths. The outputs are then composited to form an image and a rendering loss is computed to indirectly optimize the outputs. Specifically, the paper uses two losses (coarse and fine).

One of the practical limits of this approach is the need for known camera poses. This might work well when coupled with sparse SLAM, where we could use the optimized camera poses to create dense 3D reconstructions of parts of the scene.