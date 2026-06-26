---
created: 2025-03-01
modified: 2025-03-01
---
*A tabular machine-learning model I derived from first principles, where the prediction and its explanation are literally the same object. There's no trained model in the usual sense; the dataset is the model.*

> [!summary] TL;DR
> Usually you train a machine-learning model first, then bolt on a separate tool to *guess* why it made each prediction. I flipped that around. This model computes the "why" (a fair, per-feature breakdown of what pushed each prediction up or down) **straight from the data**, then adds those pieces up to produce the prediction itself. So the explanation isn't a second-hand guess about a black box, it literally *is* the model. Everything is transparent by construction, and on real datasets it holds its own against the heavyweight "black box" models people normally reach for.

# The wrong way around

Most of the time, "explainability" in machine learning works like this: you train a model (a gradient-boosted forest, a neural net, something inscrutable) and *then*, after the fact, you try to figure out why it said what it said. The most popular tool for that second step is [SHAP](https://arxiv.org/abs/1705.07874), which uses **Shapley values** from cooperative game theory to fairly split a prediction into per-feature contributions.

It works, but there's always a gap. The explanation is an *approximation* of the model, computed by a separate algorithm, and it's never quite the thing the model actually did. You're reading tea leaves about your own black box.

I kept staring at that gap and wondering if it could be closed entirely. What if you didn't train a model first? What if you computed the Shapley values *straight from the data*, and then simply **added them up to get the prediction**? Then there's no black box to explain. The explanation comes first, and the prediction falls out of it. The decomposition *is* the model.

This is the project. It turned out to work, it's competitive with gradient boosting on real datasets, and getting there meant solving a few problems that I don't think have clean answers in the existing literature.

# A one-minute primer on Shapley values

Imagine a group of people who team up to produce some payout, and you want to divide the money *fairly* based on how much each person actually contributed. The catch is that contributions depend on context. Person A might be useless alone but indispensable once person B is in the room.

Lloyd Shapley's answer (from 1953) is to average each person's **marginal contribution** over every possible order in which the team could have been assembled. If you add a player to a coalition $S$ and the payout jumps, that jump is their marginal contribution for that context; average it over all contexts and you get their Shapley value $\phi_i$. It's the *unique* way to split the payout that satisfies a handful of fairness axioms.

The one that matters most here is **efficiency**: the Shapley values sum to exactly the total payout. Nothing is lost, nothing is invented.

In ML, the "players" are the features, and the "payout" is the prediction. SHAP borrows this to explain a model. I wanted to use it to *be* the model.

# The explanation comes first

Here's the move. Instead of training a function $f$ and then explaining it, I define the game directly on the data.

The "value" of a coalition of feature-values $S$ is just the **average target among the training rows that match those values**:

$$v(S) = \mathbb{E}\big[\,Y \mid X_S = x_S\,\big]$$

estimated empirically by filtering the dataset. So $v(\varnothing)$ is the overall base rate, $v(\{\text{age}=37\})$ is the average outcome among 37-year-olds, $v(\{\text{age}=37,\ \text{job}=\text{engineer}\})$ narrows it further, and so on.

Now compute the Shapley values of *this* game. By the efficiency axiom, they reconstruct the prediction for an instance $x$:

$$\text{prediction}(x) = v(\varnothing) + \sum_i \phi_i$$

That's it. The base rate plus the feature contributions *is* an estimate of $\mathbb{E}[Y \mid X = x]$. Every prediction is, by construction, exactly decomposed into per-feature terms, not approximately, and not via a second algorithm. They're the same computation.

A few things I like about this framing:

- **It's "true to the data," not "true to a model."** Because $v(S)$ conditions on rows that *actually co-occur*, it respects correlations between features for free. KernelSHAP, by contrast, [leans on an assumption that features are independent](https://arxiv.org/abs/1903.10464) when it fills in "missing" features from a background distribution, which can produce misleading attributions when features are correlated (and they always are).
- **There's no model to be unfaithful to.** Faithfulness is the whole game in explainability; here it's free, because the attribution generates the prediction.

> [!NOTE] An honest caveat on novelty
> The *fact* that "base rate + additive contributions = prediction" holds exactly is well known for additive models. Bordt & von Luxburg recently [proved a precise equivalence between Shapley decompositions and Generalized Additive Models](https://arxiv.org/abs/2209.04012). So the math being coherent isn't the new part, and this model is a cousin of glass-box GAMs like [Explainable Boosting Machines](https://arxiv.org/abs/1909.09223). What I haven't found anywhere is the specific recipe here: estimating those coalition values **directly and non-parametrically from the empirical data**, over only the coalitions the data supports, with the statistical machinery below to make it stable, then treating that fitted decomposition as the predictor itself.

# The catch: $2^n$

There's a reason people don't do this. Computing exact Shapley values means evaluating $v(S)$ over *every* subset of features. With $n$ features that's $2^n$ coalitions: exponential, and [intractable in general](https://arxiv.org/abs/1705.07874). This is exactly why SHAP ships approximations (KernelSHAP samples coalitions; [TreeSHAP](https://www.nature.com/articles/s42256-019-0138-9) is exact but only for tree models). A from-scratch exact computation looks hopeless.

The insight that rescues it: **you don't need all $2^n$ coalitions, only the ones the data actually supports.**

Real tabular data is sparse in combination-space. The overwhelming majority of feature-value combinations never co-occur in your training set, or co-occur too rarely to estimate anything from. A coalition that matches zero rows has no $v(S)$ to speak of. So the *effective* lattice of coalitions is vastly smaller than $2^n$, and it's exactly the structure that frequent-itemset mining has exploited since the [Apriori algorithm](https://www.vldb.org/conf/1994/P487.PDF) in 1994.

> [!WARNING] This section is technical
> The trick is to never build the full $2^n$ lattice. The engine grows combinations one feature at a time, starting from single feature-values and joining them into larger ones, but it only ever keeps a combination if **enough training rows actually match it**. That one rule (borrowed from frequent-itemset mining) prunes almost everything: if a combination is already too rare to estimate, every larger combination containing it is rarer still, so there's no point generating it.
>
> Evaluating a combination is cheap. Each one simply remembers *which* training rows match it, so adding a feature is a fast set intersection and the value $v(S)$ is just the average target over the surviving rows. The Shapley contributions then accumulate as combinations grow: each time adding one feature shifts a combination's value, that shift is a marginal contribution, weighted by the standard Shapley term $\frac{|S|!\,(n-|S|-1)!}{n!}$ and credited to that feature.
>
> The payoff is an **exact** Shapley computation over the combinations the data actually supports, fast enough to run per-prediction in milliseconds (the engine is written in Rust) because the lattice is pruned down to what's real.

# Three gaps I had to close

Getting from "nice idea" to "actually works" meant solving three problems. These are the parts I'm most proud of, and where I think the real research is.

## 1. Pruning breaks the budget: the *extension* term

The moment you prune coalitions for lack of support, you break efficiency. Some marginal contributions $v(S \cup \{i\}) - v(S)$ are missing because $v(S \cup \{i\})$ never got built, so the Shapley values no longer sum back to the prediction. The fair budget doesn't add up anymore.

My fix: when an edge of the lattice is missing, **impute the unseen coalition's value with the model's own overall prediction.** Concretely, the algorithm tracks an "extension" weight for each feature wherever a coalition couldn't be extended, and later folds in that weight times the final prediction. It's the natural default ("for combinations we've never seen, assume the outcome looks like the prediction at large"), and it restores efficiency exactly, so the decomposition still reconstructs the output even on a heavily pruned lattice. This one went through three rewrites before it was right.

## 2. Thin data lies, so shrink toward a smarter prior

A coalition matched by six rows gives you a noisy $v(S)$. Trusting it blindly makes the model jumpy and overconfident on rare combinations. This is the oldest problem in actuarial statistics, and the classical answer is **credibility / empirical-Bayes shrinkage** ([James–Stein](https://en.wikipedia.org/wiki/James%E2%80%93Stein_estimator) is the famous cousin): pull thin estimates toward a prior, trust them more as evidence accumulates.

So each coalition's value is a blend,

$$\hat v(S) = (1-\lambda)\cdot \text{prior} + \lambda \cdot \text{empirical mean},$$

where the credibility weight $\lambda$ is a logistic function of support: near 0 for a handful of rows, near 1 once there's plenty.

The part I think is genuinely novel is **where the prior comes from**. It's hierarchical: a coalition's prior is assembled from its own sub-coalitions. In the cheap mode it's the average value of the immediate subsets one level down. In the richer mode it's an additive reconstruction that *adds back the known pairwise interactions*, estimating what a high-order combination "should" be worth from its lower-order structure. As you climb the lattice into thinner and thinner air, the model leans more on what the simpler combinations already told it. It degrades gracefully instead of falling apart.

## 3. Interactions, for free

Because the whole lattice is sitting in memory, the second-order structure is right there. A **[Shapley interaction index](https://link.springer.com/article/10.1007/s001820050125)** for a pair of features is a mixed second difference,

$$v(S\cup\{i,j\}) - v(S\cup\{i\}) - v(S\cup\{j\}) + v(S),$$

which measures synergy or redundancy between two features beyond their individual effects. The engine computes these in the same pass, then feeds them *back* into the prior from gap #2. Interactions both come out as a result and make the predictor better. In most SHAP tooling, interaction values are an expensive bolt-on; here they're a natural byproduct of the data structure.

*(One more, briefly: for classification everything is done in **log-odds space**, where contributions actually add linearly, then squashed back through a sigmoid. SHAP runs into the same issue, since its attributions [sum in margin/log-odds space, not probability space](https://shap.readthedocs.io/en/latest/example_notebooks/tabular_examples/model_agnostic/Squashing%20Effect.html), so this is the principled place to be additive.)*

# Does it actually work?

Yes — and it lands within a point or two of state-of-the-art gradient boosting while being a fully transparent, intrinsically-explainable model.

On a real insurance quoting dataset, against CatBoost:

| | This model | CatBoost |
|---|---|---|
| AUC | 0.747 | 0.759 |
| Log loss | 0.490 | 0.474 |
| Accuracy | 0.77 | 0.78 |

To make sure I wasn't just fooling myself on my own data, I also ran it cold on three public benchmarks. For each one I binned the features and handed a gradient-boosting baseline the *exact same* binned inputs, so the comparison isolates the modeling approach rather than the preprocessing (AUC):

| Public benchmark (rows × features) | This model | Gradient boosting, same inputs |
|---|---|---|
| [UCI Adult](https://archive.ics.uci.edu/dataset/2/adult) (49k × 14) | 0.912 | 0.920 |
| [Bank Marketing](https://archive.ics.uci.edu/dataset/222/bank+marketing) (45k × 15) | 0.784 | 0.799 |
| [Credit Card Default](https://archive.ics.uci.edu/dataset/350/default+of+credit+card+clients) (30k × 23) | 0.762 | 0.779 |

A point or two behind a boosted forest on every benchmark, and the gap widens a little as the data gets wider and harder, which is the honest and expected behavior for an additive model. But every single prediction comes with an exact, built-in Shapley decomposition rather than a post-hoc approximation. And because the outputs *are* Shapley values, they drop straight into the standard `shap` plots (waterfall, beeswarm, bar) with no glue code.

# What's actually new here

Pulling it together, the gaps this closes relative to off-the-shelf Shapley tooling:

- **Inversion.** The Shapley decomposition is the predictor, not a post-hoc explanation of one. Faithfulness is structural, and predictions are exactly additive by construction.
- **Exact, and model-free.** It computes exact Shapley values over the supported lattice, versus KernelSHAP (approximate, model-agnostic) or TreeSHAP (exact, but trees only). No model is trained at all.
- **Tractable via data sparsity.** Support pruning (the frequent-itemset idea) plus fast set intersection turn an exponential computation into a per-instance, millisecond one.
- **Conditional, "true to the data" values.** Coalition values come from rows that genuinely co-occur, so feature correlations are respected without the independence assumption baked into KernelSHAP.
- **Stable on thin data.** Hierarchical empirical-Bayes shrinkage, with a prior built from sub-coalitions and their interactions.
- **Interactions native.** Shapley interaction indices fall out of the same data structure and feed back into the model.

It's not magic — it's an additive model, and like all additive models it gives up some of the raw ceiling of a deep forest. The closest relatives are glass-box GAMs like EBM. But I haven't seen anyone build the additive components *this* way: estimated directly from the data as exact Shapley values over a frequent-coalition lattice. It started as a "what if you turned explainability around" thought experiment and ended up as a real, competitive model where the prediction and its reason for being are the same number.

# References & further reading

- Lundberg & Lee, [*A Unified Approach to Interpreting Model Predictions*](https://arxiv.org/abs/1705.07874) (SHAP / KernelSHAP), NeurIPS 2017
- Lundberg et al., [*From local explanations to global understanding with explainable AI for trees*](https://www.nature.com/articles/s42256-019-0138-9) (TreeSHAP), Nature Machine Intelligence 2020
- Aas, Jullum & Løland, [*Explaining individual predictions when features are dependent*](https://arxiv.org/abs/1903.10464), Artificial Intelligence 2021
- Bordt & von Luxburg, [*From Shapley Values to Generalized Additive Models and back*](https://arxiv.org/abs/2209.04012), AISTATS 2023
- Nori et al., [*InterpretML*](https://arxiv.org/abs/1909.09223) (Explainable Boosting Machines), 2019
- Grabisch & Roubens, [*An axiomatic approach to the concept of interaction among players in cooperative games*](https://link.springer.com/article/10.1007/s001820050125), Int. J. Game Theory 1999
- Agrawal & Srikant, [*Fast Algorithms for Mining Association Rules*](https://www.vldb.org/conf/1994/P487.PDF) (Apriori), VLDB 1994
