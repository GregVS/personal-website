---
created: 2025-03-01
modified: 2025-03-01
---
*A tabular ML model I derived from first principles, where the prediction and its explanation are the same object. There's no trained model in the usual sense -- the dataset is the model.*

# Post-hoc explanations

Most "explainability" in ML works like this: you train a model (a gradient-boosted forest, a neural net) and then, after the fact, you try to work out why it made a specific prediction. The popular tool for that second step is [SHAP](https://arxiv.org/abs/1705.07874), which uses [Shapley values](https://en.wikipedia.org/wiki/Shapley_value) from cooperative game theory to split a prediction into per-feature contributions.

It works, but there's a gap: the explanation is typically an approximation of the model (except for certain classes of models).

What if you didn't train a model first? What if you computed the Shapley values straight from the data, then just added them up to get the prediction? Then there's no black box left to explain. You compute the breakdown, and the prediction is its sum.

Turns out, you can do it. And it's competitive with SOTA models on real datasets. This article outlines what needed to be solved and how I got there.

# Shapley values

Imagine a group of people who team up to produce some money, and you want to split the money fairly by how much each person actually contributed. The tricky part is that contributions depend on context. Person A might be useless alone but indispensable once person B shows up.

Lloyd Shapley's answer, from 1953, is to average each person's *marginal contribution* over every possible order the team could have been assembled in. Add a player to a coalition $S$, see how much the payout jumps, average that jump over all the contexts, and you get their Shapley value $\phi_i$. It's the only way to fairly split the payout according to a short set of [very reasonable axioms](https://en.wikipedia.org/wiki/Shapley_value#Properties).

The one that matters here is **efficiency**: the Shapley values sum to exactly the total payout.

In ML the "players" are the features and the "money" is the prediction. 

# The approach

Instead of training a machine learning model $f$ and then explaining it, I define the "game" directly on the data.

The "value" of a coalition of feature-values $S$ is the **average target among the training rows that match those values** (AKA conditional probability):

$$v(S) = \mathbb{E}\big[\,Y \mid X_S = x_S\,\big]$$

estimated by filtering the dataset. So $v(\varnothing)$ is the overall base rate, $v(\{\text{age}=37\})$ is the average outcome among 37-year-olds, $v(\{\text{age}=37,\ \text{job}=\text{engineer}\})$ narrows it further, and so on.

Now compute the Shapley values of this game. By the efficiency axiom they reconstruct the prediction for an instance $x$:

$$\text{prediction}(x) = v(\varnothing) + \sum_i \phi_i$$

Simply put, the base rate plus the feature contributions is an estimate of $\mathbb{E}[Y \mid X = x]$. Every prediction is exactly decomposed into per-feature terms by construction, not approximately, and not via a second algorithm.

Two observations:

- **It's true to the data, not to a model.** Because $v(S)$ conditions on rows that actually co-occur, it respects correlations between features for free. KernelSHAP [assumes features are independent](https://arxiv.org/abs/1903.10464) when it fills in "missing" features from a background distribution, which can give misleading attributions when features are correlated.
- **There's no model to be unfaithful to.** Faithfulness is the whole point in explainability. Here it's free, because the attribution generates the prediction.

# The $2^n$ problem

So we know how to construct a prediction from Shapley values. But computing exact Shapley values means evaluating $v(S)$ over every subset of features. With $n$ features that's $2^n$ coalitions: exponential, and intractable in general. It's why SHAP ships approximations. KernelSHAP samples coalitions; [TreeSHAP](https://www.nature.com/articles/s42256-019-0138-9) is exact but only for tree models.

But the key realization: **you don't need all $2^n$ coalitions, only the ones the data actually supports.**

Real tabular data is sparse in combination-space. Most feature-value combinations never co-occur in your training set, or co-occur too rarely to estimate anything from. A coalition that matches zero rows has no $v(S)$ to speak of. So the effective lattice of coalitions is much smaller than $2^n$, and it's exactly the structure that frequent-itemset mining has exploited via the [Apriori algorithm](https://www.vldb.org/conf/1994/P487.PDF).

> [!WARNING] This section is technical
> The trick is to never build the full $2^n$ lattice. The engine grows combinations one feature at a time, starting from single feature-values and joining them into larger ones, and it only keeps a combination if **enough training rows actually match it**. That one rule (from frequent-itemset mining) prunes almost everything: if a combination is already too rare to estimate, every larger combination containing it is rarer still, so there's no point generating it.
>
> Evaluating a combination is cheap. Each one remembers which training rows match it, so adding a feature is a fast set intersection, and $v(S)$ is just the average target over the surviving rows. The Shapley contributions accumulate as combinations grow: each time adding a feature shifts a combination's value, that shift is a marginal contribution, weighted by the standard Shapley term $\frac{|S|!\,(n-|S|-1)!}{n!}$ and credited to that feature.
>
> The result is an **exact** Shapley computation over the combinations the data supports, fast enough to run per-prediction in milliseconds (the engine's in Rust) because the lattice is pruned down to what's statistically significant.

But still, there were a couple challenges:

## 1. Pruning sets breaks the efficiency axiom

The moment you prune coalitions for lack of support, you break efficiency. Some marginal contributions $v(S \cup \{i\}) - v(S)$ are missing because $v(S \cup \{i\})$ never got built, so the Shapley values stop summing back to the prediction. The budget doesn't add up anymore.

My fix: when an edge of the lattice is missing, **impute the unseen coalition's value with the model's own overall prediction.** It's the natural default (for combinations we've never seen, split the difference equally), and it restores efficiency exactly, so the decomposition still reconstructs the output even on a heavily pruned lattice.

## 2. Thin data lies, so shrink toward a prior

A coalition matched by six rows gives you a noisy $v(S)$. If you trust it blindly, the model gets jumpy and overconfident on rare combinations. This is the oldest problem in actuarial statistics, and the classic answer is **credibility / empirical-Bayes shrinkage** ([James--Stein](https://en.wikipedia.org/wiki/James%E2%80%93Stein_estimator) is the famous cousin): pull thin estimates toward a prior, trust them more as evidence piles up.

So each coalition's value is a blend,

$$\hat v(S) = (1-\lambda)\cdot \text{prior} + \lambda \cdot \text{empirical mean},$$

where the credibility weight $\lambda$ is a logistic function of support: near 0 for a handful of rows, near 1 once there's plenty.

The interesting part is **where the prior comes from.** It's hierarchical: a coalition's prior is built from its own sub-coalitions. In the cheap mode it's the average value of the immediate subsets one level down. In the richer mode it's an additive reconstruction that adds back the known pairwise interactions, estimating what a high-order combination should be worth from its lower-order structure. As you climb the lattice into thinner and thinner air, the model leans more on what the simpler combinations already told it. It degrades gracefully instead of falling apart.

## How feature interactions work

Because the whole lattice is sitting in memory, the second-order structure is right there. A **[Shapley interaction index](https://link.springer.com/article/10.1007/s001820050125)** for a pair of features is:

$$v(S\cup\{i,j\}) - v(S\cup\{i\}) - v(S\cup\{j\}) + v(S),$$

which effectively remove the individual contributions of each feature, so all that's left is the contribution of their combination. The engine computes these in the same pass, then feeds them back into the prior from problem #2. So interactions come out as a result and make the predictor better at the same time. In most SHAP tooling interaction values are an expensive bolt-on; here they fall out of the data structure.

# Results

It lands within a point or two of state-of-the-art gradient boosting while being a fully transparent, explainable-by-construction model.

On a real insurance quoting dataset, against CatBoost:

| | This model | CatBoost |
|---|---|---|
| AUC | 0.747 | 0.759 |
| Log loss | 0.490 | 0.474 |
| Accuracy | 0.77 | 0.78 |

I also ran it on three public benchmarks. For each one I binned the features and gave a gradient-boosting baseline the exact same binned inputs, so the comparison is about the modeling approach and not the preprocessing (AUC):

| Public benchmark (rows × features) | This model | Gradient boosting, same inputs |
|---|---|---|
| [UCI Adult](https://archive.ics.uci.edu/dataset/2/adult) (49k × 14) | 0.912 | 0.920 |
| [Bank Marketing](https://archive.ics.uci.edu/dataset/222/bank+marketing) (45k × 15) | 0.784 | 0.799 |
| [Credit Card Default](https://archive.ics.uci.edu/dataset/350/default+of+credit+card+clients) (30k × 23) | 0.762 | 0.779 |

It's a point or two behind a boosted forest on every benchmark, and the gap widens a little as the data gets wider and harder, which is what you'd expect from an additive model. But every prediction comes with an exact, built-in Shapley decomposition rather than a post-hoc approximation. And because the outputs are Shapley values, they drop straight into the standard `shap` plots (waterfall, beeswarm, bar) for visualization.

# What's new

What's different about my solution relative to off-the-shelf Shapley tooling:

- **Inversion.** The Shapley decomposition is the predictor, not a post-hoc explanation of one. Faithfulness is structural, and predictions are exactly additive by construction.
- **Exact, and model-free (ish).** It computes exact Shapley values over the supported lattice, versus KernelSHAP (approximate, model-agnostic) or TreeSHAP (exact, but trees only). No model needs to be trained, although you could argue this algorithm is the model.
- **Tractable via data sparsity.** Support pruning (the frequent-itemset idea) plus fast set intersection avoid exponential computation in nearly all cases.
- **No assumption of independence.** Coalition values come from rows that genuinely co-occur, so feature correlations are respected without the independence assumption baked into KernelSHAP.
- **Stable on thin data.** Hierarchical empirical-Bayes shrinkage, with a prior built from sub-coalitions and their interactions.
- **Interactions native.** Shapley interaction indices fall out of the same data structure and feed back into the model.

# References & further reading

- Lundberg & Lee, [*A Unified Approach to Interpreting Model Predictions*](https://arxiv.org/abs/1705.07874) (SHAP / KernelSHAP), NeurIPS 2017
- Lundberg et al., [*From local explanations to global understanding with explainable AI for trees*](https://www.nature.com/articles/s42256-019-0138-9) (TreeSHAP), Nature Machine Intelligence 2020
- Aas, Jullum & Løland, [*Explaining individual predictions when features are dependent*](https://arxiv.org/abs/1903.10464), Artificial Intelligence 2021
- Bordt & von Luxburg, [*From Shapley Values to Generalized Additive Models and back*](https://arxiv.org/abs/2209.04012), AISTATS 2023
- Nori et al., [*InterpretML*](https://arxiv.org/abs/1909.09223) (Explainable Boosting Machines), 2019
- Grabisch & Roubens, [*An axiomatic approach to the concept of interaction among players in cooperative games*](https://link.springer.com/article/10.1007/s001820050125), Int. J. Game Theory 1999
- Agrawal & Srikant, [*Fast Algorithms for Mining Association Rules*](https://www.vldb.org/conf/1994/P487.PDF) (Apriori), VLDB 1994
