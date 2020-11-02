<h1 align="center">
Taskbook
</h1>

### 使用

```
$ tb                                    按看板排序展示所有 tasks
$ tb add -m "a post" -b daily           添加 a post task 到 @daily 看板
$ tb u 1 -m zz -b cc -s 1               更新 ID 为 1 的 task 的描述为 zz，看板为 @CC，状态为已完成
$ tb rm 1,2,3                           删除 ID 为 1,2,3 的 tasks
$ tb clean -b daily                     删除 daily 看板状态为已完成的 task
$ tb clear -b daily                     清除 daily 看板任务的所有状态和优先级
```
