---
draft: true
created: 2026-08-04
---

Loop closure enables SLAM algorithms to recognize previously visited locations, which provides additional constraints on the pose graph. This helps correct positional drift and scale drift over time.

# General Structure

## 1. Transform descriptors into words

Each frame has a set of descriptors, where each descriptor maps to a single feature in the image. The first step is to build a _vocabulary_ which maps ORB descriptors (or some other binary descriptor) into groups. This can be done with k-means clustering, with k=10 as the typical choice. Each descriptor can then be mapped to a word.

## 2. Build weighted histogram

For each keyframe, we compute the frequency of each of the N words in the vocabulary, represented as an N-dimensional vector. We then apply TF-IDF weighting to reduce the impact of frequent but uninformative words.

## 3. Candidate detection

Find all keyframes (excluding recent ones) that contain any shared words with the current keyframe and score them based on L1 distance of their histograms. 

Also measure a similarity threshold, defined as the least similar neighboring frame in the covisibility graph. All candidates must be more similar to the current frame than this least similar neighbor.

Candidates must be matched across ~3 consecutive iterations of this loop closing detection algorithm to prevent false positives.

## 4. Verification


