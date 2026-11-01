# BrowseComp-Plus evaluation results

150 questions per method, one attempt per question.
Agent model: `deepseek/deepseek-flash`, with a 128,000-token context limit.
Judge: `gpt-6-luna`, with an 8,192-token output budget.
Limit and timeout outcomes count as unsuccessful attempts.

| Method | Success rate | Total tokens/task | Peak input tokens/task | Input cache hit rate |
| --- | ---: | ---: | ---: | ---: |
| pocket_context | 80.67% | 640,461.61 | 61,981.95 | 58.80% |
| react | 68.00% | 461,908.80 | 71,585.76 | 81.74% |
| resum | 72.67% | 449,880.36 | 70,370.88 | 78.26% |
| acm | 80.67% | 703,214.56 | 65,275.15 | 75.32% |

Tasks per method: 150; split: eval150.
N/A means incomplete measurement or grading; completed submissions are not correctness judgments.
