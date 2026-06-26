# Greg's Writing Voice Guide

> A reusable reference for writing or editing content so it sounds like Greg, not like
> generic AI prose. Built by analyzing every authentic page under `content/` and
> contrasting against an AI-written draft. When drafting a new page or de-AI-ifying one,
> run it through the **Rewrite checklist** at the bottom.

## 1. Voice summary

Greg writes like an engineer talking through a build with a sharp peer: plain-spoken, first-person, and concrete. He explains hard technical material (SLAM, Shapley values, NeRF) by narrating *what he did and why*, leaning on intuition and analogy before notation, and he's comfortable admitting limits ("works... kinda"). His default register is casual-technical -- contractions, short declarative sentences, the occasional aside or dry joke -- never marketing polish or academic hedging. He's confident and direct about decisions ("So I made us an app", "let's just do them all!"), and he treats the reader as someone who can keep up rather than someone who needs hand-holding scaffolds.

## 2. Concrete traits

**Sentence length & rhythm -- short, punchy, varied; fragments for emphasis.**
He mixes a longer explanatory sentence with a clipped follow-up. Frequent intentional fragments and one-liners.
> "Get something working. V2 will be a whole other story."
> "So I made us an app."
> "Big idea: take some sensor data and figure out what your world looks like and where you are in that world."

**Vocabulary register -- casual-technical; contractions everywhere; slang allowed.**
He uses precise technical terms (ORB descriptor, RANSAC, reprojection error) sitting right next to casual phrasing.
> "something inscrutable"
> "I built lots of cool things"
> "I'm a software engineer that likes building cool things."

**First person -- heavy, active, ownership-driven.** Almost everything is framed as "I did / I'm building / I want".
> "I'm building monocular visual SLAM for racing."

**How he opens pieces -- drops straight into context or backstory, no throat-clearing.** Often a date/origin or a personal anecdote, sometimes an italicized one-line preface.
> "This is a project from way back in 2018."
> "I recently read Probabilistic Robotics by Sebastian Thrun."

**How he explains technical concepts -- intuition and analogy first, then the math.**
> "Imagine a group of people who team up to produce some payout, and you want to divide the money fairly..."
> "My notes are informal and are intended to be an intuitive interpretation of the source."

**Humor/personality -- dry, self-deprecating, lightly enthusiastic.** Jokes are throwaway, not setups.
> "I wasn't particularly stellar, but I loved it"
> "perhaps I over-subscribed to Uncle Bob"
> "COVID hit and there were no more track meets, so the app had an unfortunately short lifespan."

**Hedging vs directness -- direct about decisions, honest about limits, but no boilerplate hedging.** Limitations are plain facts woven into the narrative, not a sectioned-off disclaimer.
> "it doesn't seem to work well on footage with complex motion"
> "Unfortunately **this is slow**."

**Paragraph structure -- short paragraphs, one idea each, often building to a decision or punchline.**
> "These choices all seem compatible with one another. So I'm thinking, let's just do them all!"

**Headers/lists -- functional and terse, not signposted.** Plain nouns ("Overview", "Features", "Demo", "My choices", "Implementation Challenges"). Numbered lists for sequential pipelines/steps; bulleted for feature inventories. He bolds the lead phrase of a list item then explains it.
> "1. **Lack of texture.** There are very few easily identifiable patches..."

**Markdown habits.** Obsidian/Quartz `[[wikilinks]]` for cross-references, inline `[text](url)` links to papers/repos generously, `![[image.png|400]]` embeds with italic captions beneath, occasional `> [!WARNING] This section is technical` callouts before deep dives, fenced code blocks with real code, and an italic one-line preface under a title.

**Punctuation quirks.** `--` (double hyphen) for asides, NOT em-dashes (—). `...` for trailing-off / dramatic pause. Parentheticals for quick clarifications. Bold for emphasis on key warnings or terms.
> "we can also ensure that we have enough inliers -- points with low reprojection error"
> "But this was in late Feb of 2020..."

**Transitions -- conversational connectives, sentence-initial "So".**
> "So we started a fantasy league." / "Put them together and you get SLAM."

## 3. AI tells to eliminate

These showed up in the AI-written draft and do NOT match Greg's voice:

- **Cutesy meta-commentary callout titles** -- e.g. `> [!NOTE] An honest caveat on novelty`. His callouts are bare: `> [!WARNING] This section is technical`.
- **Self-congratulatory framing of honesty/humility** -- "to make sure I wasn't just fooling myself", "the honest and expected behavior". The word "honest" doing rhetorical work is a tell.
- **"It's not just X, it's Y" inversion drama** and repeated italicized *is*/*be* for emphasis.
- **Rule-of-three padding / balanced couplets** -- "Nothing is lost, nothing is invented."
- **Signposting/recap headers** -- "The wrong way around", "What's actually new here", "Does it actually work?". Use plain nouns instead.
- **Em-dash overuse** (—). Greg uses `--`.
- **Forced metaphor flourishes** -- "You're reading tea leaves about your own black box."
- **Narrating his own pride** -- "These are the parts I'm most proud of", "The part I think is genuinely novel is...".
- **Canned deflation** -- "It's not magic."
- **Dramatic one-word answer openings** -- "Yes — and it lands within...".
- **Stacked knowing parentheticals** -- "(and they always are)".
- **Ribbon-bow conclusions** that loop back to the thesis. Greg ends abruptly and functionally.

## 4. Do / Don't

| Do (Greg) | Don't (AI tells) |
|---|---|
| Bare header nouns: "Overview", "Features", "My choices" | Signpost headers: "An honest caveat on novelty", "What's actually new here" |
| `--` for asides, `...` for trailing off | Em-dashes (—) throughout |
| State limits as plain facts: "Unfortunately **this is slow**." | Sectioned-off humility: "the honest and expected behavior" |
| Bold a key term once for emphasis | Italicize *is* / *be* repeatedly for drama |
| Intuition/analogy that explains | Metaphor for flourish: "reading tea leaves about your own black box" |
| "So I made us an app." (commit and move on) | "It's not just X, it's Y" inversions |
| Short fragments: "Get something working." | Balanced triplets: "Nothing is lost, nothing is invented." |
| End functionally (next steps, code, "V2 is another story") | Ribbon-bow conclusion looping to thesis |
| Quick parenthetical clarifier: "(movement between frames)" | Stacked knowing asides: "(and they always are)" |

## 5. Rewrite checklist

1. **Kill em-dashes.** Replace `—` with `--`, a comma, or split the sentence.
2. **Strip "honest/honestly/let's be clear/to be fair" meta-commentary.** State the limitation directly.
3. **Rename rhetorical headers to plain nouns** (what the section *is*, not a teaser).
4. **De-dramatize emphasis.** Remove italicized *is*/*be*; at most one **bold** key term per passage.
5. **Cut rule-of-three and balanced-clause padding.**
6. **Remove self-praise narration** ("most proud of", "genuinely novel"). Let the work speak.
7. **Delete performance metaphors** ("reading tea leaves", "it's not magic"). Keep only analogies that aid understanding.
8. **Add first-person ownership** -- "I did / I wanted / I'm building".
9. **Open with context or backstory, not a thesis statement.**
10. **Break up long balanced sentences with a short fragment or "So ...".**
11. **End abruptly and functionally** -- a next-step, a caveat, a code snippet.
12. **Tighten parentheticals** to genuine quick clarifications.
13. **Allow one dry, self-deprecating aside** if natural; don't manufacture wit.
14. **Use `[[wikilinks]]` for internal cross-refs and inline links to papers/repos**, with italic captions under any image embed.
