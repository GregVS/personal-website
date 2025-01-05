# Fundamental/Essential Matrix
In order to begin SLAM, we must first be able to estimate the pose of the camera in the second frame relative to the first frame.

The [fundamental matrix](https://en.wikipedia.org/wiki/Fundamental_matrix_(computer_vision)) is derived by analyzing the relationship between two cameras and a 3D point. We can project a point $x$ (expressed in homogenous coordinates) in camera 1's image to a 3D line. This is $F \cdot x$, where F is called the 3x3 fundamental matrix. $Fx = [a \ b \ c]^T$ thus represents a line equation in 3d space of the form $ax + by +c = 0$. This means that if we want $x'$ to be on that line, we just need to satisfy that equation. So $(x')^T \cdot F \cdot x = 0$.

The essential matrix is then just defined as ${\displaystyle \mathbf {E} =({\mathbf {K} '})^{\top }\;\mathbf {F} \;\mathbf {K} }$, where $K$ is the intrinsic matrix. If you normalize the $x$ coordinates beforehand (by multiplying by $K^{-1}$) then doing the computation for the fundamental matrix will effectively give you the essential matrix.

The [essential matrix](https://en.wikipedia.org/wiki/Essential_matrix) allows us to estimate the rotation and translation of the camera from one image to another. However, we can only estimate the direct of the translation, not the scale. This is problematic if the camera rotates, but does not translate.

