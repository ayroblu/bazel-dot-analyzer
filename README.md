# Bazel Dependency Viewer

Export your bazel dependencies with:

```
bazel query deps(//target:target) --notool_deps --output graph > graph.dot
```

Upload the file and this will give some tools for analyzing it
