---
created: 2025-01-05
modified: 2025-01-05
---
The fundamental matrix describes the *fundamental* relationship between two corresponding points in two camera images of a scene.

The [fundamental matrix](https://en.wikipedia.org/wiki/Fundamental_matrix_(computer_vision)) is derived by analyzing the projective geometry between two cameras and a 3D point. We can project a point $x$, expressed in camera #1's homogenous image coordinates, to a 3D line. This is $\bf F \cdot x$, where $\bf F$ is called the 3x3 fundamental matrix. $\bf Fx = [a \ b \ c]^T$ thus represents a line equation in 3d space of the form $ax + by +c = 0$. This means that if we want $x'$ to be on that line, we just need to satisfy that equation. So $(x')^T \cdot F \cdot x = 0$.

The *essential matrix* is then just defined as ${\displaystyle \mathbf {E} =({\mathbf {K} '})^{\top }\;\mathbf {F} \;\mathbf {K} }$, where $K$ is the intrinsic matrix. If you normalize the $x$ coordinates beforehand (by multiplying by $K^{-1}$) then doing the computation for the fundamental matrix will effectively give you the essential matrix.

The [essential matrix](https://en.wikipedia.org/wiki/Essential_matrix) allows us to estimate the rotation and translation of the camera from one image to another. However, we can only estimate the direct of the translation, not the scale. This is problematic if the camera rotates, but does not translate.

For a complete lecture on how to solve for the fundamental and essential matrix see:
<iframe width="560" height="315" src="https://www.youtube.com/embed/zX5NeY-GTO0?si=qTmE1t8_bZfrBi_7&amp;start=327" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>