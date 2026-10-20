---
title: 'Exploring LoRA: Efficient Fine-Tuning for Large Language Models'
description: 'A deep dive into LoRA (Low-Rank Adaptation) and how it enables efficient, task-specific fine-tuning of large language models without massive compute or storage costs.'
pubDate: 'Oct 4 2025'
heroImage: '../../assets/images/blog3-hero.jpeg'
tags: ['AI', 'GPT', 'LLM', 'Learning']
language: 'en'
defaultLanguage: 'en'
translationKey: 'post3'
---

Recently, I finished reading [*LoRA: Low-Rank Adaptation of Large Language Models*](https://arxiv.org/abs/2106.09685) to understand how large language models can be adapted to specific tasks with fewer trainable parameters.
What interested me most was the separation between the knowledge already stored in a pre-trained model and the changes needed for a new task.

## Why full fine-tuning gets expensive

Full fine-tuning updates all of a model's parameters.
For a large model, keeping a separate version for every task quickly becomes expensive in both training memory and storage.

**LoRA keeps the pre-trained weights frozen** and learns a much smaller set of task-specific parameters.
This makes it possible to specialize a model without storing another complete copy of its weights for each task.

## Learning a low-rank update

The central idea is to represent a weight update using two smaller matrices, **A** and **B**.
For a frozen weight matrix W, the adapted weight is:

<p>W′ = W + (α / r) BA</p>

Here, **r** is the adapter rank and **α** controls the update's scale.
Only A and B are trained.
For a matrix with d rows and k columns, this uses r(d + k) trainable parameters instead of dk.
When r is small, the difference is substantial.

The paper's hypothesis is that the changes needed for adaptation can have a low intrinsic rank.
That does not require the original model's weight matrices themselves to be low-rank.

## One base model, many tasks

The storage example that stood out to me was GPT-3 175B.
At 16-bit precision, its weights take roughly **350GB**.
In the paper's example, keeping one shared model and 100 small LoRA adapters takes about **354GB**, compared with **35TB** for 100 full model copies.
The adapter size depends on the rank and which matrices are adapted, so this is an example rather than a fixed cost.

This separation makes task-specific adapters easier to store and swap.
For a single task, the learned update can also be merged into the base weights for inference.

## What the results tell me

On benchmarks including **GLUE, WikiSQL, and SAMSum**, the paper reports results competitive with full fine-tuning while training far fewer parameters.
These results make LoRA an appealing starting point for task specialization, though they do not guarantee the same outcome for every model or dataset.

The practical benefit is especially clear when I think about maintaining several specialized versions of one model.
I would want to compare their task performance alongside their training memory and storage requirements.

## Questions I want to explore

I’m interested in experimenting with small, task-specific adapters and measuring how much capacity a task actually needs.
How does changing the rank affect quality, and which weight matrices are worth adapting?

My next reading is Thinking Machines Lab's [*LoRA Without Regret*](https://thinkingmachines.ai/blog/lora/), which examines the conditions under which LoRA can match full fine-tuning.
I want to use it to better understand how rank, learning rate, and other hyperparameters affect the comparison.

![LoRA Without Regret](../../assets/images/blog3-2.png)
